<div align="right">
  <a href="README_EN.md">🇬🇧 English</a>
</div>

<h1 align="center">🌌 Stellar Cartography</h1>

<p align="center">
  <em>Залетай в браузере внутрь чёрной дыры, протяни руку сквозь червоточину,<br>
  потеряйся в туманности — и всё это без единого серверного запроса.</em>
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

## Зачем это

Хотелось сделать штуку, на которую можно просто смотреть. Не играть, не кликать — смотреть, как газ закручивается вокруг горизонта событий. Как свет преломляется на горле червоточины. Как облака туманности медленно дрейфуют.

Всё работает прямо в браузере. Один HTML-файл, пять шейдеров на реймарчинге, 65 тысяч частиц для галактики. Никакого бэкенда, никаких бандлеров — Three.js, немного ванильного JS и чистая математика на GPU.

В каталоге 7 объектов, каждый со своим шейдером, цветовыми темами и подробным досье. Три туманности — для красоты. Чёрная дыра, червоточина, сфера Дайсона — для научной экзотики. Звёздное скопление — потому что Плеяды это Плеяды.

---

## Что внутри

**Шейдеры** — 5 штук, реймарчинг 60–130 шагов на пиксель, компилируется прямо на GPU.

**Туманности** — Орион M42, Конская Голова, Крабовидная. Объёмные облака, медленное движение, никаких плоских текстур.

**Чёрная дыра** — геодезики Шварцшильда, объёмный аккреционный диск, доплеровское смещение цвета. Это Sgr A*, 4 миллиона солнечных масс.

**Червоточина** — горло Морриса–Торна, при прохождении координаты инвертируются и открывается другое звёздное поле. По ту сторону — другая вселенная.

**Сфера Дайсона** — рой коллекторов вокруг звезды, тепловое свечение в зазорах между панелями.

**Карта галактики** — 65 000 частиц (диск, балдж, газовые облака), фоновые звёзды, два спиральных рукава.

**Загрузка в стиле JARVIS** — трёхколоночный терминал с логами, сканированием и калибровкой навигации. Чисто для атмосферы.

**Кастомизация** — 2 цветовые темы и 2 пресета на каждый объект, ползунки работают в реальном времени.

---

## Каталог

| # | Объект | Что это | Сектор | Почему интересно |
|:-:|--------|---------|:------:|------------------|
| 1 | **Sagittarius A\*** | Сверхмассивная ЧД | 00-CORE | Ядро нашей галактики, 4.15×10⁶ M☉ |
| 2 | **Orion Nebula M42** | Эмиссионная туманность | 03-O | Звёздная колыбель, 1 344 св. лет |
| 3 | **Horsehead Nebula** | Тёмная туманность B33 | 03-H | Тёмный силуэт на фоне свечения IC 434 |
| 4 | **Crab Nebula M1** | Остаток сверхновой | 12-T | Взрыв 1054 года, синхротронные нити |
| 5 | **Pleiades M45** | Открытое скопление | 06-S | Семь Сестёр с отражательной туманностью |
| 6 | **Cygnus Wormhole** | Мост Морриса–Торна | 07-F | Переход в альтернативную вселенную |
| 7 | **Kepler Dyson Sphere** | Мегаструктура II типа | 19-B | Рой солнечных коллекторов |

---

## Физика (если интересно)

Тут не декоративные спрайты — шейдеры считают настоящую математику.

**Гравитационное линзирование** — лучи света изгибаются пошагово по формуле Шварцшильда:
```
a = −1.5 × Rs × |L|² / r⁵ × p
```
Угловой момент `L = p × v`, `Rs` — радиус горизонта событий.

**Аккреционный диск** — это трёхмерная среда, не плоский круг:
```
ρ(r, y) = Noise3D(r, θ) × exp(−y² / h²)
```
Поэтому под углом диск выглядит как настоящий газовый бублик.

**Доплер** — газ, летящий к тебе, ярче и голубее; от тебя — тусклее и краснее:
```
D = 1 / (γ × (1 − β · cos θ))
```

**Червоточина** — при `r < Rs` луч разворачивается и вылетает в другую систему координат:
```
r < Rs  →  p_new = −p × 1.01
```

---

## Запуск

```bash
git clone https://github.com/vincere-mori/stellar-cartography.git
cd stellar-cartography

# Браузер блокирует шейдеры с file://, нужен локальный сервер
python -m http.server 7821
# → http://localhost:7821
```

### Десктоп-версия (OpenGL)

```bash
pip install -r requirements.txt
python main.py
```

<details>
<summary>Управление (десктоп)</summary>

| Клавиша / мышь | Что делает |
|---|---|
| Перетащить | Вращение камеры |
| Скролл | Зум |
| `Space` | Автопилот |
| `1`–`7` | Переключить объект |
| `Q` / `A` | Радиус Rs |
| `W` / `S` | Скорость вращения |
| `E` / `D` | Интенсивность джетов |
| `R` / `F` | Линзирование |
| `T` | Сменить тему |
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
  ♥&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://vincere-mori.github.io/stellar-cartography/">🌐 Live Demo</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="README_EN.md">🇬🇧 English</a>
</p>
