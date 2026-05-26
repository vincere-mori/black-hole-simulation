<div align="right">
  <a href="README.md">🇷🇺 Русский</a>
</div>

<h1 align="center">🌌 Stellar Cartography</h1>

<p align="center">
  <em>Fall into a black hole, reach through a wormhole,<br>
  get lost in a nebula — all without a single server request.</em>
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

## Why this exists

I wanted to build something you can just *look at*. Not click, not grind — sit back and watch gas spiral around an event horizon. Watch light bend at the throat of a wormhole. Watch nebula clouds drift in slow motion.

Everything runs in the browser. One HTML file, five raymarched shaders, 65,000 particles for the galaxy. No backend, no bundler — Three.js, some vanilla JS, and raw math on the GPU.

The catalogue has 7 objects, each with its own shader, color themes, and a detailed dossier. Three nebulae for the beauty. A black hole, a wormhole, a Dyson sphere for the exotic science. A star cluster because the Pleiades are the Pleiades.

---

## What's inside

**Shaders** — 5 of them, raymarching 60–130 steps per pixel, compiled right on the GPU.

**Nebulae** — Orion M42, Horsehead, Crab Nebula. Volumetric clouds, slow drift, no flat textures anywhere.

**Black hole** — Schwarzschild geodesics, a volumetric accretion disk, Doppler color shift. This is Sgr A*, 4 million solar masses.

**Wormhole** — Morris-Thorne throat. Cross it and the coordinates invert — a different starfield opens up on the other side. A different universe.

**Dyson sphere** — a geometric collector swarm around a star, thermal glow leaking through the gaps between panels.

**Galaxy map** — 65,000 particles (disk, bulge, gas clouds), background stars, two spiral arms.

**JARVIS boot** — a three-column terminal with logs, gravity scans, and navigation calibration. Pure atmosphere.

**Customisation** — 2 color themes and 2 presets per object, sliders update in real time.

---

## Catalogue

| # | Object | What it is | Sector | Why it's cool |
|:-:|--------|------------|:------:|---------------|
| 1 | **Sagittarius A\*** | Supermassive Black Hole | 00-CORE | Galactic center, 4.15×10⁶ M☉ |
| 2 | **Orion Nebula M42** | Emission Nebula | 03-O | Stellar nursery, 1,344 ly away |
| 3 | **Horsehead Nebula** | Dark Nebula (B33) | 03-H | Dark silhouette against IC 434's glow |
| 4 | **Crab Nebula M1** | Supernova Remnant | 12-T | SN 1054 aftermath, synchrotron filaments |
| 5 | **Pleiades M45** | Open Star Cluster | 06-S | Seven Sisters with a reflection nebula |
| 6 | **Cygnus Wormhole** | Morris-Thorne Bridge | 07-F | Throat crossing to an alternate universe |
| 7 | **Kepler Dyson Sphere** | Type II Megastructure | 19-B | Geometric solar collector swarm |

---

## The physics (if you're curious)

These aren't decorative sprites — the shaders compute real math.

**Gravitational lensing** — light rays bend step by step following the Schwarzschild metric:
```
a = −1.5 × Rs × |L|² / r⁵ × p
```
Angular momentum `L = p × v`, `Rs` is the event horizon radius.

**Accretion disk** — it's a 3D participating medium, not a flat circle:
```
ρ(r, y) = Noise3D(r, θ) × exp(−y² / h²)
```
That's why it actually looks like a gas torus when viewed at an angle.

**Doppler beaming** — gas moving toward you is brighter and bluer; away from you — dimmer and redder:
```
D = 1 / (γ × (1 − β · cos θ))
```

**Wormhole** — when `r < Rs`, the ray flips and exits into a separate coordinate system:
```
r < Rs  →  p_new = −p × 1.01
```

---

## Getting started

```bash
git clone https://github.com/vincere-mori/stellar-cartography.git
cd stellar-cartography

# Browsers block shader files on file://, so you need a local server
python -m http.server 7821
# → http://localhost:7821
```

### Desktop version (OpenGL)

```bash
pip install -r requirements.txt
python main.py
```

<details>
<summary>Keyboard & mouse controls (desktop)</summary>

| Input | What it does |
|---|---|
| Mouse drag | Orbit camera |
| Scroll | Zoom |
| `Space` | Toggle autopilot |
| `1`–`7` | Switch object |
| `Q` / `A` | Schwarzschild radius (Rs) |
| `W` / `S` | Orbital speed |
| `E` / `D` | Jet intensity |
| `R` / `F` | Gravitational lensing |
| `T` | Cycle color theme |
| `Esc` | Close |

</details>

---

## Stack

| | |
|---|---|
| Renderer | Three.js r128 · WebGL2 · GLSL 3.00 ES |
| Language | Vanilla JavaScript ES2022 |
| Desktop | Python 3 · PyOpenGL · GLFW |
| Build | Zero bundler — single HTML entry point |

---

<p align="center">
  <code>webgl</code> &nbsp;
  <code>threejs</code> &nbsp;
  <code>glsl</code> &nbsp;
  <code>raymarching</code> &nbsp;
  <code>black-hole</code> &nbsp;
  <code>schwarzschild</code> &nbsp;
  <code>accretion-disk</code> &nbsp;
  <code>gravitational-lensing</code> &nbsp;
  <code>wormhole</code> &nbsp;
  <code>morris-thorne</code> &nbsp;
  <code>nebula</code> &nbsp;
  <code>dyson-sphere</code> &nbsp;
  <code>galaxy</code> &nbsp;
  <code>astrophysics</code> &nbsp;
  <code>physics-simulation</code> &nbsp;
  <code>scientific-visualization</code> &nbsp;
  <code>3d</code> &nbsp;
  <code>interactive</code> &nbsp;
  <code>javascript</code>
</p>

---

<p align="center">
  ♥&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://vincere-mori.github.io/stellar-cartography/">🌐 Live Demo</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="README.md">🇷🇺 Русский</a>
</p>
