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

#define MAX_STEPS 96
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

    float drift = uTime * uSpinSpeed * 0.025;
    float base = fbm3(p * uNoiseScale * 0.45 + vec3(drift, drift * 0.6, -drift * 0.7));
    float wisp = fbm3(p * uNoiseScale * 1.4 - vec3(drift * 1.3, 0.0, drift));

    float dens = smoothstep(0.32, 0.85, base) * shape;
    dens += smoothstep(0.55, 0.9, wisp) * shape * (uNoiseDetail * 0.12);
    return dens;
}

// ----- Horsehead: bright IC 434 slab behind, dark silhouette in front -----
// returns (emission, dust-absorption)
vec2 densHorsehead(vec3 p, float outerR, float coreR) {
    // emission slab toward -z half (IC 434 plane)
    float bgZ = smoothstep(outerR * 0.1, -outerR * 0.6, p.z);
    float bgRad = exp(-(p.x * p.x + p.y * p.y) / (outerR * outerR * 0.55));
    float drift = uTime * uSpinSpeed * 0.022;
    float bgFbm = fbm3(p * uNoiseScale * 0.55 + vec3(drift));
    float bgEmit = bgZ * bgRad * smoothstep(0.18, 0.8, bgFbm) * 1.4;

    // build a horse-head silhouette in front (z slightly positive)
    vec3 hp = p - vec3(0.0, -0.3, 0.4);

    // neck (vertical squashed sphere)
    vec3 body = hp;
    body.x *= 1.7;
    body.z *= 1.4;
    float bodyD = length(body) - coreR * 1.45;

    // head bulge
    vec3 head = hp - vec3(-0.1, coreR * 1.6, 0.0);
    head.x *= 1.25;
    float headD = length(head) - coreR * 1.0;

    // pointed ear top
    vec3 ear = hp - vec3(-0.55, coreR * 2.5, 0.0);
    ear.y *= 0.65;
    float earD = length(ear) - coreR * 0.45;

    // snout protruding right
    vec3 snout = hp - vec3(coreR * 1.3, coreR * 0.4, 0.0);
    snout.y *= 1.5;
    snout.x *= 0.9;
    float snoutD = length(snout) - coreR * 0.7;

    // smooth-min union
    float k = 0.55;
    float dShape = -log(exp(-bodyD / k) + exp(-headD / k) + exp(-earD / k) + exp(-snoutD / k)) * k;

    float inside = smoothstep(0.05, -0.45, dShape);

    // turbulent dust mass
    float dustN = fbm3(p * uNoiseScale * 1.05 - vec3(drift * 1.4));
    float dust = inside * smoothstep(0.22, 0.7, dustN) * 2.8;

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
        mat3 rot = rotY(uTime * uSpinSpeed * 0.012);

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
                if (d.x > 0.005) {
                    vec3 emitCol = mix(uColorTheme1, uColorTheme2, 0.35);
                    float a = d.x * uDopplerStrength * 0.6 * stepLen * (1.0 - accumA);
                    accumCol += emitCol * a;
                    accumA += a;
                }
                if (d.y > 0.01) {
                    // dark dust eats accumulated light, contributes very dim self-color
                    float k = d.y * stepLen * 1.9;
                    accumCol *= exp(-k * 1.6);
                    vec3 dustCol = mix(uColorTheme1, vec3(0.05, 0.03, 0.06), 0.85);
                    float a = k * 0.18 * (1.0 - accumA);
                    accumCol += dustCol * a;
                    accumA += k * 0.35 * (1.0 - accumA);
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
                        col = mix(col, vec3(1.4, 1.3, 1.55), 0.55);
                    }
                    float bright = dens * uDopplerStrength * 0.5;
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
                    float bright = dens * uDopplerStrength * 0.55;
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

    finalCol = finalCol / (finalCol + vec3(0.95));
    finalCol = pow(finalCol, vec3(1.0 / 2.2));

    fragColor = vec4(finalCol, 1.0);
}
