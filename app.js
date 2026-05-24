// Astronomical Object Definitions & Telemetry Data
const OBJECTS = {
    gargantua: {
        name: "Gargantua Singularity",
        class: "SCHWARZSCHILD BLACK HOLE",
        coords: "X: 0.00 / Y: 0.00 / Z: 0.00",
        mass: "4.3e6 M☉",
        rad: "STABLE CORE",
        desc: "A supermassive singularity exhibiting general relativity light-deflection geodesics, dynamic gravitational lensing, and a rotating accretion disk with Keplerian speed profiles and Doppler beaming.",
        shader: "shaders/black-hole.frag",
        position: new THREE.Vector3(0, 0, 0),
        presets: {
            "gargantua": { rs: 1.0, distortion: 1.0, outer: 9.5, speed: 1.6, doppler: 1.0, stars: 1.0, theme: 0 },
            "supermassive": { rs: 1.8, distortion: 0.7, outer: 14.5, speed: 0.8, doppler: 0.5, stars: 1.2, theme: 1 }
        },
        themes: [
            { c1: '#ffc000', c2: '#ff2200', name: 'Gargantua Orange', temp: '8.4e6' },
            { c1: '#00f0ff', c2: '#0011ff', name: 'Cosmic Cyan', temp: '1.2e7' },
            { c1: '#ea00ff', c2: '#5100ff', name: 'Quantum Purple', temp: '9.8e6' }
        ],
        labels: {
            rs: "Horizon Mass (Rs)",
            distortion: "Warp Lensing",
            outer: "Disk Outer Bound",
            speed: "Disk Rotation",
            doppler: "Doppler Beaming"
        }
    },
    vela: {
        name: "Vela Pulsar",
        class: "ROTATING NEUTRON STAR",
        coords: "X: 5.00 / Y: 1.00 / Z: -4.00",
        mass: "1.44 M☉",
        rad: "EXTREME PULSATION",
        desc: "A highly magnetized, rapidly rotating neutron star. It emits precessing cones of high-energy radio jets from its magnetic poles and warps surrounding space with a dipole magnetosphere grid.",
        shader: "shaders/pulsar.frag",
        position: new THREE.Vector3(5, 1, -4),
        presets: {
            "vela": { rs: 0.8, distortion: 1.0, outer: 12.0, speed: 2.0, doppler: 1.0, stars: 1.0, theme: 0 },
            "magnetar": { rs: 1.2, distortion: 1.8, outer: 16.0, speed: 0.6, doppler: 2.2, stars: 0.5, theme: 1 }
        },
        themes: [
            { c1: '#00e5ff', c2: '#5100ff', name: 'Gamma Blue', temp: '2.5e8' },
            { c1: '#ff4040', c2: '#ea00ff', name: 'Magnetar Purple', temp: '4.1e8' }
        ],
        labels: {
            rs: "Core Size (Rs)",
            distortion: "Magneto-Warp",
            outer: "Field Boundary",
            speed: "Spin Frequency",
            doppler: "Jet Intensity"
        }
    },
    cygnus: {
        name: "Cygnus Wormhole",
        class: "MORRIS-THORNE BRIDGE",
        coords: "X: -6.00 / Y: -1.00 / Z: 5.00",
        mass: "N/A (Exotic Matter)",
        rad: "STABLE GATEWAY",
        desc: "A topological shortcut through curved spacetime. Light traversing the throat does not hit a singularity, but crosses the coordinate boundary to sample an alternate universe background.",
        shader: "shaders/wormhole.frag",
        position: new THREE.Vector3(-6, -1, 5),
        presets: {
            "stable-gate": { rs: 1.0, distortion: 1.0, outer: 10.0, speed: 1.0, doppler: 1.0, stars: 1.0, theme: 0 },
            "einstein-rosen": { rs: 0.65, distortion: 2.2, outer: 12.0, speed: 2.5, doppler: 1.8, stars: 1.2, theme: 1 }
        },
        themes: [
            { c1: '#ea00ff', c2: '#00e5ff', name: 'Nebula Portal', temp: '0' },
            { c1: '#ffc000', c2: '#00ff66', name: 'Gold-Emerald Bridge', temp: '12' }
        ],
        labels: {
            rs: "Throat Radius (Rs)",
            distortion: "Throat Bending",
            outer: "Lensing Zone",
            speed: "Chromatic Drift",
            doppler: "Alternate Lumens"
        }
    },
    kepler: {
        name: "Kepler Dyson Sphere",
        class: "STELLAR MEGASTRUCTURE",
        coords: "X: 3.00 / Y: -2.00 / Z: 7.00",
        mass: "1.08 M☉ (Central Star)",
        rad: "THERMAL EMISSION",
        desc: "A swarm of rotating geometric solar panels constructed around a star. Light escapes through the panel gaps, exposing flares and backlit mechanical plates.",
        shader: "shaders/dyson-sphere.frag",
        position: new THREE.Vector3(3, -2, 7),
        presets: {
            "dyson-orbit": { rs: 0.9, distortion: 0.0, outer: 2.8, speed: 1.5, doppler: 1.8, stars: 1.0, theme: 0 },
            "closed-swarm": { rs: 1.15, distortion: 0.0, outer: 2.8, speed: 0.7, doppler: 0.9, stars: 1.2, theme: 1 }
        },
        themes: [
            { c1: '#ff9d00', c2: '#ffcc00', name: 'Solar Gold', temp: '5780' },
            { c1: '#00e5ff', c2: '#ffffff', name: 'Sirius White-Blue', temp: '9940' }
        ],
        labels: {
            rs: "Star Diameter",
            distortion: "Gravity Flex",
            outer: "Shell Size",
            speed: "Orbital Speed",
            doppler: "Circuit Radiance"
        }
    }
};

// Global App States: 'GALAXY' or 'ORBIT'
let appState = 'GALAXY';
let activeObjectId = 'gargantua';
let activeThemeIdx = 0;
let autoRotate = true;

// UI Elements
const uiContainer = document.getElementById('ui-container');
const sidebar = document.getElementById('control-sidebar');
const infoCard = document.getElementById('info-card');
const btnBack = document.getElementById('btn-back-to-galaxy');
const btnOrbit = document.getElementById('btn-enter-orbit');
const btnAutopilot = document.getElementById('btn-camera');

// Slider Elements
const sliders = {
    rs: document.getElementById('slider-rs'),
    distortion: document.getElementById('slider-distortion'),
    outer: document.getElementById('slider-outer'),
    speed: document.getElementById('slider-speed'),
    doppler: document.getElementById('slider-doppler'),
    stars: document.getElementById('slider-stars')
};

const displays = {
    rs: document.getElementById('val-rs'),
    distortion: document.getElementById('val-distortion'),
    outer: document.getElementById('val-outer'),
    speed: document.getElementById('val-speed'),
    doppler: document.getElementById('val-doppler'),
    stars: document.getElementById('val-stars')
};

const hudFps = document.getElementById('hud-fps');
const hudSim = document.getElementById('hud-sim-speed');
const hudTemp = document.getElementById('hud-temp');

// Three.js variables
let renderer, scene, camera, controls, clock;
let orthoCamera, orthoScene, shaderMaterial;
let uniforms = {};

// Galaxy view entities
let galaxyParticles, systemNodes = [];
let raycaster, mouse;
let targetCameraPos = new THREE.Vector3();
let targetLookAt = new THREE.Vector3();
let currentLookAt = new THREE.Vector3();
let transitionProgress = 1.0; // 1.0 = transition finished/idle

// Canvas dot texture for stars
function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    return new THREE.CanvasTexture(canvas);
}

// Create pulsing neon ring texture for clickable nodes
function createNodeTexture(colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Glowing ring
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(32, 32, 22, 0, Math.PI * 2);
    ctx.stroke();
    
    // Core dot
    ctx.fillStyle = colorHex;
    ctx.beginPath();
    ctx.arc(32, 32, 8, 0, Math.PI * 2);
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
}

async function init() {
    const glCanvas = document.getElementById('webgl-canvas');
    renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene = new THREE.Scene();
    clock = new THREE.Clock();
    
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 150);
    camera.position.set(0, 14, 25);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 50.0;
    controls.minDistance = 3.0;

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // 1. Build Galaxy Map Scene
    buildGalaxyMap();

    // 2. Setup Orthographic scene (for Close-up volumetric shaders)
    orthoScene = new THREE.Scene();
    orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Initial uniform definitions
    uniforms = {
        uCamPos: { value: new THREE.Vector3() },
        uInvProjection: { value: new THREE.Matrix4() },
        uCamWorld: { value: new THREE.Matrix4() },
        uTime: { value: 0 },
        uRs: { value: 1.0 },
        uInnerRadius: { value: 2.2 },
        uOuterRadius: { value: 9.5 },
        uSpinSpeed: { value: 1.6 },
        uDopplerStrength: { value: 1.0 },
        uNoiseScale: { value: 1.4 },
        uNoiseDetail: { value: 4.5 },
        uBeamingScale: { value: 0.0 },
        uDistortion: { value: 1.0 },
        uStarDensity: { value: 1.0 },
        uColorTheme1: { value: new THREE.Color() },
        uColorTheme2: { value: new THREE.Color() }
    };

    // UI Events
    setupUIEvents();
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);

    // Loop variables
    let lastTime = 0;
    let frames = 0;

    function renderLoop(time) {
        requestAnimationFrame(renderLoop);
        
        frames++;
        if (time > lastTime + 1000) {
            hudFps.textContent = Math.round((frames * 1000) / (time - lastTime));
            frames = 0;
            lastTime = time;
        }

        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        // State Transition Camera Lerp
        if (transitionProgress < 1.0) {
            transitionProgress += delta * 1.5; // duration is approx 0.66 seconds
            if (transitionProgress >= 1.0) {
                transitionProgress = 1.0;
                onTransitionComplete();
            } else {
                // S-curve interpolation
                const t = Math.sin(transitionProgress * Math.PI / 2.0);
                camera.position.lerpVectors(camera.position, targetCameraPos, t * 0.1);
                currentLookAt.lerpVectors(currentLookAt, targetLookAt, t * 0.1);
                controls.target.copy(currentLookAt);
            }
        }

        if (appState === 'GALAXY') {
            // Spin the galaxy particles
            if (galaxyParticles) {
                galaxyParticles.rotation.y = elapsed * 0.03;
            }
            
            // Spin system nodes
            systemNodes.forEach(node => {
                node.rotation.y = -elapsed * 0.1;
                // Subtle pulse size
                const pulse = 1.0 + 0.08 * Math.sin(elapsed * 4.0 + node.position.x);
                node.scale.set(pulse, pulse, pulse);
            });

            // Auto orbit camera on galaxy map
            if (autoRotate && transitionProgress === 1.0) {
                const mapTime = elapsed * 0.03;
                const radius = 25.0;
                camera.position.x = radius * Math.cos(mapTime);
                camera.position.z = radius * Math.sin(mapTime);
                camera.position.y = 12.0 + 4.0 * Math.sin(mapTime * 0.5);
                controls.target.set(0, 0, 0);
            }

            controls.update();
            renderer.render(scene, camera);
        } else if (appState === 'ORBIT') {
            // Orbital Sim state: render full-screen shader
            if (controls && autoRotate) {
                const mapTime = elapsed * 0.04;
                const radius = 17.0;
                camera.position.x = radius * Math.cos(mapTime);
                camera.position.z = radius * Math.sin(mapTime);
            }
            
            controls.update();

            // Sync matrices to shader
            uniforms.uCamPos.value.copy(camera.position);
            uniforms.uInvProjection.value.copy(camera.projectionMatrixInverse);
            uniforms.uCamWorld.value.copy(camera.matrixWorld);
            uniforms.uTime.value = elapsed;

            renderer.render(orthoScene, orthoCamera);
        }
    }

    requestAnimationFrame(renderLoop);
}

// 3D Spiral Galaxy Generator (Three.js Particles)
function buildGalaxyMap() {
    const starCount = 10000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    
    const colorCore = new THREE.Color('#ffe199');
    const colorArm = new THREE.Color('#4d66ff');
    const colorEdge = new THREE.Color('#03011c');

    for (let i = 0; i < starCount; i++) {
        // Spiral equations
        const r = Math.pow(Math.random(), 2.5) * 16.0;
        const arms = 2;
        const armIndex = i % arms;
        const theta = (armIndex * (2.0 * Math.PI / arms)) + (r * 0.45);
        
        // Arm dispersion / scattering
        const scatterX = (Math.random() - 0.5) * (1.2 / (r * 0.1 + 0.5));
        const scatterY = (Math.random() - 0.5) * (0.8 / (r * 0.15 + 0.5));
        const scatterZ = (Math.random() - 0.5) * (1.2 / (r * 0.1 + 0.5));
        
        const x = r * Math.cos(theta) + scatterX;
        const y = scatterY;
        const z = r * Math.sin(theta) + scatterZ;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Particle colors based on radius
        let mixedColor;
        if (r < 3.0) {
            mixedColor = colorCore.clone().lerp(colorArm, r / 3.0);
        } else {
            mixedColor = colorArm.clone().lerp(colorEdge, (r - 3.0) / 13.0);
        }
        
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starTex = createStarTexture();
    const material = new THREE.PointsMaterial({
        size: 0.14,
        map: starTex,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    galaxyParticles = new THREE.Points(geometry, material);
    scene.add(galaxyParticles);

    // Build the clickable anomaly nodes
    const nodeGeom = new THREE.PlaneGeometry(1.6, 1.6);
    
    for (const key in OBJECTS) {
        const obj = OBJECTS[key];
        
        // Color mapping for node ring texture
        let ringColor = '#ffaa00';
        if (key === 'vela') ringColor = '#00ffff';
        if (key === 'cygnus') ringColor = '#ff00ff';
        if (key === 'kepler') ringColor = '#00ff66';
        
        const nodeMat = new THREE.MeshBasicMaterial({
            map: createNodeTexture(ringColor),
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        
        const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
        nodeMesh.position.copy(obj.position);
        nodeMesh.userData = { id: key };
        
        scene.add(nodeMesh);
        systemNodes.push(nodeMesh);
    }
}

// Raycasting (Hover checking in Galaxy Map)
function onMouseMove(event) {
    if (appState !== 'GALAXY' || transitionProgress < 1.0) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(systemNodes);

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        const hoveredObjId = intersects[0].object.userData.id;
        showInfoCard(hoveredObjId);
    } else {
        document.body.style.cursor = 'default';
    }
}

function onMouseClick(event) {
    if (appState !== 'GALAXY' || transitionProgress < 1.0) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(systemNodes);

    if (intersects.length > 0) {
        const clickedObjId = intersects[0].object.userData.id;
        showInfoCard(clickedObjId);
        // Turn off auto orbit, focus camera on system
        autoRotate = false;
        btnAutopilot.classList.remove('active');
    }
}

function showInfoCard(id) {
    const obj = OBJECTS[id];
    if (!obj) return;
    
    activeObjectId = id;
    
    document.getElementById('info-title').textContent = obj.name;
    document.getElementById('info-class').textContent = `CLASS: ${obj.class}`;
    document.getElementById('info-coords').textContent = obj.coords;
    document.getElementById('info-mass').textContent = obj.mass;
    document.getElementById('info-rad').textContent = obj.rad;
    document.getElementById('info-desc').textContent = obj.desc;
    
    infoCard.classList.remove('hidden');
}

// Start Transition: Zoom to selected celestial system
btnOrbit.addEventListener('click', () => {
    const obj = OBJECTS[activeObjectId];
    if (!obj) return;

    appState = 'TRANSITION';
    transitionProgress = 0.0;
    
    // Zoom close to target node coordinates
    const offset = new THREE.Vector3(0, 3, 7); // position camera offset relative to object
    targetCameraPos.copy(obj.position).add(offset);
    targetLookAt.copy(obj.position);
    currentLookAt.copy(controls.target);

    // Hide galactic HUD panel elements
    infoCard.classList.add('hidden');
    document.body.classList.add('fade-out-scene');
    
    autoRotate = false;
    btnAutopilot.classList.remove('active');
});

// Transition ends: Swap scene content to full-screen shader
async function onTransitionComplete() {
    const obj = OBJECTS[activeObjectId];
    if (!obj) return;

    // Load fragment shader code
    let shaderSource;
    try {
        const response = await fetch(obj.shader);
        if (!response.ok) throw new Error('Failed to load shader');
        shaderSource = await response.text();
    } catch (e) {
        console.error('CORS blocked local file reading. Loading warning overlay.', e);
        showShaderErrorOverlay();
        return;
    }

    // Pass vertices to vertex shader
    const vertexShaderSource = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `;

    // Dynamic label changes
    document.getElementById('active-object-name').textContent = obj.name.split(' ')[0];
    document.getElementById('label-rs').innerHTML = obj.labels.rs;
    document.getElementById('label-outer').innerHTML = obj.labels.outer;
    document.getElementById('label-speed').innerHTML = obj.labels.speed;
    document.getElementById('label-doppler').innerHTML = obj.labels.doppler;

    // Show/hide specific controller blocks based on object type
    // Dyson Sphere doesn't use standard gravity bending/doppler controls
    const distGroup = document.getElementById('group-distortion');
    const dopGroup = document.getElementById('group-doppler');
    
    if (activeObjectId === 'kepler') {
        distGroup.style.display = 'none';
        dopGroup.style.display = 'none';
        document.getElementById('accessory-title').innerHTML = '<i class="fas fa-cubes"></i> Panel Grid Details';
    } else {
        distGroup.style.display = 'block';
        dopGroup.style.display = 'block';
        document.getElementById('accessory-title').innerHTML = '<i class="fas fa-circle-notch"></i> Structure Details';
    }

    // Set slider range boundaries
    if (activeObjectId === 'vela') {
        sliders.rs.min = 0.2; sliders.rs.max = 1.6; sliders.rs.step = 0.05;
        sliders.outer.min = 6.0; sliders.outer.max = 20.0; sliders.outer.step = 0.2;
    } else if (activeObjectId === 'cygnus') {
        sliders.rs.min = 0.3; sliders.rs.max = 1.8; sliders.rs.step = 0.05;
        sliders.outer.min = 6.0; sliders.outer.max = 15.0; sliders.outer.step = 0.1;
    } else if (activeObjectId === 'kepler') {
        sliders.rs.min = 0.4; sliders.rs.max = 2.0; sliders.rs.step = 0.05;
        sliders.outer.min = 2.0; sliders.outer.max = 5.0; sliders.outer.step = 0.1;
    } else { // black hole
        sliders.rs.min = 0.2; sliders.rs.max = 2.2; sliders.rs.step = 0.05;
        sliders.outer.min = 4.0; sliders.outer.max = 15.0; sliders.outer.step = 0.1;
    }

    // Populates presets grid
    populatePresetsGrid(obj);
    
    // Populates color theme buttons
    populateThemesPicker(obj);

    // Apply default preset configuration
    const defaultPreset = Object.keys(obj.presets)[0];
    applyPresetConfig(obj, defaultPreset);

    // Rebuild Shader Material
    shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShaderSource,
        fragmentShader: shaderSource,
        uniforms: uniforms,
        depthWrite: false,
        depthTest: false,
        glslVersion: THREE.GLSL3
    });

    // Re-attach plane geometry quad
    orthoScene.clear();
    const plane = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(plane, shaderMaterial);
    orthoScene.add(quad);

    // Align perspective camera coordinates
    camera.position.set(0, 5, 17);
    controls.target.set(0, 0, 0);
    controls.maxDistance = 35.0;
    controls.minDistance = 3.5;
    autoRotate = true;
    btnAutopilot.classList.add('active');

    // State update
    appState = 'ORBIT';
    
    // Animate controls sidebar opening
    sidebar.classList.remove('collapsed');
    btnBack.classList.remove('hidden');
    document.body.classList.remove('fade-out-scene');
}

// Exit Orbital Sim: return to spiral Galaxy overview
btnBack.addEventListener('click', () => {
    sidebar.classList.add('collapsed');
    btnBack.classList.add('hidden');
    document.body.classList.add('fade-out-scene');

    setTimeout(() => {
        appState = 'GALAXY';
        camera.position.set(0, 14, 25);
        controls.target.set(0, 0, 0);
        controls.maxDistance = 50.0;
        controls.minDistance = 6.0;
        
        autoRotate = true;
        btnAutopilot.classList.remove('active');
        
        document.body.classList.remove('fade-out-scene');
    }, 600);
});

function populatePresetsGrid(obj) {
    const grid = document.getElementById('preset-container');
    grid.innerHTML = '';
    
    let isFirst = true;
    for (const presetKey in obj.presets) {
        const btn = document.createElement('button');
        btn.className = `preset-btn ${isFirst ? 'active' : ''}`;
        btn.setAttribute('data-preset', presetKey);
        btn.textContent = presetKey.replace('-', ' ');
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            applyPresetConfig(obj, presetKey);
        });
        grid.appendChild(btn);
        isFirst = false;
    }
}

function populateThemesPicker(obj) {
    const picker = document.getElementById('color-theme-picker');
    picker.innerHTML = '';
    
    obj.themes.forEach((theme, index) => {
        const btn = document.createElement('button');
        btn.className = `theme-btn ${index === 0 ? 'active' : ''}`;
        btn.setAttribute('data-theme', index);
        btn.style.background = `linear-gradient(135deg, ${theme.c1}, ${theme.c2})`;
        btn.title = theme.name;
        
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateColorTheme(obj, index);
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        });
        picker.appendChild(btn);
    });
    
    // Initial color setup
    updateColorTheme(obj, 0);
}

function applyPresetConfig(obj, presetKey) {
    const config = obj.presets[presetKey];
    if (!config) return;

    sliders.rs.value = config.rs;
    sliders.distortion.value = config.distortion;
    sliders.outer.value = config.outer;
    sliders.speed.value = config.speed;
    sliders.doppler.value = config.doppler;
    sliders.stars.value = config.stars;

    updateColorTheme(obj, config.theme);
    
    document.querySelectorAll('.theme-btn').forEach((b, idx) => {
        b.classList.toggle('active', idx === config.theme);
    });

    syncUI();
}

function updateColorTheme(obj, idx) {
    activeThemeIdx = idx;
    const theme = obj.themes[idx];
    uniforms.uColorTheme1.value.set(theme.c1);
    uniforms.uColorTheme2.value.set(theme.c2);
    
    // Sync HUD displays
    hudTemp.textContent = theme.temp;
    hudSim.textContent = (8.2 + idx * 1.4).toFixed(2);
}

function syncUI() {
    for (const key in sliders) {
        displays[key].textContent = parseFloat(sliders[key].value).toFixed(2);
        updateSliderFill(sliders[key]);
    }
    
    // Dynamic boundary rules for slider dependencies
    const rs = parseFloat(sliders.rs.value);
    
    if (activeObjectId === 'kepler') {
        // Dyson outer shell cannot be smaller than central star
        sliders.outer.min = (rs * 1.6).toFixed(2);
        if (parseFloat(sliders.outer.value) < rs * 1.6) {
            sliders.outer.value = (rs * 1.6).toFixed(2);
            displays.outer.textContent = (rs * 1.6).toFixed(2);
        }
        uniforms.uRs.value = rs;
        uniforms.uInnerRadius.value = rs * 0.9; // star core radius inside shader
        uniforms.uOuterRadius.value = parseFloat(sliders.outer.value); // dyson sphere shell size
    } else {
        // Lensed disk/magnetosphere cannot intersect horizon/core
        sliders.outer.min = (rs * 2.2).toFixed(2);
        if (parseFloat(sliders.outer.value) < rs * 2.2) {
            sliders.outer.value = (rs * 2.2).toFixed(2);
            displays.outer.textContent = (rs * 2.2).toFixed(2);
        }
        uniforms.uRs.value = rs;
        uniforms.uInnerRadius.value = rs * 2.2;
        uniforms.uOuterRadius.value = parseFloat(sliders.outer.value);
    }

    uniforms.uSpinSpeed.value = parseFloat(sliders.speed.value);
    uniforms.uDopplerStrength.value = parseFloat(sliders.doppler.value);
    uniforms.uDistortion.value = parseFloat(sliders.distortion.value);
    uniforms.uStarDensity.value = parseFloat(sliders.stars.value);
}

function setupUIEvents() {
    // Sliders input
    for (const key in sliders) {
        sliders[key].addEventListener('input', () => {
            syncUI();
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        });
    }

    // Autopilot toggle
    btnAutopilot.addEventListener('click', () => {
        autoRotate = !autoRotate;
        btnAutopilot.classList.toggle('active', autoRotate);
    });

    controls.addEventListener('start', () => {
        autoRotate = false;
        btnAutopilot.classList.remove('active');
    });
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
    overlay.style.background = 'rgba(8, 8, 16, 0.96)';
    overlay.style.color = '#ff3366';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '99999';
    overlay.style.fontFamily = 'sans-serif';
    overlay.style.padding = '40px';
    overlay.style.textAlign = 'center';

    overlay.innerHTML = `
        <h2 style="font-size: 26px; font-weight: 800; font-family: 'Outfit', sans-serif; color: #fff; margin-bottom: 20px;">CORS SECURITY RESTRICTIONS DETECTED</h2>
        <p style="color: #8c8cab; max-width: 600px; line-height: 1.6; margin-bottom: 30px;">
            Browsers block AJAX/fetch requests when HTML files are opened directly via the <b>file://</b> protocol.
        </p>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 22px; text-align: left; font-family: 'Share Tech Mono', monospace; font-size: 13px; color: #00ffff; max-width: 500px;">
            To run this application locally, serve files using a local server:<br><br>
            # Option 1 (Python):<br>
            python -m http.server 8000<br><br>
            # Option 2 (Node):<br>
            npx serve .
        </div>
        <p style="color: #ff9d00; margin-top: 30px; font-size: 14px; font-weight: 500;">
            Note: This site will load automatically without errors when hosted online via GitHub Pages!
        </p>
    `;
    document.body.appendChild(overlay);
}

window.onload = () => {
    init();
    initTutorial();
};

// --- Tutorial Onboarding ---

function initTutorial() {
    const overlay = document.getElementById('tutorial-overlay');
    if (!overlay) return;

    const done = localStorage.getItem('stellar_tutorial_done');
    if (done) {
        overlay.classList.add('hidden');
        return;
    }

    let currentStep = 0;
    const steps = overlay.querySelectorAll('.tutorial-step');
    const totalSteps = steps.length;
    const btnNext = document.getElementById('btn-tutorial-next');
    const btnSkip = document.getElementById('btn-tutorial-skip');

    function goToStep(idx) {
        steps.forEach((s, i) => {
            s.classList.remove('active', 'exit-left');
            if (i < idx) s.classList.add('exit-left');
        });
        steps[idx].classList.add('active');
        currentStep = idx;

        if (idx === totalSteps - 1) {
            btnNext.innerHTML = 'Done <i class="fas fa-check"></i>';
        } else {
            btnNext.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
        }
    }

    function dismiss() {
        localStorage.setItem('stellar_tutorial_done', '1');
        overlay.classList.add('hidden');
    }

    btnNext.addEventListener('click', () => {
        if (currentStep < totalSteps - 1) {
            goToStep(currentStep + 1);
        } else {
            dismiss();
        }
    });

    btnSkip.addEventListener('click', dismiss);

    // Help button re-opens the tutorial
    const btnHelp = document.getElementById('btn-help');
    if (btnHelp) {
        btnHelp.addEventListener('click', () => {
            overlay.classList.remove('hidden');
            goToStep(0);
        });
    }

    goToStep(0);
}

// --- Slider colored fill ---

function updateSliderFill(slider) {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const val = parseFloat(slider.value);
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
}
