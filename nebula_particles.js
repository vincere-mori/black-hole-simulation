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
    gl_PointSize = aSize * uPixelRatio * (180.0 / max(-mv.z, 0.1));
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
    float halo = exp(-d * 1.5) * 0.16;
    float a = (core + halo) * vAlpha;
    gl_FragColor = vec4(vColor * (0.18 + core * 0.38), a);
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
    float halo = exp(-d * 2.6) * 0.34;

    // 4-pointed diffraction spikes
    vec2 a = abs(uv) * 2.0;
    float spikeH = exp(-a.x * 24.0) * (1.0 - smoothstep(0.0, 1.0, a.y * 2.0));
    float spikeV = exp(-a.y * 24.0) * (1.0 - smoothstep(0.0, 1.0, a.x * 2.0));
    float spikes = (spikeH + spikeV) * 0.32;

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

function addChaos(object, cfg) {
    object.userData.chaos = Object.assign({ phase: Math.random() * Math.PI * 2 }, cfg);
    return object;
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

function markLocalMaterial(mat) {
    mat.userData.local = true;
    return mat;
}

function makeGlowRing(radius, tube, color, opacity, rotation, renderOrder) {
    const geo = new THREE.TorusGeometry(radius, tube, 8, 192);
    const mat = markLocalMaterial(new THREE.MeshBasicMaterial({
        color: new THREE.Color(color[0], color[1], color[2]),
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    }));
    const mesh = new THREE.Mesh(geo, mat);
    if (rotation) mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    if (renderOrder !== undefined) mesh.renderOrder = renderOrder;
    return mesh;
}

function makePanelTexture(theme) {
    const c = document.createElement('canvas');
    c.width = 160; c.height = 96;
    const ctx = c.getContext('2d');
    const metal = ctx.createLinearGradient(0, 0, c.width, c.height);
    metal.addColorStop(0, '#05070d');
    metal.addColorStop(0.55, '#111725');
    metal.addColorStop(1, '#05070d');
    ctx.fillStyle = metal;
    ctx.fillRect(0, 0, c.width, c.height);

    const accent = theme.c1 || '#ffcc66';
    ctx.strokeStyle = accent + '80';
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, c.width - 10, c.height - 10);
    ctx.strokeStyle = accent + '30';
    for (let x = 28; x < c.width; x += 26) {
        ctx.beginPath(); ctx.moveTo(x, 8); ctx.lineTo(x, c.height - 8); ctx.stroke();
    }
    for (let y = 24; y < c.height; y += 22) {
        ctx.beginPath(); ctx.moveTo(8, y); ctx.lineTo(c.width - 8, y); ctx.stroke();
    }
    ctx.strokeStyle = '#ffffff26';
    ctx.beginPath(); ctx.moveTo(10, 12); ctx.lineTo(c.width - 12, 12); ctx.stroke();
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
}

function makeAureliaRingTexture(cA, cB) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 512;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(c.width, c.height);
    const clamp01 = v => Math.max(0, Math.min(1, v));
    const smooth = (a, b, x) => {
        const t = clamp01((x - a) / (b - a));
        return t * t * (3 - 2 * t);
    };

    for (let y = 0; y < c.height; y++) {
        for (let x = 0; x < c.width; x++) {
            const nx = (x / (c.width - 1) - 0.5) * 2.0;
            const ny = (y / (c.height - 1) - 0.5) * 2.0;
            const r = Math.sqrt(nx * nx + ny * ny);
            const a = Math.atan2(ny, nx);
            const inner = smooth(0.43, 0.49, r);
            const outer = 1.0 - smooth(0.94, 1.0, r);
            const edge = inner * outer;
            if (edge <= 0.0) continue;

            const bands = 0.55 + 0.45 * Math.sin(r * 78.0 + Math.sin(a * 6.0) * 0.7);
            const fine = 0.70 + 0.30 * Math.sin(r * 210.0 + a * 3.0);
            const cassini = 1.0 - smooth(0.635, 0.650, r) * (1.0 - smooth(0.672, 0.688, r));
            const spokes = 0.82 + 0.18 * Math.pow(Math.max(0, Math.cos(a * 18.0 + r * 8.0)), 3.0);
            const alpha = edge * cassini * spokes * (0.18 + bands * fine * 0.42);
            const mixT = clamp01(0.24 + bands * 0.52 + Math.sin(r * 16.0) * 0.10);
            const rr = lerp(cB[0], cA[0], mixT);
            const gg = lerp(cB[1], cA[1], mixT);
            const bb = lerp(cB[2], cA[2], mixT);
            const idx = (y * c.width + x) * 4;
            img.data[idx]     = Math.round(clamp01(rr) * 255);
            img.data[idx + 1] = Math.round(clamp01(gg) * 255);
            img.data[idx + 2] = Math.round(clamp01(bb) * 255);
            img.data[idx + 3] = Math.round(clamp01(alpha) * 255);
        }
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
}

// ===== Orion M42 =====
function buildOrion(theme, material) {
    const group = new THREE.Group();
    const cBright = hexToRgb(theme.c2);   // hot stars
    const cWarm   = hexToRgb(theme.c1);   // halpha
    const cDark   = [0.018, 0.010, 0.030];

    // --- Trapezium core stars (4 bright + many small) ---
    {
        const N = 1300;
        const pos=[], col=[], size=[], al=[], se=[];
        // 4 dominant trapezium stars
        const trap = [[-1.2, 0.5, 0.4], [-1.0, 0.7, 0.1], [-1.3, 0.3, 0.7], [-1.05, 0.55, 0.55]];
        for (let i = 0; i < 4; i++) {
            pos.push(...trap[i]);
            col.push(0.85, 0.85, 0.95);
            size.push(6.2);
            al.push(0.72);
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
            size.push(0.35 + Math.random() * 0.95);
            al.push(0.24 + Math.random() * 0.34);
            se.push(Math.random());
        }
        const trapGroup = new THREE.Group();
        trapGroup.add(makePoints(pos, col, size, al, se, material.star, 2));
        addChaos(trapGroup, { rotY: 0.022, rotZ: 0.016, bob: 0.035, freq: 0.18 });
        group.add(trapGroup);
    }

    // --- Cavity wall emission (the Halpha glow) ---
    {
        const N = 24000;
        const pos=[], col=[], size=[], al=[], se=[];
        // shell around offset center with curl-like perturbation
        const cx = -1.1, cy = 0.5, cz = 0.3;
        for (let i = 0; i < N; i++) {
            const th = Math.random() * Math.PI * 2;
            const ph = Math.acos(Math.random() * 2 - 1);
            // anisotropic radii - stretched bubble
            const r = 1.35 + Math.random() * 2.55 + fbm3(th * 2, ph * 2, 0) * 1.15;
            let x = cx + r * Math.sin(ph) * Math.cos(th) * 1.15;
            let y = cy + r * Math.sin(ph) * Math.sin(th) * 0.95;
            let z = cz + r * Math.cos(ph) * 1.1;
            // pull outward into wings
            x += Math.max(0, x + 1) * 0.34;
            y += Math.sin(x * 0.9) * 0.22;
            // density-based density: skip if outside fbm threshold
            const dens = fbm3(x * 0.6 + 13, y * 0.6 + 7, z * 0.6);
            if (dens < 0.42) { i--; continue; }
            pos.push(x, y, z);
            const t = fbm3(x * 0.3, y * 0.3, z * 0.3);
            const c = lerpRgb(cWarm, cBright, t * 0.6);
            col.push(c[0] * 0.70, c[1] * 0.52, c[2] * 0.68);
            size.push(0.58 + Math.random() * 1.18 + (1 - dens) * 0.82);
            al.push(0.052 + dens * 0.096);
            se.push(Math.random());
        }
        const cavity = makePoints(pos, col, size, al, se, material.emit, 1);
        addChaos(cavity, { rotY: 0.008, rotX: 0.004, rotZ: -0.006, bob: 0.040, freq: 0.09 });
        group.add(cavity);
    }

    // --- Outer wisps / "wings" of Orion ---
    {
        const N = 18000;
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
            col.push(c[0] * 0.66, c[1] * 0.46, c[2] * 0.68);
            size.push(0.80 + Math.random() * 1.55);
            al.push(0.030 + dens * 0.062);
            se.push(Math.random());
        }
        const wings = makePoints(pos, col, size, al, se, material.emit, 0);
        addChaos(wings, { rotY: -0.006, rotZ: 0.010, bob: 0.060, freq: 0.07 });
        group.add(wings);
    }

    // --- Dust lanes (dark cool particles) ---
    {
        const N = 1800;
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
            size.push(0.85 + Math.random() * 1.25);
            al.push(0.10 + dens * 0.12);
            se.push(Math.random());
        }
        const dustLanes = makePoints(pos, col, size, al, se, material.dust, 3);
        addChaos(dustLanes, { rotY: 0.004, rotZ: -0.012, bob: 0.025, freq: 0.11 });
        group.add(dustLanes);
    }

    // --- Blue reflection veil around the Trapezium, gives M42 more depth ---
    {
        const N = 9000;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < N; i++) {
            const t = Math.random();
            const x = -2.55 + t * 4.9 + (Math.random() - 0.5) * 0.95;
            const y = 0.05 + Math.sin(t * Math.PI * 1.6) * 1.05 + (Math.random() - 0.5) * 1.1;
            const z = 0.2 + (Math.random() - 0.5) * 1.9;
            const dens = fbm3(x * 0.72 + 17, y * 0.72 + 4, z * 0.72);
            if (dens < 0.43) { i--; continue; }
            const c = lerpRgb([0.22, 0.42, 0.96], [0.76, 0.86, 1.1], dens * 0.62);
            pos.push(x, y, z);
            col.push(c[0] * 0.42, c[1] * 0.52, c[2] * 0.78);
            size.push(0.72 + Math.random() * 1.20);
            al.push(0.018 + dens * 0.046);
            se.push(Math.random());
        }
        const veil = makePoints(pos, col, size, al, se, material.emit, 2);
        addChaos(veil, { rotY: 0.014, rotZ: 0.008, bob: 0.050, freq: 0.13 });
        group.add(veil);
    }

    // --- OIII/Cyan shock ribbons: thin folded arcs instead of a flat pink cloud ---
    {
        const ribbonGroup = new THREE.Group();
        const pos=[], col=[], size=[], al=[], se=[];
        const ribbons = [
            { x0: -2.75, y0:  1.25, len: 5.6, sag: -1.35, z:  0.65, hue: 0.10 },
            { x0: -2.15, y0: -0.05, len: 5.2, sag:  0.85, z: -0.55, hue: 0.45 },
            { x0: -0.85, y0:  1.85, len: 3.8, sag: -0.65, z:  0.15, hue: 0.72 },
            { x0: -3.25, y0: -1.25, len: 4.4, sag:  0.55, z: -0.25, hue: 0.30 }
        ];
        for (const rbn of ribbons) {
            for (let i = 0; i < 3300; i++) {
                const t = Math.random();
                const curl = Math.sin(t * Math.PI * 2.0 + rbn.hue * 5.0);
                const x = rbn.x0 + t * rbn.len + (Math.random() - 0.5) * 0.16;
                const y = rbn.y0 + Math.sin(t * Math.PI) * rbn.sag + curl * 0.12 + (Math.random() - 0.5) * 0.18;
                const z = rbn.z + (Math.random() - 0.5) * 0.28;
                const dens = fbm3(x * 1.9 + rbn.hue * 8.0, y * 1.9, z * 1.9);
                if (dens < 0.40 || Math.random() < t * 0.08) { i--; continue; }
                const c = lerpRgb([0.18, 0.82, 1.05], [0.95, 0.45, 0.82], rbn.hue * 0.55);
                pos.push(x, y, z);
                col.push(c[0] * 0.55, c[1] * 0.66, c[2] * 0.88);
                size.push(0.34 + Math.random() * 0.70);
                al.push(0.030 + dens * 0.064);
                se.push(Math.random());
            }
        }
        ribbonGroup.add(makePoints(pos, col, size, al, se, material.emit, 5));
        addChaos(ribbonGroup, { rotY: -0.014, rotZ: 0.018, bob: 0.055, freq: 0.16 });
        group.add(ribbonGroup);
    }

    // --- Bright Bar + M43 companion, following the Hubble mosaic structure ---
    {
        const pos=[], col=[], size=[], al=[], se=[];
        const N = 4600;
        for (let i = 0; i < N; i++) {
            const t = Math.random();
            const along = -1.55 + t * 4.2;
            const ridge = -1.05 + along * 0.24 + Math.sin(t * Math.PI) * 0.18;
            const x = along + (Math.random() - 0.5) * 0.26;
            const y = ridge + (Math.random() - 0.5) * 0.28;
            const z = -0.25 + (Math.random() - 0.5) * 0.55;
            const dens = fbm3(x * 1.1 + 4, y * 1.1 + 9, z * 1.1);
            if (dens < 0.34) { i--; continue; }
            const c = lerpRgb([1.0, 0.36, 0.24], [0.92, 0.78, 0.48], t * 0.7);
            pos.push(x, y, z);
            col.push(c[0] * 0.72, c[1] * 0.54, c[2] * 0.44);
            size.push(0.50 + Math.random() * 0.82);
            al.push(0.038 + dens * 0.066);
            se.push(Math.random());
        }
        const brightBar = makePoints(pos, col, size, al, se, material.emit, 4);
        addChaos(brightBar, { rotY: -0.010, rotZ: 0.014, bob: 0.030, freq: 0.17 });
        group.add(brightBar);
    }

    {
        const pos=[], col=[], size=[], al=[], se=[];
        const cx2 = -3.1, cy2 = 2.05, cz2 = -0.25;
        const N = 3600;
        for (let i = 0; i < N; i++) {
            const r = Math.pow(Math.random(), 1.4) * 1.55;
            const th = Math.random() * Math.PI * 2;
            const ph = Math.acos(Math.random() * 2 - 1);
            const x = cx2 + r * Math.sin(ph) * Math.cos(th) * 1.1;
            const y = cy2 + r * Math.sin(ph) * Math.sin(th) * 0.78;
            const z = cz2 + r * Math.cos(ph) * 0.7;
            const dens = fbm3(x * 1.2, y * 1.2 + 8, z * 1.2);
            if (dens < 0.38) { i--; continue; }
            const c = lerpRgb([0.65, 0.30, 0.78], [1.0, 0.58, 0.42], 1.0 - r / 1.55);
            pos.push(x, y, z);
            col.push(c[0] * 0.52, c[1] * 0.48, c[2] * 0.62);
            size.push(0.52 + Math.random() * 0.92);
            al.push(0.026 + dens * 0.052);
            se.push(Math.random());
        }
        const m43 = makePoints(pos, col, size, al, se, material.emit, 2);
        addChaos(m43, { rotY: 0.010, rotZ: -0.010, bob: 0.035, freq: 0.15 });
        group.add(m43);
    }

    // proplyd-like dark beads near the Trapezium core
    {
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < 18; i++) {
            const x = -1.15 + (Math.random() - 0.5) * 2.2;
            const y = 0.55 + (Math.random() - 0.5) * 1.4;
            const z = 0.35 + (Math.random() - 0.5) * 1.2;
            pos.push(x, y, z);
            col.push(0.025, 0.010, 0.020);
            size.push(0.45 + Math.random() * 0.55);
            al.push(0.16 + Math.random() * 0.12);
            se.push(Math.random());
        }
        const beads = makePoints(pos, col, size, al, se, material.dust, 5);
        addChaos(beads, { rotY: 0.018, rotZ: 0.012, bob: 0.018, freq: 0.22 });
        group.add(beads);
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
    function sdEllipse(x, y, cx, cy, rx, ry) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry;
        return (Math.sqrt(dx * dx + dy * dy) - 1.0) * Math.min(rx, ry);
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
        const warp = (fbm3(x * 1.8, y * 1.8, 0) - 0.5) * 0.35
                   + (fbm3(x * 5.0, y * 5.0, 7) - 0.5) * 0.12;

        const dNeck = sdEllipse(x, y, -0.42, -1.25, 0.72, 2.10);
        const dChest = sdEllipse(x, y, -0.35, -2.55, 1.05, 0.72);
        const dHead = sdEllipse(x, y, 0.18, 0.88, 0.86, 0.66);
        const dSnout = sdRoundedBox(x, y, 0.95, 0.67, 0.58, 0.30, 0.22);

        const ex = x + 0.15, ey = y - 1.72;
        const ang = 0.45;
        const eX = Math.cos(ang) * ex - Math.sin(ang) * ey;
        const eY = Math.sin(ang) * ex + Math.cos(ang) * ey;
        const dEar = sdRoundedBox(eX, eY, 0, 0, 0.22, 0.78, 0.16);

        let d = smin(dNeck, dChest, 0.42);
        d = smin(d, dHead, 0.38);
        d = smin(d, dSnout, 0.24);
        d = smin(d, dEar, 0.20);

        const jawCut = sdEllipse(x, y, 0.66, 0.05, 0.48, 0.46);
        const backCut = sdEllipse(x, y, -1.10, 0.74, 0.36, 0.78);
        const throatCut = sdEllipse(x, y, 0.18, -0.42, 0.34, 0.56);
        d = Math.max(d, -jawCut);
        d = Math.max(d, -backCut);
        d = Math.max(d, -throatCut);

        return d + warp * 0.28;
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
            col.push(c[0] * 0.78, c[1] * 0.52, c[2] * 0.56);
            size.push(1.9 + Math.random() * 2.25);
            al.push(0.018 + dens * 0.045 * fall);
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
            col.push(c[0] * 0.78, c[1] * 0.44, c[2] * 0.44);
            size.push(1.42 + Math.random() * 1.72);
            al.push(0.024 + dens * 0.055 * fall);
            se.push(Math.random());
        }
        const envelope = makePoints(pos, col, size, al, se, material.emit, 1);
        addChaos(envelope, { rotY: -0.010, rotX: 0.006, rotZ: 0.012, bob: 0.045, freq: 0.12 });
        group.add(envelope);
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
            col.push(c[0] * 0.45, c[1] * 0.42, c[2] * 0.48);
            size.push(2.2 + Math.random() * 1.75);
            al.push(0.88 + (1.0 - edgeMix) * 0.10);
            se.push(Math.random());
            placed++;
        }
        group.add(makePoints(pos, col, size, al, se, material.dust, 8));
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
            col.push(c[0] * 0.78, c[1] * 0.42, c[2] * 0.38);
            size.push(0.92 + Math.random() * 1.12);
            al.push(0.045 + edgeBright * 0.130);
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
            size.push(8 * s.mag);
            al.push(0.62);
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
            size.push(1.0 + Math.random() * 1.8);
            al.push(0.22 + Math.random() * 0.28);
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
        starSize.push(6);
        starAl.push(0.65);
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
            col.push(c[0] * 0.45, c[1] * 0.48, c[2] * 0.58);
            size.push(0.85 + Math.random() * 1.25);
            al.push(0.018 + dens * 0.046);
            se.push(Math.random());
        }
        group.add(makePoints(pos, col, size, al, se, material.emit, 2));
    }

    // ===== JWST-like mane fibers: blue base, red hydrogen wisps above the ridge =====
    {
        const pos=[], col=[], size=[], al=[], se=[];
        const N = 16000;
        for (let i = 0; i < N; i++) {
            const t = Math.random();
            const x = -1.55 + t * 3.4 + (Math.random() - 0.5) * 0.18;
            const yBase = 0.85 + Math.sin(t * Math.PI * 1.25) * 1.0;
            const y = yBase + Math.pow(Math.random(), 1.8) * 2.4;
            const z = -0.35 + (Math.random() - 0.5) * 0.65;
            const fiber = Math.abs(Math.sin((x * 2.5 + y * 0.9) * 2.7));
            const dens = fbm3(x * 2.0 + 17, y * 1.5, z * 1.8);
            if (fiber < 0.48 || dens < 0.36) { i--; continue; }
            const heightMix = Math.min(1, Math.max(0, (y - 0.8) / 3.1));
            const c = lerpRgb([0.22, 0.50, 0.86], [1.0, 0.22, 0.14], heightMix);
            pos.push(x, y, z);
            col.push(c[0] * 0.42, c[1] * 0.36, c[2] * 0.40);
            size.push(0.45 + Math.random() * 0.72);
            al.push(0.018 + dens * 0.048 * (0.65 + heightMix * 0.4));
            se.push(Math.random());
        }
        const cage = makePoints(pos, col, size, al, se, material.emit, 4);
        addChaos(cage, { rotY: 0.018, rotX: -0.008, rotZ: 0.014, bob: 0.040, freq: 0.16 });
        group.add(cage);
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
        size.push(10);
        al.push(0.64);
        se.push(0.5);
        const starCore = makePoints(pos, col, size, al, se, material.star, 3);
        addChaos(starCore, { rotY: 0.014, rotZ: 0.018, bob: 0.035, freq: 0.18 });
        group.add(starCore);
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
            size.push(0.75 + Math.random() * 1.25);
            al.push(0.045 + dens * 0.090);
            se.push(Math.random());
        }
        const envelope = makePoints(pos, col, size, al, se, material.emit, 1);
        addChaos(envelope, { rotY: -0.010, rotX: 0.006, rotZ: 0.012, bob: 0.045, freq: 0.12 });
        group.add(envelope);
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
                size.push(0.85 + (1 - t) * 1.45 + Math.random() * 0.55);
                al.push(0.060 + tt * 0.150);
                se.push(Math.random());
            }
        }
        const filGroup = new THREE.Group();
        filGroup.add(makePoints(pos, col, size, al, se, material.emit, 2));
        // slow rotation of synchrotron filaments around pulsar
        filGroup.userData.spin = 0.06;
        group.add(filGroup);
    }

    // --- Webb/Hubble cage: red-orange outer loops with blue iron knots ---
    {
        const pos=[], col=[], size=[], al=[], se=[];
        const loopCount = 13;
        const N_per = 950;
        for (let f = 0; f < loopCount; f++) {
            const phase = (f / loopCount) * Math.PI * 2;
            const tilt = -0.42 + (f % 5) * 0.20;
            const zOff = (Math.random() - 0.5) * 1.1;
            for (let i = 0; i < N_per; i++) {
                const t = Math.random() * Math.PI * 2;
                const wob = Math.sin(t * 3.0 + phase) * 0.28 + (fbm3(t, phase, 1.0) - 0.5) * 0.35;
                const rx = 4.8 + Math.sin(phase * 2.0) * 0.45;
                const ry = 2.75 + Math.cos(phase) * 0.34;
                const x = Math.cos(t + phase * 0.08) * (rx + wob);
                const y = Math.sin(t) * (ry + wob * 0.4) + Math.sin(t * 2.0 + phase) * 0.18;
                const z = Math.sin(t + phase) * 1.15 + zOff + x * tilt * 0.12;
                if (Math.random() < 0.34 && Math.abs(Math.sin(t * 5.0 + phase)) < 0.4) continue;
                const hot = Math.random();
                const c = hot > 0.78
                    ? [0.18, 0.58, 1.0]
                    : lerpRgb([1.0, 0.23, 0.08], [0.95, 0.72, 0.18], Math.random() * 0.7);
                pos.push(x, y, z);
                col.push(c[0] * 0.82, c[1] * 0.75, c[2] * 0.7);
                size.push(0.75 + Math.random() * 0.95);
                al.push(0.045 + Math.random() * 0.120);
                se.push(Math.random());
            }
        }
        const cage = makePoints(pos, col, size, al, se, material.emit, 4);
        addChaos(cage, { rotY: 0.018, rotX: -0.008, rotZ: 0.014, bob: 0.040, freq: 0.16 });
        group.add(cage);
    }

    // --- Milky synchrotron interior and ripple pattern around the pulsar ---
    {
        const pos=[], col=[], size=[], al=[], se=[];
        const N = 10500;
        for (let i = 0; i < N; i++) {
            const th = Math.random() * Math.PI * 2;
            const ph = Math.acos(Math.random() * 2 - 1);
            const r = Math.pow(Math.random(), 0.85) * 3.4;
            const waist = 0.72 + 0.28 * Math.abs(Math.sin(th * 2.0));
            const x = r * Math.sin(ph) * Math.cos(th) * 1.25;
            const y = r * Math.cos(ph) * 0.55 * waist;
            const z = r * Math.sin(ph) * Math.sin(th) * 0.9;
            const dens = fbm3(x * 0.9 + 4, y * 0.9 + 7, z * 0.9);
            if (dens < 0.33) { i--; continue; }
            const c = lerpRgb([0.80, 0.88, 1.0], [0.42, 0.82, 1.0], dens);
            pos.push(x, y, z);
            col.push(c[0] * 0.55, c[1] * 0.65, c[2] * 0.85);
            size.push(0.85 + Math.random() * 1.25);
            al.push(0.022 + dens * 0.055);
            se.push(Math.random());
        }
        const interior = makePoints(pos, col, size, al, se, material.emit, 0);
        addChaos(interior, { rotY: 0.012, rotX: 0.010, rotZ: -0.010, bob: 0.050, freq: 0.10 });
        group.add(interior);
    }

    {
        const pos=[], col=[], size=[], al=[], se=[];
        for (let ring = 0; ring < 4; ring++) {
            const radius = 0.9 + ring * 0.55;
            for (let i = 0; i < 360; i++) {
                if (Math.random() < 0.24) continue;
                const a = (i / 360) * Math.PI * 2;
                const x = Math.cos(a) * radius * 1.55;
                const y = Math.sin(a) * radius * 0.42;
                const z = Math.sin(a * 2.0) * 0.12;
                pos.push(x, y, z);
                col.push(0.88, 0.92, 1.1);
                size.push(0.62 + ring * 0.12);
                al.push(0.105 - ring * 0.016);
                se.push(Math.random());
            }
        }
        const ripple = makePoints(pos, col, size, al, se, material.emit, 5);
        ripple.userData.pulse = { axis: 'x', base: 1.0, amp: 0.045, freq: 0.35 };
        group.add(ripple);
    }
    return group;
}

// ===== Pleiades M45 =====
function buildPleiades(theme, material) {
    const group = new THREE.Group();
    const cNeb = hexToRgb(theme.c1);     // blue reflection
    const cStar = hexToRgb(theme.c2);    // star color

    // Principal stars, arranged to read like the real M45 grouping rather than a random cluster.
    const stars = [
        { pos: [ 0.0,  0.0,  0.0], mag: 1.45, name: 'Alcyone' },
        { pos: [-2.2,  1.0, -0.5], mag: 1.05, name: 'Maia' },
        { pos: [ 2.25,  0.55, 0.35], mag: 1.08, name: 'Atlas' },
        { pos: [ 2.65,  0.95, 0.15], mag: 0.80, name: 'Pleione' },
        { pos: [-1.55, -1.35, 0.9], mag: 0.95, name: 'Electra' },
        { pos: [ 1.05,  1.95,-1.0], mag: 0.96, name: 'Taygeta' },
        { pos: [-3.15, -0.55, 1.25], mag: 1.08, name: 'Merope' },
        { pos: [-0.35,  1.55, 0.85], mag: 0.72, name: 'Celaeno' },
        { pos: [ 0.95, -1.85,-0.45], mag: 0.68, name: 'Asterope' }
    ];

    // --- Bright blue stars with diffraction spikes ---
    {
        const pos=[], col=[], size=[], al=[], se=[];
        for (const s of stars) {
            pos.push(...s.pos);
            col.push(0.85, 0.9, 1.1);
            size.push(8.8 * s.mag);
            al.push(0.68);
            se.push(Math.random());
        }
        const starCore = makePoints(pos, col, size, al, se, material.star, 3);
        addChaos(starCore, { rotY: 0.014, rotZ: 0.018, bob: 0.035, freq: 0.18 });
        group.add(starCore);
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
                size.push(0.75 + Math.random() * 1.05 + (1 - dens) * 0.75);
                al.push(0.026 + dens * 0.062 * s.mag);
                se.push(Math.random());
            }
        }
        const reflection = makePoints(pos, col, size, al, se, material.emit, 1);
        addChaos(reflection, { rotY: -0.012, rotZ: 0.014, bob: 0.04, freq: 0.16 });
        group.add(reflection);
    }

    // --- Merope-style blue-white dust streamers, long and nearly straight ---
    {
        const pos=[], col=[], size=[], al=[], se=[];
        const N = 18000;
        const anchors = [
            { p: [-3.15, -0.55, 1.25], len: 5.2, angle: 0.55, mag: 1.0 },
            { p: [ 0.0,   0.0, 0.0],  len: 4.1, angle: 0.36, mag: 0.82 },
            { p: [-2.2,  1.0,-0.5],  len: 3.7, angle: 0.66, mag: 0.72 },
            { p: [ 1.05, 1.95,-1.0], len: 3.2, angle: 0.46, mag: 0.62 }
        ];
        for (const a of anchors) {
            const dir = [Math.cos(a.angle), Math.sin(a.angle) * 0.62, -0.18];
            const side = [-dir[1], dir[0], 0.0];
            const per = Math.floor(N / anchors.length);
            for (let i = 0; i < per; i++) {
                const t = Math.random();
                const lane = Math.floor(Math.random() * 7) - 3;
                const stripe = lane * 0.18 + (Math.random() - 0.5) * 0.08;
                const x = a.p[0] + dir[0] * t * a.len + side[0] * stripe;
                const y = a.p[1] + dir[1] * t * a.len + side[1] * stripe;
                const z = a.p[2] + dir[2] * t * a.len + (Math.random() - 0.5) * 0.45;
                const dens = fbm3(x * 1.1 + 12, y * 1.1, z * 1.1);
                if (dens < 0.38 || Math.random() < t * 0.16) { i--; continue; }
                const c = lerpRgb(cNeb, [0.82, 0.92, 1.1], 0.45 + (1.0 - t) * 0.32);
                pos.push(x, y, z);
                col.push(c[0] * 0.72, c[1] * 0.78, c[2]);
                size.push(0.75 + Math.random() * 1.05);
                al.push((0.035 + dens * 0.075) * a.mag * (1.0 - t * 0.35));
                se.push(Math.random());
            }
        }
        const streamers = makePoints(pos, col, size, al, se, material.emit, 0);
        addChaos(streamers, { rotY: 0.016, rotZ: -0.022, bob: 0.05, freq: 0.13 });
        group.add(streamers);
    }

    // --- Slow blue dust lanes crossing the cluster, visible in motion ---
    {
        const laneGroup = new THREE.Group();
        const pos=[], col=[], size=[], al=[], se=[];
        const lanes = [
            { y: -0.55, z: 0.15, a: 0.28, len: 7.2, off: -2.8 },
            { y:  0.72, z: -0.35, a: 0.18, len: 6.3, off: -2.1 },
            { y:  1.55, z: 0.10, a: 0.38, len: 4.6, off: -1.4 }
        ];
        for (const lane of lanes) {
            for (let i = 0; i < 5200; i++) {
                const t = Math.random();
                const wave = Math.sin(t * Math.PI * 2.0 + lane.a * 6.0) * 0.22;
                const x = lane.off + t * lane.len;
                const y = lane.y + wave + (Math.random() - 0.5) * 0.34;
                const z = lane.z + (Math.random() - 0.5) * 0.45;
                const dens = fbm3(x * 1.25 + lane.a * 10.0, y * 1.25, z * 1.25);
                if (dens < 0.43) { i--; continue; }
                const c = lerpRgb([0.28, 0.48, 0.92], [0.78, 0.90, 1.1], dens * 0.72);
                pos.push(x, y, z);
                col.push(c[0] * 0.52, c[1] * 0.62, c[2] * 0.86);
                size.push(0.45 + Math.random() * 0.85);
                al.push(0.018 + dens * 0.042);
                se.push(Math.random());
            }
        }
        laneGroup.add(makePoints(pos, col, size, al, se, material.emit, 0));
        addChaos(laneGroup, { rotY: 0.020, rotZ: 0.026, bob: 0.06, freq: 0.14 });
        group.add(laneGroup);
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
        const looseStars = makePoints(pos, col, size, al, se, material.star, 2);
        addChaos(looseStars, { rotY: -0.010, rotZ: 0.016, bob: 0.028, freq: 0.12 });
        group.add(looseStars);
    }
    return group;
}

// ===== Aurelia Rogue Planet =====
// A high-detail fictional rogue exoplanet: storm bands, atmosphere, rings, aurora, moons, plasma wake.
function buildAurelia(theme, material) {
    const root = new THREE.Group();
    const cA = hexToRgb(theme.c1);
    const cB = hexToRgb(theme.c2);
    const cIce = [0.78, 0.96, 1.08];
    const cNight = [0.015, 0.018, 0.045];

    const planetMat = markLocalMaterial(new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color(cA[0], cA[1], cA[2]) },
            uColorB: { value: new THREE.Color(cB[0], cB[1], cB[2]) }
        },
        vertexShader: `
            varying vec3 vN;
            varying vec3 vP;
            varying vec2 vUv;
            void main() {
                vN = normalize(normalMatrix * normal);
                vP = position;
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            precision highp float;
            uniform float uTime;
            uniform vec3 uColorA;
            uniform vec3 uColorB;
            varying vec3 vN;
            varying vec3 vP;
            varying vec2 vUv;

            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }
            float noise(vec2 p) {
                vec2 i = floor(p), f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                float a = hash(i);
                float b = hash(i + vec2(1.0, 0.0));
                float c = hash(i + vec2(0.0, 1.0));
                float d = hash(i + vec2(1.0, 1.0));
                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }
            float fbm(vec2 p) {
                float v = 0.0;
                float a = 0.55;
                for (int i = 0; i < 5; i++) {
                    v += noise(p) * a;
                    p *= 2.03;
                    a *= 0.52;
                }
                return v;
            }

            void main() {
                vec3 n = normalize(vN);
                vec3 light = normalize(vec3(-0.45, 0.28, 0.84));
                float day = smoothstep(-0.25, 0.88, dot(n, light));
                float limb = pow(1.0 - abs(dot(n, vec3(0.0, 0.0, 1.0))), 2.2);
                float lat = abs(vP.y);

                float beltNoise = fbm(vec2(vUv.x * 4.0 + uTime * 0.025, vUv.y * 12.0));
                float jetShear = sin(vUv.y * 18.0 + beltNoise * 4.0) * 0.018;
                float bands = 0.5 + 0.5 * sin(vUv.y * 58.0 + beltNoise * 7.0 + uTime * 0.28);
                float storms = smoothstep(0.58, 0.92, fbm(vec2(vUv.x * 9.0 - uTime * 0.055 + jetShear, vUv.y * 18.0 + sin(vUv.y * 20.0))));
                float dx = abs(fract(vUv.x - 0.64 + uTime * 0.010 + 0.5) - 0.5);
                float oval = exp(-(dx * dx / 0.0028 + (vUv.y - 0.42) * (vUv.y - 0.42) / 0.00095));
                float ringShadow = smoothstep(0.16, 0.018, abs(vP.y + 0.05 + sin(vUv.x * 7.0) * 0.035)) * smoothstep(0.05, 0.80, day);
                float polar = smoothstep(1.45, 2.25, lat);

                vec3 deep = mix(vec3(0.03, 0.045, 0.13), uColorB * 0.34, 0.55);
                vec3 belt = mix(uColorB * 0.28, uColorA * 0.58, bands);
                vec3 storm = mix(belt, vec3(0.80, 0.95, 1.10), storms * 0.45);
                storm = mix(storm, vec3(0.08, 0.04, 0.20), oval * 0.58);
                storm += vec3(0.42, 0.92, 1.05) * oval * 0.25;
                vec3 aurora = uColorA * polar * (0.22 + 0.35 * sin(vUv.x * 34.0 + uTime * 1.4));
                vec3 nightside = vec3(0.006, 0.010, 0.030) + aurora * 0.70;
                vec3 col = mix(nightside, mix(deep, storm, 0.72), day);
                col += uColorA * limb * 0.28 + aurora * 0.45;
                col *= 1.0 - ringShadow * 0.34;
                col *= 0.78 + day * 0.38;
                gl_FragColor = vec4(col, 1.0);
            }
        `
    }));

    const planet = new THREE.Mesh(new THREE.SphereGeometry(2.35, 128, 72), planetMat);
    planet.scale.set(1.08, 0.96, 1.0);
    planet.rotation.set(0.05, -0.42, -0.12);
    planet.userData.spin = 0.010;
    root.add(planet);

    const cloudMat = markLocalMaterial(new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color(cIce[0], cIce[1], cIce[2]) }
        },
        vertexShader: `
            varying vec3 vN;
            varying vec2 vUv;
            void main() {
                vN = normalize(normalMatrix * normal);
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            precision highp float;
            uniform float uTime;
            uniform vec3 uColorA;
            varying vec3 vN;
            varying vec2 vUv;
            float hash(vec2 p){ return fract(sin(dot(p, vec2(41.7, 289.2))) * 43758.5453); }
            float noise(vec2 p){
                vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
                return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
            }
            float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<4;i++){ v+=noise(p)*a; p*=2.1; a*=0.5; } return v; }
            void main() {
                float lanes = fbm(vec2(vUv.x * 7.0 + uTime * 0.045, vUv.y * 16.0));
                float streaks = smoothstep(0.48, 0.76, lanes) * smoothstep(0.03, 0.22, abs(sin(vUv.y * 42.0 + lanes * 4.0)));
                float rim = pow(1.0 - abs(dot(normalize(vN), vec3(0,0,1))), 1.6);
                float a = streaks * 0.22 + rim * 0.10;
                gl_FragColor = vec4(uColorA * (0.30 + streaks * 0.55), a);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    }));
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(2.43, 128, 64), cloudMat);
    clouds.scale.copy(planet.scale);
    clouds.rotation.copy(planet.rotation);
    clouds.userData.spin = 0.035;
    root.add(clouds);

    const atmoMat = markLocalMaterial(new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color(cA[0], cA[1], cA[2]) },
            uColorB: { value: new THREE.Color(cB[0], cB[1], cB[2]) }
        },
        vertexShader: `
            varying vec3 vN;
            void main() {
                vN = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            precision highp float;
            uniform float uTime;
            uniform vec3 uColorA;
            uniform vec3 uColorB;
            varying vec3 vN;
            void main() {
                float rim = pow(1.0 - abs(dot(normalize(vN), vec3(0.0, 0.0, 1.0))), 2.7);
                float pulse = 0.82 + 0.18 * sin(uTime * 1.1);
                vec3 col = mix(uColorB, uColorA, rim) * pulse;
                gl_FragColor = vec4(col, rim * 0.34);
            }
        `,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    }));
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(2.72, 128, 64), atmoMat);
    atmosphere.scale.copy(planet.scale);
    atmosphere.userData.spin = -0.004;
    atmosphere.userData.pulse = { axis: 'y', base: 0.96, amp: 0.018, freq: 0.16 };
    root.add(atmosphere);

    // layered ice/metal rings and dust gaps
    {
        const ringGroup = new THREE.Group();
        ringGroup.rotation.set(Math.PI / 2 + 0.18, 0.20, -0.36);
        const ringTex = makeAureliaRingTexture(cA, cB);
        const ringMatA = markLocalMaterial(new THREE.MeshBasicMaterial({
            map: ringTex,
            color: new THREE.Color(1, 1, 1),
            transparent: true,
            opacity: 0.70,
            alphaTest: 0.015,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        const ringMatB = markLocalMaterial(new THREE.MeshBasicMaterial({
            map: makeAureliaRingTexture(cB, cA),
            color: new THREE.Color(1, 1, 1),
            transparent: true,
            opacity: 0.34,
            alphaTest: 0.015,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        const ringA = new THREE.Mesh(new THREE.RingGeometry(3.12, 5.45, 256, 4), ringMatA);
        const ringB = new THREE.Mesh(new THREE.RingGeometry(4.38, 6.15, 256, 3), ringMatB);
        ringA.renderOrder = 3;
        ringB.renderOrder = 2;
        ringGroup.add(ringA, ringB);

        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < 14000; i++) {
            const r = 3.05 + Math.pow(Math.random(), 0.74) * 3.35;
            const a = Math.random() * Math.PI * 2;
            const gap = Math.abs(Math.sin(r * 5.2)) * Math.abs(Math.sin(r * 1.7 + 1.2));
            if (gap < 0.17) continue;
            const x = Math.cos(a) * r;
            const z = Math.sin(a) * r;
            const y = (Math.random() - 0.5) * 0.035;
            pos.push(x, y, z);
            const c = lerpRgb(cA, cB, Math.random() * 0.55);
            col.push(c[0] * 0.72, c[1] * 0.78, c[2] * 0.95);
            size.push(0.22 + Math.random() * 0.48);
            al.push(0.022 + gap * 0.045);
            se.push(Math.random());
        }
        const dust = makePoints(pos, col, size, al, se, material.emitStatic, 5);
        ringGroup.add(dust);
        ringGroup.userData.spin = 0.055;
        root.add(ringGroup);
    }

    // aurora curtains around magnetic poles
    {
        const pos=[], col=[], size=[], al=[], se=[];
        for (let side = -1; side <= 1; side += 2) {
            for (let i = 0; i < 5200; i++) {
                const a = Math.random() * Math.PI * 2;
                const band = 0.35 + Math.random() * 0.45;
                const height = Math.pow(Math.random(), 1.8) * 1.08;
                const r = 1.05 + band * 0.30 + height * 0.06;
                const x = Math.cos(a) * r;
                const z = Math.sin(a) * r;
                const y = side * (1.86 + band * 0.38 + height * 0.32);
                const flutter = Math.sin(a * 7.0 + height * 2.0) * 0.16;
                pos.push(x + Math.cos(a) * flutter, y, z + Math.sin(a) * flutter);
                const c = lerpRgb(cA, [0.74, 1.0, 0.82], Math.random() * 0.55);
                col.push(c[0], c[1], c[2]);
                size.push(0.22 + height * 0.46 + Math.random() * 0.26);
                al.push(0.024 + (1.0 - height / 1.08) * 0.060);
                se.push(Math.random());
            }
        }
        const aurora = makePoints(pos, col, size, al, se, material.emit, 8);
        aurora.userData.pulse = { axis: 'y', base: 1.0, amp: 0.055, freq: 0.24 };
        addChaos(aurora, { rotY: 0.045, rotZ: 0.016, bob: 0.03, freq: 0.22 });
        root.add(aurora);
    }

    // ionized plasma wake
    {
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < 11000; i++) {
            const t = Math.pow(Math.random(), 0.76);
            const swirl = t * Math.PI * 6.2 + Math.random() * Math.PI * 2.0;
            const radius = 0.12 + t * 0.86;
            const x = -2.0 - t * 7.2 + Math.sin(swirl) * radius * 0.46;
            const y = Math.sin(swirl * 0.7) * radius * 0.24 + (Math.random() - 0.5) * 0.30;
            const z = Math.cos(swirl) * radius + (Math.random() - 0.5) * 0.38;
            if (Math.random() < t * 0.18) continue;
            pos.push(x, y, z);
            const c = lerpRgb(cA, [1.0, 0.42, 0.20], t);
            col.push(c[0] * (1.0 - t * 0.28), c[1] * (0.85 - t * 0.18), c[2]);
            size.push(0.34 + (1.0 - t) * 0.62 + Math.random() * 0.38);
            al.push((0.040 + (1.0 - t) * 0.070) * (1.0 - t * 0.55));
            se.push(Math.random());
        }
        const wake = makePoints(pos, col, size, al, se, material.emit, 1);
        addChaos(wake, { rotY: 0.018, rotZ: -0.010, bob: 0.10, freq: 0.10 });
        root.add(wake);
    }

    // moons and magnetic field arcs
    {
        const moonMat = markLocalMaterial(new THREE.MeshBasicMaterial({
            color: new THREE.Color(0.72, 0.78, 0.86),
            transparent: true,
            opacity: 0.74
        }));
        const orbit = new THREE.Group();
        const moonA = new THREE.Mesh(new THREE.SphereGeometry(0.18, 32, 16), moonMat);
        const moonB = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 12), moonMat);
        moonA.position.set(5.4, 0.75, -1.1);
        moonB.position.set(-4.2, -0.55, 1.9);
        orbit.add(moonA, moonB);
        orbit.userData.spin = -0.075;
        root.add(orbit);

        const arcA = makeGlowRing(3.1, 0.008, cA, 0.13, [0.62, 0.18, 0.06], 4);
        const arcB = makeGlowRing(3.75, 0.006, cB, 0.10, [-0.45, 0.45, 0.12], 4);
        const arcC = makeGlowRing(4.45, 0.005, [0.72, 0.95, 1.0], 0.07, [0.35, -0.40, -0.15], 3);
        arcA.scale.set(1.28, 0.58, 1.0);
        arcB.scale.set(1.46, 0.50, 1.0);
        arcC.scale.set(1.62, 0.42, 1.0);
        arcA.userData.spin = 0.018;
        arcB.userData.spin = -0.014;
        arcC.userData.spin = 0.010;
        arcA.userData.pulse = { axis: 'x', base: 1.28, amp: 0.030, freq: 0.11 };
        arcB.userData.pulse = { axis: 'x', base: 1.46, amp: 0.025, freq: 0.13 };
        root.add(arcA, arcB, arcC);
    }

    root.rotation.z = -0.05;
    return root;
}

// ===== Background starfield (always added behind nebula objects) =====
function buildBackgroundStars(material) {
    const group = new THREE.Group();

    {
        const N = 3200;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < N; i++) {
            const th = Math.random() * Math.PI * 2;
            const ph = Math.acos(Math.random() * 2 - 1);
            const r = 72 + Math.random() * 28;
            pos.push(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th));
            const t = Math.random();
            if (t < 0.16) col.push(1.0, 0.74, 0.46);
            else if (t < 0.42) col.push(0.62, 0.78, 1.0);
            else col.push(0.86 + t * 0.14, 0.88 + t * 0.10, 1.0);
            size.push(0.35 + Math.random() * 0.95);
            al.push(0.20 + Math.random() * 0.42);
            se.push(Math.random());
        }
        const far = makePoints(pos, col, size, al, se, material.emitStatic, -3);
        addChaos(far, { rotY: 0.018, rotX: 0.006, freq: 0.07 });
        group.add(far);
    }

    {
        const N = 520;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < N; i++) {
            const th = Math.random() * Math.PI * 2;
            const ph = Math.acos(Math.random() * 2 - 1);
            const r = 56 + Math.random() * 18;
            pos.push(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th));
            const t = Math.random();
            if (t < 0.22) col.push(1.0, 0.70, 0.38);
            else if (t < 0.55) col.push(0.55, 0.78, 1.0);
            else col.push(1.0, 0.96, 0.88);
            size.push(1.2 + Math.random() * 2.4);
            al.push(0.34 + Math.random() * 0.48);
            se.push(Math.random());
        }
        const bright = makePoints(pos, col, size, al, se, material.star, -2);
        addChaos(bright, { rotY: -0.026, rotZ: 0.008, freq: 0.11 });
        group.add(bright);
    }

    {
        const N = 4200;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < N; i++) {
            const r = 50 + Math.random() * 16;
            const a = Math.random() * Math.PI * 2;
            const y = (Math.random() - 0.5) * 10.0;
            const band = Math.exp(-(y * y) / 34.0);
            if (Math.random() > band) { i--; continue; }
            pos.push(Math.cos(a) * r, y, Math.sin(a) * r);
            const c = lerpRgb([0.12, 0.22, 0.45], [0.48, 0.20, 0.62], Math.random());
            col.push(c[0], c[1], c[2]);
            size.push(1.4 + Math.random() * 2.2);
            al.push(0.012 + Math.random() * 0.028);
            se.push(Math.random());
        }
        const haze = makePoints(pos, col, size, al, se, material.emitStatic, -4);
        addChaos(haze, { rotY: 0.010, rotX: 0.004, freq: 0.05 });
        group.add(haze);
    }

    return group;
}

// ===== Sgr A* accent: thick EHT-like ring, orbiting hot knots, lensed star arcs =====
function buildBlackHoleJets(theme, material) {
    const group = new THREE.Group();
    const cWarm = hexToRgb(theme.c1);
    const cHot = [1.0, 0.72, 0.32];
    const cWhite = [1.0, 0.92, 0.72];

    group.add(makeGlowRing(1.72, 0.018, cWhite, 0.20, [Math.PI / 2, 0, 0], 6));
    group.add(makeGlowRing(2.05, 0.026, cWarm, 0.16, [Math.PI / 2, 0, 0], 5));
    group.add(makeGlowRing(2.55, 0.012, [0.7, 0.28, 0.12], 0.10, [Math.PI / 2, 0, 0], 4));

    {
        const N = 4600;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < N; i++) {
            const t = Math.random();
            const r = 1.85 + Math.pow(Math.random(), 1.7) * 1.15;
            const a = Math.random() * Math.PI * 2;
            const brightSide = 0.62 + 0.38 * Math.max(0, Math.cos(a - Math.PI * 0.92));
            const gap = Math.max(0.18, Math.abs(Math.sin(a * 1.4 + 0.6)));
            if (Math.random() > brightSide * gap) continue;
            const x = Math.cos(a) * r;
            const z = Math.sin(a) * r;
            const y = (Math.random() - 0.5) * (0.10 + (r - 1.8) * 0.08);
            pos.push(x, y, z);
            const heat = Math.pow(1.0 - (r - 1.85) / 1.15, 0.8);
            const c = lerpRgb(cWarm, cHot, heat * 0.8);
            col.push(c[0] * (0.72 + brightSide * 0.38), c[1] * (0.64 + brightSide * 0.3), c[2] * 0.74);
            size.push(0.9 + heat * 1.6 + Math.random() * 0.8);
            al.push((0.10 + heat * 0.22) * brightSide);
            se.push(t);
        }
        const ring = makePoints(pos, col, size, al, se, material.emit, 7);
        ring.userData.spin = 0.16;
        group.add(ring);
    }

    {
        const pos=[], col=[], size=[], al=[], se=[];
        for (let band = 0; band < 9; band++) {
            const base = Math.random() * Math.PI * 2;
            const arcLen = 0.25 + Math.random() * 0.55;
            const radius = 2.25 + Math.random() * 0.85;
            for (let i = 0; i < 90; i++) {
                const t = i / 89;
                const a = base + (t - 0.5) * arcLen;
                const x = Math.cos(a) * radius;
                const z = Math.sin(a) * radius;
                const y = (Math.random() - 0.5) * 0.05 + (band - 4) * 0.015;
                const fade = Math.sin(t * Math.PI);
                pos.push(x, y, z);
                col.push(0.92, 0.78, 0.52);
                size.push(0.65 + fade * 0.8);
                al.push(0.04 + fade * 0.13);
                se.push(Math.random());
            }
        }
        group.add(makePoints(pos, col, size, al, se, material.emitStatic, 8));
    }

    group.userData.pulse = { axis: 'x', base: 1.0, amp: 0.018, freq: 0.18 };
    return group;
}

// ===== Wormhole lensing scaffold =====
// Einstein rings, repeated star arcs, and a sparse throat current.
function buildWormholeInflow(theme, material) {
    const group = new THREE.Group();
    const cA = hexToRgb(theme.c1);
    const cB = hexToRgb(theme.c2);

    group.add(makeGlowRing(1.55, 0.016, cB, 0.28, [0, 0, 0], 5));
    group.add(makeGlowRing(2.25, 0.010, cA, 0.18, [0.55, 0.05, 0.12], 4));
    group.add(makeGlowRing(3.15, 0.008, lerpRgb(cA, cB, 0.55), 0.11, [-0.45, 0.22, 0.05], 3));

    {
        const N = 7600;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < N; i++) {
            const t = Math.pow(Math.random(), 0.72);
            const r = 1.25 + t * 7.2;
            const turns = 5.2;
            const a = Math.random() * Math.PI * 2 + t * turns;
            const pinch = Math.pow(1.0 - t, 1.4);
            const x = Math.cos(a) * r;
            const z = Math.sin(a) * r;
            const y = (Math.random() - 0.5) * (0.16 + t * 0.9) + Math.sin(a * 2.0) * 0.14 * pinch;
            if (Math.random() < t * 0.22) continue;
            pos.push(x, y, z);
            const c = lerpRgb(cB, cA, t);
            col.push(c[0] * (0.75 + pinch * 0.35), c[1] * 0.85, c[2]);
            size.push(0.75 + pinch * 1.8 + Math.random() * 0.55);
            al.push(0.06 + pinch * 0.28);
            se.push(Math.random());
        }
        group.add(makePoints(pos, col, size, al, se, material.emit, 6));
    }

    // repeated starfield images, like a ray-traced Morris-Thorne view
    {
        const pos=[], col=[], size=[], al=[], se=[];
        for (let ring = 0; ring < 5; ring++) {
            const radius = 1.75 + ring * 0.55;
            const copies = 38 + ring * 8;
            for (let i = 0; i < copies; i++) {
                const a0 = (i / copies) * Math.PI * 2 + Math.sin(i * 7.1) * 0.08;
                const arc = 0.035 + Math.random() * 0.07;
                for (let j = 0; j < 9; j++) {
                    const t = j / 8;
                    const a = a0 + (t - 0.5) * arc;
                    const x = Math.cos(a) * radius;
                    const z = Math.sin(a) * radius;
                    const y = (ring - 2) * 0.10 + (Math.random() - 0.5) * 0.04;
                    const fade = Math.sin(t * Math.PI);
                    const c = (ring % 2 === 0) ? [0.86, 0.92, 1.0] : [1.0, 0.72, 0.42];
                    pos.push(x, y, z);
                    col.push(c[0], c[1], c[2]);
                    size.push(0.45 + fade * 0.65);
                    al.push(0.05 + fade * (0.12 - ring * 0.01));
                    se.push(Math.random());
                }
            }
        }
        group.add(makePoints(pos, col, size, al, se, material.emitStatic, 7));
    }

    group.userData.spin = 0.22;
    return group;
}

// ===== Dyson swarm: instanced collector panels, open orbital bands, waste heat =====
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
        size.push(13);
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

    // --- Waste heat / leaked stellar light through incomplete swarm coverage ---
    {
        const N_per = 360;
        const numRays = 28;
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

    // --- Real 3D panel meshes instead of point sprites ---
    const shellRadii = [3.4, 4.8, 6.2];
    const shellDensity = [110, 150, 190];
    const normal0 = new THREE.Vector3(0, 0, 1);
    const posV = new THREE.Vector3();
    const norm = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const roll = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const matrix = new THREE.Matrix4();

    for (let s = 0; s < shellRadii.length; s++) {
        const shellGroup = new THREE.Group();
        const radius = shellRadii[s];
        const maxPanels = shellDensity[s];
        const panelGeo = new THREE.PlaneGeometry(0.28 + s * 0.035, 0.15 + s * 0.02);
        const panelMat = markLocalMaterial(new THREE.MeshBasicMaterial({
            map: makePanelTexture(theme),
            transparent: true,
            opacity: 0.92,
            side: THREE.DoubleSide,
            vertexColors: true,
            depthWrite: true
        }));
        const panels = new THREE.InstancedMesh(panelGeo, panelMat, maxPanels);
        panels.renderOrder = 3;

        const bands = 7 + s * 2;
        for (let i = 0; i < maxPanels; i++) {
            const band = i % bands;
            const bandT = (band + 0.38 + Math.random() * 0.24) / bands;
            const ph = Math.acos(1.0 - 2.0 * bandT);
            const lanePhase = Math.sin(band * 1.7 + s);
            const lane = Math.floor(i / bands);
            const th = ((lane * 2.399963 + Math.random() * 0.28) % (Math.PI * 2)) + lanePhase * 0.10;
            const r = radius + (Math.random() - 0.5) * 0.18;
            posV.set(
                r * Math.sin(ph) * Math.cos(th),
                r * Math.cos(ph),
                r * Math.sin(ph) * Math.sin(th)
            );
            norm.copy(posV).normalize();
            quat.setFromUnitVectors(normal0, norm);
            roll.setFromAxisAngle(norm, Math.random() * Math.PI * 2);
            quat.multiply(roll);
            const panelScale = 0.55 + Math.random() * 0.35;
            scale.set(panelScale, panelScale * (0.85 + Math.random() * 0.25), 1.0);
            matrix.compose(posV, quat, scale);
            panels.setMatrixAt(i, matrix);

            const heat = Math.random();
            const c = heat > 0.94
                ? lerpRgb(cHot, cStar, Math.random() * 0.45).map(v => v * 0.82)
                : lerpRgb([0.08, 0.09, 0.12], cPanel, 0.22 + heat * 0.58);
            panels.setColorAt(i, new THREE.Color(c[0], c[1], c[2]));
        }
        if (panels.instanceMatrix) panels.instanceMatrix.needsUpdate = true;
        if (panels.instanceColor) panels.instanceColor.needsUpdate = true;
        shellGroup.add(panels);

        shellGroup.add(makeGlowRing(radius, 0.006, cPanel, 0.08, [Math.PI / 2, 0, 0], 2));
        shellGroup.userData.spin = 0.045 - s * 0.010;
        shellGroup.rotation.x = (s % 2 === 0 ? 0.25 : -0.22) + (Math.random() - 0.5) * 0.18;
        shellGroup.rotation.z = (Math.random() - 0.5) * 0.25;
        root.add(shellGroup);
    }

    // --- Maintenance satellites and thermal glints ---
    {
        const N = 360;
        const pos=[], col=[], size=[], al=[], se=[];
        for (let i = 0; i < N; i++) {
            const th = Math.random() * Math.PI * 2;
            const ph = Math.PI * (0.32 + Math.random() * 0.36);
            const r = 2.6 + Math.random() * 4.3;
            const x = r * Math.sin(ph) * Math.cos(th);
            const y = r * Math.cos(ph) + (Math.random() - 0.5) * 0.22;
            const z = r * Math.sin(ph) * Math.sin(th);
            pos.push(x, y, z);
            const c = Math.random() < 0.7 ? [0.85, 0.8, 0.7] : cPanel;
            col.push(c[0], c[1], c[2]);
            size.push(1.0 + Math.random() * 1.1);
            al.push(0.35 + Math.random() * 0.35);
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
    const root = new THREE.Group();
    root.add(buildBackgroundStars(material));
    let accent = null;
    switch (objectId) {
        case 'sgr_a':   accent = buildBlackHoleJets(theme, material); break;
        case 'cygnus':  accent = buildWormholeInflow(theme, material); break;
        default:        return root;
    }
    if (accent) root.add(accent);
    return root;
}

function buildNebula(type, theme, renderer) {
    const material = getSpriteMaterials(renderer);
    const root = new THREE.Group();
    root.add(buildBackgroundStars(material));
    let neb;
    switch (type) {
        case 'orion':     neb = buildOrion(theme, material);     break;
        case 'aurelia':   neb = buildAurelia(theme, material);   break;
        case 'horsehead': neb = buildHorsehead(theme, material); break;
        case 'crab':      neb = buildCrab(theme, material);      break;
        case 'pleiades':  neb = buildPleiades(theme, material);  break;
        case 'dyson':     neb = buildDyson(theme, material);     break;
        default: neb = new THREE.Group();
    }
    const chaosByType = {
        orion:     { rotY: 0.012, rotZ: 0.010, bob: 0.10, freq: 0.12 },
        aurelia:   { rotY: 0.020, rotX: 0.006, rotZ: 0.010, bob: 0.045, freq: 0.14 },
        horsehead: { rotY: 0.006, rotZ: 0.006, bob: 0.06, freq: 0.08 },
        crab:      { rotY: 0.030, rotX: 0.014, rotZ: 0.020, bob: 0.08, freq: 0.18 },
        pleiades:  { rotY: 0.010, rotZ: 0.008, bob: 0.05, freq: 0.10 },
        dyson:     { rotY: 0.040, rotX: 0.018, rotZ: 0.012, bob: 0.05, freq: 0.16 }
    };
    addChaos(neb, chaosByType[type] || { rotY: 0.01, freq: 0.1 });
    root.add(neb);
    return root;
}

// rotate / pulse any group marked with userData.spin or userData.pulse
function tickOrbitals(group, dt, t) {
    if (!group) return;
    group.traverse(c => {
        if (!c.userData) return;
        const mats = Array.isArray(c.material) ? c.material : (c.material ? [c.material] : []);
        for (const mat of mats) {
            if (mat.uniforms && mat.uniforms.uTime) mat.uniforms.uTime.value = t;
        }
        if (c.userData.spin) {
            c.rotation.y += c.userData.spin * dt;
        }
        if (c.userData.chaos) {
            const ch = c.userData.chaos;
            if (!ch.base) {
                ch.base = {
                    x: c.position.x, y: c.position.y, z: c.position.z
                };
            }
            const f = ch.freq || 0.1;
            const p = ch.phase || 0.0;
            c.rotation.x += (Math.sin(t * f + p) + Math.sin(t * f * 2.7 + p * 0.7) * 0.45) * (ch.rotX || 0) * dt;
            c.rotation.y += (Math.cos(t * f * 1.3 + p) + Math.sin(t * f * 2.1 + p) * 0.35) * (ch.rotY || 0) * dt;
            c.rotation.z += (Math.sin(t * f * 1.7 + p * 1.4) + Math.cos(t * f * 2.4 + p) * 0.35) * (ch.rotZ || 0) * dt;
            if (ch.bob) {
                c.position.y = ch.base.y + Math.sin(t * f * 2.0 + p) * ch.bob + Math.sin(t * f * 5.0 + p) * ch.bob * 0.25;
            }
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
        const mats = Array.isArray(o.material) ? o.material : (o.material ? [o.material] : []);
        for (const mat of mats) {
            if (!mat.userData || !mat.userData.local) continue;
            if (mat.map) mat.map.dispose();
            mat.dispose();
        }
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
