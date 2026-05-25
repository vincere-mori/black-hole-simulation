<div align="right">
  <a href="README.md">🇷🇺 Русский</a>
</div>

<h1 align="center">🌌 Stellar Cartography</h1>

<p align="center">
  Interactive 3D galaxy map with real-time relativistic simulations of<br>
  black holes, pulsars, wormholes and megastructures — running entirely in the browser
</p>

<p align="center">
  <b>7 unique anomalies</b> · 4 raymarched GLSL shaders · 65,000 galaxy particles · full dossier per object
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
    <img src="https://img.shields.io/badge/▶%20Live%20Demo-vincere--mori.github.io-e8943a?style=for-the-badge" alt="Live Demo"/>
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

## About

A deep-space simulator that runs entirely in the browser — no backend, no bundler, no third-party engine. A single HTML file loads Three.js, four raymarched GLSL shaders compute relativistic physics on the GPU, and 65,000 particles draw a logarithmic spiral galaxy with two arms and a central bulge.

The map hosts 7 unique objects — each rendered with its own shader, with custom presets, color themes and a full scientific dossier. Click a node to open the info card, ENTER ORBIT to enter orbital mode with real-time physics sliders, DOSSIER to drop a terminal overlay with the full breakdown: overview, parameters, render features, interesting facts.

---

## Features

- 🌀 **4 GLSL shaders** — raymarching with 90–130 steps per pixel, compiled on the GPU
- ⚫ **Black holes** — Schwarzschild geodesics, volumetric accretion disk, relativistic Doppler beaming, gravitational redshift
- ⚡ **Pulsars / magnetars** — conical radio jets from magnetic poles, precessing dipole magnetosphere, pulse modulation
- 🕳️ **Wormholes** — Morris–Thorne throat crossing, coordinate inversion at r < Rs, independent "alternate universe"
- 🔮 **Dyson spheres** — geometric collector swarm, coronal flares through gaps, thermal IR emission
- 🌌 **Galaxy map** — 65,000 particles (disk, bulge, nebula) + 10,800 background stars + 800 bright highlights
- 🖥️ **JARVIS boot** — three-column terminal: center log + GRAV SCAN / PARTICLE FLUX / SYS RESOURCES / NAV CALIB
- 📋 **Object dossiers** — terminal overlay with overview, physics params, render features and scientific facts
- 🎨 **Full customization** — 2–3 color themes and 2 presets per object, 6 real-time sliders

---

## Anomaly Catalog

| # | Object | Class | Sector | Highlight |
|:-:|--------|-------|:------:|-----------|
| 1 | **Sagittarius A\*** | Supermassive Black Hole | 00-CORE | Milky Way galactic center, 4.15×10⁶ M☉ |
| 2 | **Gargantua Singularity** | Schwarzschild Black Hole | 04-A | 4.3×10⁶ M☉, Doppler-shifted accretion disk |
| 3 | **Vela Pulsar** | Rotating Neutron Star | 12-C | Conical radio jets, dipole magnetosphere |
| 4 | **SGR 1806-20 Magnetar** | Extreme Magnetar | 18-F | Strongest known magnetic field (1.6×10¹⁵ G) |
| 5 | **Cygnus Wormhole** | Morris–Thorne Bridge | 07-F | Throat crossing to alternate universe |
| 6 | **Andromeda Gateway** | Intergalactic Wormhole | 99-Z | Stabilized bridge to the Andromeda galaxy |
| 7 | **Kepler Dyson Sphere** | Type II Megastructure | 19-B | Geometric solar collector swarm |

---

## Physics & Math

### Gravitational Geodesics (Schwarzschild)
```
a = −1.5 × Rs × |L|² / r⁵ × p
```
Light rays are bent step-by-step during raymarching. **L = p × v** is the angular momentum vector, **Rs** is the Schwarzschild radius.

### Volumetric Accretion Disk
```
ρ(r, y) = Noise3D(r, θ) × exp(−y² / h²)
```
A 3D participating medium producing realistic gas silhouettes from any angle — not a flat sprite.

### Relativistic Doppler Beaming
```
D = 1 / (γ × (1 − β · cos θ))
```
Gas moving toward the observer appears brighter and blue-shifted; gas receding is dimmer and red-shifted.

### Morris-Thorne Throat Crossing
```
r < Rs  →  p_new = −p × 1.01
```
When a ray penetrates the wormhole throat, coordinates are inverted and the ray enters an independent alternate-universe coordinate space with its own starfield.

---

## Quick Start

```bash
git clone https://github.com/vincere-mori/stellar-cartography.git
cd stellar-cartography

# A local server is required — browsers block shader files on file://
python -m http.server 7821
# → open http://localhost:7821
```

### Desktop Version (OpenGL)

```bash
pip install -r requirements.txt
python main.py
```

<details>
<summary>Keyboard & Mouse Controls (Desktop)</summary>

| Input | Action |
|---|---|
| Mouse Drag | Rotate / Orbit Camera |
| Scroll | Zoom |
| `Space` | Toggle Camera Autopilot |
| `1`–`7` | Switch Object |
| `Q` / `A` | Schwarzschild Radius (Rs) |
| `W` / `S` | Orbital Speed |
| `E` / `D` | Jet / Telemetry Intensity |
| `R` / `F` | Gravitational Lensing |
| `T` | Cycle Color Theme |
| `Esc` | Close Window |

</details>

---

## Stack

| Layer | Technology |
|---|---|
| Renderer | Three.js r128 · WebGL2 · GLSL 3.00 ES |
| Language | Vanilla JavaScript ES2022 |
| Desktop | Python 3 · PyOpenGL · GLFW |
| Build | Zero bundler — single HTML entry point |

---

<p align="center">
  <code>webgl</code> &nbsp;
  <code>webgl2</code> &nbsp;
  <code>threejs</code> &nbsp;
  <code>glsl</code> &nbsp;
  <code>shader</code> &nbsp;
  <code>raymarching</code> &nbsp;
  <code>fragment-shader</code> &nbsp;
  <code>real-time-rendering</code> &nbsp;
  <code>black-hole</code> &nbsp;
  <code>schwarzschild</code> &nbsp;
  <code>accretion-disk</code> &nbsp;
  <code>gravitational-lensing</code> &nbsp;
  <code>wormhole</code> &nbsp;
  <code>morris-thorne</code> &nbsp;
  <code>pulsar</code> &nbsp;
  <code>magnetar</code> &nbsp;
  <code>neutron-star</code> &nbsp;
  <code>dyson-sphere</code> &nbsp;
  <code>megastructure</code> &nbsp;
  <code>galaxy</code> &nbsp;
  <code>milky-way</code> &nbsp;
  <code>space</code> &nbsp;
  <code>astronomy</code> &nbsp;
  <code>astrophysics</code> &nbsp;
  <code>relativity</code> &nbsp;
  <code>general-relativity</code> &nbsp;
  <code>physics-simulation</code> &nbsp;
  <code>scientific-visualization</code> &nbsp;
  <code>3d</code> &nbsp;
  <code>interactive</code> &nbsp;
  <code>web-app</code> &nbsp;
  <code>javascript</code>
</p>

---

<p align="center">
  Made with ♥&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://vincere-mori.github.io/stellar-cartography/">🌐 Live Demo</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="README.md">🇷🇺 Русский</a>
</p>
