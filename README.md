# Stellar Cartography — Interactive Cosmic Map Explorer

An interactive 3D Cosmic Map and real-time relativistic anomaly simulator featuring high-performance physics-based shaders. The project includes:
1. **Interactive 3D Galaxy Map (Web)**: A rotating spiral galaxy of 10,000 stars built using `Three.js` (WebGL). It lets you locate, hover, and select major cosmic anomalies. Selecting a node triggers a smooth camera zoom animation and opens a dedicated simulator.
2. **Volumetric Relativistic Simulations**: Four custom-built GLSL fragment shaders (run either locally on desktop or via browser) representing:
   * **Schwarzschild Black Hole**: Gravitational lensing geodesic raymarching with 3D volumetric thickness, Doppler beaming, and gravitational redshift.
   * **Vela Pulsar**: A precessing, fast-spinning neutron star emitting conical relativistic jets and a dipole magnetosphere grid.
   * **Cygnus Wormhole**: Morris-Thorne Einstein-Rosen bridge coordinate inversion that lets you look straight through a spherical throat to see an alternate universe background.
   * **Kepler Dyson Megastructure**: Orbiting geometric panel shields surrounding a star, exposing dynamic solar flares and core temperatures through panel gaps.
3. **Python Desktop App**: Run any of the four shaders locally in a Pygame window powered by PyOpenGL hardware acceleration.

---

## Simulated Objects & Physics Math

### 1. Schwarzschild Black Hole (`shaders/black-hole.frag`)

Bends incoming light rays from background stars based on Schwarzschild spacetime geodesics:

$$\vec{a} = -\frac{1.5 \cdot R_s \cdot |\vec{L}|^2}{r^5} \vec{p}$$

Features a true 3D volumetric accretion disk calculated inside a vertical Gaussian density envelope:

$$\text{Density}_{\text{vol}} = \text{FBM}(r, \theta) \cdot \exp\left(-\frac{y^2}{d^2}\right)$$

And shifts frequencies due to both Keplerian orbital speeds (Doppler Beaming) and gravity well energy loss (Gravitational Redshift):

$$D = \frac{1}{\gamma(1 - \beta \cos\theta)}, \quad z_g = \frac{1}{\sqrt{1 - R_s/r}} - 1$$

### 2. Vela Pulsar (`shaders/pulsar.frag`)
A precessing magnetic axis vector $\vec{m}(t)$ creates precessing cones of radiation. When a photon enters the cone ($\cos\alpha > \text{threshold}$), it accumulates high-energy jet glow:

$$\text{JetGlow} \propto \frac{\text{power}(\cos\alpha, N)}{r}$$

Surrounding the star is a dipole magnetosphere grid representing field line equations.

### 3. Cygnus Wormhole (`shaders/wormhole.frag`)
Models a Morris-Thorne wormhole throat transition. When a ray reaches throat radius $r < R_s$, the space coordinate is inverted:

$$\vec{p}_{\text{new}} = -\vec{p} \cdot 1.01$$

The ray emerges on the opposite side of the throat and continues its trajectory inside an **alternate universe** sampling a different colored nebula and starfield.

### 4. Kepler Dyson Sphere (`shaders/dyson-sphere.frag`)
A central star sphere surrounded by a larger spherical shell. A rotating sin-cos grid equation partitions the shell into geometric panels and structural gaps:

$$\text{Panel} = \text{step}(\text{gap}, \text{fract}(\theta \cdot F)) \cdot \text{step}(\text{gap}, \text{fract}(\phi \cdot F))$$

Rays passing through gaps expose active solar flares on the star core.

---

## Running the Web App Locally

Due to browser security CORS restrictions, loading fragment shaders dynamically requires running a simple web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

Open `http://localhost:8000` in your web browser.

---

## Running the Python Desktop App

Ensure you have Python 3.8+ and run:

```bash
pip install -r requirements.txt
python main.py
```

### Desktop Bindings
* **`1` / `2` / `3` / `4`**: Swap active object (Black Hole, Pulsar, Wormhole, Dyson Sphere).
* **Mouse Drag / Scroll**: Orbit / Zoom camera.
* **SPACE**: Toggle Camera Autopilot.
* **Q / A**: Adjust Horizon/Star Radius ($R_s$).
* **W / S**: Adjust Spin/Orbital Speed.
* **E / D**: Adjust Glow/Circuit Brightness.
* **R / F**: Adjust Lensing/Warp strength.
* **T**: Cycle through Theme color palettes.
* **ESC**: Close application.
