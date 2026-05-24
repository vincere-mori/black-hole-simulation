// ===== Object Catalog =====
const OBJECTS = {
    gargantua: {
        name: "Gargantua Singularity",
        class: "SCHWARZSCHILD BLACK HOLE",
        sector: "SECTOR 04-A",
        coords: "X: -3.50 / Y: 0.80 / Z: -2.00",
        mass: "4.3e6 M☉",
        rad: "STABLE CORE",
        desc: "Supermassive singularity at galactic center. Accretion disk with Keplerian velocity profiles, relativistic Doppler beaming, and gravitational lensing geodesics.",
        shader: "shaders/black-hole.frag",
        position: new THREE.Vector3(-3.5, 0.8, -2),
        presets: {
            "gargantua": { rs: 1.0, distortion: 1.0, outer: 9.5, speed: 1.6, doppler: 1.0, stars: 1.0, theme: 0 },
            "supermassive": { rs: 1.8, distortion: 0.7, outer: 14.5, speed: 0.8, doppler: 0.5, stars: 1.2, theme: 1 }
        },
        themes: [
            { c1: '#ffc000', c2: '#ff2200', name: 'Gargantua Orange', temp: '8.4e6' },
            { c1: '#00f0ff', c2: '#0011ff', name: 'Cosmic Cyan', temp: '1.2e7' },
            { c1: '#ea00ff', c2: '#5100ff', name: 'Quantum Purple', temp: '9.8e6' }
        ],
        labels: { rs: "Horizon Mass (Rs)", distortion: "Warp Lensing", outer: "Disk Outer Bound", speed: "Disk Rotation", doppler: "Doppler Beaming" }
    },
    vela: {
        name: "Vela Pulsar",
        class: "ROTATING NEUTRON STAR",
        sector: "SECTOR 12-C",
        coords: "X: 5.00 / Y: 1.00 / Z: -4.00",
        mass: "1.44 M☉",
        rad: "EXTREME PULSATION",
        desc: "Highly magnetized neutron star. Precessing radio jet cones from magnetic poles, dipole magnetosphere field-line grid.",
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
        labels: { rs: "Core Size (Rs)", distortion: "Magneto-Warp", outer: "Field Boundary", speed: "Spin Frequency", doppler: "Jet Intensity" }
    },
    cygnus: {
        name: "Cygnus Wormhole",
        class: "MORRIS-THORNE BRIDGE",
        sector: "SECTOR 07-F",
        coords: "X: -6.00 / Y: -1.00 / Z: 5.00",
        mass: "N/A (Exotic)",
        rad: "STABLE GATEWAY",
        desc: "Topological shortcut through curved spacetime. Light crosses the coordinate boundary to sample an alternate-universe background.",
        shader: "shaders/wormhole.frag",
        position: new THREE.Vector3(-6, -1, 5),
        presets: {
            "stable-gate": { rs: 1.0, distortion: 1.0, outer: 10.0, speed: 1.0, doppler: 1.0, stars: 1.0, theme: 0 },
            "einstein-rosen": { rs: 0.65, distortion: 2.2, outer: 12.0, speed: 2.5, doppler: 1.8, stars: 1.2, theme: 1 }
        },
        themes: [
            { c1: '#ea00ff', c2: '#00e5ff', name: 'Nebula Portal', temp: '0' },
            { c1: '#ffc000', c2: '#00ff66', name: 'Gold-Emerald', temp: '12' }
        ],
        labels: { rs: "Throat Radius (Rs)", distortion: "Throat Bending", outer: "Lensing Zone", speed: "Chromatic Drift", doppler: "Alternate Lumens" }
    },
    kepler: {
        name: "Kepler Dyson Sphere",
        class: "STELLAR MEGASTRUCTURE",
        sector: "SECTOR 19-B",
        coords: "X: 3.00 / Y: -2.00 / Z: 7.00",
        mass: "1.08 M☉ (Host Star)",
        rad: "THERMAL EMISSION",
        desc: "Swarm of rotating geometric solar collectors around a star. Light escapes through panel gaps, exposing flares and backlit plates.",
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
        labels: { rs: "Star Diameter", distortion: "Gravity Flex", outer: "Shell Size", speed: "Orbital Speed", doppler: "Circuit Radiance" }
    },
    sgr_a: {
        name: "Sagittarius A*",
        class: "SUPERMASSIVE BLACK HOLE",
        sector: "SECTOR 00-CORE",
        coords: "X: 0.00 / Y: 0.00 / Z: 0.00",
        mass: "4.15e6 M☉",
        rad: "EVENT HORIZON DETECTED",
        desc: "The supermassive black hole at the center of the Milky Way. Creates intense gravitational lensing of background stars and features a highly energetic plasma accretion flow.",
        shader: "shaders/black-hole.frag",
        position: new THREE.Vector3(0, 0, 0),
        presets: {
            "core-singularity": { rs: 1.5, distortion: 1.4, outer: 11.0, speed: 2.2, doppler: 1.3, stars: 1.2, theme: 0 },
            "quiet-horizon": { rs: 0.8, distortion: 0.8, outer: 8.0, speed: 1.2, doppler: 0.8, stars: 1.0, theme: 1 }
        },
        themes: [
            { c1: '#ff3300', c2: '#ff9900', name: 'Plasma Flare', temp: '1.5e7' },
            { c1: '#00ffcc', c2: '#0055ff', name: 'Core Cyan', temp: '8.9e6' }
        ],
        labels: { rs: "Horizon Mass (Rs)", distortion: "Warp Lensing", outer: "Disk Outer Bound", speed: "Disk Rotation", doppler: "Doppler Beaming" }
    },
    crab: {
        name: "Crab Pulsar",
        class: "HIGH-SPIN NEUTRON STAR",
        sector: "SECTOR 05-B",
        coords: "X: -8.00 / Y: 3.00 / Z: -6.00",
        mass: "1.4 M☉",
        rad: "RAPID BEAMING",
        desc: "A young, rapidly spinning neutron star at the center of the Crab Nebula. Emits intense, highly-collimated electromagnetic jets and powers the surrounding glowing nebula filaments.",
        shader: "shaders/pulsar.frag",
        position: new THREE.Vector3(-8, 3, -6),
        presets: {
            "crab-rapid": { rs: 0.9, distortion: 1.2, outer: 14.0, speed: 3.5, doppler: 1.8, stars: 0.8, theme: 0 },
            "crab-nebula": { rs: 0.7, distortion: 0.8, outer: 10.0, speed: 1.5, doppler: 1.0, stars: 1.2, theme: 1 }
        },
        themes: [
            { c1: '#00aaff', c2: '#002288', name: 'Blue Nebula', temp: '3.2e8' },
            { c1: '#ff0055', c2: '#5500ff', name: 'Chandra Pink', temp: '4.8e8' }
        ],
        labels: { rs: "Core Size (Rs)", distortion: "Magneto-Warp", outer: "Field Boundary", speed: "Spin Frequency", doppler: "Jet Intensity" }
    },
    andromeda: {
        name: "Andromeda Gateway",
        class: "INTERGALACTIC WORMHOLE",
        sector: "SECTOR 99-Z",
        coords: "X: 8.00 / Y: -3.00 / Z: -8.00",
        mass: "N/A (Exotic Matter)",
        rad: "STABLE ALIEN BRIDGE",
        desc: "A massive, artificially-stabilized Morris-Thorne wormhole connecting our galaxy to the Andromeda galaxy. Gravitational lensing warps our view of the Andromeda starfield inside the throat.",
        shader: "shaders/wormhole.frag",
        position: new THREE.Vector3(8, -3, -8),
        presets: {
            "intergalactic": { rs: 1.2, distortion: 1.5, outer: 11.5, speed: 1.8, doppler: 1.4, stars: 1.0, theme: 0 },
            "void-gate": { rs: 0.7, distortion: 2.5, outer: 9.0, speed: 0.5, doppler: 0.8, stars: 1.5, theme: 1 }
        },
        themes: [
            { c1: '#cc00ff', c2: '#330066', name: 'Andromeda Magenta', temp: '0' },
            { c1: '#00ffaa', c2: '#003311', name: 'Bio-Green Portal', temp: '6' }
        ],
        labels: { rs: "Throat Radius (Rs)", distortion: "Throat Bending", outer: "Lensing Zone", speed: "Chromatic Drift", doppler: "Alternate Lumens" }
    },
    dyson_swarm: {
        name: "Solara Dyson Swarm",
        class: "DENSE MEGASTRUCTURE",
        sector: "SECTOR 15-D",
        coords: "X: -2.00 / Y: -4.00 / Z: -5.00",
        mass: "0.95 M☉ (Host Star)",
        rad: "CLOSED COLLECTOR SHELL",
        desc: "A dense swarm of solar collector plates surrounding the star Solara. Star flares escape through grid gaps, emitting high thermal radiation.",
        shader: "shaders/dyson-sphere.frag",
        position: new THREE.Vector3(-2, -4, -5),
        presets: {
            "full-collect": { rs: 0.85, distortion: 0.0, outer: 2.5, speed: 1.0, doppler: 1.2, stars: 0.9, theme: 0 },
            "active-gaps": { rs: 1.1, distortion: 0.0, outer: 3.2, speed: 2.2, doppler: 2.0, stars: 1.1, theme: 1 }
        },
        themes: [
            { c1: '#aaff00', c2: '#ffaa00', name: 'Solara Amber', temp: '4800' },
            { c1: '#ff00ff', c2: '#ffffff', name: 'Nebular Violet', temp: '8500' }
        ],
        labels: { rs: "Star Diameter", distortion: "Gravity Flex", outer: "Shell Size", speed: "Orbital Speed", doppler: "Circuit Radiance" }
    },
    polaris: {
        name: "Polaris Singularity",
        class: "INTERMEDIATE BLACK HOLE",
        sector: "SECTOR 02-B",
        coords: "X: 1.00 / Y: 6.00 / Z: -7.00",
        mass: "1.2e5 M☉",
        rad: "STABLE HORIZON",
        desc: "An intermediate-mass black hole located in the Polaris system. Features a highly warped accretion flow with extreme gravitational time dilation near the photon sphere.",
        shader: "shaders/black-hole.frag",
        position: new THREE.Vector3(1, 6, -7),
        presets: {
            "intermediate": { rs: 0.6, distortion: 0.8, outer: 6.5, speed: 2.0, doppler: 0.7, stars: 1.1, theme: 0 },
            "high-spin": { rs: 0.9, distortion: 1.3, outer: 9.0, speed: 3.5, doppler: 1.5, stars: 0.8, theme: 1 }
        },
        themes: [
            { c1: '#00ffff', c2: '#0055ff', name: 'Polar Blue', temp: '5.2e6' },
            { c1: '#ff00ff', c2: '#660099', name: 'Ultraviolet Flare', temp: '7.8e6' }
        ],
        labels: { rs: "Horizon Mass (Rs)", distortion: "Warp Lensing", outer: "Disk Outer Bound", speed: "Disk Rotation", doppler: "Doppler Beaming" }
    },
    aldebaran: {
        name: "Aldebaran Bulge",
        class: "STELLAR CORE FLARE",
        sector: "SECTOR 08-A",
        coords: "X: -4.00 / Y: 5.00 / Z: 3.00",
        mass: "1.7 M☉ (Host Core)",
        rad: "CORONAL RADIATION",
        desc: "The hyperactive glowing core of the Aldebaran supergiant star, surrounded by dynamic magnetic dust clouds and intense coronal loops.",
        shader: "shaders/dyson-sphere.frag",
        position: new THREE.Vector3(-4, 5, 3),
        presets: {
            "supergiant": { rs: 1.5, distortion: 0.0, outer: 3.8, speed: 0.8, doppler: 1.0, stars: 1.0, theme: 0 },
            "hyper-flare": { rs: 1.8, distortion: 0.0, outer: 4.5, speed: 2.5, doppler: 2.0, stars: 1.2, theme: 1 }
        },
        themes: [
            { c1: '#ff4400', c2: '#ffcc00', name: 'Aldebaran Fire', temp: '3910' },
            { c1: '#ff0055', c2: '#ffaaee', name: 'Magenta Glow', temp: '4200' }
        ],
        labels: { rs: "Star Diameter", distortion: "Gravity Flex", outer: "Shell Size", speed: "Orbital Speed", doppler: "Circuit Radiance" }
    },
    magnetar_1806: {
        name: "SGR 1806-20 Magnetar",
        class: "EXTREME MAGNETAR",
        sector: "SECTOR 18-F",
        coords: "X: -7.00 / Y: -5.00 / Z: 2.00",
        mass: "2.1 M☉",
        rad: "MAGNETIC FIELD BURST",
        desc: "An ultradense magnetosphere generator. The strongest magnetic field observed in the universe, distorting the surrounding space and emitting violent gamma-ray flares.",
        shader: "shaders/pulsar.frag",
        position: new THREE.Vector3(-7, -5, 2),
        presets: {
            "magnetar-burst": { rs: 0.8, distortion: 2.5, outer: 16.0, speed: 4.2, doppler: 2.4, stars: 0.7, theme: 0 },
            "rest-state": { rs: 0.6, distortion: 1.5, outer: 11.0, speed: 1.2, doppler: 1.0, stars: 1.1, theme: 1 }
        },
        themes: [
            { c1: '#ff3300', c2: '#5500ff', name: 'Magnetic Red-Violet', temp: '5.2e8' },
            { c1: '#00ffcc', c2: '#003366', name: 'Hyper-Gamma Cyan', temp: '6.5e8' }
        ],
        labels: { rs: "Core Size (Rs)", distortion: "Magneto-Warp", outer: "Field Boundary", speed: "Spin Frequency", doppler: "Jet Intensity" }
    },
    centauri: {
        name: "Centauri Bridge",
        class: "MICRO WORMHOLE",
        sector: "SECTOR 01-C",
        coords: "X: 4.00 / Y: -3.00 / Z: -2.00",
        mass: "N/A (Microgateway)",
        rad: "QUANTUM INTERCEPT",
        desc: "A small wormhole stabilized by quantum fields. Acts as a high-speed communications gateway linking the Sol system and Centauri cluster.",
        shader: "shaders/wormhole.frag",
        position: new THREE.Vector3(4, -3, -2),
        presets: {
            "micro-link": { rs: 0.5, distortion: 1.2, outer: 7.5, speed: 1.2, doppler: 0.7, stars: 1.3, theme: 0 },
            "quantum-drift": { rs: 0.35, distortion: 2.0, outer: 6.0, speed: 2.2, doppler: 1.5, stars: 1.5, theme: 1 }
        },
        themes: [
            { c1: '#00ffff', c2: '#ea00ff', name: 'Quantum Portal', temp: '0' },
            { c1: '#ffcc00', c2: '#ff3300', name: 'Solaris Gateway', temp: '9' }
        ],
        labels: { rs: "Throat Radius (Rs)", distortion: "Throat Bending", outer: "Lensing Zone", speed: "Chromatic Drift", doppler: "Alternate Lumens" }
    }
};
// ===== State ===== =====
let appState = 'BOOT';
let activeObjectId = 'gargantua';
let activeThemeIdx = 0;
let autoRotate = true;

// ===== Boot Terminal =====
const BOOT_LINES = [
    { text: "> BIOS POST check ... ", cls: "line-dim", delay: 80 },
    { text: "  Memory: 256 TB unified — OK", cls: "line-ok", delay: 50 },
    { text: "  GPU cluster: 8x RTX-ASTRO — OK", cls: "line-ok", delay: 50 },
    { text: "  Photon buffer: 4096 lanes — OK", cls: "line-ok", delay: 40 },
    { text: "", cls: "line-dim", delay: 30 },
    { text: "> Loading kernel ASTRO-NAV/x86_64 ...", cls: "line-info", delay: 120 },
    { text: "  Module: gravitational_lens.ko — loaded", cls: "line-dim", delay: 60 },
    { text: "  Module: schwarzschild_integrator.ko — loaded", cls: "line-dim", delay: 50 },
    { text: "  Module: doppler_beaming.ko — loaded", cls: "line-dim", delay: 50 },
    { text: "  Module: accretion_disk_volumetric.ko — loaded", cls: "line-dim", delay: 40 },
    { text: "  Module: magnetosphere_dipole.ko — loaded", cls: "line-dim", delay: 50 },
    { text: "  Module: wormhole_throat.ko — loaded", cls: "line-dim", delay: 40 },
    { text: "", cls: "line-dim", delay: 20 },
    { text: "> Initializing WebGL2 renderer ...", cls: "line-info", delay: 100 },
    { text: "  Canvas: 1920x1080 @ 2x DPI", cls: "line-dim", delay: 40 },
    { text: "  Shader compiler: GLSL 3.00 ES — ready", cls: "line-ok", delay: 50 },
    { text: "  Fragment shader pipeline: 4 programs queued", cls: "line-dim", delay: 40 },
    { text: "", cls: "line-dim", delay: 20 },
    { text: "> Scanning deep space telemetry feeds ...", cls: "line-info", delay: 100 },
    { text: "  [ANOMALY] Gargantua Singularity  — SEC_04-A — 4.3e6 M☉", cls: "line-warn", delay: 30 },
    { text: "  [ANOMALY] Vela Pulsar             — SEC_12-C — 1.44 M☉", cls: "line-warn", delay: 30 },
    { text: "  [ANOMALY] Cygnus Wormhole          — SEC_07-F — exotic", cls: "line-warn", delay: 30 },
    { text: "  [ANOMALY] Kepler Dyson Sphere      — SEC_19-B — megastruct", cls: "line-warn", delay: 30 },
    { text: "  [ANOMALY] Sagittarius A*          — SEC_00-C — 4.15e6 M☉", cls: "line-warn", delay: 30 },
    { text: "  [ANOMALY] Crab Pulsar             — SEC_05-B — 1.40 M☉", cls: "line-warn", delay: 30 },
    { text: "  [ANOMALY] Andromeda Gateway       — SEC_99-Z — bridge", cls: "line-warn", delay: 30 },
    { text: "  [ANOMALY] Solara Dyson Swarm      — SEC_15-D — megastruct", cls: "line-warn", delay: 30 },
    { text: "  [ANOMALY] Polaris Singularity     — SEC_02-B — 1.2e5 M☉", cls: "line-warn", delay: 30 },
    { text: "  [ANOMALY] Aldebaran Bulge         — SEC_08-A — active core", cls: "line-warn", delay: 30 },
    { text: "  [ANOMALY] SGR 1806-20 Magnetar    — SEC_18-F — extreme", cls: "line-warn", delay: 30 },
    { text: "  [ANOMALY] Centauri Bridge         — SEC_01-C — quantum", cls: "line-warn", delay: 30 },
    { text: "  Total anomalies registered: 12", cls: "line-dim", delay: 40 },
    { text: "", cls: "line-dim", delay: 20 },
    { text: "> Building galaxy particle field (10000 stars) ...", cls: "line-info", delay: 100 },
    { text: "  Spiral arm algorithm: 2-arm log-distribution", cls: "line-dim", delay: 50 },
    { text: "  Star texture: 16x16 radial gradient — cached", cls: "line-dim", delay: 40 },
    { text: "", cls: "line-dim", delay: 20 },
    { text: "> Calibrating OrbitControls ...", cls: "line-info", delay: 80 },
    { text: "  Damping: 0.05 | FOV: 45° | Range: 3–50 AU", cls: "line-dim", delay: 40 },
    { text: "", cls: "line-dim", delay: 20 },
    { text: "> Running diagnostics ...", cls: "line-info", delay: 100 },
    { text: "  Framebuffer integrity — PASS", cls: "line-ok", delay: 50 },
    { text: "  Depth buffer precision — PASS", cls: "line-ok", delay: 40 },
    { text: "  Raymarching pipeline — PASS", cls: "line-ok", delay: 50 },
    { text: "  Tone mapping (Reinhard) — PASS", cls: "line-ok", delay: 40 },
    { text: "", cls: "line-dim", delay: 30 },
    { text: "> ALL SYSTEMS NOMINAL", cls: "line-ok", delay: 120 },
    { text: "  Star chart ready for navigation.", cls: "line-info", delay: 80 },
];

function bootClock() {
    const el = document.getElementById('boot-clock');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toISOString().slice(11, 19) + ' UTC';
}

async function runBootSequence() {
    const terminal = document.getElementById('boot-terminal');
    const progressWrap = document.getElementById('boot-progress-wrap');
    const progressBar = document.getElementById('boot-progress-bar');
    const progressPct = document.getElementById('boot-progress-pct');
    const enterWrap = document.getElementById('boot-enter-wrap');

    bootClock();
    const clockInterval = setInterval(bootClock, 1000);

    const total = BOOT_LINES.length;
    // phase 1: print lines
    for (let i = 0; i < total; i++) {
        const { text, cls, delay } = BOOT_LINES[i];
        const div = document.createElement('div');
        div.className = `line ${cls}`;
        div.textContent = text;
        terminal.appendChild(div);
        terminal.scrollTop = terminal.scrollHeight;

        // update progress
        if (i === 3) {
            progressWrap.classList.remove('boot-hidden');
        }
        const pct = Math.min(100, Math.round(((i + 1) / total) * 100));
        progressBar.style.setProperty('--pct', pct + '%');
        progressPct.textContent = pct + '%';

        await sleep(delay);
    }

    await sleep(300);
    // show enter button
    enterWrap.classList.remove('boot-hidden');
    enterWrap.style.animation = 'fadeIn 0.4s forwards';

    // wait for click or Enter key
    await new Promise(resolve => {
        const btn = document.getElementById('boot-enter-btn');
        const handler = () => {
            btn.removeEventListener('click', handler);
            document.removeEventListener('keydown', keyHandler);
            resolve();
        };
        const keyHandler = (e) => { if (e.key === 'Enter') handler(); };
        btn.addEventListener('click', handler);
        document.addEventListener('keydown', keyHandler);
    });

    clearInterval(clockInterval);

    // fade out boot screen
    const bootScreen = document.getElementById('boot-screen');
    bootScreen.classList.add('boot-exit');

    await sleep(800);
    bootScreen.style.display = 'none';

    // reveal main app
    const appContainer = document.getElementById('app-container');
    appContainer.classList.remove('app-hidden');
    appContainer.style.animation = 'fadeIn 0.5s forwards';

    appState = 'GALAXY';
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// ===== DOM refs =====
let sidebar, infoCard, btnBack, btnOrbit, btnAutopilot, btnHelp;

// ===== Sliders =====
const sliderIds = ['rs', 'distortion', 'outer', 'speed', 'doppler', 'stars'];
let sliders = {};
let displays = {};
let hudFps, hudTemp;

// ===== Three.js =====
let renderer, scene, camera, controls, clock;
let orthoCamera, orthoScene, shaderMaterial;
let uniforms = {};
let galaxyParticles, galaxyDust, systemNodes = [];
let raycaster, mouse;
let targetCameraPos = new THREE.Vector3();
let targetLookAt = new THREE.Vector3();
let currentLookAt = new THREE.Vector3();
let transitionProgress = 1.0;

function createStarTexture() {
    const c = document.createElement('canvas');
    c.width = 16; c.height = 16;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.85)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 16, 16);
    return new THREE.CanvasTexture(c);
}

function createNodeTexture(hex) {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    const ctx = c.getContext('2d');
    
    ctx.clearRect(0, 0, 128, 128);
    ctx.shadowColor = hex;
    ctx.shadowBlur = 10;
    
    ctx.strokeStyle = hex;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const x = 64 + 48 * Math.cos(angle);
        const y = 64 + 48 * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(64, 24); ctx.lineTo(64, 40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(64, 104); ctx.lineTo(64, 88); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(24, 64); ctx.lineTo(40, 64); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(104, 64); ctx.lineTo(88, 64); ctx.stroke();
    
    const gradient = ctx.createRadialGradient(64, 64, 2, 64, 64, 20);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.4, hex);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(64, 64, 20, 0, Math.PI * 2);
    ctx.fill();
    
    return new THREE.CanvasTexture(c);
}

function createNebulaTexture() {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1.0)');
    g.addColorStop(0.15, 'rgba(255,255,255,0.6)');
    g.addColorStop(0.45, 'rgba(255,255,255,0.18)');
    g.addColorStop(1, 'rgba(255,255,255,0.0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
}

function createCoreGlowTexture() {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255, 235, 200, 1.0)');
    g.addColorStop(0.2, 'rgba(255, 180, 100, 0.65)');
    g.addColorStop(0.5, 'rgba(255, 100, 50, 0.2)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
}

async function initApp() {
    // cache dom
    sidebar = document.getElementById('control-sidebar');
    infoCard = document.getElementById('info-card');
    btnBack = document.getElementById('btn-back-to-galaxy');
    btnOrbit = document.getElementById('btn-enter-orbit');
    btnAutopilot = document.getElementById('btn-camera');
    btnHelp = document.getElementById('btn-help');
    hudFps = document.getElementById('hud-fps');
    hudTemp = document.getElementById('hud-temp');

    for (const k of sliderIds) {
        sliders[k] = document.getElementById('slider-' + k);
        displays[k] = document.getElementById('val-' + k);
    }

    // renderer
    const glCanvas = document.getElementById('webgl-canvas');
    renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene = new THREE.Scene();
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 20, 45);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 80.0;
    controls.minDistance = 3.0;

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    buildGalaxyMap();

    // ortho scene for shaders
    orthoScene = new THREE.Scene();
    orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

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

    setupUIEvents();
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);

    let lastTime = 0, frames = 0;

    function loop(time) {
        requestAnimationFrame(loop);
        frames++;
        if (time > lastTime + 1000) {
            if (hudFps) hudFps.textContent = Math.round((frames * 1000) / (time - lastTime));
            frames = 0;
            lastTime = time;
        }

        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        if (transitionProgress < 1.0) {
            transitionProgress += delta * 1.5;
            if (transitionProgress >= 1.0) {
                transitionProgress = 1.0;
                onTransitionComplete();
            } else {
                const t = Math.sin(transitionProgress * Math.PI / 2.0);
                camera.position.lerpVectors(camera.position, targetCameraPos, t * 0.1);
                currentLookAt.lerpVectors(currentLookAt, targetLookAt, t * 0.1);
                controls.target.copy(currentLookAt);
            }
        }

        if (appState === 'GALAXY' || appState === 'TRANSITION') {
            if (galaxyParticles) galaxyParticles.rotation.y = elapsed * 0.03;
            if (galaxyDust) galaxyDust.rotation.y = elapsed * 0.03;

            systemNodes.forEach(node => {
                const pulse = 1.8 + 0.15 * Math.sin(elapsed * 4.0 + node.position.x);
                node.scale.set(pulse, pulse, 1.0);
            });

            if (autoRotate && transitionProgress === 1.0) {
                const mt = elapsed * 0.03;
                const radius = 45.0;
                camera.position.x = radius * Math.cos(mt);
                camera.position.z = radius * Math.sin(mt);
                camera.position.y = 15.0 + 5.0 * Math.sin(mt * 0.5);
                controls.target.set(0, 0, 0);
            }

            controls.update();
            renderer.render(scene, camera);

        } else if (appState === 'ORBIT') {
            if (controls && autoRotate) {
                const mt = elapsed * 0.04;
                camera.position.x = 17.0 * Math.cos(mt);
                camera.position.z = 17.0 * Math.sin(mt);
            }

            controls.update();
            uniforms.uCamPos.value.copy(camera.position);
            uniforms.uInvProjection.value.copy(camera.projectionMatrixInverse);
            uniforms.uCamWorld.value.copy(camera.matrixWorld);
            uniforms.uTime.value = elapsed;
            
            renderer.autoClear = false;
            renderer.clear();
            systemNodes.forEach(n => n.visible = false);
            if (galaxyDust) galaxyDust.visible = false;
            renderer.render(scene, camera);
            
            renderer.render(orthoScene, orthoCamera);
            
            systemNodes.forEach(n => n.visible = true);
            if (galaxyDust) galaxyDust.visible = true;
            renderer.autoClear = true;
        }
    }

    requestAnimationFrame(loop);
}

function buildGalaxyMap() {
    // 1. Distant background starfield
    const bgCount = 6000;
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = new Float32Array(bgCount * 3);
    const bgCol = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) {
        const r = 85.0 + Math.random() * 45.0;
        const u = Math.random() * 2.0 - 1.0;
        const phi = Math.random() * Math.PI * 2.0;
        const theta = Math.acos(u);
        
        bgPos[i * 3]     = r * Math.sin(theta) * Math.cos(phi);
        bgPos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        bgPos[i * 3 + 2] = r * Math.cos(theta);
        
        const brightness = 0.4 + Math.random() * 0.6;
        bgCol[i * 3]     = brightness;
        bgCol[i * 3 + 1] = brightness * (0.9 + Math.random() * 0.1);
        bgCol[i * 3 + 2] = brightness * (0.8 + Math.random() * 0.2);
    }
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    bgGeo.setAttribute('color', new THREE.BufferAttribute(bgCol, 3));
    const bgMat = new THREE.PointsMaterial({
        size: 0.09,
        map: createStarTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const bgStars = new THREE.Points(bgGeo, bgMat);
    scene.add(bgStars);

    // 2. Bright stars of the galaxy (40000 particles)
    const count = 40000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const cCore = new THREE.Color('#ffe199');
    const cArm = new THREE.Color('#4d66ff');
    const cEdge = new THREE.Color('#03011c');

    for (let i = 0; i < count; i++) {
        const r = Math.pow(Math.random(), 2.3) * 24.0;
        const armIdx = i % 2;
        const theta = (armIdx * Math.PI) + (r * 0.45);
        const sx = (Math.random() - 0.5) * (1.8 / (r * 0.1 + 0.5));
        const sy = (Math.random() - 0.5) * (1.2 / (r * 0.15 + 0.5));
        const sz = (Math.random() - 0.5) * (1.8 / (r * 0.1 + 0.5));

        pos[i * 3]     = r * Math.cos(theta) + sx;
        pos[i * 3 + 1] = sy;
        pos[i * 3 + 2] = r * Math.sin(theta) + sz;

        let mc;
        if (r < 3.0) mc = cCore.clone().lerp(cArm, r / 3.0);
        else mc = cArm.clone().lerp(cEdge, (r - 3.0) / 13.0);

        col[i * 3]     = mc.r;
        col[i * 3 + 1] = mc.g;
        col[i * 3 + 2] = mc.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
        size: 0.14,
        map: createStarTexture(),
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    galaxyParticles = new THREE.Points(geo, mat);
    scene.add(galaxyParticles);

    // 3. Volumetric dust/nebula clouds (15000 particles)
    const dustCount = 15000;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustCol = new Float32Array(dustCount * 3);
    
    const colorArmA = new THREE.Color('#38bdf8');
    const colorArmB = new THREE.Color('#ea00ff');
    const colorCoreGlow = new THREE.Color('#f0a030');
    
    for (let i = 0; i < dustCount; i++) {
        const r = Math.pow(Math.random(), 1.8) * 24.0;
        const armIdx = i % 2;
        const theta = (armIdx * Math.PI) + (r * 0.45) + (Math.random() - 0.5) * 0.22;
        
        const sx = (Math.random() - 0.5) * (3.3 / (r * 0.1 + 0.5));
        const sy = (Math.random() - 0.5) * (1.8 / (r * 0.15 + 0.5));
        const sz = (Math.random() - 0.5) * (3.3 / (r * 0.1 + 0.5));
        
        dustPos[i * 3]     = r * Math.cos(theta) + sx;
        dustPos[i * 3 + 1] = sy;
        dustPos[i * 3 + 2] = r * Math.sin(theta) + sz;
        
        let c;
        if (r < 3.0) {
            c = colorCoreGlow.clone().lerp(colorArmB, r / 3.0);
        } else {
            c = (armIdx === 0) 
                ? colorArmB.clone().lerp(colorArmA, (r - 3.0) / 13.0)
                : colorArmA.clone().lerp(new THREE.Color('#050228'), (r - 3.0) / 13.0);
        }
        
        dustCol[i * 3]     = c.r;
        dustCol[i * 3 + 1] = c.g;
        dustCol[i * 3 + 2] = c.b;
    }
    
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustCol, 3));
    
    const dustMat = new THREE.PointsMaterial({
        size: 2.0,
        map: createNebulaTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    galaxyDust = new THREE.Points(dustGeo, dustMat);
    scene.add(galaxyDust);

    // 4. Central core bulge glow
    const coreSpriteMat = new THREE.SpriteMaterial({
        map: createCoreGlowTexture(),
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const coreSprite = new THREE.Sprite(coreSpriteMat);
    coreSprite.scale.set(7.0, 7.0, 1.0);
    scene.add(coreSprite);

    // 5. System Nodes (rendered as sprites, facing camera)
    const nodeColors = {
        gargantua: '#f0a030',
        vela: '#00ffff',
        cygnus: '#ff00ff',
        kepler: '#00ff66',
        sgr_a: '#ff4500',
        crab: '#38bdf8',
        andromeda: '#bf55ec',
        dyson_swarm: '#c5eff7',
        polaris: '#48929b',
        aldebaran: '#ff6b6b',
        magnetar_1806: '#d2527f',
        centauri: '#673ab7'
    };

    for (const key in OBJECTS) {
        const obj = OBJECTS[key];
        const spriteMat = new THREE.SpriteMaterial({
            map: createNodeTexture(nodeColors[key] || '#ffffff'),
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(obj.position).multiplyScalar(2.5);
        sprite.scale.set(2.4, 2.4, 1.0);
        sprite.renderOrder = 999;
        sprite.userData = { id: key };
        scene.add(sprite);
        systemNodes.push(sprite);
    }
}

// ===== Raycasting =====
function onMouseMove(e) {
    if (appState !== 'GALAXY' || transitionProgress < 1.0) return;
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(systemNodes);
    if (hits.length > 0) {
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    }
}

function onMouseClick(e) {
    if (appState !== 'GALAXY' || transitionProgress < 1.0) return;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(systemNodes);
    if (hits.length > 0) {
        showInfoCard(hits[0].object.userData.id);
        autoRotate = false;
        if (btnAutopilot) btnAutopilot.classList.remove('active');
    }
}

function showInfoCard(id) {
    const obj = OBJECTS[id];
    if (!obj) return;
    activeObjectId = id;
    document.getElementById('info-sector').textContent = obj.sector;
    document.getElementById('info-title').textContent = obj.name;
    document.getElementById('info-class').textContent = 'CLASS: ' + obj.class;
    document.getElementById('info-coords').textContent = obj.coords;
    document.getElementById('info-mass').textContent = obj.mass;
    document.getElementById('info-rad').textContent = obj.rad;
    document.getElementById('info-desc').textContent = obj.desc;
    infoCard.classList.remove('hidden');
}

// ===== Transitions =====

async function onTransitionComplete() {
    const obj = OBJECTS[activeObjectId];
    if (!obj) return;

    let shaderSrc;
    try {
        const resp = await fetch(obj.shader);
        if (!resp.ok) throw new Error('shader load failed');
        shaderSrc = await resp.text();
    } catch (e) {
        console.error('Cannot fetch shader:', e);
        return;
    }

    const vtx = `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
    `;

    document.getElementById('active-object-name').textContent = obj.name.split(' ')[0];
    document.getElementById('label-rs').innerHTML = obj.labels.rs;
    document.getElementById('label-outer').innerHTML = obj.labels.outer;
    document.getElementById('label-speed').innerHTML = obj.labels.speed;
    document.getElementById('label-doppler').innerHTML = obj.labels.doppler;

    const distG = document.getElementById('group-distortion');
    const dopG = document.getElementById('group-doppler');

    if (activeObjectId === 'kepler' || activeObjectId === 'dyson_swarm' || activeObjectId === 'aldebaran') {
        distG.style.display = 'none';
        dopG.style.display = 'none';
        document.getElementById('accessory-title').innerHTML = '<i class="fas fa-cubes"></i> Panel Grid';
    } else {
        distG.style.display = 'block';
        dopG.style.display = 'block';
        document.getElementById('accessory-title').innerHTML = '<i class="fas fa-circle-notch"></i> Structure';
    }

    // slider bounds
    if (activeObjectId === 'vela' || activeObjectId === 'crab' || activeObjectId === 'magnetar_1806') {
        sliders.rs.min = 0.2; sliders.rs.max = 1.6; sliders.rs.step = 0.05;
        sliders.outer.min = 6.0; sliders.outer.max = 20.0; sliders.outer.step = 0.2;
    } else if (activeObjectId === 'cygnus' || activeObjectId === 'andromeda' || activeObjectId === 'centauri') {
        sliders.rs.min = 0.3; sliders.rs.max = 1.8; sliders.rs.step = 0.05;
        sliders.outer.min = 6.0; sliders.outer.max = 15.0; sliders.outer.step = 0.1;
    } else if (activeObjectId === 'kepler' || activeObjectId === 'dyson_swarm' || activeObjectId === 'aldebaran') {
        sliders.rs.min = 0.4; sliders.rs.max = 2.0; sliders.rs.step = 0.05;
        sliders.outer.min = 2.0; sliders.outer.max = 5.0; sliders.outer.step = 0.1;
    } else {
        sliders.rs.min = 0.2; sliders.rs.max = 2.2; sliders.rs.step = 0.05;
        sliders.outer.min = 4.0; sliders.outer.max = 15.0; sliders.outer.step = 0.1;
    }

    populatePresetsGrid(obj);
    populateThemesPicker(obj);
    applyPresetConfig(obj, Object.keys(obj.presets)[0]);

    shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vtx,
        fragmentShader: shaderSrc,
        uniforms: uniforms,
        depthWrite: false,
        depthTest: false,
        transparent: true,
        glslVersion: THREE.GLSL3
    });

    orthoScene.clear();
    orthoScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

    camera.position.set(0, 5, 17);
    controls.target.set(0, 0, 0);
    controls.maxDistance = 35.0;
    controls.minDistance = 3.5;
    autoRotate = true;
    btnAutopilot.classList.add('active');

    appState = 'ORBIT';
    sidebar.classList.remove('collapsed');
    btnBack.classList.remove('hidden');
}

// back to galaxy
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-back-to-galaxy').addEventListener('click', () => {
        sidebar.classList.add('collapsed');
        btnBack.classList.add('hidden');

        setTimeout(() => {
            appState = 'GALAXY';
            camera.position.set(0, 20, 45);
            controls.target.set(0, 0, 0);
            controls.maxDistance = 80.0;
            controls.minDistance = 6.0;
            autoRotate = true;
            btnAutopilot.classList.remove('active');
        }, 500);
    });

    // help / guide
    document.getElementById('btn-help').addEventListener('click', () => {
        document.getElementById('guide-overlay').classList.remove('guide-hidden');
    });
    document.getElementById('guide-close').addEventListener('click', () => {
        document.getElementById('guide-overlay').classList.add('guide-hidden');
    });
});

function populatePresetsGrid(obj) {
    const grid = document.getElementById('preset-container');
    grid.innerHTML = '';
    let first = true;
    for (const pk in obj.presets) {
        const btn = document.createElement('button');
        btn.className = 'preset-btn' + (first ? ' active' : '');
        btn.textContent = pk.replace(/-/g, ' ');
        btn.addEventListener('click', () => {
            grid.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyPresetConfig(obj, pk);
        });
        grid.appendChild(btn);
        first = false;
    }
}

function populateThemesPicker(obj) {
    const picker = document.getElementById('color-theme-picker');
    picker.innerHTML = '';
    obj.themes.forEach((t, i) => {
        const btn = document.createElement('button');
        btn.className = 'theme-btn' + (i === 0 ? ' active' : '');
        btn.style.background = `linear-gradient(135deg, ${t.c1}, ${t.c2})`;
        btn.title = t.name;
        btn.addEventListener('click', () => {
            picker.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateColorTheme(obj, i);
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        });
        picker.appendChild(btn);
    });
    updateColorTheme(obj, 0);
}

function applyPresetConfig(obj, key) {
    const cfg = obj.presets[key];
    if (!cfg) return;
    sliders.rs.value = cfg.rs;
    sliders.distortion.value = cfg.distortion;
    sliders.outer.value = cfg.outer;
    sliders.speed.value = cfg.speed;
    sliders.doppler.value = cfg.doppler;
    sliders.stars.value = cfg.stars;
    updateColorTheme(obj, cfg.theme);
    document.querySelectorAll('.theme-btn').forEach((b, i) => b.classList.toggle('active', i === cfg.theme));
    syncUI();
}

function updateColorTheme(obj, idx) {
    activeThemeIdx = idx;
    const theme = obj.themes[idx];
    uniforms.uColorTheme1.value.set(theme.c1);
    uniforms.uColorTheme2.value.set(theme.c2);
    if (hudTemp) hudTemp.textContent = theme.temp;
}

function syncUI() {
    for (const k of sliderIds) {
        if (displays[k] && sliders[k]) displays[k].textContent = parseFloat(sliders[k].value).toFixed(2);
    }

    const rs = parseFloat(sliders.rs.value);

    if (activeObjectId === 'kepler' || activeObjectId === 'dyson_swarm' || activeObjectId === 'aldebaran') {
        sliders.outer.min = (rs * 1.6).toFixed(2);
        if (parseFloat(sliders.outer.value) < rs * 1.6) {
            sliders.outer.value = (rs * 1.6).toFixed(2);
            displays.outer.textContent = (rs * 1.6).toFixed(2);
        }
        uniforms.uRs.value = rs;
        uniforms.uInnerRadius.value = rs * 0.9;
        uniforms.uOuterRadius.value = parseFloat(sliders.outer.value);
    } else {
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

    // slider fill
    for (const k of sliderIds) {
        if (!sliders[k]) continue;
        const s = sliders[k];
        const pct = ((s.value - s.min) / (s.max - s.min)) * 100;
        s.style.background = `linear-gradient(90deg, var(--accent) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
    }
}

function setupUIEvents() {
    for (const k of sliderIds) {
        if (!sliders[k]) continue;
        sliders[k].addEventListener('input', () => {
            syncUI();
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        });
    }

    if (btnAutopilot) {
        btnAutopilot.addEventListener('click', () => {
            autoRotate = !autoRotate;
            btnAutopilot.classList.toggle('active', autoRotate);
        });
    }

    controls.addEventListener('start', () => {
        autoRotate = false;
        if (btnAutopilot) btnAutopilot.classList.remove('active');
    });

    const btnEnter = document.getElementById('btn-enter-orbit');
    if (btnEnter) {
        btnEnter.addEventListener('click', () => {
            const obj = OBJECTS[activeObjectId];
            if (!obj) return;
            appState = 'TRANSITION';
            transitionProgress = 0.0;
            targetCameraPos.copy(obj.position).multiplyScalar(2.5).add(new THREE.Vector3(0, 3, 7));
            targetLookAt.copy(obj.position).multiplyScalar(2.5);
            currentLookAt.copy(controls.target);
            infoCard.classList.add('hidden');
            autoRotate = false;
            if (btnAutopilot) btnAutopilot.classList.remove('active');
        });
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// ===== Entry Point =====
window.onload = async function() {
    await runBootSequence();
    await initApp();
};
