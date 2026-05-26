<div align="right">
  <a href="README.md">🇷🇺 Русский</a>
</div>

<h1 align="center">🌌 Stellar Cartography</h1>

<p align="center">
  <em>A meditative space explorer right in your browser. No servers, no noise — just volumetric raymarching, particles, and the laws of astrophysics.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/WebGL2-GLSL_3.00-e8943a?style=flat-square&logo=opengl" alt="WebGL2"/>
  <img src="https://img.shields.io/badge/Three.js-r128-black?style=flat-square&logo=threedotjs" alt="Three.js"/>
  <img src="https://img.shields.io/badge/JavaScript-ES2022-f7df1e?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/GLSL-raymarching-38bdf8?style=flat-square" alt="GLSL"/>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT"/>
</p>

<p align="center">
  <a href="https://vincere-mori.github.io/stellar-cartography/">
    <img src="https://img.shields.io/badge/▶%20Open%20Interactive%20Map-vincere--mori.github.io-e8943a?style=for-the-badge" alt="Live Demo"/>
  </a>
</p>

---

<p align="center">
  <img src="./assets/demo-galaxy.gif" alt="Galaxy Map — 3D navigation" width="100%"/>
</p>

<p align="center">
  <img src="./assets/demo-blackhole.gif" alt="Black Hole Orbit" width="49%"/>
  <img src="./assets/demo-boot.gif" alt="JARVIS Boot Sequence" width="49%"/>
</p>

---

### Why did I build this?

This project started from a simple desire to build an interactive digital canvas that is just beautiful to look at. There are no game loops, high scores, or time limits here. It is a living cosmic simulation.

You can watch stellar gas spiral into the event horizon of a supermassive black hole, peer through the warped throat of a wormhole into another universe, or study the complex geometry of a Dyson sphere.

Everything runs locally on your GPU. No heavy bundlers, no backend — just vanilla JavaScript, Three.js, and raw physics computed inside GLSL fragment shaders.

---

### Key Features

* **Volumetric Raymarching** — all major celestial anomalies are rendered on the GPU using a custom raymarching loop (60–80 steps per ray).
* **3D Nebulae** — realistic gas and dust clouds (Orion M42, the Crab Nebula, and the Horsehead silhouette) with complex color gradients, without using any flat sprites.
* **Black Hole (Sagittarius A\*)** — realistic gravitational lensing computed on-the-fly using the Schwarzschild metric, complete with relativistic Doppler beaming (frequency and brightness shifting of the gas).
* **Traversable Wormhole** — a Morris-Thorne bridge. As you approach the throat, space coordinates invert, seamlessly transitioning you into an alternate universe with its own custom starfield.
* **Dyson Sphere (Kepler)** — a futuristic swarm of solar panel collectors orbiting a host star with glowing circuit patterns and light filtering through the gaps.
* **Milky Way Map** — 55,000 particles mapped along spiral arms, a dense central bulge, and dust clouds.
* **Terminal Experience** — a retro sci-fi boot sequence inspired by onboard navigation computer diagnostics.

---

### Anomaly Registry

| # | Anomaly | Class | Sector | Highlight |
|:-:|:---|:---|:---:|:---|
| 1 | **Sagittarius A\*** | Supermassive Black Hole | `00-CORE` | Center of the Milky Way, 4.15 million solar masses |
| 2 | **Orion Nebula M42** | Emission Nebula | `03-O` | A vast stellar nursery located 1,344 light-years away |
| 3 | **Horsehead Nebula** | Dark Nebula (B33) | `03-H` | An iconic dark dust silhouette backlit by IC 434's emission |
| 4 | **Crab Nebula M1** | Supernova Remnant | `12-T` | Aftermath of the 1054 supernova with a central precessing pulsar |
| 5 | **Pleiades M45** | Open Star Cluster | `06-S` | The Seven Sisters wrapped in a delicate reflection nebula |
| 6 | **Cygnus Wormhole** | Einstein-Rosen Bridge | `07-F` | A stable wormhole featuring high-distortion ring lensing |
| 7 | **Kepler Dyson Sphere** | Megastructure | `19-B` | Swarm of geometric panels harvesting the energy of its star |

---

### The Physics

If you want to know how the math works in the shaders:

1. **Light Bending (Gravitational Lensing):** light ray directions are updated at each step of the march using the Schwarzschild geodesic approximation:
   $$\vec{a} = -1.5 \cdot R_s \cdot \frac{|\vec{L}|^2}{r^5} \cdot \vec{p}$$
   Where $\vec{L} = \vec{p} \times \vec{v}$ is the angular momentum, and $R_s$ is the Schwarzschild radius.
   
2. **Accretion Disk Volume:** the gas density is modeled as a 3D torus with a Gaussian vertical decay and domain-warped fractal noise:
   $$\rho(r, y) = \text{WarpedNoise}(r, \theta) \cdot \exp\left(-\frac{y^2}{h^2}\right)$$

3. **Relativistic Beaming:** the brightness of the accretion disk is modulated by the Doppler factor, making the gas moving toward you brighter and blue-shifted, and gas moving away dimmer and red-shifted:
   $$D = \frac{1}{\gamma \cdot (1 - \beta \cos\theta)}$$

4. **Wormhole Transition:** when the ray passes inside the throat ($r < R_s$), the coordinates are inverted:
   $$\vec{p}_{new} = -\vec{p} \cdot 1.01$$

---

### Quick Start

The project is completely self-contained. However, modern browsers block shader imports via the `file://` protocol due to CORS security policies. You will need a simple local server to run it.

```bash
# Clone the repository
git clone https://github.com/vincere-mori/stellar-cartography.git
cd stellar-cartography

# Start a simple python web server
python -m http.server 7821
```

Now open your browser and navigate to: **`http://localhost:7821`**

#### Desktop Standalone Version (OpenGL / Python)
You can also run the project locally as a native window:
```bash
pip install -r requirements.txt
python main.py
```

<details>
<summary>⌨️ Keyboard Controls (Desktop Version)</summary>

| Key | Action |
|---|---|
| `Mouse Drag` | Rotate the camera around the active object |
| `Mouse Scroll` | Zoom in / out |
| `Space` | Toggle autopilot camera orbit |
| `1` – `7` | Select celestial object |
| `Q` / `A` | Adjust anomaly radius ($R_s$) |
| `W` / `S` | Adjust accretion disk / panel rotation speed |
| `E` / `D` | Adjust Doppler beaming / jet glow intensity |
| `R` / `F` | Adjust gravity distortion / lensing strength |
| `T` | Cycle through color themes |
| `Esc` | Quit the application |

</details>

---

### Tech Stack

* **Graphics:** Three.js (r128) · WebGL2 · GLSL 3.00 ES
* **Frontend:** Vanilla ES2022 JavaScript + CSS3
* **Desktop:** Python 3 · PyOpenGL · GLFW
* **Build:** None (zero-bundler, runs out of the box)

---

<p align="center">
  ♥&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://vincere-mori.github.io/stellar-cartography/">🌐 Live Demo</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="README.md">🇷🇺 Русский</a>
</p>
