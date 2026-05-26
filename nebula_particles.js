// ===== Particle-based nebula builders =====
// builds per-object Three.Group of THREE.Points layers with custom sprite shaders.
// Black hole / wormhole / dyson sphere keep their raymarched shaders.

(function(global){

// shared sprite shader: soft round particle with alpha falloff
const SPRITE_VTX = `
attribute float aSize;
attribute float aAlpha;
attribute float aSeed;
attribute vec3  aColor;

uniform float uTime;
uniform float uPixelRatio;
uniform float uTwinkle;
uniform float uDriftAmp;

varying vec3  vColor;
varying float vAlpha;

void main() {
    vColor = aColor;

    // gentle per-particle drift so the cloud feels alive
    float ph = aSeed * 6.28318;
    vec3 pos = position;
    pos.x += sin(uTime * 0.05 + ph)        * uDriftAmp;
    pos.y += cos(uTime * 0.04 + ph * 1.3)  * uDriftAmp * 0.7;
    pos.z += sin(uTime * 0.06 + ph * 0.7)  * uDriftAmp;

    // twinkle (mostly for stars)
    float tw = mix(1.0, 0.55 + 0.45 * sin(uTime * 1.6 + ph * 5.0), uTwinkle);

    vAlpha = aAlpha * tw;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (260.0 / max(-mv.z, 0.1));
}
`;

// additive emission sprite: bright core + soft halo
const SPRITE_FRAG_EMIT = `
precision highp float;
varying vec3  vColor;
varying float vAlpha;

void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    if (d > 1.0) discard;
    float core = exp(-d * d * 3.0);
    float halo = exp(-d * 1.4) * 0.3;
    float a = (core + halo) * vAlpha;
    gl_FragColor = vec4(vColor * (0.45 + core * 0.6), a);
}
`;

// dust sprite: dark, opaque, soft edge - blocks background
const SPRITE_FRAG_DUST = `
precision highp float;
varying vec3  vColor;
varying float vAlpha;

void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    if (d > 1.0) discard;
    float core = smoothstep(1.0, 0.0, d);
    gl_FragColor = vec4(vColor, core * vAlpha);
}
`;

// bright star sprite with 4-spike diffraction
const SPRITE_FRAG_STAR = `
precision highp float;
varying vec3  vColor;
varying float vAlpha;

void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    if (d > 1.0) discard;

    float core = exp(-d * d * 10.0);
    float halo = exp(-d * 2.5) * 0.6;

    // 4-pointed diffraction spikes
    vec2 a = abs(uv) * 2.0;
    float spikeH = exp(-a.x * 24.0) * (1.0 - smoothstep(0.0, 1.0, a.y * 2.0));
    float spikeV = exp(-a.y * 24.0) * (1.0 - smoothstep(0.0, 1.0, a.x * 2.0));
    float spikes = (spikeH + spikeV) * 0.55;

    float a2 = (core + halo + spikes) * vAlpha;
    vec3 col = mix(vColor, vec3(1.0, 1.0, 1.1), core * 0.3);
    gl_FragColor = vec4(col * (0.5 + core * 0.5), a2);
}
`;

let _spriteCache = null;
function getSpriteMaterials(renderer) {
    if (_spriteCache) return _spriteCache;
    const pr = renderer.getPixelRatio();
    const mk = (frag, blending, depthWrite, twinkle, driftAmp) => new THREE.ShaderMaterial({
        uniforms: {
            uTime:       { value: 0 },
            uPixelRatio: { value: pr },
            uTwinkle:    { value: twinkle },
            uDriftAmp:   { value: driftAmp }
        },
        vertexShader: SPRITE_VTX,
        fragmentShader: frag,
        blending: blending,
        depthTest: true,
        depthWrite: depthWrite,
        transparent: true
    });
    _spriteCache = {
        emit: mk(SPRITE_FRAG_EMIT, THREE.AdditiveBlending, false, 0.0, 0.08),
        emitStatic: mk(SPRITE_FRAG_EMIT, THREE.AdditiveBlending, false, 0.0, 0.0),
        star: mk(SPRITE_FRAG_STAR, THREE.AdditiveBlending, false, 0.35, 0.0),
        dust: mk(SPRITE_FRAG_DUST, THREE.NormalBlending,    false, 0.0, 0.04)
    };
    return _spriteCache;
}

function tickSpriteMaterials(t) {
    if (!_spriteCache) return;
    for (const k in _spriteCache) {
        _spriteCache[k].uniforms.uTime.value = t;
    }
}

// helper - build Points from arrays
function makePoints(pos, col, size, alpha, seed, material, renderOrder) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aColor',   new THREE.Float32BufferAttribute(col, 3));
    g.setAttribute('aSize',    new THREE.Float32BufferAttribute(size, 1));
    g.setAttribute('aAlpha',   new THREE.Float32BufferAttribute(alpha, 1));
    g.setAttribute('aSeed',    new THREE.Float32BufferAttribute(seed, 1));
    const p = new THREE.Points(g, material);
    p.frustumCulled = false;
    if (renderOrder !== undefined) p.renderOrder = renderOrder;
    return p;
}

// ===== noise helpers =====
function hash(x) { x = Math.sin(x) * 43758.5453; return x - Math.floor(x); }
function smoothNoise3(x, y, z) {
    const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
    const fx = x - ix, fy = y - iy, fz = z - iz;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    const uz = fz * fz * (3 - 2 * fz);
    function h(a, b, c) { return hash(a * 127.1 + b * 311.7 + c * 74.7); }
    const v000 = h(ix, iy, iz), v100 = h(ix+1, iy, iz);
    const v010 = h(ix, iy+1, iz), v110 = h(ix+1, iy+1, iz);
    const v001 = h(ix, iy, iz+1), v101 = h(ix+1, iy, iz+1);
    const v011 = h(ix, iy+1, iz+1), v111 = h(ix+1, iy+1, iz+1);
    return ((v000*(1-ux) + v100*ux)*(1-uy) + (v010*(1-ux) + v110*ux)*uy)*(1-uz)
         + ((v001*(1-ux) + v101*ux)*(1-uy) + (v011*(1-ux) + v111*ux)*uy)*uz;
}
function fbm3(x, y, z) {
    let v = 0, a = 0.5, s = 1;
    for (let i = 0; i < 4; i++) {
        v += a * smoothNoise3(x * s, y * s, z * s);
        s *= 2.05; a *= 0.5;
    }
    return v;
}

// color helpers
function hexToRgb(h) {
    const v = parseInt(h.replace('#', ''), 16);
    return [((v>>16)&255)/255, ((v>>8)&255)/255, (v&255)/255];
}
function lerp(a, b, t) { return a + (b - a) * t; }
function lerpRgb(c1, c2, t) { return [lerp(c1[0],c2[0],t), lerp(c1[1],c2[1],t), lerp(c1[2],c2[2],t)]; }
function scaleRgb(c, s) { return [c[0]*s, c[1]*s, c[2]*s]; }

// ===== Orion M42 =====
function buildOrion(theme, material) {
    const group = new THREE.Group();
    const cBright = hexToRgb(theme.c2);   // hot stars
    const cWarm   = hexToRgb(theme.c1);   // halpha
    const cDark   = [0.05, 0.02, 0.08];

    // --- Trapezium core stars (4 bright + many small) ---
    {
        const N = 2400;
        const pos=[], col=[], size=[], al=[], se=[];
        // 4 dominant trapezium stars
        const trap = [[-1.2, 0.5, 0.4], [-1.0, 0.7, 0.1], [-1.3, 0.3, 0.7], [-1.05, 0.55, 0.55]];
        for (let i = 0; i < 4; i++) {
            pos.push(...trap[i]);
            col.push(0.85, 0.85, 0.95);
            size.push(11);
            al.push(0.9);
            se.push(Math.random());
        }
        for (let i = 0; i < N; i++) {
            const r = Math.pow(Math.random(), 2.2) * 1.6;
            const th = Math.random() * Math.PI * 2;
            const ph = Math.acos(Math.random() * 2 - 1);
            const x = -1.15 + r * Math.sin(ph) * Math.cos(th);
            const y =  0.55 + r * Math.sin(ph) * Math.sin(th);
            const z =  0.40 + r * Math.cos(ph);
            pos.push(x, y, z);
            const t = Math.random();
            const c = lerpRgb([0.9, 0.95, 1.05], cBright, t * 0.5);
            col.push(...c);
            size.push(0.6 + Math.random() * 1.6);
            al.push(0.45 + Math.random() * 0.45);
            se.push(Math.random());
        }
        group.add(makePoints(pos, col, size, al, se, material.star, 2));
    }

    // --- Cavity wall emission (the Halpha glow) ---
    {
        const N = 28000;
        const pos=[], col=[], size=[], al=[], se=[];
        // shell around offset center with curl-like perturbation
        const cx = -1.1, cy = 0.5, cz = 0.3;
        for (let i = 0; i < N; i++) {
            const th = Math.random() * Math.PI * 2;
            const ph = Math.acos(Math.random() * 2 - 1);
            // anisotropic radii - stretched bubble
            const r = 1.6 + Math.random() * 2.4 + fbm3(th * 2, ph * 2, 0) * 1.4;
            let x = cx + r * Math.sin(ph) * Math.cos(th) * 1.15;
            let y = cy + r * Math.sin(ph) * Math.sin(th) * 0.95;
            let z = cz + r * Math.cos(ph) * 1.1;
            // pull outward into wings
            x += Math.max(0, x + 1) * 0.45;
            // density-based density: skip if outside fbm threshold
            const dens = fbm3(x * 0.6 + 13, y * 0.6 + 7, z * 0.6);
            if (dens < 0.42) { i--; continue; }
            pos.push(x, y, z);
            const t = fbm3(x * 0.3, y * 0.3, z * 0.3);
            const c = lerpRgb(cWarm, cBright, t * 0.6);
            col.push(c[0] * 0.85, c[1] * 0.6, c[2] * 0.7);
            size.push(0.8 + Math.random() * 1.6 + (1 - dens) * 1.4);
            al.push(0.10 + dens * 0.18);
            se.push(Math.random());
        }
        group.add(makePoints(pos, col, size, al, se, material.emit, 1));
    }

    // --- Outer wisps / "wings" of Orion ---
    {
        const N = 14000;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < N; i++) {
            // elongated cloud along +x with vertical spread
            const t = Math.random();
            const x = -2.0 + t * 7.0 + (Math.random() - 0.5) * 1.5;
            const y = (Math.random() - 0.5) * 2.6 * (1.0 - t * 0.3);
            const z = (Math.random() - 0.5) * 2.2;
            const dens = fbm3(x * 0.4 + 3.1, y * 0.4 + 9.2, z * 0.4);
            if (dens < 0.36) { i--; continue; }
            pos.push(x, y, z);
            const tt = fbm3(x * 0.2, y * 0.2, z * 0.2);
            const c = lerpRgb(cWarm, [0.55, 0.2, 0.45], tt * 0.7);
            col.push(c[0] * 0.85, c[1] * 0.55, c[2] * 0.75);
            size.push(1.2 + Math.random() * 2.2);
            al.push(0.04 + dens * 0.10);
            se.push(Math.random());
        }
        group.add(makePoints(pos, col, size, al, se, material.emit, 0));
    }

    // --- Dust lanes (dark cool particles) ---
    {
        const N = 3500;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < N; i++) {
            const t = Math.random();
            const x = -2.0 + t * 6.5 + (Math.random() - 0.5) * 0.8;
            const y = -0.8 + Math.sin(t * 4.0) * 0.5 + (Math.random() - 0.5) * 0.4;
            const z = (Math.random() - 0.5) * 1.4;
            const dens = fbm3(x * 0.8 + 21, y * 0.8 + 5, z * 0.8);
            if (dens < 0.5) { i--; continue; }
            pos.push(x, y, z);
            col.push(cDark[0], cDark[1], cDark[2]);
            size.push(2.0 + Math.random() * 2.5);
            al.push(0.25 + dens * 0.25);
            se.push(Math.random());
        }
        group.add(makePoints(pos, col, size, al, se, material.dust, 3));
    }
    return group;
}

// ===== Horsehead B33 - cinematic rebuild =====
// Deep crimson IC 434 background + bright Halpha "wall" + dust silhouette with rim glow
// + variety stars + small NGC 2023 reflection companion bottom-left
function buildHorsehead(theme, material) {
    const group = new THREE.Group();

    // Hubble-palette H-alpha tones (used regardless of theme - this is real-physics color)
    const cBackDeep   = [0.55, 0.06, 0.18];   // deep crimson far field
    const cBackBright = [0.85, 0.18, 0.32];   // brighter Halpha
    const cRim        = [0.95, 0.25, 0.30];   // edge rim glow
    const cDustCore   = [0.012, 0.006, 0.018];
    const cDustEdge   = [0.22, 0.06, 0.10];   // backlight tint on dust edge

    // 2D SDF primitives for horse silhouette
    function sdCircle(x, y, cx, cy, r) {
        const dx = x - cx, dy = y - cy;
        return Math.sqrt(dx*dx + dy*dy) - r;
    }
    function sdRoundedBox(x, y, cx, cy, hw, hh, r) {
        const qx = Math.abs(x - cx) - hw + r;
        const qy = Math.abs(y - cy) - hh + r;
        const ox = Math.max(qx, 0), oy = Math.max(qy, 0);
        return Math.sqrt(ox*ox + oy*oy) + Math.min(Math.max(qx, qy), 0) - r;
    }
    function smin(a, b, k) {
        const h = Math.max(k - Math.abs(a - b), 0) / k;
        return Math.min(a, b) - h * h * k * 0.25;
    }
    // horse profile (xy plane) with multi-frequency edge perturbation for irregular dust look
    function sdHorse2D(x, y) {
        // edge-warping noise so silhouette isn't a perfect SDF
        const warp = (fbm3(x * 1.8, y * 1.8, 0) - 0.5) * 0.35
                   + (fbm3(x * 5.0, y * 5.0, 7) - 0.5) * 0.12;
        const dBody = sdRoundedBox(x, y, -0.1, -1.4, 1.0, 1.9, 0.55);
        const dHead = sdCircle(x, y, 0.0, 0.8, 1.05);
        // tilted ear
        const ex = x + 0.42, ey = y - 1.85;
        const ang = 0.32;
        const eX = Math.cos(ang) * ex - Math.sin(ang) * ey;
        const eY = Math.sin(ang) * ex + Math.cos(ang) * ey;
        const dEar = sdRoundedBox(eX, eY, 0, 0, 0.32, 0.95, 0.22);
        const dSnout = sdRoundedBox(x, y, 1.05, 0.45, 0.6, 0.42, 0.32);
        let d = smin(dBody, dHead, 0.55);
        d = smin(d, dEar, 0.32);
        d = smin(d, dSnout, 0.32);
        return d + warp * 0.45;
    }

    // ===== Background IC 434 diffuse glow (deep crimson far field) =====
    {
        const N = 42000;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < N; i++) {
            const r = Math.sqrt(Math.random()) * 26.0;
            const ang = Math.random() * Math.PI * 2;
            const x = Math.cos(ang) * r;
            const y = Math.sin(ang) * r;
            const z = -5.0 + (Math.random() - 0.5) * 1.4;
            const fall = Math.exp(-(r * r) / 90.0);
            const dens = fbm3(x * 0.22 + 5, y * 0.22 + 11, z * 0.3);
            if (dens < 0.30) { i--; continue; }
            // brightness gradient: more concentrated near horse base
            const lo = fbm3(x * 0.5, y * 0.5 + 2.0, 0);
            const c = lerpRgb(cBackDeep, cBackBright, Math.min(1, lo * 1.3));
            pos.push(x, y, z);
            col.push(c[0] * 0.7, c[1] * 0.6, c[2] * 0.65);
            size.push(2.6 + Math.random() * 3.2);
            al.push(0.025 + dens * 0.05 * fall);
            se.push(Math.random());
        }
        group.add(makePoints(pos, col, size, al, se, material.emit, 0));
    }

    // ===== Bright H-alpha "wall" along bottom of background (the dramatic glowing horizon) =====
    {
        const N = 28000;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < N; i++) {
            const x = (Math.random() - 0.5) * 18.0;
            // concentrated in a horizontal band near y=-2..1 (the wall where dust meets light)
            const yBand = -1.5 + (Math.random() - 0.5) * 3.0;
            // turbulent y offset for ragged cloud top
            const yWobble = (fbm3(x * 0.4 + 9, 0, 0) - 0.5) * 1.8;
            const y = yBand + yWobble;
            const z = -3.8 + (Math.random() - 0.5) * 1.0;
            const dens = fbm3(x * 0.5 + 13, y * 0.7, z * 0.4 + 2);
            if (dens < 0.42) { i--; continue; }
            // distance from y=0 for vertical brightness falloff
            const fall = Math.exp(-Math.pow((y + 0.5) / 2.0, 2));
            const c = lerpRgb(cBackBright, cRim, fall * 0.4);
            pos.push(x, y, z);
            col.push(c[0] * 0.85, c[1] * 0.55, c[2] * 0.55);
            size.push(2.2 + Math.random() * 2.4);
            al.push(0.04 + dens * 0.08 * fall);
            se.push(Math.random());
        }
        group.add(makePoints(pos, col, size, al, se, material.emit, 1));
    }

    // ===== Horsehead silhouette - DENSE dark dust core =====
    {
        const N = 95000;
        const pos=[], col=[], size=[], al=[], se=[];
        let placed = 0, tries = 0;
        while (placed < N && tries < N * 18) {
            tries++;
            const x = -2.2 + Math.random() * 4.3;
            const y = -3.4 + Math.random() * 6.4;
            const d = sdHorse2D(x, y);
            if (d > 0.0) continue;
            // organic density variation inside
            const dens = fbm3(x * 1.4 + 7, y * 1.4, 0);
            if (dens < 0.25) continue;
            const z = -0.2 + (Math.random() - 0.5) * 1.0;
            const inside = Math.max(0, -d);
            // deeper inside = pure dark, near edge = slightly tinted by backlight
            const edgeMix = Math.exp(-inside * 2.5);
            const c = lerpRgb(cDustCore, cDustEdge, edgeMix * 0.6);
            pos.push(x, y, z);
            col.push(c[0], c[1], c[2]);
            size.push(2.4 + Math.random() * 2.0);
            al.push(0.78 + (1.0 - edgeMix) * 0.20);
            se.push(Math.random());
            placed++;
        }
        group.add(makePoints(pos, col, size, al, se, material.dust, 3));
    }

    // ===== Rim lighting: bright red-orange halo right at silhouette edge =====
    // Sampled in a thin band just OUTSIDE the SDF where light wraps around dust
    {
        const N = 12000;
        const pos=[], col=[], size=[], al=[], se=[];
        let placed = 0, tries = 0;
        while (placed < N && tries < N * 22) {
            tries++;
            const x = -2.2 + Math.random() * 4.4;
            const y = -3.4 + Math.random() * 6.4;
            const d = sdHorse2D(x, y);
            // narrow band outside the silhouette (0 < d < 0.18)
            if (d <= 0.0 || d > 0.22) continue;
            const z = -0.1 + (Math.random() - 0.5) * 0.8;
            // brightest right at the edge, fading outward
            const edgeBright = Math.exp(-d * 9.0);
            // skip random subset to avoid uniform halo
            const dens = fbm3(x * 1.8 + 23, y * 1.8, 0);
            if (dens < 0.4) continue;
            const c = lerpRgb(cRim, [1.0, 0.5, 0.4], edgeBright * 0.5);
            pos.push(x, y, z);
            col.push(c[0] * 0.9, c[1] * 0.55, c[2] * 0.5);
            size.push(1.6 + Math.random() * 1.6);
            al.push(0.06 + edgeBright * 0.18);
            se.push(Math.random());
            placed++;
        }
        group.add(makePoints(pos, col, size, al, se, material.emit, 4));
    }

    // ===== Foreground stars (variety: bright spike stars + many small dim) =====
    {
        const pos=[], col=[], size=[], al=[], se=[];
        // a few prominent bright stars (like the iconic one above the horsehead)
        const bright = [
            { p: [0.4, 3.0, 1.0], mag: 1.1, c: [0.9, 0.92, 1.1] },     // bright blue-white above horsehead
            { p: [-3.5, 0.2, 1.0], mag: 0.85, c: [0.85, 0.88, 1.05] }, // mid-left
            { p: [4.0, 2.4, 0.8], mag: 0.6, c: [1.0, 0.9, 0.75] },     // upper-right warm
            { p: [2.8, -2.5, 0.6], mag: 0.55, c: [0.9, 0.85, 1.0] }
        ];
        for (const s of bright) {
            pos.push(...s.p);
            col.push(s.c[0], s.c[1], s.c[2]);
            size.push(13 * s.mag);
            al.push(0.92);
            se.push(Math.random());
        }
        // ~180 small dim background stars distributed across visible area
        for (let i = 0; i < 220; i++) {
            const x = (Math.random() - 0.5) * 16.0;
            const y = (Math.random() - 0.5) * 12.0;
            const z = -1.0 + (Math.random() - 0.5) * 4.0;
            // bias colors: HR-diagram-ish mix
            const r = Math.random();
            let c;
            if (r < 0.55)      c = [0.85, 0.88, 1.05];   // blue-white (most common in field)
            else if (r < 0.78) c = [1.0, 0.95, 0.85];    // white-yellow
            else if (r < 0.92) c = [1.0, 0.82, 0.6];     // orange
            else               c = [0.95, 0.55, 0.4];    // red giant
            pos.push(x, y, z);
            col.push(c[0], c[1], c[2]);
            size.push(1.8 + Math.random() * 3.0);
            al.push(0.35 + Math.random() * 0.45);
            se.push(Math.random());
        }
        group.add(makePoints(pos, col, size, al, se, material.star, 5));
    }

    // ===== NGC 2023 reflection nebula companion (bottom-left of frame) =====
    {
        // bright central star
        const starPos=[], starCol=[], starSize=[], starAl=[], starSe=[];
        starPos.push(-4.5, -2.6, -0.2);
        starCol.push(0.95, 0.95, 1.05);
        starSize.push(11);
        starAl.push(0.95);
        starSe.push(Math.random());
        group.add(makePoints(starPos, starCol, starSize, starAl, starSe, material.star, 6));

        // cyan-blue reflection cloud around it
        const N = 8000;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < N; i++) {
            const r = Math.pow(Math.random(), 1.8) * 1.6;
            const th = Math.random() * Math.PI * 2;
            const ph = Math.acos(Math.random() * 2 - 1);
            const lx = r * Math.sin(ph) * Math.cos(th);
            const ly = r * Math.sin(ph) * Math.sin(th);
            const lz = r * Math.cos(ph);
            const x = -4.5 + lx;
            const y = -2.6 + ly;
            const z = -0.2 + lz;
            const dens = fbm3(lx * 1.4 + 19, ly * 1.4, lz * 1.4 + 5);
            if (dens < 0.4) { i--; continue; }
            const t = 1.0 - r / 1.6;
            // teal/cyan reflection
            const c = lerpRgb([0.25, 0.5, 0.7], [0.7, 0.85, 1.0], t * 0.5);
            pos.push(x, y, z);
            col.push(c[0] * 0.7, c[1] * 0.7, c[2] * 0.8);
            size.push(1.4 + Math.random() * 1.8);
            al.push(0.04 + dens * 0.10);
            se.push(Math.random());
        }
        group.add(makePoints(pos, col, size, al, se, material.emit, 2));
    }
    return group;
}

// ===== Crab Nebula M1 =====
function buildCrab(theme, material) {
    const group = new THREE.Group();
    const cA = hexToRgb(theme.c1);
    const cB = hexToRgb(theme.c2);

    // --- Central pulsar (bright point) ---
    {
        const pos=[], col=[], size=[], al=[], se=[];
        pos.push(0, 0, 0);
        col.push(0.85, 0.88, 1.05);
        size.push(13);
        al.push(0.9);
        se.push(0.5);
        group.add(makePoints(pos, col, size, al, se, material.star, 3));
    }

    // --- Synchrotron envelope (oblate) ---
    {
        const N = 22000;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < N; i++) {
            // oblate spheroid surface band
            const th = Math.random() * Math.PI * 2;
            const ph = Math.acos(Math.random() * 2 - 1);
            const baseR = 3.2 + Math.random() * 1.8;
            const r = baseR + fbm3(th * 2, ph * 3, 0) * 1.0;
            const x = r * Math.sin(ph) * Math.cos(th) * 1.2;
            const y = r * Math.cos(ph) * 0.7;
            const z = r * Math.sin(ph) * Math.sin(th) * 1.2;
            const dens = fbm3(x * 0.55, y * 0.55, z * 0.55);
            if (dens < 0.42) { i--; continue; }
            pos.push(x, y, z);
            const t = fbm3(x * 0.25 + 7, y * 0.25, z * 0.25);
            const c = lerpRgb(cA, cB, t);
            col.push(c[0] * 0.85, c[1] * 0.85, c[2] * 0.9);
            size.push(1.0 + Math.random() * 1.6);
            al.push(0.08 + dens * 0.15);
            se.push(Math.random());
        }
        group.add(makePoints(pos, col, size, al, se, material.emit, 1));
    }

    // --- Radial synchrotron filaments (6 bright chains) ---
    {
        const N_per = 1800;
        const numFil = 8;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let f = 0; f < numFil; f++) {
            const baseAng = (f / numFil) * Math.PI * 2 + Math.random() * 0.4;
            const tilt = (Math.random() - 0.5) * 0.5;
            for (let i = 0; i < N_per; i++) {
                const t = Math.random();
                const r = 0.5 + t * 5.0;
                // small curl along filament
                const wobble = Math.sin(t * 8.0 + f) * 0.25;
                const ang = baseAng + wobble * 0.2;
                const x = r * Math.cos(ang) * 1.2 + (Math.random() - 0.5) * 0.25;
                const y = r * tilt + Math.sin(t * 5.0 + f) * 0.4 + (Math.random() - 0.5) * 0.25;
                const z = r * Math.sin(ang) * 1.2 + (Math.random() - 0.5) * 0.25;
                pos.push(x, y, z);
                const tt = (1.0 - t);
                const c = lerpRgb(cB, cA, t * 0.7);
                col.push(c[0] * (0.5 + tt * 0.4), c[1] * (0.5 + tt * 0.4), c[2] * 0.85);
                size.push(1.6 + (1 - t) * 2.0 + Math.random() * 0.8);
                al.push(0.15 + tt * 0.25);
                se.push(Math.random());
            }
        }
        const filGroup = new THREE.Group();
        filGroup.add(makePoints(pos, col, size, al, se, material.emit, 2));
        // slow rotation of synchrotron filaments around pulsar
        filGroup.userData.spin = 0.06;
        group.add(filGroup);
    }
    return group;
}

// ===== Pleiades M45 =====
function buildPleiades(theme, material) {
    const group = new THREE.Group();
    const cNeb = hexToRgb(theme.c1);     // blue reflection
    const cStar = hexToRgb(theme.c2);    // star color

    // Seven Sisters approximate positions
    const stars = [
        { pos: [ 0.0,  0.0,  0.0], mag: 1.4, name: 'Alcyone' },
        { pos: [-2.4,  0.8, -0.6], mag: 1.0, name: 'Maia' },
        { pos: [ 2.7, -0.4,  0.7], mag: 1.1, name: 'Atlas' },
        { pos: [-1.6, -1.5,  1.0], mag: 0.85, name: 'Electra' },
        { pos: [ 1.4,  1.9, -1.1], mag: 0.9, name: 'Taygeta' },
        { pos: [-3.1, -0.3,  1.4], mag: 0.95, name: 'Merope' },
        { pos: [ 3.2,  1.1, -0.8], mag: 0.75, name: 'Pleione' }
    ];

    // --- 7 bright stars with diffraction spikes ---
    {
        const pos=[], col=[], size=[], al=[], se=[];
        for (const s of stars) {
            pos.push(...s.pos);
            col.push(0.85, 0.9, 1.1);
            size.push(14 * s.mag);
            al.push(0.95);
            se.push(Math.random());
        }
        group.add(makePoints(pos, col, size, al, se, material.star, 3));
    }

    // --- Reflection nebulosity per star (filamentary blue dust) ---
    {
        const N_per = 4500;
        const pos=[], col=[], size=[], al=[], se=[];
        for (const s of stars) {
            for (let i = 0; i < N_per; i++) {
                const r = Math.pow(Math.random(), 1.7) * 1.7;
                const th = Math.random() * Math.PI * 2;
                const ph = Math.acos(Math.random() * 2 - 1);
                const lx = r * Math.sin(ph) * Math.cos(th);
                const ly = r * Math.sin(ph) * Math.sin(th);
                const lz = r * Math.cos(ph);
                const x = s.pos[0] + lx;
                const y = s.pos[1] + ly;
                const z = s.pos[2] + lz;
                const dens = fbm3(lx * 1.4 + s.pos[0] * 3, ly * 1.4, lz * 1.4 + s.pos[2] * 5);
                if (dens < 0.45) { i--; continue; }
                pos.push(x, y, z);
                const t = (1.0 - r / 1.7);
                const c = lerpRgb(cNeb, [0.85, 0.9, 1.1], t * 0.35);
                col.push(c[0] * (0.7 + t * 0.3), c[1] * (0.75 + t * 0.25), c[2] * 0.95);
                size.push(0.9 + Math.random() * 1.4 + (1 - dens) * 1.0);
                al.push(0.04 + dens * 0.10 * s.mag);
                se.push(Math.random());
            }
        }
        group.add(makePoints(pos, col, size, al, se, material.emit, 1));
    }

    // --- Smaller cluster stars scattered around ---
    {
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < 80; i++) {
            const x = (Math.random() - 0.5) * 9.0;
            const y = (Math.random() - 0.5) * 5.0;
            const z = (Math.random() - 0.5) * 5.0;
            let near = false;
            for (const s of stars) {
                const dx = x - s.pos[0], dy = y - s.pos[1], dz = z - s.pos[2];
                if (dx*dx + dy*dy + dz*dz < 0.7) { near = true; break; }
            }
            if (near) { i--; continue; }
            pos.push(x, y, z);
            col.push(0.85, 0.88, 1.0);
            size.push(2.5 + Math.random() * 2.5);
            al.push(0.4 + Math.random() * 0.4);
            se.push(Math.random());
        }
        group.add(makePoints(pos, col, size, al, se, material.star, 2));
    }
    return group;
}

// ===== Background starfield (always added behind nebula objects) =====
function buildBackgroundStars(material) {
    const N = 1500;
    const pos=[], col=[], size=[], al=[], se=[];
    for (let i = 0; i < N; i++) {
        // on far sphere
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(Math.random() * 2 - 1);
        const r = 60;
        pos.push(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th));
        const t = Math.random();
        col.push(0.85 + t * 0.15, 0.88 + t * 0.12, 1.0);
        size.push(0.6 + Math.random() * 1.4);
        al.push(0.4 + Math.random() * 0.5);
        se.push(Math.random());
    }
    return makePoints(pos, col, size, al, se, material.emitStatic, -1);
}

// ===== Black Hole bipolar jets =====
// Two relativistic plasma jets perpendicular to the accretion disk.
// Particles "flow" outward over time via the vertex drift uniform.
function buildBlackHoleJets(theme, material) {
    const group = new THREE.Group();
    const cHot = [0.85, 0.92, 1.15];      // blue-white near base
    const cMid = hexToRgb(theme.c1);
    const cTip = [0.55, 0.25, 0.65];

    const N = 3500;
    const pos=[], col=[], size=[], al=[], se=[];
    for (let side = -1; side <= 1; side += 2) {
        for (let i = 0; i < N; i++) {
            const t = Math.pow(Math.random(), 0.7);   // bias toward base
            const y = side * (2.2 + t * 16.0);
            // jet widens with distance (cone)
            const radius = 0.28 + t * 1.6;
            const ang = Math.random() * Math.PI * 2;
            const rJit = Math.sqrt(Math.random()) * radius;
            const x = Math.cos(ang) * rJit;
            const z = Math.sin(ang) * rJit;
            pos.push(x, y, z);
            const c = lerpRgb(lerpRgb(cHot, cMid, t * 0.7), cTip, t * 0.5);
            col.push(c[0], c[1], c[2]);
            size.push(1.4 + (1 - t) * 2.0 + Math.random() * 0.6);
            al.push(0.18 + (1 - t) * 0.5);
            se.push(Math.random());
        }
    }
    group.add(makePoints(pos, col, size, al, se, material.emit, 5));
    // slow rotation around jet axis + gentle Y-scale pulse (Doppler boosting "wave")
    group.userData.spin = 0.08;
    group.userData.pulse = { axis: 'y', base: 1.0, amp: 0.06, freq: 0.4 };
    return group;
}

// ===== Wormhole inflow spiral =====
// Spiral of particles slowly drifting toward the throat
function buildWormholeInflow(theme, material) {
    const group = new THREE.Group();
    const cA = hexToRgb(theme.c1);
    const cB = hexToRgb(theme.c2);

    const N = 6000;
    const pos=[], col=[], size=[], al=[], se=[];
    for (let i = 0; i < N; i++) {
        // logarithmic spiral falling toward throat
        const t = Math.pow(Math.random(), 0.6);
        const r = 1.8 + t * 6.5;
        const turns = 3.0;
        const ang = Math.random() * Math.PI * 2 + t * turns;
        const yJit = (Math.random() - 0.5) * (0.4 + t * 1.2);
        const x = Math.cos(ang) * r;
        const z = Math.sin(ang) * r;
        const y = yJit;
        pos.push(x, y, z);
        const c = lerpRgb(cA, cB, t);
        col.push(c[0], c[1], c[2]);
        size.push(0.9 + (1 - t) * 1.4 + Math.random() * 0.6);
        al.push(0.14 + (1 - t) * 0.4);
        se.push(Math.random());
    }
    group.add(makePoints(pos, col, size, al, se, material.emit, 4));
    // continuous spiral rotation = particles appear to swirl into the throat
    group.userData.spin = 0.35;
    return group;
}

// ===== Dyson Sphere - full 3D rebuild =====
// Central star + multiple orbital shells of panel sprites + bright satellite traffic
// Each shell is rotated externally for orbital motion
function buildDyson(theme, material) {
    const root = new THREE.Group();
    const cStar = hexToRgb(theme.c2);
    const cPanel = hexToRgb(theme.c1);
    const cHot = [1.0, 0.85, 0.5];

    // --- Central star (gentle, ACES will handle highlights) ---
    {
        const starGroup = new THREE.Group();
        const pos=[], col=[], size=[], al=[], se=[];
        pos.push(0, 0, 0);
        col.push(cStar[0] * 0.7, cStar[1] * 0.65, cStar[2] * 0.55);
        size.push(18);
        al.push(0.85);
        se.push(0.3);
        starGroup.add(makePoints(pos, col, size, al, se, material.star, 5));
        // gentle brightness pulse via Y-scale (very subtle - solar wind feel)
        starGroup.userData.pulse = { axis: 'y', base: 1.0, amp: 0.04, freq: 0.6 };
        root.add(starGroup);
    }

    // --- Corona / inner glow (additive emission cloud near star) ---
    {
        const N = 1200;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < N; i++) {
            const th = Math.random() * Math.PI * 2;
            const ph = Math.acos(Math.random() * 2 - 1);
            const r = 0.4 + Math.pow(Math.random(), 2) * 1.2;
            const x = r * Math.sin(ph) * Math.cos(th);
            const y = r * Math.cos(ph);
            const z = r * Math.sin(ph) * Math.sin(th);
            pos.push(x, y, z);
            const c = lerpRgb([0.8, 0.75, 0.65], cStar, Math.random() * 0.5);
            col.push(c[0] * 0.7, c[1] * 0.65, c[2] * 0.6);
            size.push(2.2 + Math.random() * 2.6);
            al.push(0.05 + Math.random() * 0.10);
            se.push(Math.random());
        }
        root.add(makePoints(pos, col, size, al, se, material.emit, 4));
    }

    // --- Light rays escaping through gaps (radial streamers, slowly drifting) ---
    {
        const N_per = 250;
        const numRays = 18;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let f = 0; f < numRays; f++) {
            const baseTh = Math.random() * Math.PI * 2;
            const basePh = Math.acos(Math.random() * 2 - 1);
            for (let i = 0; i < N_per; i++) {
                const t = Math.random();
                const r = 1.5 + t * 8.0;
                const jit = (1 - t) * 0.15 + t * 0.4;
                const th = baseTh + (Math.random() - 0.5) * jit;
                const ph = basePh + (Math.random() - 0.5) * jit;
                const x = r * Math.sin(ph) * Math.cos(th);
                const y = r * Math.cos(ph);
                const z = r * Math.sin(ph) * Math.sin(th);
                pos.push(x, y, z);
                const c = lerpRgb([0.85, 0.75, 0.6], cStar, t * 0.3);
                col.push(c[0] * 0.7, c[1] * 0.55 * (1 - t * 0.5), c[2] * 0.5 * (1 - t * 0.6));
                size.push(1.4 + (1 - t) * 2.0);
                al.push(0.02 + (1 - t) * 0.10);
                se.push(Math.random());
            }
        }
        const rayGroup = new THREE.Group();
        rayGroup.add(makePoints(pos, col, size, al, se, material.emit, 3));
        // rays drift slowly so structure isn't static
        rayGroup.userData.spin = 0.015;
        root.add(rayGroup);
    }

    // --- Orbital panel shells (3 radii, each rotates separately) ---
    const shellRadii = [3.0, 4.2, 5.5];
    const shellDensity = [3500, 4500, 5500];
    for (let s = 0; s < shellRadii.length; s++) {
        const shellGroup = new THREE.Group();
        const radius = shellRadii[s];
        const N = shellDensity[s];
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < N; i++) {
            const th = Math.random() * Math.PI * 2;
            const ph = Math.acos(Math.random() * 2 - 1);
            // sparse density - many panels but with gaps
            if (Math.random() < 0.4) continue;
            const r = radius + (Math.random() - 0.5) * 0.25;
            const x = r * Math.sin(ph) * Math.cos(th);
            const y = r * Math.cos(ph);
            const z = r * Math.sin(ph) * Math.sin(th);
            pos.push(x, y, z);
            const heat = Math.random();
            const c = heat > 0.94
                ? lerpRgb(cHot, cStar, Math.random() * 0.4).map(v => v * 0.6)
                : lerpRgb([0.12, 0.12, 0.16], cPanel, heat * 0.6);
            col.push(c[0], c[1], c[2]);
            size.push(2.2 + Math.random() * 1.8);
            al.push(heat > 0.94 ? 0.7 : 0.5 + Math.random() * 0.3);
            se.push(Math.random());
        }
        // panels: use dust material (occluding) so they stand out as solid hexes
        shellGroup.add(makePoints(pos, col, size, al, se, material.dust, 2));
        shellGroup.userData.spin = 0.04 - s * 0.012;          // outer = slower
        shellGroup.userData.tilt = (Math.random() - 0.5) * 0.6;
        shellGroup.rotation.x = shellGroup.userData.tilt;
        root.add(shellGroup);
    }

    // --- Satellite traffic (tiny bright dots in slow orbit) ---
    {
        const N = 250;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < N; i++) {
            const th = Math.random() * Math.PI * 2;
            const ph = Math.acos(Math.random() * 2 - 1);
            const r = 2.5 + Math.random() * 3.5;
            const x = r * Math.sin(ph) * Math.cos(th);
            const y = r * Math.cos(ph);
            const z = r * Math.sin(ph) * Math.sin(th);
            pos.push(x, y, z);
            col.push(0.85, 0.8, 0.7);
            size.push(1.6 + Math.random() * 1.0);
            al.push(0.45 + Math.random() * 0.3);
            se.push(Math.random());
        }
        const satGroup = new THREE.Group();
        satGroup.add(makePoints(pos, col, size, al, se, material.star, 3));
        satGroup.userData.spin = -0.06;  // counter-rotating to shells for visual interest
        root.add(satGroup);
    }

    return root;
}

// ===== entry point =====
function buildAccent(objectId, theme, renderer) {
    const material = getSpriteMaterials(renderer);
    switch (objectId) {
        case 'sgr_a':   return buildBlackHoleJets(theme, material);
        case 'cygnus':  return buildWormholeInflow(theme, material);
        default:        return null;
    }
}

function buildNebula(type, theme, renderer) {
    const material = getSpriteMaterials(renderer);
    const root = new THREE.Group();
    root.add(buildBackgroundStars(material));
    let neb;
    switch (type) {
        case 'orion':     neb = buildOrion(theme, material);     break;
        case 'horsehead': neb = buildHorsehead(theme, material); break;
        case 'crab':      neb = buildCrab(theme, material);      break;
        case 'pleiades':  neb = buildPleiades(theme, material);  break;
        case 'dyson':     neb = buildDyson(theme, material);     break;
        default: neb = new THREE.Group();
    }
    root.add(neb);
    return root;
}

// rotate / pulse any group marked with userData.spin or userData.pulse
function tickOrbitals(group, dt, t) {
    if (!group) return;
    group.traverse(c => {
        if (!c.userData) return;
        if (c.userData.spin) {
            c.rotation.y += c.userData.spin * dt;
        }
        if (c.userData.pulse) {
            const p = c.userData.pulse;
            const v = p.base + Math.sin(t * p.freq * Math.PI * 2) * p.amp;
            if (p.axis === 'x')      c.scale.x = v;
            else if (p.axis === 'z') c.scale.z = v;
            else                     c.scale.y = v;
        }
    });
}

function disposeNebula(group) {
    if (!group) return;
    group.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        // material is shared, do not dispose
    });
}

global.NebulaParticles = {
    build: buildNebula,
    buildAccent: buildAccent,
    dispose: disposeNebula,
    tick: tickSpriteMaterials,
    tickOrbitals: tickOrbitals
};

})(window);
