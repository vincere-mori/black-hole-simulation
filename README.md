# 🌌 Stellar Cartography

An interactive 3D Cosmic Map and real-time relativistic anomaly simulator. Explore intermediate and supermassive black holes, pulsars, wormholes, and megastructures directly in your browser or via a desktop application.

* Live Web Application: [https://vincere-mori.github.io/stellar-cartography/](https://vincere-mori.github.io/stellar-cartography/)
* Desktop Version: Powered by Python + PyOpenGL (real-time GLSL shader compilation)

---

## 🌟 Catalog of Anomalies

The map features 12 unique celestial objects, each located at specific galactic coordinates:

| Key | Name | Classification | Coordinates | Core Characteristics |
|---|---|---|---|---|
| **1** | **Gargantua Singularity** | Schwarzschild Black Hole | X: -3.50, Y: 0.80, Z: -2.00 | Volumetric accretion disk, Keplerian velocity, Doppler lensing |
| **2** | **Vela Pulsar** | Rotating Neutron Star | X: 5.00, Y: 1.00, Z: -4.00 | Conical relativistic radio jets, precessing magnetic dipole field |
| **3** | **Cygnus Wormhole** | Morris-Thorne Bridge | X: -6.00, Y: -1.00, Z: 5.00 | Spacetime bridge, throat inversion to an alternate universe |
| **4** | **Kepler Dyson Sphere** | Stellar Megastructure | X: 3.00, Y: -2.00, Z: 7.00 | Swarm of geometric solar panels, stellar flares, silhouettes |
| **5** | **Sagittarius A*** | Supermassive Black Hole | X: 0.00, Y: 0.00, Z: 0.00 | Milky Way galactic core, extreme redshift, active plasma flow |
| **6** | **Crab Pulsar** | High-Spin Neutron Star | X: -8.00, Y: 3.00, Z: -6.00 | Young pulsar, ultra-rapid rotation, Chandra X-ray pink theme |
| **7** | **Andromeda Gateway** | Intergalactic Wormhole | X: 8.00, Y: -3.00, Z: -8.00 | Massive gateway bridge leading to the Andromeda galaxy |
| **8** | **Solara Dyson Swarm** | Dense Megastructure | X: -2.00, Y: -4.00, Z: -5.00 | Solar energy collector plates with escaping coronal glare |
| **9** | **Polaris Singularity** | Intermediate Black Hole | X: 1.00, Y: 6.00, Z: -7.00 | High-spin intermediate singularity, ultraviolet accretion disk |
| **10** | **Aldebaran Bulge** | Stellar Core Flare | X: -4.00, Y: 5.00, Z: 3.00 | Hyperactive red giant star core, violent flares, magnetic clouds |
| **11** | **SGR 1806-20 Magnetar** | Extreme Magnetar | X: -7.00, Y: -5.00, Z: 2.00 | Strongest magnetic field observed, precessing gamma-ray jets |
| **12** | **Centauri Bridge** | Micro Wormhole | X: 4.00, Y: -3.00, Z: -2.00 | Quantum-stabilized micro-throat connecting Sol and Centauri |

---

## 🔬 Physics & Mathematics

The simulations run directly on the GPU using high-performance GLSL fragment shaders. The underlying physics models include:

### Gravitational Spacetime Bending
Light rays near black holes and wormholes are bent using Schwarzschild geodesics integrated step-by-step during raymarching:

`a = -1.5 * Rs * |L|² / (r⁵) * p`

* **p**: Photon position vector
* **a**: Bending acceleration vector
* **Rs**: Schwarzschild horizon radius
* **L**: Angular momentum vector (`L = p × v`)

### Volumetric Accretion Disk
Accretion disks are rendered as 3D participating media with density mapped inside a vertical Gaussian envelope:

`Density = Noise(r, θ) * exp(-y² / thickness²)`

This produces realistic gas silhouettes from edge-on camera angles rather than flat 2D planes.

### Relativistic Doppler Beaming & Redshift
* **Doppler Shift**: Relativistic beaming shifts the color and brightness of the accretion disk depending on whether gas is moving towards or away from the camera:
  `D = 1 / (γ * (1 - β * cos(θ)))`
* **Gravitational Redshift**: Light escaping from the gravity well shifts towards dark red/infrared near the event horizon:
  `z = 1 / sqrt(1 - Rs / r) - 1`

### Morris-Thorne Throat Crossing
When a ray penetrates the wormhole throat boundary (`r < Rs`), coordinates are inverted:

`p_new = -p * 1.01`

The ray emerges in another coordinate space, sampling an alternate starfield background.

---

## 💻 Running the Application

### 1. Web Version (Local Development)
Because browser security policies (CORS) restrict loading shader files directly from local storage, serve the directory using any local server:

```bash
# Option A: Python (installed by default on most systems)
python -m http.server 8080

# Option B: Node.js / npm
npx serve .
```

Then open `http://localhost:8080` in your web browser.

### 2. Desktop Version
Run the simulation locally on your desktop using hardware-accelerated OpenGL:

```bash
# Install dependencies
pip install -r requirements.txt

# Run the app
python main.py
```

#### Keyboard & Mouse Controls (Desktop)

| Control | Action |
|---|---|
| **Mouse Drag** | Rotate / Orbit Camera |
| **Mouse Scroll** | Zoom Camera In / Out |
| **SPACE** | Toggle Camera Autopilot |
| **1 – 9** | Switch to Gargantua, Vela, Cygnus, Kepler, Sgr A*, Crab, Andromeda, Solara, Polaris |
| **0, -, =** | Switch to Aldebaran, SGR 1806-20, Centauri Bridge |
| **Q / A** | Increase / Decrease Schwarzschild Radius (Rs) |
| **W / S** | Increase / Decrease Spin / Orbital Speed |
| **E / D** | Increase / Decrease Jet Glow / Telemetry Intensity |
| **R / F** | Increase / Decrease Spacetime Lensing Warp |
| **T** | Swap Theme Color Palette |
| **ESC** | Close Desktop Window |
