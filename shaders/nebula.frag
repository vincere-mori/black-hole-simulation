#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 vUv;

uniform vec3 uCamPos;
uniform mat4 uInvProjection;
uniform mat4 uCamWorld;

uniform float uTime;
uniform float uRs;
uniform float uInnerRadius;
uniform float uOuterRadius;
uniform float uSpinSpeed;
uniform float uDopplerStrength;
uniform float uNoiseScale;
uniform float uNoiseDetail;
uniform float uBeamingScale;
uniform float uDistortion;
uniform float uStarDensity;
uniform vec3 uColorTheme1;
uniform vec3 uColorTheme2;
uniform int  uShapeMode;        // 0=orion, 1=horsehead, 2=crab, 3=pleiades

#define MAX_STEPS 60
#define PI 3.14159265359

float hash3(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise3(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash3(p + vec3(0,0,0)), hash3(p + vec3(1,0,0)), f.x),
                   mix(hash3(p + vec3(0,1,0)), hash3(p + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash3(p + vec3(0,0,1)), hash3(p + vec3(1,0,1)), f.x),
                   mix(hash3(p + vec3(0,1,1)), hash3(p + vec3(1,1,1)), f.x), f.y), f.z);
}

float fbm3(vec3 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise3(p);
        p = p * 2.1 + vec3(3.7);
        a *= 0.5;
    }
    return v;
}

mat3 rotY(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

vec3 getStarfield(vec3 rd) {
    vec3 stars = vec3(0.0);
    for (int j = 0; j < 2; j++) {
        vec3 p = rd * (200.0 + float(j) * 90.0);
        vec3 ip = floor(p);
        vec3 fp = fract(p);
        float h = fract(sin(dot(ip, vec3(127.1, 311.7, 74.7))) * 43758.5453);
        if (h > 1.0 - (0.004 * uStarDensity)) {
            float d = length(fp - vec3(0.5));
            stars += vec3(exp(-d / 0.06)) * h * 0.9;
        }
    }
    return stars;
}

// ----- Orion: asymmetric stellar nursery with offset trapezium core -----
float densOrion(vec3 p, float outerR, float coreR) {
    vec3 c1 = vec3(-0.8, 0.4, 0.0);
    float d1 = length(p - c1);
    float lobe = exp(-pow(d1 / (coreR * 1.4), 1.8));

    // long wing sweeping along +x (the famous Orion wing)
    vec3 wp = p - vec3(0.6, -0.2, 0.0);
    wp.x *= 0.5;
    wp.y *= 1.1;
    float wing = exp(-pow(length(wp) / (outerR * 0.45), 2.0)) * 0.75;

    // cavity hollow blown by hot stars
    vec3 hole = p - vec3(-1.1, 0.6, 0.3);
    float hollow = exp(-dot(hole, hole) * 1.6);

    float shape = max(lobe + wing - hollow * 0.45, 0.0);

    float drift = uTime * uSpinSpeed * 0.015;
    float base = fbm3(p * uNoiseScale * 0.45 + vec3(drift, drift * 0.6, -drift * 0.7));
    float wisp = fbm3(p * uNoiseScale * 1.4 - vec3(drift * 1.3, 0.0, drift));

    float dens = smoothstep(0.32, 0.85, base) * shape;
    dens += smoothstep(0.55, 0.9, wisp) * shape * (uNoiseDetail * 0.12);
    return dens;
}

// ----- Horsehead: bright IC 434 slab behind, dark silhouette in front -----
// returns (emission, dust-absorption)
vec2 densHorsehead(vec3 p, float outerR, float coreR) {
    // Wide IC 434 emission background — spans the full field
    // Bright pink H-alpha wall on the +y half, fading down
    float bgY = smoothstep(-outerR * 0.8, outerR * 0.6, p.y) * 0.8 + 0.2;
    float bgZ = smoothstep(outerR * 0.3, -outerR * 0.5, p.z);
    float bgRad = exp(-(p.x * p.x) / (outerR * outerR * 1.2));
    float drift = uTime * uSpinSpeed * 0.013;
    float bgFbm = fbm3(p * uNoiseScale * 0.4 + vec3(drift, drift * 0.4, -drift * 0.3));
    float bgWisp = fbm3(p * uNoiseScale * 0.9 - vec3(drift * 0.7, 0.0, drift * 0.5));
    float bgEmit = bgY * bgZ * bgRad * (smoothstep(0.15, 0.75, bgFbm) * 0.9 + smoothstep(0.4, 0.85, bgWisp) * 0.4);

    // Horse-head dark silhouette — positioned against the glow
    vec3 hp = p - vec3(0.0, -0.15, 0.25);

    // Neck — tall vertical column
    vec3 body = hp;
    body.x *= 1.5;
    body.z *= 1.6;
    float bodyD = length(body) - coreR * 1.6;

    // Head bulge — offset upward and slightly left
    vec3 head = hp - vec3(-0.15, coreR * 1.8, 0.0);
    head.x *= 1.15;
    head.z *= 1.3;
    float headD = length(head) - coreR * 1.1;

    // Pointed ear — distinctive peak at top-left
    vec3 ear = hp - vec3(-0.5, coreR * 2.7, 0.0);
    ear.y *= 0.55;
    ear.x *= 0.85;
    float earD = length(ear) - coreR * 0.5;

    // Snout — protruding to the right
    vec3 snout = hp - vec3(coreR * 1.4, coreR * 0.6, 0.0);
    snout.y *= 1.6;
    snout.x *= 0.8;
    float snoutD = length(snout) - coreR * 0.75;

    // Base cloud — wide dark cloud below the horse
    vec3 baseCloud = hp - vec3(0.0, -coreR * 1.0, 0.0);
    baseCloud.y *= 0.5;
    baseCloud.x *= 0.6;
    float baseD = length(baseCloud) - coreR * 2.5;

    // Smooth union of all parts
    float k = 0.5;
    float dShape = -log(exp(-bodyD/k) + exp(-headD/k) + exp(-earD/k) + exp(-snoutD/k) + exp(-baseD/k)) * k;

    // Strong absorption inside silhouette
    float inside = smoothstep(0.1, -0.6, dShape);

    // Turbulent dust texture
    float dustN = fbm3(p * uNoiseScale * 0.85 - vec3(drift * 0.8, drift * 0.3, drift * 0.5));
    float dustDetail = fbm3(p * uNoiseScale * 1.8 + vec3(drift * 1.2));
    float dust = inside * (smoothstep(0.18, 0.65, dustN) * 2.2 + smoothstep(0.5, 0.9, dustDetail) * 1.0);

    // Rim glow — bright edge where silhouette meets emission
    float rim = smoothstep(-0.6, -0.05, dShape) * smoothstep(0.15, -0.15, dShape);
    bgEmit += rim * 0.6 * bgZ;

    return vec2(bgEmit, dust);
}

// ----- Crab: oblate envelope with rotating radial synchrotron filaments -----
float densCrab(vec3 p, float outerR, float coreR) {
    // squash into oblate spheroid
    vec3 e = p;
    e.x *= 0.78;
    e.y *= 1.1;
    float r = length(e);

    float ang = atan(p.z, p.x);
    // 6 rotating filaments
    float filAng = sin(ang * 6.0 + uTime * uSpinSpeed * 0.18) * 0.5 + 0.5;
    filAng = pow(filAng, 1.4);

    // turbulent breaks along the filaments
    float radN = fbm3(vec3(ang * 3.0, r * 1.4, p.y * 1.3) + vec3(uTime * uSpinSpeed * 0.05));

    float outerEdge = smoothstep(outerR * 1.05, coreR * 0.9, r);
    float innerCut = smoothstep(coreR * 0.4, coreR * 1.1, r);
    float shellMask = outerEdge * innerCut;

    float filaments = shellMask * (0.35 + 0.65 * filAng) * smoothstep(0.28, 0.78, radN);

    // central pulsar - subtle 1.5Hz pulse, never goes dark
    float pulse = 0.78 + 0.22 * sin(uTime * 1.5);
    float core = exp(-r * r / (coreR * coreR * 0.45)) * pulse;

    return filaments * 1.4 + core * 0.85;
}

// ----- Pleiades star positions (Seven Sisters approx layout) -----
vec3 plPos(int i) {
    if (i == 0) return vec3( 0.0,  0.0,  0.0);
    if (i == 1) return vec3(-2.4,  0.8, -0.6);
    if (i == 2) return vec3( 2.7, -0.4,  0.7);
    if (i == 3) return vec3(-1.6, -1.5,  1.0);
    if (i == 4) return vec3( 1.4,  1.9, -1.1);
    if (i == 5) return vec3(-3.1, -0.3,  1.4);
    if (i == 6) return vec3( 3.2,  1.1, -0.8);
    return vec3(0.0);
}

float plMag(int i) {
    if (i == 0) return 1.40;
    if (i == 1) return 1.00;
    if (i == 2) return 1.10;
    if (i == 3) return 0.85;
    if (i == 4) return 0.90;
    if (i == 5) return 0.95;
    if (i == 6) return 0.75;
    return 0.5;
}

vec3 sampPleiades(vec3 p) {
    vec3 col = vec3(0.0);
    float drift = uTime * uSpinSpeed * 0.018;

    for (int i = 0; i < 7; i++) {
        vec3 sp = plPos(i);
        vec3 rel = p - sp;
        float d = length(rel);
        if (d > 1.8) continue;  // tight halo only
        float mag = plMag(i);
        float tw = 0.82 + 0.18 * sin(uTime * (0.6 + float(i) * 0.27) + float(i) * 1.7);

        // bright star core
        float starGlow = exp(-d * d * 10.0) * mag * uBeamingScale * tw;

        // local reflection nebula per star (own noise seed, sharp falloff)
        float nebN = fbm3(rel * uNoiseScale * 1.6 + vec3(drift + float(i) * 5.0));
        float neb = exp(-d * 2.0) * mag * 0.6 * smoothstep(0.4, 0.82, nebN);

        vec3 starCol = mix(uColorTheme2, vec3(1.2, 1.2, 1.35), 0.65);
        vec3 nebCol  = mix(uColorTheme1, uColorTheme2, 0.7);
        col += starCol * starGlow + nebCol * neb;
    }
    return col;
}

void main() {
    vec4 ndc = vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
    vec4 rdView = uInvProjection * ndc;
    rdView.z = -1.0;
    rdView.w = 0.0;
    vec3 rd = normalize((uCamWorld * rdView).xyz);
    vec3 ro = uCamPos;

    float coreR = max(uRs * 2.0, 1.0);
    float outerR = max(uOuterRadius, coreR + 0.5);

    // loose bounding sphere covers all shape modes
    float boundR = outerR * 1.3;
    float b = dot(ro, rd);
    float c = dot(ro, ro) - boundR * boundR;
    float disc = b * b - c;

    vec3 accumCol = vec3(0.0);
    float accumA = 0.0;

    if (disc > 0.0) {
        float sq = sqrt(disc);
        float tNear = max(-b - sq, 0.0);
        float tFar = -b + sq;
        float span = max(tFar - tNear, 0.01);
        float stepLen = span / float(MAX_STEPS);
        float t = tNear + stepLen * 0.5;

        // slow global rotation - gives all clouds gentle motion
        mat3 rot = rotY(uTime * uSpinSpeed * 0.007);

        for (int i = 0; i < MAX_STEPS; i++) {
            if (accumA > 0.97) break;
            vec3 pw = ro + rd * t;
            vec3 p = rot * pw;

            if (uShapeMode == 3) {
                // Pleiades - direct color contribution per sample
                vec3 cc = sampPleiades(p);
                float lum = dot(cc, vec3(0.3, 0.59, 0.11));
                if (lum > 0.015) {
                    float a = clamp(lum * stepLen * 1.1, 0.0, 1.0) * (1.0 - accumA);
                    accumCol += cc * a;
                    accumA += a;
                }
            }
            else if (uShapeMode == 1) {
                // Horsehead - emission + absorption
                vec2 d = densHorsehead(p, outerR, coreR);
                // Emission background (IC 434 H-alpha glow)
                if (d.x > 0.003) {
                    // Pink-magenta gradient: brighter at top, deeper at edges
                    float yFade = smoothstep(-outerR * 0.5, outerR * 0.5, p.y);
                    vec3 emitCol = mix(uColorTheme1 * 0.7, uColorTheme1, yFade);
                    emitCol = mix(emitCol, uColorTheme2, 0.15);
                    float a = d.x * uDopplerStrength * 0.45 * stepLen * (1.0 - accumA);
                    accumCol += emitCol * a;
                    accumA += a;
                }
                // Dark dust absorption (horse silhouette)
                if (d.y > 0.01) {
                    float k = d.y * stepLen * 2.4;
                    // Strong extinction — eats the pink glow behind
                    accumCol *= exp(-k * 2.2);
                    // Very faint self-emission from warm dust
                    vec3 dustCol = vec3(0.03, 0.015, 0.025);
                    float a = k * 0.08 * (1.0 - accumA);
                    accumCol += dustCol * a;
                    accumA += k * 0.5 * (1.0 - accumA);
                }
            }
            else if (uShapeMode == 2) {
                // Crab supernova remnant
                float dens = densCrab(p, outerR, coreR);
                if (dens > 0.01) {
                    float r = length(p);
                    float ang = atan(p.z, p.x);
                    float mt = clamp(r / outerR + sin(ang * 6.0) * 0.12, 0.0, 1.0);
                    vec3 col = mix(uColorTheme1, uColorTheme2, mt);
                    if (r < coreR * 0.6) {
                        col = mix(col, vec3(0.9, 0.85, 1.1), 0.45);
                    }
                    float bright = dens * uDopplerStrength * 0.35;
                    float a = bright * stepLen * 0.95 * (1.0 - accumA);
                    accumCol += col * a;
                    accumA += a;
                }
            }
            else {
                // Orion (default mode 0)
                float dens = densOrion(p, outerR, coreR);
                if (dens > 0.01) {
                    float r = length(p - vec3(-0.8, 0.4, 0.0));
                    float mt = clamp(r / outerR * 0.95, 0.0, 1.0);
                    vec3 col = mix(uColorTheme1, uColorTheme2, mt);
                    float bright = dens * uDopplerStrength * 0.4;
                    float a = bright * stepLen * 0.9 * (1.0 - accumA);
                    accumCol += col * a;
                    accumA += a;
                }
            }

            t += stepLen;
        }
    }

    vec3 sky = getStarfield(rd);
    vec3 finalCol = accumCol + sky * (1.0 - accumA);

    if (uShapeMode != 3) {
        float centerD = length(cross(ro, rd));
        float halo = exp(-centerD * 0.35) * 0.05 * uDopplerStrength;
        finalCol += uColorTheme1 * halo * (1.0 - accumA);
    }

    finalCol = finalCol / (finalCol + vec3(1.1));
    finalCol = pow(finalCol, vec3(1.0 / 2.2));

    fragColor = vec4(finalCol, 1.0);
}
