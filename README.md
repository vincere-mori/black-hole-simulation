# Relativistic Black Hole Simulator

An interactive, real-time relativistic black hole simulation featuring gravitational lensing, a Keplerian accretion disk with Doppler beaming, and a lensed starfield/nebula background. This repository includes two implementations of the simulation sharing the same GLSL fragment shader:
1. **Python Desktop App**: Built using `ModernGL` and `Pygame` for local high-performance hardware-accelerated rendering.
2. **Web Application**: Built using `Three.js` (WebGL2) with a modern glassmorphic control panel, hosted live via GitHub Pages.

---

## Technical & Physical Details

The simulation uses raymarching inside a custom GLSL fragment shader to integrate light rays moving through curved spacetime around a non-rotating (Schwarzschild) black hole.

### Gravitational Lensing (Schwarzschild Geodesics)

Rather than travelling in straight lines, photon trajectories are bent by the gravity of the singularity. The geodesic equation for a photon is integrated step-by-step using an adaptive Euler integrator:

$$\vec{a} = -\frac{1.5 \cdot R_s \cdot |\vec{L}|^2}{r^5} \vec{p}$$

Where:
* $R_s$ is the Schwarzschild radius (event horizon scale).
* $\vec{p}$ is the current position vector of the photon relative to the singularity.
* $\vec{L} = \vec{p} \times \vec{v}$ is the angular momentum of the ray (cross product of position and direction).
* $\vec{a}$ is the resulting acceleration vector pulling the light ray toward the center.

An adaptive step size is calculated dynamically based on distance to prevent numerical instabilities near the event horizon:

$$\text{stepSize} = \text{clamp}(r \cdot 0.065, 0.012, 0.28)$$

### Accretion Disk & Relativistic Doppler Beaming

The accretion disk is modeled in the equatorial plane ($y=0$) and shaded using a multi-octave domain-warped Fractal Brownian Motion (FBM) noise function to create fluid-like dust lanes. 

To simulate relativistic effects, the disk is subject to **Keplerian velocity fields** ($\beta = v/c \propto \sqrt{R_s/r}$). Matter moving towards the camera appears brighter and blue-shifted (Doppler beaming), while matter moving away is dimmer and red-shifted.

The Doppler factor is defined as:

$$D = \frac{1}{\gamma(1 - \beta \cos\theta)}$$

Where $\gamma = 1 / \sqrt{1 - \beta^2}$ is the Lorentz factor, and $\theta$ is the angle between the emitter's velocity and the photon ray. The brightness is modulated by $D^{3 + \text{beaming}}$, and the color spectrum is shifted dynamically.

---

## 1. Web Version (GitHub Pages)

The web version runs fully in any modern web browser supporting WebGL2. It includes a glassmorphic sidebar panel with preset configurations, sliders to modify physics parameters in real-time, and color scheme selectors.

### Local Running

Due to browser CORS security policies, fetching the local `shader.frag` file requires running a simple web server rather than opening `index.html` directly from your file explorer.

Run one of the following commands in the project directory:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

Then, navigate to `http://localhost:8000` (or the port specified by the server).

---

## 2. Python Version (ModernGL + Pygame)

The desktop version runs the exact same GLSL shader directly on your GPU using `ModernGL` for OpenGL context wrapping and `Pygame` for window management and inputs.

### Setup and Requirements

Ensure you have Python 3.8+ installed. Install the dependencies using:

```bash
pip install -r requirements.txt
```

### Running the App

```bash
python main.py
```

---

## Interactive Controls

### Navigation (Both Versions)
* **Left Click + Drag**: Orbit/rotate camera.
* **Scroll Wheel / Touch pinch**: Zoom camera in and out.

### Python Controls
* **SPACE**: Toggle camera auto-orbit.
* **Q / A**: Increase / Decrease Event Horizon Mass ($R_s$).
* **W / S**: Increase / Decrease Disk Spin Speed.
* **E / D**: Increase / Decrease Relativistic Doppler Beaming.
* **R / F**: Increase / Decrease Gravitational Lensing Distortion.
* **T**: Cycle through Color Themes.
* **ESC**: Exit application.

### Web Controls
* Use the sliders, color pickers, and action buttons in the translucent sidebar panel.
* Select one of the presets (**Gargantua**, **Nebula Quasar**, **Quantum Micro**, **Supermassive Void**) for instant structural transformations.
