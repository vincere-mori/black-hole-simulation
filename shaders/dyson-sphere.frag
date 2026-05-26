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
uniform float uRs;             // Central star radius scale (e.g. 1.0)
uniform float uInnerRadius;     // Dummy
uniform float uOuterRadius;     // Dyson sphere shell radius scale (e.g. 2.6)
uniform float uSpinSpeed;       // Panel rotation speed
uniform float uDopplerStrength; // Circuit glow intensity
uniform float uNoiseScale;      // Solar flare noise scale
uniform float uNoiseDetail;     // Geometric panel frequency
uniform float uBeamingScale;    // Star surface temperature
uniform float uDistortion;      // Dummy
uniform float uStarDensity;     // Star density
uniform vec3 uColorTheme1;      // Circuit glow color (e.g. neon orange/gold)
uniform vec3 uColorTheme2;      // Star color (e.g. hot yellow/white)

#define MAX_STEPS 60
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
        p = p * 2.2 + vec2(10.0);
        a *= 0.5;
    }
    return v;
}

// Background Starfield
vec3 getStarfield(vec3 rd) {
    vec3 stars = vec3(0.0);
    for (int j = 0; j < 2; j++) {
        vec3 p = rd * (180.0 + float(j) * 80.0);
        vec3 ip = floor(p);
        vec3 fp = fract(p);
        
        float h = fract(sin(dot(ip, vec3(127.1, 311.7, 74.7))) * 43758.5453);
        if (h > 1.0 - (0.007 * uStarDensity)) {
            float dist = length(fp - vec3(0.5));
            stars += vec3(exp(-dist / 0.04)) * h;
        }
    }
    return stars;
}

// Check intersection of ray with a sphere of radius R
bool intersectSphere(vec3 ro, vec3 rd, float r, out float t0, out float t1) {
    float b = dot(ro, rd);
    float c = dot(ro, ro) - r * r;
    float h = b * b - c;
    if (h < 0.0) return false;
    h = sqrt(h);
    t0 = -b - h;
    t1 = -b + h;
    return true;
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
    
    float rStar = uRs * 0.9;
    float rShell = uRs * 2.8;
    
    float t0_shell, t1_shell;
    float t0_star, t1_star;
    
    vec3 finalColor = vec3(0.0);
    
    // Check if the ray hits the Dyson Sphere Shell
    if (intersectSphere(rayOrigin, rayDirWorld, rShell, t0_shell, t1_shell) && t0_shell > 0.0) {
        // Intersect outer shell front
        vec3 hitPos = rayOrigin + rayDirWorld * t0_shell;
        
        // Rotate shell coordinate system over time
        vec3 rotPos = hitPos;
        float angle = uTime * uSpinSpeed * 0.15;
        float c = cos(angle), s = sin(angle);
        rotPos.xz = mat2(c, s, -s, c) * rotPos.xz;
        
        // Spherical coordinates of hit position
        vec3 normPos = normalize(rotPos);
        float theta = acos(normPos.y);
        float phi = atan(normPos.z, normPos.x);
        
        // Geometric panel calculation using sin/cos grid
        float freq = uNoiseDetail; // panel density multiplier
        float gapWidth = 0.06;     // width of the structural gap between panels
        
        float panelLat = step(gapWidth, fract(theta * freq / PI));
        float panelLong = step(gapWidth, fract(phi * freq / (2.0 * PI)));
        bool isPanel = (panelLat > 0.5) && (panelLong > 0.5);
        
        if (isPanel) {
            // Hit solid panel: dark metal shell with glowing circuit lines
            vec3 metalBase = vec3(0.03, 0.03, 0.05);
            
            // Circuit line textures on panel surface
            float circLat = step(0.95, sin(theta * freq * 8.0)) * step(0.2, fract(phi * freq * 4.0));
            float circLong = step(0.95, sin(phi * freq * 16.0)) * step(0.2, fract(theta * freq * 2.0));
            float circuit = clamp(circLat + circLong, 0.0, 1.0);
            
            // Panel ambient noise
            float n = fbm(vec2(theta * 5.0, phi * 10.0)) * 0.05;
            
            vec3 circColor = uColorTheme1 * circuit * uDopplerStrength * 1.4;
            finalColor = metalBase + circColor + vec3(n);
        } else {
            // Gap in the shell: light passes through!
            // Check if the ray continues to hit the central star
            if (intersectSphere(rayOrigin, rayDirWorld, rStar, t0_star, t1_star) && t0_star > 0.0) {
                vec3 starHitPos = rayOrigin + rayDirWorld * t0_star;
                vec2 starUV = vec2(atan(starHitPos.z, starHitPos.x), starHitPos.y) * uNoiseScale;
                float starNoise = fbm(starUV + vec2(uTime * 0.8));
                
                // Star surface: hot, glowing, active
                vec3 starCol = uColorTheme2 * (1.4 + starNoise * 0.8);
                finalColor = starCol;
            } else {
                // Missed star, crossed back of shell
                // Let's check if it hits the back shell panels
                vec3 backHitPos = rayOrigin + rayDirWorld * t1_shell;
                vec3 backRotPos = backHitPos;
                backRotPos.xz = mat2(c, s, -s, c) * backRotPos.xz;
                vec3 backNormPos = normalize(backRotPos);
                float bTheta = acos(backNormPos.y);
                float bPhi = atan(backNormPos.z, backNormPos.x);
                
                bool isBackPanel = (step(gapWidth, fract(bTheta * freq / PI)) > 0.5) &&
                                   (step(gapWidth, fract(bPhi * freq / (2.0 * PI))) > 0.5);
                
                if (isBackPanel) {
                    // Back panel is visible through the gap!
                    // It is dark and backlit by the star, giving it a silhouette look
                    finalColor = vec3(0.02, 0.02, 0.03);
                } else {
                    // Missed all panels, goes to space
                    finalColor = getStarfield(rayDirWorld);
                }
            }
            
            // Volumetric glowing corona/god-rays from star escaping through gaps
            float centerDist = length(cross(rayOrigin, rayDirWorld));
            float coronaGlow = exp(-max(0.0, centerDist - rStar) * 1.5) * 0.28;
            finalColor += uColorTheme2 * coronaGlow;
        }
    } else {
        // Ray completely missed the shell: draw background starfield and star glow
        finalColor = getStarfield(rayDirWorld);
        
        // Solar system glare / glow around Dyson structure
        float centerDist = length(cross(rayOrigin, rayDirWorld));
        float outerGlow = exp(-max(0.0, centerDist - rShell) * 1.8) * 0.15;
        finalColor += uColorTheme2 * outerGlow;
    }
    
    // Tone mapping and gamma
    finalColor = finalColor / (finalColor + vec3(0.9));
    finalColor = pow(finalColor, vec3(1.0 / 2.2));
    
    fragColor = vec4(finalColor, 1.0);
}
