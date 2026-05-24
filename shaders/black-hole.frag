#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 vUv;

// Camera uniforms
uniform vec3 uCamPos;
uniform mat4 uInvProjection;
uniform mat4 uCamWorld;

// Simulation parameters
uniform float uTime;
uniform float uRs;             // Schwarzschild radius
uniform float uInnerRadius;     // Accretion disk inner boundary
uniform float uOuterRadius;     // Accretion disk outer boundary
uniform float uSpinSpeed;       // Accretion disk rotation speed
uniform float uDopplerStrength; // Relativistic Doppler beaming strength
uniform float uNoiseScale;      // Accretion disk noise frequency
uniform float uNoiseDetail;     // Accretion disk noise density/octaves
uniform float uBeamingScale;    // Beaming intensity exponent
uniform float uDistortion;      // Lensing strength multiplier
uniform float uStarDensity;     // Density of background stars
uniform vec3 uColorTheme1;      // Accretion disk hot color (inner)
uniform vec3 uColorTheme2;      // Accretion disk cold color (outer)

#define MAX_STEPS 130
#define PI 3.14159265359

// Volumetric thickness parameters
const float uThickness = 0.08;

// Hash functions
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float hash3(vec3 p) {
    p = fract(p * vec3(443.8975, 397.2973, 491.1871));
    p += dot(p.xyz, p.yzx + 19.19);
    return fract(p.x * p.y * p.z);
}

// 2D Value Noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
}

// Fractal Brownian Motion
float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = rot * p * 2.0 + vec2(10.0);
        a *= 0.5;
    }
    return v;
}

// Domain-warped FBM for fluid swirls
float warpedFbm(vec2 p) {
    vec2 q = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));
    return fbm(p + 2.0 * q);
}

// Volumetric sampling of the accretion disk
vec4 sampleDiskVolume(vec3 pos, float dist, vec3 v) {
    float r = dist;
    
    // Keplerian rotation profile: speed decreases with distance
    float angle = atan(pos.z, pos.x);
    float angularVelocity = uSpinSpeed * sqrt(uRs / (r * r * r + 0.01));
    float phiRotated = angle - uTime * angularVelocity;
    
    // Noise sampling
    vec2 uvNoise = vec2(r * uNoiseScale, phiRotated * uNoiseDetail);
    float n = warpedFbm(uvNoise);
    
    // Gaussian vertical density envelope for 3D thickness profile
    float verticalFade = exp(-(pos.y * pos.y) / (uThickness * uThickness * 0.6));
    
    // Radial boundary fade
    float x = (r - uInnerRadius) / (uOuterRadius - uInnerRadius);
    float radialFade = sin(x * PI);
    
    float density = n * verticalFade * radialFade * 0.7;
    if (density < 0.005) return vec4(0.0);
    
    // Base temperature color mapping
    vec3 baseColor = mix(uColorTheme1 * 2.5, uColorTheme2, pow(x, 1.2));
    
    // Relativistic Doppler beaming
    vec3 diskVelocityDir = normalize(vec3(-pos.z, 0.0, pos.x)); // Counter-clockwise flow
    float cosTheta = dot(diskVelocityDir, -v);
    
    // Velocity as fraction of speed of light
    float beta = 0.42 * sqrt(uRs / r); 
    float gamma = 1.0 / sqrt(1.0 - beta * beta);
    float dopplerFactor = 1.0 / (gamma * (1.0 - beta * cosTheta));
    
    float beaming = pow(dopplerFactor, 3.0 + uBeamingScale) * uDopplerStrength;
    beaming = mix(1.0, beaming, clamp(uDopplerStrength, 0.0, 1.0));
    density *= beaming;
    
    // Doppler color shifting
    vec3 finalColor = baseColor;
    if (dopplerFactor > 1.0) {
        finalColor = mix(finalColor, vec3(0.7, 0.88, 1.35) * length(baseColor), clamp((dopplerFactor - 1.0) * 0.6, 0.0, 0.8));
    } else {
        finalColor = mix(finalColor, vec3(0.6, 0.04, 0.0) * length(baseColor), clamp((1.0 - dopplerFactor) * 0.7, 0.0, 0.8));
    }
    
    // Relativistic Gravitational Redshift (dimming and shifting to red near event horizon)
    float redshift = sqrt(1.0 - uRs / r);
    finalColor = mix(finalColor, vec3(0.4, 0.0, 0.0) * length(finalColor), (1.0 - redshift) * 0.7);
    
    finalColor *= beaming * redshift;
    
    return vec4(finalColor, density);
}

// Lensed Background Starfield
vec3 getStarfield(vec3 rd) {
    vec3 stars = vec3(0.0);
    for (int j = 0; j < 3; j++) {
        vec3 p = rd * (180.0 + float(j) * 70.0);
        vec3 ip = floor(p);
        vec3 fp = fract(p);
        
        float h = hash3(ip);
        if (h > 1.0 - (0.008 * uStarDensity)) {
            float dist = length(fp - vec3(0.5));
            float size = 0.035 + 0.12 * hash(ip.xy);
            float glow = exp(-dist / size);
            stars += vec3(glow) * h;
        }
    }
    return stars;
}

// Nebula background noise
float snoise3D(vec3 p) {
    return sin(p.x + sin(p.y)) * 0.33 + sin(p.y + sin(p.z)) * 0.33 + sin(p.z + sin(p.x)) * 0.34;
}

vec3 getNebula(vec3 rd) {
    float n = 0.0;
    vec3 p = rd * 2.2;
    float a = 0.5;
    for(int i = 0; i < 4; i++) {
        n += a * (snoise3D(p) * 0.5 + 0.5);
        p *= 2.0;
        a *= 0.5;
    }
    
    vec3 colBlue = vec3(0.005, 0.02, 0.1);
    vec3 colPurple = vec3(0.06, 0.008, 0.06);
    vec3 colSpace = vec3(0.001, 0.0, 0.003);
    
    vec3 col = mix(colSpace, colBlue, n);
    col = mix(col, colPurple, pow(n, 2.0));
    return col;
}

void main() {
    // Convert UV to View Space Ray
    vec4 ndc = vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
    vec4 rayDirView = uInvProjection * ndc;
    rayDirView.z = -1.0;
    rayDirView.w = 0.0;
    
    // Transform Ray to World Space
    vec3 rayDirWorld = normalize((uCamWorld * rayDirView).xyz);
    vec3 rayOrigin = uCamPos;
    
    vec3 p = rayOrigin;
    vec3 v = rayDirWorld;
    
    float t = 0.0;
    float stepSize = 0.1;
    bool hitBH = false;
    vec4 diskColorAccum = vec4(0.0);
    
    // Inline bloom accumulator along the ray
    vec3 bloomAccum = vec3(0.0);
    
    for (int i = 0; i < MAX_STEPS; i++) {
        float r2 = dot(p, p);
        float r = sqrt(r2);
        
        // Crossed Event Horizon
        if (r < uRs * 1.001) {
            hitBH = true;
            break;
        }
        
        // Escaped outer boundary
        if (r > 42.0) {
            break;
        }
        
        // Fine-tuned adaptive step size
        // Slower steps near the photon sphere (1.5 * Rs) for razor-sharp lensing boundary
        stepSize = clamp(r * 0.062, 0.011, 0.28);
        
        // Geodesic gravity bending integration
        vec3 L = cross(p, v);
        float h2 = dot(L, L);
        vec3 a = -1.5 * uRs * h2 * p / (r2 * r2 * r) * uDistortion;
        
        v += a * stepSize;
        v = normalize(v);
        
        vec3 nextP = p + v * stepSize;
        
        // Volumetric Accretion Disk Marching
        if (abs(p.y) < uThickness) {
            float dist = length(p.xz);
            if (dist >= uInnerRadius && dist <= uOuterRadius) {
                vec4 diskSample = sampleDiskVolume(p, dist, v);
                
                // Front-to-back alpha compositing
                float alpha = diskSample.a * (1.0 - diskColorAccum.a) * stepSize * 2.8;
                diskColorAccum.rgb += diskSample.rgb * alpha;
                diskColorAccum.a += alpha;
                
                // Accumulate volumetric glow/bloom along the ray
                bloomAccum += diskSample.rgb * alpha * exp(-abs(p.y) * 4.0) * 0.12;
                
                if (diskColorAccum.a >= 0.98) {
                    diskColorAccum.a = 1.0;
                    // Continue marching to check if the ray later falls into the BH (eclipse)
                }
            }
        }
        
        p = nextP;
    }
    
    // Final Compositing
    vec3 finalColor = vec3(0.0);
    if (!hitBH) {
        vec3 backgroundSky = getStarfield(v) + getNebula(v);
        finalColor = backgroundSky * (1.0 - diskColorAccum.a) + diskColorAccum.rgb;
    } else {
        // Event Horizon core (black), but displays disk in front of it
        finalColor = diskColorAccum.rgb;
    }
    
    // Add volumetric bloom
    finalColor += bloomAccum;
    
    // Relativistic atmospheric scattering/corona glow near horizon
    float centerDist = length(cross(rayOrigin, rayDirWorld));
    float horizonGlow = exp(-max(0.0, centerDist - uRs) * 2.6) * 0.22;
    if (centerDist > uRs && !hitBH) {
        finalColor += vec3(0.9, 0.48, 0.15) * horizonGlow * (1.0 - diskColorAccum.a);
    }
    
    // Cinematic tone mapping & gamma correction
    finalColor = finalColor / (finalColor + vec3(0.85)); // Reinhard mapping
    finalColor = pow(finalColor, vec3(1.0 / 2.2));       // Gamma correction
    
    fragColor = vec4(finalColor, 1.0);
}
