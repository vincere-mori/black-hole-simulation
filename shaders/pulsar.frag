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
uniform float uRs;             // Star core radius
uniform float uInnerRadius;     // Dummy for compatibility
uniform float uOuterRadius;     // Magnetosphere radius
uniform float uSpinSpeed;       // Star rotation speed
uniform float uDopplerStrength; // Jet beam intensity
uniform float uNoiseScale;      // Surface noise scale
uniform float uNoiseDetail;     // Magnetosphere density
uniform float uBeamingScale;    // Jet narrowness
uniform float uDistortion;      // Magnetic warp multiplier
uniform float uStarDensity;     // Star density
uniform vec3 uColorTheme1;      // Jet color (e.g. bright blue/cyan)
uniform vec3 uColorTheme2;      // Magnetosphere color (e.g. deep purple)

#define MAX_STEPS 90
#define PI 3.14159265359

// Noise helper
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
        v += a * noise(p);
        p = p * 2.1 + vec2(4.0);
        a *= 0.5;
    }
    return v;
}

// Background Starfield (unwarped or slightly warped by pulsar)
vec3 getStarfield(vec3 rd) {
    vec3 stars = vec3(0.0);
    for (int j = 0; j < 2; j++) {
        vec3 p = rd * (180.0 + float(j) * 80.0);
        vec3 ip = floor(p);
        vec3 fp = fract(p);
        
        // Simple hash
        float h = fract(sin(dot(ip, vec3(127.1, 311.7, 74.7))) * 43758.5453);
        if (h > 1.0 - (0.005 * uStarDensity)) {
            float dist = length(fp - vec3(0.5));
            float size = 0.04;
            float glow = exp(-dist / size);
            stars += vec3(glow) * h;
        }
    }
    return stars;
}

void main() {
    // Generate view ray
    vec4 ndc = vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
    vec4 rayDirView = uInvProjection * ndc;
    rayDirView.z = -1.0;
    rayDirView.w = 0.0;
    
    vec3 rayDirWorld = normalize((uCamWorld * rayDirView).xyz);
    vec3 rayOrigin = uCamPos;
    
    vec3 p = rayOrigin;
    vec3 v = rayDirWorld;
    
    // Magnetic pole orientation (precessing over time)
    float rotTime = uTime * uSpinSpeed;
    float tilt = 0.45; // angle between rotation axis and magnetic axis
    vec3 magAxis = vec3(sin(tilt) * cos(rotTime), cos(tilt), sin(tilt) * sin(rotTime));
    magAxis = normalize(magAxis);
    
    float t = 0.0;
    float stepSize = 0.15;
    vec3 colorAccum = vec3(0.0);
    float alphaAccum = 0.0;
    bool hitStar = false;
    
    for (int i = 0; i < MAX_STEPS; i++) {
        float r = length(p);
        
        // Escape check
        if (r > 35.0 || alphaAccum >= 0.98) {
            break;
        }
        
        // Hit star core surface (Neutron Star)
        if (r < uRs) {
            hitStar = true;
            
            // Surface texture rendering (hot magnetic regions)
            vec3 normal = p / r;
            vec2 surfUV = vec2(atan(normal.z, normal.x) / PI, acos(normal.y) / PI);
            surfUV.x += uTime * uSpinSpeed * 0.05; // Spin surface
            
            float n = fbm(surfUV * uNoiseScale);
            
            // Core color: extremely hot blue-white
            vec3 coreCol = vec3(0.7, 0.9, 1.5) * (1.5 + n);
            
            // Hotspots at magnetic poles
            float align = abs(dot(normal, magAxis));
            float hotspot = pow(align, 8.0) * 1.5;
            coreCol += vec3(0.8, 1.1, 2.0) * hotspot;
            
            float alpha = 1.0 - alphaAccum;
            colorAccum += coreCol * alpha;
            alphaAccum = 1.0;
            break;
        }
        
        // Dynamic step size (smaller near star core)
        stepSize = clamp(r * 0.08, 0.04, 0.4);
        
        // Calculate relativistic jet beams
        vec3 pNorm = p / r;
        float cosPoleAngle = dot(pNorm, magAxis);
        float absCos = abs(cosPoleAngle);
        
        // Cone parameter (jet narrowness uBeamingScale)
        float jetThreshold = 0.93 - (uBeamingScale * 0.02);
        
        if (absCos > jetThreshold) {
            // Inside the relativistic jet beam!
            float jetFactor = (absCos - jetThreshold) / (1.0 - jetThreshold);
            float jetGlow = pow(jetFactor, 4.0) * uDopplerStrength * 1.8;
            
            // Decrease intensity with distance, but add pulses
            float pulse = 1.0 + 0.3 * sin(r * 1.5 - uTime * 12.0);
            jetGlow *= pulse / (r * 0.3 + 0.5);
            
            vec3 jetCol = uColorTheme1 * jetGlow;
            
            // Compositing
            float alpha = (1.0 - alphaAccum) * jetGlow * stepSize * 1.5;
            colorAccum += jetCol * alpha;
            alphaAccum += alpha;
        }
        
        // Dipole magnetosphere field visualization (glowing rings/filaments)
        // Dipole field structure lines: sin(r) * sin(theta)...
        float theta = acos(dot(pNorm, magAxis));
        float dipoleLines = sin(r * 1.2 - uTime * 6.0) * sin(theta * 4.0);
        float magneticGlow = pow(abs(dipoleLines), 8.0) * 0.15 * uNoiseDetail;
        // Fade out with distance
        magneticGlow *= exp(-r * 0.12);
        
        if (magneticGlow > 0.005) {
            vec3 magCol = mix(uColorTheme2, uColorTheme1, sin(r * 0.3) * 0.5 + 0.5);
            float alpha = (1.0 - alphaAccum) * magneticGlow * stepSize * 2.0;
            colorAccum += magCol * alpha;
            alphaAccum += alpha;
        }
        
        // Step forward
        p += v * stepSize;
    }
    
    // Compositing background
    vec3 finalColor = colorAccum;
    if (alphaAccum < 1.0) {
        vec3 sky = getStarfield(v);
        // Add subtle nebula glow
        float skyGlow = sin(v.x * 2.0 + sin(v.y * 3.0)) * 0.5 + 0.5;
        sky += uColorTheme2 * (skyGlow * 0.03);
        finalColor += sky * (1.0 - alphaAccum);
    }
    
    // Star glow/bloom approximation around the core
    float centerDist = length(cross(rayOrigin, rayDirWorld));
    float starGlow = exp(-max(0.0, centerDist - uRs) * 2.0) * 0.35;
    finalColor += vec3(0.6, 0.8, 1.2) * starGlow * (1.0 - alphaAccum);
    
    // Tone mapping and gamma
    finalColor = finalColor / (finalColor + vec3(0.9));
    finalColor = pow(finalColor, vec3(1.0 / 2.2));
    
    fragColor = vec4(finalColor, 1.0);
}
