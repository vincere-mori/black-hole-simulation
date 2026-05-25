<div align="right">
  <a href="README_EN.md">🇬🇧 English</a>
</div>

<h1 align="center">🌌 Stellar Cartography</h1>

<p align="center">
  Интерактивная 3D-карта галактики с релятивистскими симуляциями<br>
  чёрных дыр, пульсаров, червоточин и мегаструктур прямо в браузере
</p>

<p align="center">
  <b>7 уникальных аномалий</b> · 4 GLSL-шейдера на реймарчинге · 65 000 частиц галактики · полное досье по каждому объекту
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

Это симулятор глубокого космоса, который работает прямо в браузере — без бэкенда, без сборщика, без сторонних движков. Один HTML-файл подгружает Three.js, четыре GLSL-шейдера с реймарчингом считают релятивистскую физику на GPU, а 65 000 частиц рисуют логарифмическую галактику с двумя рукавами и центральным балджем.

На карте размещены 7 уникальных объектов — каждый отрисован своим шейдером, со своими пресетами, цветовыми темами и подробным научным досье. Клик по узлу — открывается карточка, ENTER ORBIT — переходишь в орбитальный режим с настройкой физики в реалтайме, DOSSIER — выпадает терминал с полным разбором: обзор, параметры, особенности рендера, интересные факты.

---

## Возможности

- 🌀 **4 GLSL-шейдера** — реймарчинг по 90–130 шагов на пиксель, скомпилировано на GPU
- ⚫ **Чёрные дыры** — геодезики Шварцшильда, объёмный аккреционный диск, релятивистский Доплер-биминг, гравитационное красное смещение
- ⚡ **Пульсары / магнетары** — конические радиоджеты от магнитных полюсов, прецессирующая дипольная магнитосфера, пульсовая модуляция
- 🕳️ **Червоточины** — переход горла Морриса–Торна, инверсия координат при r < Rs, независимая «альтернативная вселенная»
- 🔮 **Сферы Дайсона** — геометрический рой коллекторов, корональные вспышки сквозь зазоры, тепловая ИК-эмиссия
- 🌌 **Карта галактики** — 65 000 частиц (диск, балдж, туманность) + 10 800 фоновых звёзд + 800 ярких выделений
- 🖥️ **JARVIS-загрузка** — трёхколоночный терминал: центральный лог + GRAV SCAN / PARTICLE FLUX / SYS RESOURCES / NAV CALIB
- 📋 **Досье по объектам** — терминал-оверлей с обзором, физпараметрами, особенностями рендера и научными фактами
- 🎨 **Полная кастомизация** — 2–3 цветовые темы и 2 пресета параметров на объект, 6 ползунков в реалтайм

---

## Каталог аномалий

| # | Объект | Класс | Сектор | Особенность |
|:-:|--------|-------|:------:|-------------|
| 1 | **Sagittarius A\*** | Сверхмассивная ЧД | 00-CORE | Ядро Млечного Пути, 4.15×10⁶ M☉ |
| 2 | **Gargantua Singularity** | Чёрная дыра Шварцшильда | 04-A | 4.3×10⁶ M☉, аккреционный диск с Доплером |
| 3 | **Vela Pulsar** | Нейтронная звезда | 12-C | Конические радиоджеты, дипольное поле |
| 4 | **SGR 1806-20 Magnetar** | Экстремальный магнетар | 18-F | Сильнейшее магнитное поле во вселенной (1.6×10¹⁵ Гс) |
| 5 | **Cygnus Wormhole** | Мост Морриса–Торна | 07-F | Переход в альтернативную вселенную |
| 6 | **Andromeda Gateway** | Межгалактическая ЧР | 99-Z | Стабилизированный мост к галактике Андромеды |
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
  Сделано с ♥&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://vincere-mori.github.io/stellar-cartography/">🌐 Live Demo</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="README_EN.md">🇬🇧 English</a>
</p>
