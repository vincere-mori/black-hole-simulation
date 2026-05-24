// Theme color palettes matching the Python desktop application
const THEMES = [
    { c1: '#ffc000', c2: '#ff2200', name: 'Gargantua Orange', temp: '8.4e6' },
    { c1: '#00f0ff', c2: '#0011ff', name: 'Cosmic Cyan', temp: '1.2e7' },
    { c1: '#ea00ff', c2: '#5100ff', name: 'Quantum Purple', temp: '9.8e6' },
    { c1: '#ff4040', c2: '#ff0000', name: 'Singularity Crimson', temp: '6.2e6' }
];

// Presets definitions
const PRESETS = {
    gargantua: {
        rs: 1.0,
        distortion: 1.0,
        outer: 9.5,
        speed: 1.6,
        doppler: 1.0,
        stars: 1.0,
        theme: 0
    },
    quasar: {
        rs: 0.8,
        distortion: 1.4,
        outer: 12.0,
        speed: 2.2,
        doppler: 1.8,
        stars: 1.8,
        theme: 1
    },
    micro: {
        rs: 0.35,
        distortion: 2.2,
        outer: 4.5,
        speed: 3.5,
        doppler: 2.4,
        stars: 0.5,
        theme: 2
    },
    void: {
        rs: 1.8,
        distortion: 0.7,
        outer: 14.5,
        speed: 0.8,
        doppler: 0.5,
        stars: 1.2,
        theme: 3
    }
};

let currentPreset = 'gargantua';
let activeThemeIdx = 0;
let autoRotate = true;

// Setup HTML elements
const canvas = document.getElementById('webgl-canvas');
const sidebar = document.getElementById('control-sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const autoRotateBtn = document.getElementById('btn-camera');

// Slider elements
const sliders = {
    rs: document.getElementById('slider-rs'),
    distortion: document.getElementById('slider-distortion'),
    outer: document.getElementById('slider-outer'),
    speed: document.getElementById('slider-speed'),
    doppler: document.getElementById('slider-doppler'),
    stars: document.getElementById('slider-stars')
};

// Value displays
const displays = {
    rs: document.getElementById('val-rs'),
    distortion: document.getElementById('val-distortion'),
    outer: document.getElementById('val-outer'),
    speed: document.getElementById('val-speed'),
    doppler: document.getElementById('val-doppler'),
    stars: document.getElementById('val-stars')
};

// HUD displays
const hudFps = document.getElementById('hud-fps');
const hudRs = document.getElementById('hud-rs');
const hudTemp = document.getElementById('hud-temp');

// Sidebar toggle logic
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    toggleBtn.querySelector('i').classList.toggle('fa-sliders-h');
    toggleBtn.querySelector('i').classList.toggle('fa-times');
});

// Three.js variables
let renderer, scene, camera, orthoCamera, orthoScene, shaderMaterial, clock;
let uniforms = {};

async function init() {
    // 1. Setup Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Setup Perspective Camera (for controls/orbiting)
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 6, 18);

    // Setup OrbitControls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 40.0;
    controls.minDistance = 4.0;

    // 3. Setup Orthographic Camera & Scene (for full-screen rendering)
    orthoScene = new THREE.Scene();
    orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 4. Fetch GLSL Fragment Shader
    let fragmentShaderSource;
    try {
        const response = await fetch('shader.frag');
        if (!response.ok) throw new Error('Failed to fetch shader');
        fragmentShaderSource = await response.text();
    } catch (e) {
        console.error('Could not load shader.frag dynamically. Falling back to built-in fallback shader string.', e);
        showShaderErrorOverlay();
        return;
    }

    // 5. Setup Vertex Shader
    const vertexShaderSource = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `;

    // 6. Define Uniforms
    uniforms = {
        uCamPos: { value: new THREE.Vector3() },
        uInvProjection: { value: new THREE.Matrix4() },
        uCamWorld: { value: new THREE.Matrix4() },
        uTime: { value: 0 },
        uRs: { value: parseFloat(sliders.rs.value) },
        uInnerRadius: { value: parseFloat(sliders.rs.value) * 2.2 },
        uOuterRadius: { value: parseFloat(sliders.outer.value) },
        uSpinSpeed: { value: parseFloat(sliders.speed.value) },
        uDopplerStrength: { value: parseFloat(sliders.doppler.value) },
        uNoiseScale: { value: 1.4 },
        uNoiseDetail: { value: 4.5 },
        uBeamingScale: { value: 0.0 },
        uDistortion: { value: parseFloat(sliders.distortion.value) },
        uStarDensity: { value: parseFloat(sliders.stars.value) },
        uColorTheme1: { value: new THREE.Color() },
        uColorTheme2: { value: new THREE.Color() }
    };

    updateColorTheme(activeThemeIdx);

    // Create Shader Material (WebGL2 compatibility)
    shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        uniforms: uniforms,
        depthWrite: false,
        depthTest: false,
        glslVersion: THREE.GLSL3
    });

    // Create full-screen plane mesh
    const plane = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(plane, shaderMaterial);
    orthoScene.add(quad);

    clock = new THREE.Clock();

    // Event Listeners for UI
    setupUIEventListeners(controls);

    // Window resize
    window.addEventListener('resize', onWindowResize);

    // Initial sync
    syncUI();

    // Start Loop
    let lastTime = 0;
    let frames = 0;
    let fpsInterval = 0;

    function animate(time) {
        requestAnimationFrame(animate);

        // Frame calculations
        frames++;
        if (time > lastTime + 1000) {
            hudFps.textContent = Math.round((frames * 1000) / (time - lastTime));
            frames = 0;
            lastTime = time;
        }

        // Camera auto-orbit
        if (autoRotate && !controls.state === -1) {
            const timeVal = clock.getElapsedTime() * 0.05;
            const radius = Math.sqrt(camera.position.x * camera.position.x + camera.position.z * camera.position.z);
            camera.position.x = radius * Math.cos(timeVal);
            camera.position.z = radius * Math.sin(timeVal);
        }

        controls.update();

        // Update matrices uniforms
        uniforms.uCamPos.value.copy(camera.position);
        uniforms.uInvProjection.value.copy(camera.projectionMatrixInverse);
        uniforms.uCamWorld.value.copy(camera.matrixWorld);
        uniforms.uTime.value = clock.getElapsedTime();

        // Render Orthographic quad (Perspective camera values are inside uniforms)
        renderer.render(orthoScene, orthoCamera);
    }

    requestAnimationFrame(animate);
}

function updateColorTheme(idx) {
    activeThemeIdx = idx;
    const theme = THEMES[idx];
    uniforms.uColorTheme1.value.set(theme.c1);
    uniforms.uColorTheme2.value.set(theme.c2);
    hudTemp.textContent = theme.temp;
}

function syncUI() {
    // Dynamic display values
    for (const key in sliders) {
        displays[key].textContent = parseFloat(sliders[key].value).toFixed(2);
    }
    
    // Manage dynamic constraints
    const rs = parseFloat(sliders.rs.value);
    sliders.outer.min = (rs * 2.2).toFixed(2);
    if (parseFloat(sliders.outer.value) < rs * 2.2) {
        sliders.outer.value = (rs * 2.2).toFixed(2);
        displays.outer.textContent = (rs * 2.2).toFixed(2);
    }

    hudRs.textContent = rs.toFixed(2);

    // Sync values directly to uniforms
    uniforms.uRs.value = rs;
    uniforms.uInnerRadius.value = rs * 2.2;
    uniforms.uOuterRadius.value = parseFloat(sliders.outer.value);
    uniforms.uSpinSpeed.value = parseFloat(sliders.speed.value);
    uniforms.uDopplerStrength.value = parseFloat(sliders.doppler.value);
    uniforms.uDistortion.value = parseFloat(sliders.distortion.value);
    uniforms.uStarDensity.value = parseFloat(sliders.stars.value);
}

function setupUIEventListeners(controls) {
    // Sliders
    for (const key in sliders) {
        sliders[key].addEventListener('input', () => {
            syncUI();
            // Deactivate preset highlight if custom adjustments are made
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        });
    }

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const presetKey = e.target.getAttribute('data-preset');
            applyPreset(presetKey);
        });
    });

    // Theme pickers
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const idx = parseInt(e.target.getAttribute('data-theme'));
            updateColorTheme(idx);
            
            // Highlight matching preset button or deactivate it
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        });
    });

    // Auto-orbit button
    autoRotateBtn.addEventListener('click', () => {
        autoRotate = !autoRotate;
        autoRotateBtn.classList.toggle('active', autoRotate);
    });
    // Set initial active state of orbit button
    autoRotateBtn.classList.toggle('active', autoRotate);

    // Stop auto-rotation when user starts dragging
    controls.addEventListener('start', () => {
        autoRotate = false;
        autoRotateBtn.classList.remove('active');
    });
}

function applyPreset(key) {
    const config = PRESETS[key];
    if (!config) return;

    sliders.rs.value = config.rs;
    sliders.distortion.value = config.distortion;
    sliders.outer.value = config.outer;
    sliders.speed.value = config.speed;
    sliders.doppler.value = config.doppler;
    sliders.stars.value = config.stars;

    // Apply color theme
    updateColorTheme(config.theme);
    
    // Reflect active state in theme buttons
    document.querySelectorAll('.theme-btn').forEach((b, idx) => {
        b.classList.toggle('active', idx === config.theme);
    });

    syncUI();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function showShaderErrorOverlay() {
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(10, 10, 20, 0.95)';
    overlay.style.color = '#ff4444';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.fontFamily = 'sans-serif';
    overlay.style.padding = '40px';
    overlay.style.textAlign = 'center';

    overlay.innerHTML = `
        <h2 style="font-size: 28px; margin-bottom: 20px; font-family: 'Outfit', sans-serif; color: #fff;">CORS Security Restrictions Detected</h2>
        <p style="color: #a0a0c0; max-width: 600px; line-height: 1.6; margin-bottom: 30px;">
            Browsers block AJAX/fetch requests (like loading <b>shader.frag</b>) when HTML files are opened directly via the <b>file://</b> protocol.
        </p>
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 20px; text-align: left; font-family: monospace; font-size: 13px; color: #00ffcc;">
            To run this simulation locally, please use a local development server:<br><br>
            # Option 1 (Python):<br>
            python -m http.server 8000<br><br>
            # Option 2 (Node/npx):<br>
            npx serve .
        </div>
        <p style="color: #ff9d00; margin-top: 30px; font-size: 14px;">
            Note: The page will load automatically without errors when deployed online to GitHub Pages!
        </p>
    `;
    document.body.appendChild(overlay);
}

// Start application
window.onload = init;
