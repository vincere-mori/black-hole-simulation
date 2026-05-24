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

#define MAX_STEPS 140
#define PI 3.14159265359

// Hash functions for noise
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

// Fractal Brownian Motion (FBM) for accretion disk dust lanes
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

// Domain-warped FBM for fluid-like swirls
float warpedFbm(vec2 p) {
    vec2 q = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));
    return fbm(p + 2.0 * q);
}

// Relativistic Doppler Beaming and Redshift
vec4 sampleAccretionDisk(vec3 pos, float dist, vec3 v) {
    float r = dist;
    
    // Keplerian rotation: inner edge rotates faster
    float angle = atan(pos.z, pos.x);
    float angularVelocity = uSpinSpeed * sqrt(uRs / (r * r * r + 0.01));
    float phiRotated = angle - uTime * angularVelocity;
    
    // Polar coordinates for noise
    vec2 uvNoise = vec2(r * uNoiseScale, phiRotated * uNoiseDetail);
    float n = warpedFbm(uvNoise);
    
    // Normalized distance factor in the disk
    float x = (r - uInnerRadius) / (uOuterRadius - uInnerRadius);
    float edgeFade = sin(x * PI); // fades to 0 at boundaries
    
    // Density calculation
    float density = n * edgeFade * 0.45;
    if (density < 0.01) return vec4(0.0);
    
    // Base temperature color mapping (hot inner edge -> cooler outer edge)
    vec3 baseColor = mix(uColorTheme1 * 2.0, uColorTheme2, pow(x, 1.5));
    
    // Relativistic Doppler beaming
    vec3 diskVelocityDir = normalize(vec3(-pos.z, 0.0, pos.x)); // Counter-clockwise flow
    float cosTheta = dot(diskVelocityDir, -v);
    
    // Velocity as fraction of speed of light
    float beta = 0.45 * sqrt(uRs / r); 
    float gamma = 1.0 / sqrt(1.0 - beta * beta);
    float dopplerFactor = 1.0 / (gamma * (1.0 - beta * cosTheta));
    
    // Beaming alters intensity
    float beaming = pow(dopplerFactor, 3.0 + uBeamingScale);
    density *= beaming;
    
    // Doppler shifts color (blue-shift for approaching, red-shift for receding)
    vec3 finalColor = baseColor;
    if (dopplerFactor > 1.0) {
        // Blue shift: shift towards white/blue and increase brightness
        finalColor = mix(finalColor, vec3(0.7, 0.85, 1.3) * length(baseColor), clamp((dopplerFactor - 1.0) * 0.6, 0.0, 0.7));
    } else {
        // Red shift: shift towards deep dark red
        finalColor = mix(finalColor, vec3(0.65, 0.05, 0.01) * length(baseColor), clamp((1.0 - dopplerFactor) * 0.7, 0.0, 0.8));
    }
    
    finalColor *= beaming;
    
    return vec4(finalColor, clamp(density, 0.0, 1.0));
}

// Warped Starfield Background
vec3 getStarfield(vec3 rd) {
    vec3 stars = vec3(0.0);
    for (int j = 0; j < 3; j++) {
        vec3 p = rd * (180.0 + float(j) * 70.0);
        vec3 ip = floor(p);
        vec3 fp = fract(p);
        
        float h = hash3(ip);
        if (h > 1.0 - (0.008 * uStarDensity)) {
            float dist = length(fp - vec3(0.5));
            float size = 0.04 + 0.12 * hash(ip.xy);
            float glow = exp(-dist / size);
            stars += vec3(glow) * h;
        }
    }
    return stars;
}

// 3D Sine noise for background nebula
float snoise3D(vec3 p) {
    return sin(p.x + sin(p.y)) * 0.33 + sin(p.y + sin(p.z)) * 0.33 + sin(p.z + sin(p.x)) * 0.34;
}

// Background Nebula Color
vec3 getNebula(vec3 rd) {
    float n = 0.0;
    vec3 p = rd * 2.2;
    float a = 0.5;
    for(int i = 0; i < 4; i++) {
        n += a * (snoise3D(p) * 0.5 + 0.5);
        p *= 2.0;
        a *= 0.5;
    }
    
    vec3 colBlue = vec3(0.01, 0.03, 0.12);
    vec3 colPurple = vec3(0.08, 0.01, 0.08);
    vec3 colSpace = vec3(0.002, 0.001, 0.005);
    
    vec3 col = mix(colSpace, colBlue, n);
    col = mix(col, colPurple, pow(n, 2.0));
    return col;
}

void main() {
    // Generate initial ray in World Space
    vec4 ndc = vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
    vec4 rayDirView = uInvProjection * ndc;
    rayDirView.z = -1.0;
    rayDirView.w = 0.0;
    
    vec3 rayDirWorld = normalize((uCamWorld * rayDirView).xyz);
    vec3 rayOrigin = uCamPos;
    
    vec3 p = rayOrigin;
    vec3 v = rayDirWorld;
    
    float t = 0.0;
    float stepSize = 0.1;
    bool hitBH = false;
    vec4 diskColorAccum = vec4(0.0);
    
    for (int i = 0; i < MAX_STEPS; i++) {
        float r2 = dot(p, p);
        float r = sqrt(r2);
        
        // Inside Event Horizon (Singularity pull)
        if (r < uRs * 1.001) {
            hitBH = true;
            break;
        }
        
        // Escape boundary
        if (r > 45.0) {
            break;
        }
        
        // Adaptive step size: smaller steps near Event Horizon, larger far away
        stepSize = clamp(r * 0.065, 0.012, 0.28);
        
        // Relativistic geodesic gravity integration:
        // Acceleration a = - 1.5 * Rs * L^2 * p / r^5
        vec3 L = cross(p, v);
        float h2 = dot(L, L);
        vec3 a = -1.5 * uRs * h2 * p / (r2 * r2 * r) * uDistortion;
        
        v += a * stepSize;
        v = normalize(v);
        
        vec3 nextP = p + v * stepSize;
        
        // Check intersection with equatorial plane (y = 0)
        if (p.y * nextP.y < 0.0) {
            float tPlane = -p.y / v.y;
            vec3 intersect = p + v * tPlane;
            float dist = length(intersect.xz);
            
            if (dist >= uInnerRadius && dist <= uOuterRadius) {
                vec4 diskSample = sampleAccretionDisk(intersect, dist, v);
                
                // Front-to-back compositing
                float alpha = diskSample.a * (1.0 - diskColorAccum.a);
                diskColorAccum.rgb += diskSample.rgb * alpha;
                diskColorAccum.a += alpha;
                
                if (diskColorAccum.a >= 0.98) {
                    diskColorAccum.a = 1.0;
                    break;
                }
            }
        }
        
        p = nextP;
    }
    
    // Final color blending (Black Hole core vs Disk vs Stars)
    vec3 finalColor = vec3(0.0);
    if (!hitBH) {
        // Warp coordinates to sample the sky
        vec3 backgroundSky = getStarfield(v) + getNebula(v);
        finalColor = backgroundSky * (1.0 - diskColorAccum.a) + diskColorAccum.rgb;
    } else {
        // Ray fell into the event horizon
        finalColor = diskColorAccum.rgb; // only show disk in front of event horizon
    }
    
    // Add subtle glow (bloom effect approximation near horizon)
    float rBH = length(rayOrigin);
    // Simple radial glow from center
    float centerDist = length(cross(rayOrigin, rayDirWorld));
    float horizonGlow = exp(-max(0.0, centerDist - uRs) * 2.5) * 0.18;
    if (centerDist > uRs && !hitBH) {
        finalColor += vec3(0.85, 0.45, 0.15) * horizonGlow * (1.0 - diskColorAccum.a);
    }
    
    // Tone mapping and gamma correction
    finalColor = finalColor / (finalColor + vec3(1.0)); // Reinhard tone mapping
    finalColor = pow(finalColor, vec3(1.0 / 2.2));     // Gamma 2.2 correction
    
    fragColor = vec4(finalColor, 1.0);
}
