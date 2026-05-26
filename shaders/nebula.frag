#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 vUv;

uniform vec3 uCamPos;
uniform mat4 uInvProjection;
uniform mat4 uCamWorld;

uniform float uTime;
uniform float uRs;              // core radius (peak density)
uniform float uInnerRadius;     // unused
uniform float uOuterRadius;     // outer extent of volume
uniform float uSpinSpeed;       // slow drift (use ~0.2-0.6, multiplied by 0.03 inside)
uniform float uDopplerStrength; // overall brightness 0.4-1.5
uniform float uNoiseScale;      // base cloud frequency
uniform float uNoiseDetail;     // wisp contrast
uniform float uBeamingScale;    // embedded star brightness (cluster mode); 0 disables
uniform float uDistortion;      // asymmetry / stretch
uniform float uStarDensity;     // bg starfield density
uniform vec3 uColorTheme1;      // dense core color
uniform vec3 uColorTheme2;      // outer wisp color

#define MAX_STEPS 64
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
    for (int i = 0; i < 4; i++) {
        v += a * noise3(p);
        p = p * 2.1 + vec3(3.7);
        a *= 0.5;
    }
    return v;
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

// fixed cluster star layout (used when uBeamingScale > 0.1)
vec3 clusterStarPos(int i) {
    float a = float(i) * 1.398;
    float r = 2.2 + float(i % 3) * 1.0;
    float y = sin(a * 0.7) * 0.7;
    return vec3(cos(a) * r, y, sin(a) * r);
}

float starWeight(int i) {
    return 0.55 + 0.45 * fract(sin(float(i) * 12.9898) * 43758.5453);
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

    // ray-sphere intersection with outer bound
    float b = dot(ro, rd);
    float c = dot(ro, ro) - outerR * outerR;
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

        vec3 drift = vec3(uTime * uSpinSpeed * 0.03,
                          uTime * uSpinSpeed * 0.018,
                          uTime * uSpinSpeed * -0.024);

        for (int i = 0; i < MAX_STEPS; i++) {
            if (accumA > 0.97) break;
            vec3 p = ro + rd * t;
            float r = length(p);

            if (r < outerR) {
                // soft bell shape peaking near coreR
                float fall = (r - coreR) / max(outerR - coreR, 0.1);
                float shape = exp(-fall * fall * 1.6);

                // asymmetry stretch
                vec3 q = p;
                q.x *= mix(1.0, 0.55, clamp(uDistortion * 0.3, 0.0, 1.0));
                q.y *= mix(1.0, 0.75, clamp(uDistortion * 0.25, 0.0, 1.0));

                // base cloud + wisp
                float base = fbm3(q * uNoiseScale * 0.4 + drift);
                float wisp = fbm3(q * uNoiseScale * 1.3 - drift * 1.7);
                float dens = smoothstep(0.38, 0.85, base) * shape;
                dens += smoothstep(0.55, 0.9, wisp) * shape * (uNoiseDetail * 0.12);

                if (dens > 0.01) {
                    float mixT = clamp(r / outerR * 0.7 + (1.0 - shape) * 0.35 + wisp * 0.15, 0.0, 1.0);
                    vec3 col = mix(uColorTheme1, uColorTheme2, mixT);
                    float brightness = dens * uDopplerStrength * 0.55;
                    float a = brightness * stepLen * 0.9 * (1.0 - accumA);
                    accumCol += col * a;
                    accumA += a;
                }

                // embedded bright stars for cluster mode
                if (uBeamingScale > 0.1) {
                    for (int s = 0; s < 7; s++) {
                        vec3 sp = clusterStarPos(s);
                        float d = length(p - sp);
                        if (d < 0.7) {
                            float w = starWeight(s);
                            float glow = exp(-d * 6.5) * w * uBeamingScale;
                            vec3 starCol = mix(uColorTheme2, vec3(1.1, 1.1, 1.25), 0.55);
                            float a = glow * stepLen * 1.6 * (1.0 - accumA);
                            accumCol += starCol * a;
                            accumA += a;
                        }
                    }
                }
            }

            t += stepLen;
        }
    }

    vec3 sky = getStarfield(rd);
    vec3 finalCol = accumCol + sky * (1.0 - accumA);

    // very subtle halo around the volume center
    float centerD = length(cross(ro, rd));
    float halo = exp(-centerD * 0.35) * 0.06 * uDopplerStrength;
    finalCol += uColorTheme1 * halo * (1.0 - accumA);

    finalCol = finalCol / (finalCol + vec3(0.95));
    finalCol = pow(finalCol, vec3(1.0 / 2.2));

    fragColor = vec4(finalCol, 1.0);
}
