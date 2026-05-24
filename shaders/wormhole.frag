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
uniform float uRs;             // Wormhole throat radius (e.g., 1.0)
uniform float uInnerRadius;     // Warp boundary
uniform float uOuterRadius;     // Outer lensing boundary
uniform float uSpinSpeed;       // Throat chromatic dispersion
uniform float uDopplerStrength; // Alternate universe brightness scale
uniform float uNoiseScale;      // Nebula detail in alternate universe
uniform float uNoiseDetail;     // Ring distortion scale
uniform float uBeamingScale;    // Alternate universe color bias
uniform float uDistortion;      // Gravity bending scale
uniform float uStarDensity;     // Starfield density
uniform vec3 uColorTheme1;      // Alternate universe nebula color 1 (e.g., purple)
uniform vec3 uColorTheme2;      // Alternate universe nebula color 2 (e.g., green/pink)

#define MAX_STEPS 120
#define PI 3.14159265359

// Hash helpers
float hash3(vec3 p) {
    p = fract(p * vec3(443.8975, 397.2973, 491.1871));
    p += dot(p.xyz, p.yzx + 19.19);
    return fract(p.x * p.y * p.z);
}

// 3D Sine noise for nebulas
float snoise3D(vec3 p) {
    return sin(p.x + sin(p.y)) * 0.33 + sin(p.y + sin(p.z)) * 0.33 + sin(p.z + sin(p.x)) * 0.34;
}

// Standard Universe Sky (Blue-Cyan theme)
vec3 getOurUniverseSky(vec3 rd) {
    // Starfield
    vec3 stars = vec3(0.0);
    for (int j = 0; j < 2; j++) {
        vec3 p = rd * (160.0 + float(j) * 90.0);
        vec3 ip = floor(p);
        vec3 fp = fract(p);
        float h = hash3(ip);
        if (h > 1.0 - (0.007 * uStarDensity)) {
            float dist = length(fp - vec3(0.5));
            stars += vec3(exp(-dist / 0.05)) * h;
        }
    }
    
    // Nebula FBM
    float n = 0.0;
    vec3 np = rd * 2.0;
    float a = 0.5;
    for(int i = 0; i < 3; i++) {
        n += a * (snoise3D(np) * 0.5 + 0.5);
        np *= 2.1;
        a *= 0.5;
    }
    vec3 nebula = mix(vec3(0.001, 0.002, 0.015), vec3(0.01, 0.04, 0.08), n);
    return stars + nebula;
}

// Alternate Universe Sky (Purple-Magenta/Green theme)
vec3 getAltUniverseSky(vec3 rd) {
    // Starfield (slightly different distribution)
    vec3 stars = vec3(0.0);
    for (int j = 0; j < 2; j++) {
        vec3 p = rd * (190.0 - float(j) * 70.0);
        vec3 ip = floor(p);
        vec3 fp = fract(p);
        float h = hash3(ip + vec3(100.0));
        if (h > 1.0 - (0.009 * uStarDensity)) {
            float dist = length(fp - vec3(0.5));
            // Golden and blue stars
            vec3 col = mix(vec3(1.2, 0.8, 0.4), vec3(0.6, 0.9, 1.4), h);
            stars += col * exp(-dist / 0.045) * h;
        }
    }
    
    // Nebula FBM
    float n = 0.0;
    vec3 np = rd * (1.8 * uNoiseScale);
    float a = 0.5;
    for(int i = 0; i < 4; i++) {
        n += a * (snoise3D(np) * 0.5 + 0.5);
        np *= 2.2;
        a *= 0.5;
    }
    
    vec3 nebula = mix(vec3(0.002, 0.0, 0.004), uColorTheme1 * 0.12, n);
    nebula = mix(nebula, uColorTheme2 * 0.18, pow(n, 2.0));
    
    return (stars + nebula) * uDopplerStrength;
}

void main() {
    // NDC to View Ray
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
    bool crossedThroat = false;
    
    // Raymarching Schwarzschild-like wormhole metric
    for (int i = 0; i < MAX_STEPS; i++) {
        float r2 = dot(p, p);
        float r = sqrt(r2);
        
        // Escape boundary
        if (r > 40.0) {
            break;
        }
        
        // Adaptive step size
        stepSize = clamp(r * 0.065, 0.012, 0.3);
        
        // Check if ray crosses the wormhole throat (r < Rs)
        if (r < uRs) {
            crossedThroat = !crossedThroat;
            
            // Morris-Thorne throat transition:
            // The ray passes through the throat to emergence in the opposite coordinate
            p = -p * 1.01; // Invert position through the throat sphere with tiny buffer
            // Direction remains forward (relative to coordinates, so v is unaffected or slightly bent)
            r2 = dot(p, p);
            r = sqrt(r2);
        }
        
        // Light bending logic:
        // Unlike black holes, wormholes bend space but don't have a singularity.
        // Bending force drops off rapidly outside the throat.
        vec3 L = cross(p, v);
        float h2 = dot(L, L);
        // Bending force formula: pulls light towards throat but weakens
        vec3 a = -1.0 * uRs * h2 * p / (r2 * r2 * r) * uDistortion;
        
        v += a * stepSize;
        v = normalize(v);
        p += v * stepSize;
    }
    
    // Output color based on which universe the photon ended up in
    vec3 finalColor = vec3(0.0);
    if (crossedThroat) {
        finalColor = getAltUniverseSky(v);
    } else {
        finalColor = getOurUniverseSky(v);
    }
    
    // Add glowing refraction ring around the throat boundary (Einstein Ring effect)
    float centerDist = length(cross(rayOrigin, rayDirWorld));
    float throatGlow = exp(-max(0.0, centerDist - uRs) * 3.5) * 0.25;
    // Chromatic dispersion color (e.g. glowing orange/cyan boundary)
    vec3 ringColor = mix(vec3(0.9, 0.6, 0.2), vec3(0.2, 0.7, 0.9), sin(uTime * uSpinSpeed) * 0.5 + 0.5);
    finalColor += ringColor * throatGlow;
    
    // Tone mapping and gamma
    finalColor = finalColor / (finalColor + vec3(0.9));
    finalColor = pow(finalColor, vec3(1.0 / 2.2));
    
    fragColor = vec4(finalColor, 1.0);
}
