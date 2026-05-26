<div align="right">
  <a href="README_EN.md">🇬🇧 English</a>
</div>

<h1 align="center">🌌 Stellar Cartography</h1>

<p align="center">
  Интерактивная 3D-карта галактики: туманности, звёздное скопление,<br>
  остаток сверхновой, чёрная дыра, червоточина и сфера Дайсона - всё в браузере
</p>

<p align="center">
  <b>7 объектов</b> · 5 GLSL-шейдеров на реймарчинге · 65 000 частиц галактики · полное досье по каждому объекту
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
    <img src="https://img.shields.io/badge/▶%20Открыть%20демо-vincere--mori.github.io-e8943a?style=for-the-badge" alt="Live Demo"/>
  </a>
</p>

---

<p align="center">
  <img src="./assets/demo-galaxy.gif" alt="Galaxy Map — 3D навигация" width="100%"/>
</p>

<p align="center">
  <img src="./assets/demo-blackhole.gif" alt="Black Hole Orbit" width="49%"/>
  <img src="./assets/demo-boot.gif" alt="JARVIS Boot Sequence" width="49%"/>
</p>

---

## О проекте

Симулятор глубокого космоса прямо в браузере - без бэкенда, без сборщика, без сторонних движков. Один HTML-файл подгружает Three.js, пять GLSL-шейдеров на реймарчинге считают физику на GPU, а 65 000 частиц рисуют логарифмическую галактику с двумя рукавами и центральным балджем.

Каталог - 7 разнородных объектов: туманности и звёздное скопление для красоты, чёрная дыра, червоточина и сфера Дайсона для научной экзотики. Каждый объект отрисован своим шейдером, со своими пресетами, цветовыми темами и подробным досье. Анимация спокойная, без агрессивных вспышек - на это можно просто смотреть.

---

## Возможности

- 🌀 **5 GLSL-шейдеров** - реймарчинг 60-130 шагов на пиксель, скомпилировано на GPU
- 🌌 **Туманности и скопление** - объёмные облака с медленным дрейфом: Орион M42, Конская Голова, Крабовидная, Плеяды M45
- ⚫ **Чёрная дыра** - геодезики Шварцшильда, аккреционный диск, мягкое линзирование (Sagittarius A*)
- 🕳️ **Червоточина** - переход горла Морриса-Торна, инверсия координат при r < Rs, альтернативное звёздное поле
- 🔮 **Сфера Дайсона** - геометрический рой коллекторов, тепловая эмиссия через зазоры
- 🪐 **Карта галактики** - 65 000 частиц (диск, балдж, туманность) + фоновые звёзды
- 🖥️ **JARVIS-загрузка** - трёхколоночный терминал: лог + GRAV SCAN / PARTICLE FLUX / SYS RESOURCES / NAV CALIB
- 📋 **Досье по объектам** - терминал-оверлей с обзором, параметрами, особенностями рендера и фактами (RU/EN)
- 🎨 **Кастомизация** - 2 цветовые темы и 2 пресета на объект, ползунки в реальном времени

---

## Каталог объектов

| # | Объект | Класс | Сектор | Особенность |
|:-:|--------|-------|:------:|-------------|
| 1 | **Sagittarius A\*** | Сверхмассивная ЧД | 00-CORE | Ядро Млечного Пути, 4.15×10⁶ M☉ |
| 2 | **Orion Nebula M42** | Эмиссионная туманность | 03-O | Звёздная колыбель в Орионе, 1 344 св. лет |
| 3 | **Horsehead Nebula** | Тёмная туманность B33 | 03-H | Силуэт на фоне IC 434 |
| 4 | **Crab Nebula M1** | Остаток сверхновой | 12-T | Сверхновая 1054 года, синхротронные нити |
| 5 | **Pleiades M45** | Открытое скопление | 06-S | Семь Сестёр, отражательная туманность |
| 6 | **Cygnus Wormhole** | Мост Морриса-Торна | 07-F | Переход в альтернативную вселенную |
| 7 | **Kepler Dyson Sphere** | Мегаструктура II типа | 19-B | Геометрический рой солнечных панелей |

---

## Физика

### Искривление геодезических (Шварцшильд)
```
a = −1.5 × Rs × |L|² / r⁵ × p
```
Лучи света изгибаются пошагово в реймарчинге. **L = p × v** — угловой момент, **Rs** — горизонт событий.

### Объёмный аккреционный диск
```
ρ(r, y) = Noise3D(r, θ) × exp(−y² / h²)
```
3D-участвующая среда: реалистичные силуэты под углом, а не плоский спрайт.

### Доплеровское смещение
```
D = 1 / (γ × (1 − β · cos θ))
```
Газ к наблюдателю — ярче и синее; от наблюдателя — тусклее и краснее.

### Червоточина (Моррис–Торн)
```
r < Rs  →  p_new = −p × 1.01
```
Луч пересекает горло и выходит в другое пространство с независимым звёздным фоном.

---

## Быстрый старт

```bash
git clone https://github.com/vincere-mori/stellar-cartography.git
cd stellar-cartography

# Нужен локальный сервер — браузер блокирует шейдеры с file://
python -m http.server 7821
# → http://localhost:7821
```

### Десктоп (OpenGL)

```bash
pip install -r requirements.txt
python main.py
```

<details>
<summary>Управление (десктоп)</summary>

| Клавиша / мышь | Действие |
|---|---|
| Перетащить | Вращение камеры |
| Скролл | Зум |
| `Space` | Автопилот |
| `1`–`7` | Переключить объект |
| `Q` / `A` | Радиус горизонта Rs |
| `W` / `S` | Скорость вращения |
| `E` / `D` | Интенсивность джетов |
| `R` / `F` | Линзирование |
| `T` | Тема |
| `Esc` | Закрыть |

</details>

---

## Стек

| | |
|---|---|
| Рендер | Three.js r128 · WebGL2 · GLSL 3.00 ES |
| Язык | Vanilla JavaScript ES2022 |
| Десктоп | Python 3 · PyOpenGL · GLFW |
| Сборка | Без бандлера — один HTML-файл |

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
  <code>nebula</code> &nbsp;
  <code>orion-nebula</code> &nbsp;
  <code>supernova-remnant</code> &nbsp;
  <code>star-cluster</code> &nbsp;
  <code>pleiades</code> &nbsp;
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
  Сделано с ♥&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://vincere-mori.github.io/stellar-cartography/">🌐 Live Demo</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="README_EN.md">🇬🇧 English</a>
</p>
