// ===== Inline Shaders (loaded from script tags, no fetch needed) =====
const SHADERS = {};

// ===== Object Catalog =====
const OBJECTS = {
    sgr_a: {
        name: "Sagittarius A*",
        class: "SUPERMASSIVE BLACK HOLE",
        sector: "SECTOR 00-CORE",
        coords: "X: 0.00 / Y: 0.00 / Z: 0.00",
        mass: "4.15e6 M☉",
        rad: "EVENT HORIZON STABLE",
        desc: "Сверхмассивная чёрная дыра в центре Млечного Пути. Аккреционный диск, мягкое гравитационное линзирование и спокойное вращение плазмы вокруг горизонта.",
        shader: "shaders/black-hole.frag",
        accentParticles: true,
        position: new THREE.Vector3(0, 0, 0),
        presets: {
            "tranquil-core": { rs: 1.1, distortion: 0.9, outer: 9.0, speed: 0.4, doppler: 0.35, stars: 1.0, theme: 0 },
            "deep-horizon":  { rs: 1.6, distortion: 1.1, outer: 12.0, speed: 0.3, doppler: 0.25, stars: 1.1, theme: 1 }
        },
        themes: [
            { c1: '#e85a1a', c2: '#ffb86b', name: 'Warm Amber', temp: '8.4e6' },
            { c1: '#7ec8ff', c2: '#2a4cff', name: 'Cool Cobalt', temp: '1.1e7' }
        ],
        labels: { rs: "Horizon Mass (Rs)", distortion: "Warp Lensing", outer: "Disk Outer Bound", speed: "Disk Rotation", doppler: "Doppler Beaming" }
    },
    orion_nebula: {
        name: "Orion Nebula M42",
        class: "EMISSION NEBULA",
        sector: "SECTOR 03-O",
        coords: "X: -4.20 / Y: 0.80 / Z: 3.40",
        mass: "~2000 M☉",
        rad: "Hα EMISSION",
        desc: "Один из самых ярких звёздных питомников в небе. Огромное облако водорода и пыли, подсвеченное молодыми голубыми звёздами в центре.",
        shader: "shaders/nebula.frag",
        renderMode: "particles",
        particleType: "orion",
        orbitRadius: 16.4,
        orbitSwing: 0.24,
        position: new THREE.Vector3(-4.2, 0.8, 3.4),
        presets: {
            "ha-glow":   { rs: 1.4, distortion: 0.6, outer: 11.0, speed: 0.25, doppler: 1.0, stars: 1.0, theme: 0 },
            "deep-cloud":{ rs: 2.0, distortion: 0.4, outer: 13.5, speed: 0.15, doppler: 0.8, stars: 1.2, theme: 1 }
        },
        themes: [
            { c1: '#ff5f8b', c2: '#5d3acc', name: 'Hydrogen Pink', temp: '1.0e4' },
            { c1: '#ff9a6b', c2: '#2e6fff', name: 'Trapezium Blue', temp: '1.5e4' }
        ],
        labels: { rs: "Core Density", distortion: "Cloud Shape", outer: "Cloud Extent", speed: "Drift Speed", doppler: "Emission Strength" }
    },
    aurelia: {
        name: "Aurelia Rogue Planet",
        class: "ROGUE EXOPLANET ANOMALY",
        sector: "SECTOR 03-H",
        coords: "X: -3.10 / Y: -0.40 / Z: 4.80",
        mass: "~2.3 Mj",
        rad: "AURORA PLASMA WAKE",
        desc: "Одинокая планета-гигант без звезды: холодный мир с сильным магнитным полем, полярными сияниями, прозрачными кольцами и хвостом ионизированной плазмы.",
        shader: "shaders/nebula.frag",
        renderMode: "particles",
        particleType: "aurelia",
        orbitRadius: 18.0,
        orbitSwing: 0.35,
        position: new THREE.Vector3(-3.1, -0.4, 4.8),
        presets: {
            "aurora-storm": { rs: 1.35, distortion: 0.9, outer: 8.4, speed: 0.34, doppler: 1.1, stars: 1.0, theme: 0 },
            "eclipse-rings":{ rs: 1.10, distortion: 1.2, outer: 10.2, speed: 0.22, doppler: 0.85, stars: 1.2, theme: 1 }
        },
        themes: [
            { c1: '#25f0ff', c2: '#7a4dff', name: 'Aurora Cyan', temp: '87 K' },
            { c1: '#ff7a3d', c2: '#3de0ff', name: 'Ion Ember', temp: '112 K' }
        ],
        labels: { rs: "Planet Radius", distortion: "Magnetic Shear", outer: "Ring Span", speed: "Storm Drift", doppler: "Plasma Glow" }
    },
    crab_nebula: {
        name: "Crab Nebula M1",
        class: "SUPERNOVA REMNANT",
        sector: "SECTOR 12-T",
        coords: "X: 5.40 / Y: 0.50 / Z: 2.20",
        mass: "~5 M☉",
        rad: "SYNCHROTRON EMISSION",
        desc: "Остаток сверхновой 1054 года. Расширяющееся облако филаментов, в центре - пульсар, который подпитывает свечение синхротронным излучением.",
        shader: "shaders/nebula.frag",
        renderMode: "particles",
        particleType: "crab",
        orbitRadius: 21,
        orbitSwing: 0.32,
        position: new THREE.Vector3(5.4, 0.5, 2.2),
        presets: {
            "filaments":  { rs: 1.2, distortion: 0.5, outer: 10.0, speed: 0.3, doppler: 1.0, stars: 1.0, theme: 0 },
            "expanding":  { rs: 1.6, distortion: 0.3, outer: 12.5, speed: 0.18, doppler: 0.85, stars: 1.1, theme: 1 }
        },
        themes: [
            { c1: '#b14eff', c2: '#00e0ff', name: 'Synchrotron Violet', temp: '1.5e4' },
            { c1: '#ff5b8a', c2: '#3affe5', name: 'Crab Filaments', temp: '1.2e4' }
        ],
        labels: { rs: "Core Density", distortion: "Filament Shape", outer: "Remnant Radius", speed: "Expansion Drift", doppler: "Synchrotron Glow" }
    },
    pleiades: {
        name: "Pleiades M45",
        class: "OPEN STAR CLUSTER",
        sector: "SECTOR 06-S",
        coords: "X: 4.10 / Y: 1.20 / Z: -3.60",
        mass: "~800 M☉",
        rad: "REFLECTION NEBULA",
        desc: "Молодое звёздное скопление в созвездии Тельца. Семь ярких голубых звёзд погружены в нежную отражательную туманность.",
        shader: "shaders/nebula.frag",
        renderMode: "particles",
        particleType: "pleiades",
        orbitRadius: 18.0,
        orbitSwing: 0.34,
        position: new THREE.Vector3(4.1, 1.2, -3.6),
        presets: {
            "seven-sisters":{ rs: 1.6, distortion: 0.3, outer: 10.5, speed: 0.2, doppler: 0.7, stars: 1.2, theme: 0 },
            "soft-veil":    { rs: 2.0, distortion: 0.2, outer: 12.0, speed: 0.12, doppler: 0.55, stars: 1.4, theme: 1 }
        },
        themes: [
            { c1: '#a8c8ff', c2: '#ffffff', name: 'Reflection Blue', temp: '1.0e4' },
            { c1: '#bcd6ff', c2: '#fff2c8', name: 'Starlight Cream', temp: '9.5e3' }
        ],
        labels: { rs: "Cluster Core", distortion: "Halo Shape", outer: "Halo Radius", speed: "Drift Speed", doppler: "Nebula Glow" }
    },
    cygnus: {
        name: "Cygnus Wormhole",
        class: "MORRIS-THORNE BRIDGE",
        sector: "SECTOR 07-F",
        coords: "X: 5.40 / Y: -0.80 / Z: -2.50",
        mass: "N/A (Exotic)",
        rad: "STABLE GATEWAY",
        desc: "Топологический мост через искривлённое пространство. Через горло видна звёздная панорама другой вселенной.",
        shader: "shaders/wormhole.frag",
        accentParticles: true,
        position: new THREE.Vector3(5.4, -0.8, -2.5),
        presets: {
            "stable-gate":   { rs: 1.1, distortion: 0.8, outer: 10.0, speed: 0.5, doppler: 0.9, stars: 1.0, theme: 0 },
            "einstein-rosen":{ rs: 0.8, distortion: 1.4, outer: 11.5, speed: 0.9, doppler: 1.1, stars: 1.2, theme: 1 }
        },
        themes: [
            { c1: '#b56cff', c2: '#5ce0ff', name: 'Aurora Portal', temp: '0' },
            { c1: '#ffb86b', c2: '#5cffaa', name: 'Gold-Emerald', temp: '12' }
        ],
        labels: { rs: "Throat Radius (Rs)", distortion: "Throat Bending", outer: "Lensing Zone", speed: "Chromatic Drift", doppler: "Alternate Lumens" }
    },
    kepler: {
        name: "Kepler Dyson Sphere",
        class: "STELLAR MEGASTRUCTURE",
        sector: "SECTOR 19-B",
        coords: "X: 7.00 / Y: 1.00 / Z: 0.50",
        mass: "1.08 M☉ (Host Star)",
        rad: "THERMAL EMISSION",
        desc: "Рой геометрических солнечных коллекторов, окружающих звезду. Свет пробивается через зазоры между панелями, обрисовывая силуэт мегаструктуры.",
        shader: "shaders/dyson-sphere.frag",
        renderMode: "particles",
        particleType: "dyson",
        orbitRadius: 20,
        orbitSwing: 0.55,
        position: new THREE.Vector3(7.0, 1.0, 0.5),
        presets: {
            "dyson-orbit": { rs: 0.9, distortion: 0.0, outer: 2.8, speed: 0.7, doppler: 1.1, stars: 1.0, theme: 0 },
            "closed-swarm":{ rs: 1.15, distortion: 0.0, outer: 2.8, speed: 0.4, doppler: 0.7, stars: 1.2, theme: 1 }
        },
        themes: [
            { c1: '#ff9d00', c2: '#ffcc00', name: 'Solar Gold', temp: '5780' },
            { c1: '#7ed8ff', c2: '#ffffff', name: 'Sirius White-Blue', temp: '9940' }
        ],
        labels: { rs: "Star Diameter", distortion: "Gravity Flex", outer: "Shell Size", speed: "Orbital Speed", doppler: "Circuit Radiance" }
    }
};
// ===== Dossier Data (English) =====
const OBJECT_DOSSIERS_EN = {
    sgr_a: {
        overview: `Sagittarius A* is the supermassive black hole at the heart of the Milky Way, about 26,000 light-years from Earth. With a mass of 4.15 × 10⁶ M☉ it anchors the gravitational structure of the entire galactic core.

In this scene the disk rotates slowly and the lensing of background stars is gentle — the goal is to show the quiet majesty of a horizon, not a violent flare.`,
        params: [
            ['Mass',                '4.15 × 10⁶ M☉'],
            ['Schwarzschild Radius','Rs ≈ 12.3 × 10⁹ km'],
            ['Distance from Earth', '~26,000 ly'],
            ['Disk Temperature',    '~10⁷ K (inner edge)'],
            ['Photon Sphere',       '1.5 Rs (unstable)'],
            ['ISCO',                '3 Rs'],
            ['Hawking Temperature', '~10⁻¹⁴ K'],
        ],
        features: [
            'Schwarzschild geodesic raymarching with smooth gravitational lensing',
            'Volumetric accretion disk — Keplerian rotation, soft Doppler beaming',
            'Calmed presets (slow rotation, low beaming amplitude) for relaxed viewing',
            'Two color themes: warm amber, cool cobalt',
        ],
        facts: [
            'Imaged by the Event Horizon Telescope collaboration in 2022',
            'Despite its mass, its angular size on the sky is smaller than 50 microarcseconds',
            'The S2 star orbits it at up to 7,650 km/s — confirming general relativity in strong fields',
            'A photon at the photon sphere can orbit the black hole multiple times before escaping',
        ],
    },
    orion_nebula: {
        overview: `The Orion Nebula (M42) is one of the brightest and most studied stellar nurseries visible from Earth, lying about 1,344 light-years away in the constellation Orion. Inside this glowing cloud of hydrogen and dust, thousands of young stars are being born right now.

Its pink and violet glow comes from hot young stars in the Trapezium cluster ionising the surrounding hydrogen — emission and reflection blending into one of the most photogenic objects in the sky.`,
        params: [
            ['Distance',      '1,344 ly'],
            ['Diameter',      '~24 ly'],
            ['Total Mass',    '~2,000 M☉'],
            ['Age',           '~3 million years'],
            ['Visible Stars', '~700 (forming)'],
            ['Apparent Mag.', '+4.0 (naked-eye)'],
        ],
        features: [
            'Volumetric raymarched cloud with soft fbm noise, slow drift',
            'Two-tone color gradient: Hα pink core to violet outer wisps',
            'No pulsing or flashing — meditative, calm look',
            'Background starfield blends naturally with cloud edges',
        ],
        facts: [
            'Discovered by Nicolas-Claude Fabri de Peiresc in 1610',
            'You can see it with the naked eye as the "sword" of Orion',
            'Hubble has imaged hundreds of protoplanetary disks (proplyds) inside it',
            'Light leaving M42 in 681 AD is arriving at Earth right now',
        ],
    },
    horsehead: {
        overview: `Barnard 33 — the Horsehead Nebula — is a dense cloud of cold gas and dust silhouetted against the bright red emission nebula IC 434 in Orion. The iconic horse-head shape is pure shadow, the cloud blocking the glow behind it.

It is one of the most recognisable shapes in the night sky and a classic example of a dark nebula seen in absorption rather than emission.`,
        params: [
            ['Distance',      '~1,375 ly'],
            ['Diameter',      '~3.5 ly'],
            ['Mass',          '~300 M☉'],
            ['Constellation', 'Orion'],
            ['Type',          'Dark molecular cloud'],
            ['Backlight',     'IC 434 (Hα emission)'],
        ],
        features: [
            'High distortion uniform shapes the dark silhouette',
            'Warm red-orange backlight bleeds through the cloud edges',
            'Almost static — extremely slow drift, no flicker',
            'Two themes: bright backlit ember, deep coal & rust',
        ],
        facts: [
            'First photographed by Williamina Fleming in 1888',
            'The dust cloud will eventually dissipate — in cosmic terms, it is short-lived',
            'New stars are still forming inside the densest knots',
            'Visible only with long exposure or large telescopes',
        ],
    },
    crab_nebula: {
        overview: `Messier 1, the Crab Nebula, is the expanding remnant of a supernova that Chinese astronomers recorded in 1054 AD. It contains a fast-spinning pulsar at its heart that lights up the surrounding gas through synchrotron radiation.

The result is a wispy, filament-rich cloud of purple and cyan, expanding outwards at roughly 1,500 km/s.`,
        params: [
            ['Distance',         '~6,500 ly'],
            ['Diameter',         '~11 ly'],
            ['Mass',             '~4.6 M☉'],
            ['Expansion Speed',  '~1,500 km/s'],
            ['Age',              '~970 years'],
            ['Central Pulsar',   '33 ms spin period'],
        ],
        features: [
            'Volumetric cloud with wisp-detail layer for filaments',
            'Synchrotron color palette — violet core, cyan filaments',
            'Slow outward drift simulates expansion',
            'Soft halo around centre suggests embedded pulsar',
        ],
        facts: [
            'The 1054 supernova was bright enough to be visible in daylight for 23 days',
            'Recorded by Chinese, Japanese, and Arab astronomers',
            'The central pulsar (PSR B0531+21) rotates 30 times a second',
            'Charles Messier catalogued it first — it became Messier 1',
        ],
    },
    pleiades: {
        overview: `Messier 45 — the Pleiades, or Seven Sisters — is the most famous open cluster in the sky. About 444 light-years away in Taurus, it consists of hot, young, blue stars wrapped in a delicate reflection nebula.

Many cultures across history have included the Pleiades in myth — they are visible to the naked eye and unmistakable on a clear winter night.`,
        params: [
            ['Distance',     '~444 ly'],
            ['Total Mass',   '~800 M☉'],
            ['Age',          '~100 million years'],
            ['Bright Stars', '7 visible to naked eye'],
            ['Total Stars',  '~1,000 (gravitationally bound)'],
            ['Diameter',     '~17 ly'],
        ],
        features: [
            'Cluster mode active — 7 embedded bright stars rendered inside the cloud',
            'Soft reflection-nebula colour palette: blue cloud, white-cream stars',
            'Minimal motion — the cluster feels peaceful and still',
            'Two themes: classic reflection blue, warmer starlight cream',
        ],
        facts: [
            'Named after the Seven Sisters of Greek mythology',
            'Featured on the Subaru car logo (Subaru = "Pleiades" in Japanese)',
            'The reflection nebula is unrelated dust the cluster is currently passing through',
            'In ~250 million years the cluster will disperse and stop being a cluster',
        ],
    },
    cygnus: {
        overview: `Cygnus Wormhole is a topological shortcut through curved spacetime — a Morris-Thorne bridge. Looking into the throat you see the starfield of an entirely different universe, blended with gravitational lensing of our own.

In this scene the throat is stable and the colour drift is slow, allowing you to study the geometry rather than be overwhelmed by motion.`,
        params: [
            ['Throat Radius',     'Rs ≈ 1.1 (configurable)'],
            ['Mass-Energy Type',  'Exotic / Negative'],
            ['Stability',         'Stabilised'],
            ['Bridge Length',     'Theoretically negligible'],
            ['Tidal Forces',      'Walkable (large throat)'],
            ['Observable Colour', 'Mixed alternate spectrum'],
        ],
        features: [
            'Coordinate inversion at r < Rs — the ray enters the alternate universe',
            'Independent starfield rendered through the throat',
            'Einstein-ring lensing around the boundary',
            'Slow chromatic drift — no aggressive colour cycling',
        ],
        facts: [
            'Theoretically proposed by Morris and Thorne in 1988',
            'Requires exotic matter with negative energy density to remain open',
            'Quantum field theory permits negative energy in small amounts (Casimir effect)',
            'No wormholes have been observed — they remain mathematical solutions to GR',
        ],
    },
    kepler: {
        overview: `Kepler Dyson Sphere is a Type-II Kardashev megastructure — a swarm of geometric solar collectors enclosing a Sun-like star. Light escapes through the gaps in the panel grid, sketching the silhouette of an artificial world.

It represents what an advanced civilisation could build to harvest the total energy output of its star.`,
        params: [
            ['Host Star',        '1.08 M☉ (G-type)'],
            ['Shell Radius',     '~1 AU'],
            ['Surface Area',     '~2.8 × 10²³ m²'],
            ['Energy Captured',  '~3.8 × 10²⁶ W'],
            ['Civilisation',     'Kardashev Type II'],
            ['Construction',     'Hypothetical'],
        ],
        features: [
            'Analytic ray-sphere intersection — pure geometry, very fast',
            'Panel grid drawn from latitude/longitude lines',
            'Gentle thermal emission from the panels',
            'Two themes: Solar gold, Sirius white-blue',
        ],
        facts: [
            'Proposed by Freeman Dyson in 1960',
            'A full solid sphere is gravitationally unstable — a real one would be a swarm',
            'Tabby\'s Star (KIC 8462852) briefly raised Dyson-swarm speculation in 2015',
            'Detecting one would show up as an infrared excess in star surveys',
        ],
    },
};

// ===== Dossier Data (Russian) =====
const OBJECT_DOSSIERS_RU = {
    sgr_a: {
        overview: `Стрелец A* — сверхмассивная чёрная дыра в центре Млечного Пути, примерно в 26 000 световых лет от Земли. С массой 4.15 × 10⁶ M☉ она удерживает гравитационную структуру всего галактического ядра.

В этой сцене диск вращается медленно, а линзирование фоновых звёзд мягкое — задача показать тихое величие горизонта, а не яростную вспышку.`,
        params: [
            ['Масса',               '4.15 × 10⁶ M☉'],
            ['Радиус Шварцшильда',  'Rs ≈ 12.3 × 10⁹ км'],
            ['Расстояние от Земли', '~26 000 св. лет'],
            ['Температура диска',   '~10⁷ K (внутр. край)'],
            ['Фотонная сфера',      '1.5 Rs (нестабильная)'],
            ['ISCO',                '3 Rs'],
            ['Температура Хокинга', '~10⁻¹⁴ K'],
        ],
        features: [
            'Реймарчинг по геодезикам Шварцшильда, мягкое линзирование',
            'Объёмный аккреционный диск, кеплеровское вращение, тихий Доплер',
            'Спокойные пресеты (медленное вращение, низкая амплитуда биминга)',
            'Две темы: тёплый янтарь, холодный кобальт',
        ],
        facts: [
            'Снят коллаборацией Event Horizon Telescope в 2022 году',
            'Несмотря на массу, угловой размер на небе меньше 50 микросекунд',
            'Звезда S2 проходит мимо со скоростью до 7 650 км/с, подтверждая ОТО',
            'Фотон на фотонной сфере может обогнуть дыру несколько раз перед побегом',
        ],
    },
    orion_nebula: {
        overview: `Туманность Ориона (M42) — одна из самых ярких и изученных звёздных колыбелей, видимых с Земли. Лежит примерно в 1 344 световых годах от нас в созвездии Ориона. Внутри этого светящегося облака водорода и пыли прямо сейчас рождаются тысячи молодых звёзд.

Её розово-фиолетовое свечение возникает из-за того, что горячие молодые звёзды в скоплении Трапеция ионизируют окружающий водород.`,
        params: [
            ['Расстояние',      '1 344 св. лет'],
            ['Диаметр',         '~24 св. лет'],
            ['Полная масса',    '~2 000 M☉'],
            ['Возраст',         '~3 млн лет'],
            ['Видимые звёзды',  '~700 (формируются)'],
            ['Видимая величина','+4.0 (видна глазом)'],
        ],
        features: [
            'Объёмное реймарченное облако с мягким fbm-шумом и медленным дрейфом',
            'Двухтоновый градиент: розовое ядро Hα → фиолетовые внешние нити',
            'Без пульсации и вспышек — медитативный, спокойный вид',
            'Звёздный фон естественно сливается с краями облака',
        ],
        facts: [
            'Открыта Николя-Клодом Фабри де Пейреском в 1610 году',
            'Видна невооружённым глазом как «меч» Ориона',
            'Hubble сфотографировал сотни протопланетных дисков внутри неё',
            'Свет, ушедший из M42 в 681 году, доходит до Земли прямо сейчас',
        ],
    },
    horsehead: {
        overview: `Барнард 33 — туманность Конская Голова — плотное облако холодного газа и пыли, видимое силуэтом на фоне яркой красной эмиссионной туманности IC 434 в Орионе. Знаменитая форма головы лошади — это чистая тень.

Один из самых узнаваемых силуэтов в ночном небе и классический пример тёмной туманности, видимой по поглощению.`,
        params: [
            ['Расстояние',  '~1 375 св. лет'],
            ['Диаметр',     '~3.5 св. лет'],
            ['Масса',       '~300 M☉'],
            ['Созвездие',   'Орион'],
            ['Тип',         'Тёмное молекулярное облако'],
            ['Подсветка',   'IC 434 (эмиссия Hα)'],
        ],
        features: [
            'Высокий uDistortion формирует характерный тёмный силуэт',
            'Тёплая красно-оранжевая подсветка пробивается сквозь края облака',
            'Почти статика — крайне медленный дрейф, без мерцаний',
            'Две темы: яркий «уголь и пламя» и глубокая «уголь и ржавчина»',
        ],
        facts: [
            'Впервые сфотографирована Уильяминой Флеминг в 1888 году',
            'Пылевое облако со временем рассеется — по космическим меркам недолговечно',
            'Внутри плотнейших узлов всё ещё формируются новые звёзды',
            'Видна только при длинной выдержке или в крупный телескоп',
        ],
    },
    crab_nebula: {
        overview: `Мессье 1, Крабовидная туманность — расширяющийся остаток сверхновой, которую китайские астрономы зафиксировали в 1054 году. В центре сидит быстро вращающийся пульсар, подсвечивающий газ синхротронным излучением.

Результат — туманное облако фиолетовых и бирюзовых нитей, расширяющееся со скоростью около 1 500 км/с.`,
        params: [
            ['Расстояние',       '~6 500 св. лет'],
            ['Диаметр',          '~11 св. лет'],
            ['Масса',            '~4.6 M☉'],
            ['Скорость расширения','~1 500 км/с'],
            ['Возраст',          '~970 лет'],
            ['Центральный пульсар','33 мс период'],
        ],
        features: [
            'Объёмное облако с дополнительным wisp-слоем для нитей',
            'Синхротронная палитра — фиолетовое ядро, бирюзовые нити',
            'Медленный направленный дрейф имитирует расширение',
            'Мягкий ореол в центре намекает на встроенный пульсар',
        ],
        facts: [
            'Сверхновая 1054 года была видна днём 23 дня подряд',
            'Зафиксирована китайскими, японскими и арабскими астрономами',
            'Центральный пульсар PSR B0531+21 делает 30 оборотов в секунду',
            'Шарль Мессье каталогизировал её первой — она стала Messier 1',
        ],
    },
    pleiades: {
        overview: `Мессье 45 — Плеяды, или Семь Сестёр — самое известное рассеянное скопление на небе. Около 444 световых лет от нас в созвездии Тельца. Состоит из горячих молодых голубых звёзд, окутанных нежной отражательной туманностью.

Многие культуры в истории включали Плеяды в свои мифы — они видны невооружённым глазом и безошибочно узнаваемы ясной зимней ночью.`,
        params: [
            ['Расстояние',        '~444 св. лет'],
            ['Полная масса',      '~800 M☉'],
            ['Возраст',           '~100 млн лет'],
            ['Ярких звёзд',       '7 видны глазом'],
            ['Всего звёзд',       '~1 000 (связанных)'],
            ['Диаметр',           '~17 св. лет'],
        ],
        features: [
            'Активирован кластер-режим — 7 встроенных ярких звёзд внутри облака',
            'Палитра отражательной туманности: голубое облако, бело-кремовые звёзды',
            'Минимум движения — скопление выглядит спокойным и неподвижным',
            'Две темы: классическая «отражательная синева» и тёплая «кремовая»',
        ],
        facts: [
            'Названы в честь семи сестёр из греческой мифологии',
            'Изображены на логотипе Subaru (subaru = «плеяды» по-японски)',
            'Отражательная туманность — это просто пыль, через которую сейчас проходит скопление',
            'Через ~250 млн лет скопление рассеется и перестанет быть скоплением',
        ],
    },
    cygnus: {
        overview: `Червоточина Лебедя — топологический мост через искривлённое пространство-время, мост Морриса-Торна. Через горло видно звёздное поле другой вселенной, смешанное с гравитационным линзированием нашей.

В этой сцене горло стабильно, а цветовой дрейф медленный — это позволяет рассматривать геометрию, а не быть оглушённым движением.`,
        params: [
            ['Радиус горла',      'Rs ≈ 1.1 (настраивается)'],
            ['Тип массы-энергии', 'Экзотическая / отрицательная'],
            ['Стабильность',      'Стабилизирована'],
            ['Длина моста',       'Теоретически пренебрежимо мала'],
            ['Приливные силы',    'Проходимы (большое горло)'],
            ['Видимый спектр',    'Смешанный, альтернативный'],
        ],
        features: [
            'Инверсия координат при r < Rs — луч уходит в альтернативную вселенную',
            'Независимое звёздное поле, видимое сквозь горло',
            'Линзирование в форме эйнштейновского кольца на границе',
            'Медленный хроматический дрейф — без агрессивной смены цвета',
        ],
        facts: [
            'Теоретически предложена Моррисом и Торном в 1988 году',
            'Требует экзотической материи с отрицательной плотностью энергии',
            'Квантовая теория поля допускает отрицательную энергию (эффект Казимира)',
            'Червоточины ни разу не наблюдались — пока только решения ОТО',
        ],
    },
    kepler: {
        overview: `Сфера Дайсона Кеплера — мегаструктура II типа по шкале Кардашёва. Рой геометрических солнечных коллекторов, окружающих звезду солнечного класса. Свет пробивается сквозь зазоры между панелями, обрисовывая силуэт искусственного мира.

Это то, что могла бы построить продвинутая цивилизация, чтобы захватить всю энергию своей звезды.`,
        params: [
            ['Центральная звезда','1.08 M☉ (G-класс)'],
            ['Радиус оболочки',   '~1 а.е.'],
            ['Площадь поверхности','~2.8 × 10²³ м²'],
            ['Захваченная энергия','~3.8 × 10²⁶ Вт'],
            ['Цивилизация',       'II тип Кардашёва'],
            ['Конструкция',       'Гипотетическая'],
        ],
        features: [
            'Аналитическое пересечение луча со сферой — чистая геометрия, очень быстро',
            'Сетка панелей нарисована линиями широты и долготы',
            'Мягкое тепловое излучение от панелей',
            'Две темы: «солнечное золото», «бело-голубой Сириус»',
        ],
        facts: [
            'Предложена Фрименом Дайсоном в 1960 году',
            'Сплошная сфера гравитационно неустойчива — реальная была бы роем',
            'Звезда Табби (KIC 8462852) в 2015 ненадолго оживила гипотезу о Дайсоне',
            'Обнаружение проявилось бы как избыток ИК-излучения в обзоре звёзд',
        ],
    },
};

OBJECT_DOSSIERS_EN.aurelia = {
    overview: `Aurelia is a fictional rogue exoplanet anomaly: a cold gas giant drifting without a parent star, still visible through charged auroras, translucent rings, and a long ionized plasma wake.`,
    params: [
        ['Mass', '~2.3 Mj'],
        ['Type', 'Rogue gas giant'],
        ['Thermal State', 'Cryogenic upper clouds'],
        ['Field', 'Extreme magnetosphere'],
        ['Visible Feature', 'Aurora and plasma tail'],
        ['Ring Material', 'Ice and metallic dust'],
    ],
    features: [
        'Procedural 3D planet shader with animated storm bands',
        'Transparent atmosphere, cloud layer, rings, moons, and magnetic arcs',
        'Aurora curtains above both poles',
        'A plasma wake makes the object read clearly from orbit',
    ],
    facts: [
        'Rogue planets are expected to exist between star systems',
        'Strong magnetospheres can produce auroras without direct starlight',
        'Ring systems can survive around giant planets far from a star',
        'The visual design references Jupiter bands, Saturn rings, and polar aurora imagery',
    ],
};

OBJECT_DOSSIERS_RU.aurelia = {
    overview: `Aurelia - вымышленная аномалия: холодная планета-гигант без родительской звезды, видимая за счет заряженных полярных сияний, прозрачных колец и длинного хвоста ионизированной плазмы.`,
    params: [
        ['Масса', '~2.3 Mj'],
        ['Тип', 'одинокий газовый гигант'],
        ['Состояние', 'криогенные верхние облака'],
        ['Поле', 'экстремальная магнитосфера'],
        ['Главный признак', 'сияния и плазменный хвост'],
        ['Кольца', 'лед и металлическая пыль'],
    ],
    features: [
        'Процедурный 3D-шейдер планеты с живыми штормовыми поясами',
        'Прозрачная атмосфера, облачный слой, кольца, луны и магнитные дуги',
        'Полярные aurora-завесы над обоими полюсами',
        'Плазменный хвост делает объект читаемым в orbit mode',
    ],
    facts: [
        'Одинокие планеты должны встречаться между звездными системами',
        'Сильная магнитосфера может создавать сияния даже без прямого света звезды',
        'Кольцевые системы могут сохраняться вокруг планет-гигантов далеко от звезды',
        'Визуальная база: пояса Юпитера, кольца Сатурна и полярные сияния',
    ],
};

// Active language (default: Russian, swap via toggle)
let dossierLang = 'ru';
const DOSSIER_LABELS = {
    en: { overview: 'OVERVIEW', params: 'PHYSICS PARAMETERS', features: 'RENDER FEATURES', facts: 'INTERESTING FACTS', title: 'ANOMALY DOSSIER', esc: 'ESC to close' },
    ru: { overview: 'ОБЗОР',    params: 'ФИЗИЧЕСКИЕ ПАРАМЕТРЫ', features: 'ОСОБЕННОСТИ РЕНДЕРА', facts: 'ИНТЕРЕСНЫЕ ФАКТЫ', title: 'ДОСЬЕ АНОМАЛИИ', esc: 'ESC чтобы закрыть' }
};

// ===== State =====
let appState = 'BOOT';
let nodeLabels = {};
let activeObjectId = 'sgr_a';
let activeThemeIdx = 0;
let autoRotate = true;

// ===== Boot Terminal =====
// entry types: plain (default), 'scan' (animated bar fill), 'typewriter' (char-by-char)
const BOOT_LINES = [
    { text: "> BIOS POST sequence initiated ...", cls: "line-info", delay: 90 },
    { text: "  [MEM ] 256 TB unified ................... OK", cls: "line-ok", delay: 50 },
    { text: "  [GPU ] 8x RTX-ASTRO cluster ............. OK", cls: "line-ok", delay: 50 },
    { text: "  [PHT ] 4096-lane photon buffer .......... OK", cls: "line-ok", delay: 50 },
    { text: "  [QENT] Quantum entangler ................ OK", cls: "line-ok", delay: 50 },
    { text: "", cls: "line-dim", delay: 20 },
    { text: "> Loading ASTRO-NAV/x86_64 kernel ...", cls: "line-info", delay: 100 },
    { text: "  gravitational_lens.ko ........... [  OK  ]", cls: "line-dim", delay: 50 },
    { text: "  schwarzschild_integrator.ko ..... [  OK  ]", cls: "line-dim", delay: 50 },
    { text: "  doppler_beaming.ko .............. [  OK  ]", cls: "line-dim", delay: 40 },
    { text: "  accretion_disk_volumetric.ko .... [  OK  ]", cls: "line-dim", delay: 50 },
    { text: "  magnetosphere_dipole.ko ......... [  OK  ]", cls: "line-dim", delay: 50 },
    { text: "  wormhole_throat.ko .............. [  OK  ]", cls: "line-dim", delay: 40 },
    { text: "", cls: "line-dim", delay: 20 },
    { text: "> Hardware diagnostics:", cls: "line-info", delay: 80 },
    { text: "  CPU_LOAD  [██████████░░░░░░]  67%  NOMINAL", cls: "line-dim", delay: 35 },
    { text: "  MEM_UTIL  [████████████░░░░]  76%  NOMINAL", cls: "line-dim", delay: 35 },
    { text: "  GPU_VRAM  [██████████████░░]  89%  NOMINAL", cls: "line-dim", delay: 35 },
    { text: "  THRML_SY  [█████████░░░░░░░]  58°C NOMINAL", cls: "line-dim", delay: 35 },
    { text: "  NET_SYNC  [███████████░░░░░]  71%  NOMINAL", cls: "line-dim", delay: 35 },
    { text: "", cls: "line-dim", delay: 20 },
    { text: "> Initializing WebGL2 renderer ...", cls: "line-info", delay: 100 },
    { text: "  Canvas: 1920x1080 @ 2x DPI ............. OK", cls: "line-dim", delay: 40 },
    { text: "  GLSL 3.00 ES compiler .............. READY", cls: "line-ok", delay: 50 },
    { text: "  Fragment pipeline: 4 shaders queued ... OK", cls: "line-dim", delay: 40 },
    { text: "", cls: "line-dim", delay: 20 },
    { text: "> Decoding raw telemetry stream ...", cls: "line-info", delay: 100 },
    { text: "  0x4A2F FF91 04B7 338E  0x11CC 75D0 52AE F90B", cls: "line-warn", delay: 25 },
    { text: "  0x671A 4488 BB36 E25D  0xC3F0 1B82 9D4E A7C1", cls: "line-warn", delay: 25 },
    { text: "  0x08F5 3A61 77BE D294  0x5E19 AB4C 2D83 F6E0", cls: "line-warn", delay: 25 },
    { text: "> Carrier signal analysis:", cls: "line-info", delay: 80 },
    { text: "  ◁▁▂▃▅▇██▇▅▃▂▁▁▂▃▅▇██▇▅▃▂▁▂▄▆▇██▇▆▄▂▷", cls: "line-ok", delay: 30 },
    { text: "  FREQ: 1.420405 GHz  SNR: 34.7 dB  LOCK: ACQ", cls: "line-dim", delay: 40 },
    { text: "", cls: "line-dim", delay: 20 },
    { type: "scan", label: "> Sector authentication", cls: "line-ok", result: "GRANTED", delay: 0 },
    { text: "", cls: "line-dim", delay: 20 },
    { text: "> Scanning deep-space anomaly registry ...", cls: "line-info", delay: 100 },
    { text: "  [ANOMALY] Sagittarius A*         — SEC_00-C — 4.15e6 M☉", cls: "line-warn", delay: 32 },
    { text: "  [ANOMALY] Gargantua Singularity  — SEC_04-A — 4.3e6 M☉",  cls: "line-warn", delay: 32 },
    { text: "  [ANOMALY] Vela Pulsar            — SEC_12-C — 1.44 M☉",   cls: "line-warn", delay: 32 },
    { text: "  [ANOMALY] SGR 1806-20 Magnetar   — SEC_18-F — extreme",   cls: "line-warn", delay: 32 },
    { text: "  [ANOMALY] Cygnus Wormhole        — SEC_07-F — exotic",    cls: "line-warn", delay: 32 },
    { text: "  [ANOMALY] Andromeda Gateway      — SEC_99-Z — bridge",    cls: "line-warn", delay: 32 },
    { text: "  [ANOMALY] Kepler Dyson Sphere    — SEC_19-B — megastruct",cls: "line-warn", delay: 32 },
    { text: "  CATALOG: 7 / 7 anomalies — COMPLETE", cls: "line-dim", delay: 40 },
    { text: "", cls: "line-dim", delay: 20 },
    { text: "> Building galaxy particle simulation ...", cls: "line-info", delay: 80 },
    { text: "  Background: 10,000 stars — spherical shell", cls: "line-dim", delay: 40 },
    { text: "  Disk:       40,000 stars — 2-arm log-spiral", cls: "line-dim", delay: 40 },
    { text: "  Nebula:     15,000 pts   — volumetric dust", cls: "line-dim", delay: 40 },
    { text: "", cls: "line-dim", delay: 20 },
    { text: "> Running diagnostics ...", cls: "line-info", delay: 80 },
    { text: "  Framebuffer integrity ............. PASS", cls: "line-ok", delay: 50 },
    { text: "  Depth buffer precision ............ PASS", cls: "line-ok", delay: 40 },
    { text: "  Raymarching pipeline .............. PASS", cls: "line-ok", delay: 50 },
    { text: "  Tone mapping (Reinhard) ........... PASS", cls: "line-ok", delay: 40 },
    { text: "", cls: "line-dim", delay: 30 },
    { type: "typewriter", text: "> ALL SYSTEMS NOMINAL — STAR CHART READY", cls: "line-ok", charDelay: 32, delay: 180 },
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
        const entry = BOOT_LINES[i];

        // update progress
        if (i === 3) progressWrap.classList.remove('boot-hidden');
        const pct = Math.min(100, Math.round(((i + 1) / total) * 100));
        progressBar.style.setProperty('--pct', pct + '%');
        progressPct.textContent = pct + '%';

        if (entry.type === 'scan') {
            // Animated fill bar
            const div = document.createElement('div');
            div.className = `line ${entry.cls}`;
            terminal.appendChild(div);
            terminal.scrollTop = terminal.scrollHeight;
            const barLen = 18;
            for (let b = 0; b <= barLen; b++) {
                const bar = '█'.repeat(b) + '░'.repeat(barLen - b);
                div.textContent = `${entry.label} [${bar}]`;
                await sleep(28);
            }
            div.textContent = `${entry.label} [${'█'.repeat(barLen)}] ${entry.result}`;
            await sleep(entry.delay || 200);

        } else if (entry.type === 'typewriter') {
            // Character-by-character typing
            const div = document.createElement('div');
            div.className = `line ${entry.cls}`;
            div.textContent = '';
            terminal.appendChild(div);
            terminal.scrollTop = terminal.scrollHeight;
            for (const ch of entry.text) {
                div.textContent += ch;
                terminal.scrollTop = terminal.scrollHeight;
                await sleep(entry.charDelay || 50);
            }
            await sleep(entry.delay || 100);

        } else {
            const div = document.createElement('div');
            div.className = `line ${entry.cls}`;
            div.textContent = entry.text;
            terminal.appendChild(div);
            terminal.scrollTop = terminal.scrollHeight;
            await sleep(entry.delay);
        }
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
let objectScene, composer, bloomPass, currentNebulaGroup = null;
let uniforms = {};
let galaxyParticles, galaxyDust, coreSprite, systemNodes = [];
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

function createNodeTexture(hex, type) {
    const S = 192;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, S, S);
    const cx = S / 2, cy = S / 2, R = S / 2;

    if (type === 'blackhole') {
        // ── Mini black hole: tilted accretion disk + dark event horizon ──
        const dR = R * 0.50;  // disk radius
        const dY = R * 0.10;  // disk vertical compression (3D tilt)

        // Diffuse outer halo
        const halo = ctx.createRadialGradient(cx, cy, dR * 0.6, cx, cy, R * 0.96);
        halo.addColorStop(0, hex + '22'); halo.addColorStop(0.5, hex + '18'); halo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R * 0.96, 0, Math.PI * 2); ctx.fill();

        // Back half of disk (dimmer, behind horizon)
        ctx.shadowColor = hex; ctx.shadowBlur = 14;
        const back = ctx.createLinearGradient(cx - dR, cy, cx + dR, cy);
        back.addColorStop(0, 'rgba(255,100,0,0.55)');
        back.addColorStop(0.45, hex + 'bb');
        back.addColorStop(1, 'rgba(255,200,50,0.2)');
        ctx.strokeStyle = back; ctx.lineWidth = 11;
        ctx.beginPath(); ctx.ellipse(cx, cy, dR, dY, 0, Math.PI, 0); ctx.stroke();

        // Event horizon (solid black circle)
        ctx.shadowBlur = 0;
        const hor = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.30);
        hor.addColorStop(0, '#000000'); hor.addColorStop(0.88, '#000000'); hor.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = hor; ctx.beginPath(); ctx.arc(cx, cy, R * 0.31, 0, Math.PI * 2); ctx.fill();

        // Front half of disk (bright, Doppler-shifted)
        ctx.shadowColor = hex; ctx.shadowBlur = 28;
        const front = ctx.createLinearGradient(cx - dR, cy, cx + dR, cy);
        front.addColorStop(0, 'rgba(255,230,80,1.0)');   // approaching = blue-shifted = bright
        front.addColorStop(0.35, hex + 'ff');
        front.addColorStop(0.7, hex + 'cc');
        front.addColorStop(1, 'rgba(200,40,0,0.5)');     // receding = red-shifted = dim
        ctx.strokeStyle = front; ctx.lineWidth = 14;
        ctx.beginPath(); ctx.ellipse(cx, cy, dR, dY, 0, 0, Math.PI); ctx.stroke();

        // Photon sphere glow (gravitational lensing ring)
        ctx.shadowBlur = 10; ctx.strokeStyle = 'rgba(255,210,120,0.5)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(cx, cy, R * 0.36, 0, Math.PI * 2); ctx.stroke();

    } else if (type === 'pulsar') {
        // ── Mini pulsar: neutron star + relativistic jets + magnetosphere rings ──
        const jLen = R * 0.86;

        // Faint magnetosphere rings
        ctx.shadowColor = hex; ctx.shadowBlur = 6; ctx.strokeStyle = hex + '28'; ctx.lineWidth = 1;
        [R*0.38, R*0.58, R*0.78].forEach(r => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); });

        // Jet beams (top + bottom)
        ctx.shadowBlur = 22;
        [[cy - 7, cy - jLen], [cy + 7, cy + jLen]].forEach(([y0, y1]) => {
            const g = ctx.createLinearGradient(cx, y0, cx, y1);
            g.addColorStop(0, hex + 'ff'); g.addColorStop(0.4, hex + 'cc'); g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.strokeStyle = g; ctx.lineWidth = 9;
            ctx.beginPath(); ctx.moveTo(cx, y0); ctx.lineTo(cx, y1); ctx.stroke();
            // bright inner core of jet
            ctx.lineWidth = 2.5; ctx.strokeStyle = '#ffffffbb';
            ctx.beginPath(); ctx.moveTo(cx, y0); ctx.lineTo(cx, y0 + (y1 - y0) * 0.45); ctx.stroke();
        });

        // Cross-ticks along jets
        ctx.shadowBlur = 4; ctx.strokeStyle = hex + 'aa'; ctx.lineWidth = 1.5;
        for (let t = 1; t <= 5; t++) {
            const w = Math.max(2, 10 - t * 1.8);
            ctx.beginPath(); ctx.moveTo(cx - w, cy - t * 14); ctx.lineTo(cx + w, cy - t * 14); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx - w, cy + t * 14); ctx.lineTo(cx + w, cy + t * 14); ctx.stroke();
        }

        // Neutron star core
        ctx.shadowBlur = 30;
        const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.21);
        core.addColorStop(0, '#ffffff'); core.addColorStop(0.2, '#ddf4ff');
        core.addColorStop(0.55, hex); core.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = core; ctx.beginPath(); ctx.arc(cx, cy, R * 0.21, 0, Math.PI * 2); ctx.fill();

    } else if (type === 'wormhole') {
        // ── Mini wormhole: portal with alternate-universe interior ──

        // Dark space background around portal
        const bg = ctx.createRadialGradient(cx, cy, R * 0.28, cx, cy, R * 0.90);
        bg.addColorStop(0, 'rgba(0,0,0,0)'); bg.addColorStop(1, 'rgba(0,5,20,0.5)');
        ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(cx, cy, R * 0.90, 0, Math.PI * 2); ctx.fill();

        // Alternate universe glow inside portal
        const portal = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.40);
        portal.addColorStop(0, hex + 'ff'); portal.addColorStop(0.45, hex + 'cc');
        portal.addColorStop(0.8, hex + '55'); portal.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = portal; ctx.beginPath(); ctx.arc(cx, cy, R * 0.40, 0, Math.PI * 2); ctx.fill();

        // Stars visible through the portal (other universe)
        ctx.shadowBlur = 0; ctx.fillStyle = '#ffffff';
        const rng = s => { let x = Math.sin(s * 9301 + 49297) * 43758; return x - Math.floor(x); };
        for (let i = 0; i < 14; i++) {
            const ang = rng(i * 3.14) * Math.PI * 2;
            const dist = rng(i * 1.61) * R * 0.30;
            const sr = 0.7 + rng(i * 2.71) * 1.8;
            ctx.globalAlpha = 0.6 + rng(i * 0.5) * 0.4;
            ctx.beginPath(); ctx.arc(cx + Math.cos(ang) * dist, cy + Math.sin(ang) * dist, sr, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Einstein ring (dashed bright)
        ctx.shadowColor = hex; ctx.shadowBlur = 20; ctx.strokeStyle = hex; ctx.lineWidth = 5;
        const segs = 10;
        for (let a = 0; a < segs; a++) {
            const s = (a / segs) * Math.PI * 2, e = s + (Math.PI * 2 / segs) - 0.26;
            ctx.beginPath(); ctx.arc(cx, cy, R * 0.50, s, e); ctx.stroke();
        }
        // Fine lensing halo
        ctx.shadowBlur = 6; ctx.strokeStyle = '#ffffff55'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(cx, cy, R * 0.52, 0, Math.PI * 2); ctx.stroke();

    } else if (type === 'planet') {
        // Mini rogue planet: crescent disk, rings, and aurora rim.
        const planetR = R * 0.38;
        const ringR = R * 0.64;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-0.28);
        ctx.shadowColor = hex;
        ctx.shadowBlur = 18;
        ctx.strokeStyle = hex + 'aa';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(0, 0, ringR, ringR * 0.26, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 4;
        ctx.strokeStyle = '#ffffff55';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(0, 0, ringR * 0.78, ringR * 0.18, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        const body = ctx.createRadialGradient(cx - planetR * 0.35, cy - planetR * 0.32, 0, cx, cy, planetR);
        body.addColorStop(0, '#ffffff');
        body.addColorStop(0.18, hex);
        body.addColorStop(0.58, '#18235a');
        body.addColorStop(1, '#020411');
        ctx.shadowColor = hex;
        ctx.shadowBlur = 20;
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(cx, cy, planetR, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = '#6fffffdd';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 14;
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.arc(cx, cy - planetR * 0.42 + i * 5, planetR * 0.58, Math.PI * 0.15, Math.PI * 0.82);
            ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';

    } else if (type === 'dyson') {
        // ── Mini Dyson sphere: star peeking through metallic grid cage ──
        const RG = R * 0.60;

        // Star background glow
        const sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, RG * 0.9);
        sg.addColorStop(0, hex + 'ee'); sg.addColorStop(0.35, hex + 'aa');
        sg.addColorStop(0.65, hex + '44'); sg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(cx, cy, RG * 0.9, 0, Math.PI * 2); ctx.fill();

        // Dark panel coverage (sphere blocks most of the star)
        ctx.shadowBlur = 0;
        const panels = ctx.createRadialGradient(cx, cy, RG * 0.18, cx, cy, RG);
        panels.addColorStop(0, 'rgba(2,4,10,0)'); panels.addColorStop(0.5, 'rgba(2,4,10,0.55)');
        panels.addColorStop(0.88, 'rgba(2,4,10,0.88)'); panels.addColorStop(1, 'rgba(2,4,10,0)');
        ctx.fillStyle = panels; ctx.beginPath(); ctx.arc(cx, cy, RG, 0, Math.PI * 2); ctx.fill();

        // Latitude ellipses (structural rings)
        ctx.shadowColor = hex; ctx.shadowBlur = 10; ctx.strokeStyle = hex + 'bb'; ctx.lineWidth = 1.5;
        [-R*0.28, -R*0.15, 0, R*0.15, R*0.28].forEach(yo => {
            const rx = Math.sqrt(Math.max(0, RG * RG - yo * yo));
            ctx.beginPath(); ctx.ellipse(cx, cy + yo, rx, rx * 0.18, 0, 0, Math.PI * 2); ctx.stroke();
        });

        // Longitude arcs (6 great circles)
        for (let i = 0; i < 6; i++) {
            ctx.save(); ctx.translate(cx, cy); ctx.rotate(i * Math.PI / 6);
            ctx.beginPath(); ctx.ellipse(0, 0, RG * 0.22, RG, 0, 0, Math.PI * 2);
            ctx.stroke(); ctx.restore();
        }

        // Outer shell circle
        ctx.lineWidth = 2.5; ctx.strokeStyle = hex; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.arc(cx, cy, RG, 0, Math.PI * 2); ctx.stroke();

        // Central star (shows through gaps)
        ctx.shadowBlur = 24;
        const sc = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.18);
        sc.addColorStop(0, '#ffffff'); sc.addColorStop(0.3, hex);
        sc.addColorStop(0.8, hex + '88'); sc.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sc; ctx.beginPath(); ctx.arc(cx, cy, R * 0.18, 0, Math.PI * 2); ctx.fill();

    } else if (type === 'nebula') {
        // ── Mini nebula: soft layered cloud + faint embedded stars ──
        // outer diffuse halo
        const halo = ctx.createRadialGradient(cx, cy, R * 0.10, cx, cy, R * 0.95);
        halo.addColorStop(0, hex + 'ee');
        halo.addColorStop(0.25, hex + 'aa');
        halo.addColorStop(0.55, hex + '55');
        halo.addColorStop(0.85, hex + '1a');
        halo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R * 0.95, 0, Math.PI * 2); ctx.fill();

        // soft wispy lobes (3 offset blobs)
        ctx.globalCompositeOperation = 'lighter';
        const rng = s => { const x = Math.sin(s * 9301 + 49297) * 43758; return x - Math.floor(x); };
        for (let i = 0; i < 3; i++) {
            const ang = rng(i * 1.7) * Math.PI * 2;
            const off = R * 0.18;
            const lx = cx + Math.cos(ang) * off;
            const ly = cy + Math.sin(ang) * off;
            const lr = R * (0.32 + rng(i * 2.3) * 0.18);
            const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
            g.addColorStop(0, hex + '88');
            g.addColorStop(0.5, hex + '33');
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(lx, ly, lr, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';

        // embedded stars
        ctx.shadowBlur = 0; ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 5; i++) {
            const ang = rng(i * 5.13) * Math.PI * 2;
            const dist = rng(i * 0.91) * R * 0.40;
            const sr = 1.0 + rng(i * 2.07) * 1.6;
            ctx.globalAlpha = 0.7 + rng(i * 1.3) * 0.3;
            ctx.beginPath(); ctx.arc(cx + Math.cos(ang) * dist, cy + Math.sin(ang) * dist, sr, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;

    } else {
        // Generic fallback (hexagon)
        ctx.shadowColor = hex; ctx.shadowBlur = 12; ctx.strokeStyle = hex; ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = i * Math.PI / 3;
            i === 0 ? ctx.moveTo(cx + R*0.75*Math.cos(a), cy + R*0.75*Math.sin(a))
                    : ctx.lineTo(cx + R*0.75*Math.cos(a), cy + R*0.75*Math.sin(a));
        }
        ctx.closePath(); ctx.stroke();
        const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, R * 0.3);
        g.addColorStop(0, '#ffffff'); g.addColorStop(0.4, hex); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 0.3, 0, Math.PI * 2); ctx.fill();
    }

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
    // Load shaders from inline script tags (works on file:// protocol, no fetch needed)
    // Strip #version and precision directives — Three.js r128 injects its own preamble
    function loadShader(id) {
        return document.getElementById(id).textContent
            .split('\n')
            .filter(l => !/^\s*#version\b|^\s*precision\s+(lowp|mediump|highp)/.test(l))
            .join('\n')
            .trim();
    }
    SHADERS['shaders/black-hole.frag']  = loadShader('shader-black-hole');
    SHADERS['shaders/pulsar.frag']      = loadShader('shader-pulsar');
    SHADERS['shaders/wormhole.frag']    = loadShader('shader-wormhole');
    SHADERS['shaders/dyson-sphere.frag']= loadShader('shader-dyson');
    SHADERS['shaders/nebula.frag']      = loadShader('shader-nebula');

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
    camera.position.set(0, 32, 72);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 80.0;
    controls.minDistance = 3.0;

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    buildGalaxyMap();

    // ortho scene for raymarched shaders (black hole, wormhole, dyson)
    orthoScene = new THREE.Scene();
    orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 3D scene for particle-based nebulae
    objectScene = new THREE.Scene();

    // postprocessing - bloom for the WOW factor
    if (typeof THREE.EffectComposer !== 'undefined') {
        composer = new THREE.EffectComposer(renderer);
        composer.addPass(new THREE.RenderPass(objectScene, camera));
        bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.14,  // strength
            0.35,  // radius
            0.9,   // threshold
        );
        composer.addPass(bloomPass);

        // ACES tonemap + subtle chromatic aberration + vignette (cinematic post)
        const finalShader = {
            uniforms: {
                tDiffuse:  { value: null },
                uExposure: { value: 0.62 },
                uVignette: { value: 0.35 },
                uChromaAb: { value: 0.0025 }
            },
            vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
            fragmentShader: `
                precision highp float;
                varying vec2 vUv;
                uniform sampler2D tDiffuse;
                uniform float uExposure;
                uniform float uVignette;
                uniform float uChromaAb;

                // ACES filmic tonemap - graceful highlight roll-off, no harsh white
                vec3 aces(vec3 x) {
                    float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
                    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
                }

                void main() {
                    vec2 cen = vUv - 0.5;
                    float dist = length(cen);
                    vec2 off = cen * dist * uChromaAb;
                    vec3 col;
                    col.r = texture2D(tDiffuse, vUv + off).r;
                    col.g = texture2D(tDiffuse, vUv).g;
                    col.b = texture2D(tDiffuse, vUv - off).b;
                    col *= uExposure;
                    col = aces(col);
                    float vig = 1.0 - smoothstep(0.55, 1.1, dist * 2.0) * uVignette;
                    col *= vig;
                    gl_FragColor = vec4(col, 1.0);
                }
            `
        };
        const finalPass = new THREE.ShaderPass(finalShader);
        finalPass.renderToScreen = true;
        composer.addPass(finalPass);
    }

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
        uShapeMode: { value: 0 },
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
            transitionProgress += delta * 0.8;
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
            if (appState === 'GALAXY') {
                const galaxyAngle = elapsed * 0.015;
                if (galaxyParticles) galaxyParticles.rotation.y = galaxyAngle;
                if (galaxyDust) galaxyDust.rotation.y = galaxyAngle;

                // rotate object markers with the galaxy spiral
                const cosA = Math.cos(galaxyAngle), sinA = Math.sin(galaxyAngle);
                systemNodes.forEach(node => {
                    const bp = node.userData.basePos;
                    if (bp) {
                        node.position.x = bp.x * cosA + bp.z * sinA;
                        node.position.z = -bp.x * sinA + bp.z * cosA;
                        node.position.y = bp.y;
                    }
                    const pulse = 2.0 + 0.18 * Math.sin(elapsed * 2.4 + node.position.x);
                    node.scale.set(pulse, pulse, 1.0);
                });
            }

            if (appState === 'GALAXY' && autoRotate && transitionProgress === 1.0) {
                const mt = elapsed * 0.015;
                const radius = 45.0;
                camera.position.x = radius * Math.cos(mt);
                camera.position.z = radius * Math.sin(mt);
                camera.position.y = 15.0 + 5.0 * Math.sin(mt * 0.5);
                controls.target.set(0, 0, 0);
            }

            controls.update();
            renderer.render(scene, camera);

            // Update floating node labels (project 3D → 2D)
            if (appState === 'GALAXY') {
                const hw = window.innerWidth * 0.5, hh = window.innerHeight * 0.5;
                systemNodes.forEach(node => {
                    const key = node.userData.id;
                    const lbl = nodeLabels[key];
                    if (!lbl) return;
                    const pos = node.position.clone().project(camera);
                    if (pos.z < 1.0) {
                        const sx = pos.x * hw + hw + 18;
                        const sy = -pos.y * hh + hh - 6;
                        lbl.style.transform = `translate(${sx}px,${sy}px)`;
                        lbl.classList.add('visible');
                    } else {
                        lbl.classList.remove('visible');
                    }
                });
            } else {
                // Hide labels during transition
                Object.values(nodeLabels).forEach(l => l.classList.remove('visible'));
            }

        } else if (appState === 'ORBIT') {
            const obj = OBJECTS[activeObjectId];
            const particleMode = obj && obj.renderMode === 'particles';

            if (controls && autoRotate) {
                const mt = elapsed * 0.02;
                const orbitR = obj.orbitRadius || (particleMode ? 22.0 : 17.0);
                const swing = obj.orbitSwing || 1.0;
                const a = swing < 0.98 ? Math.sin(mt) * swing : mt;
                camera.position.x = orbitR * Math.sin(a);
                camera.position.z = orbitR * Math.cos(a);
                if (particleMode) {
                    camera.position.y = 2.4 + Math.sin(elapsed * 0.19) * 0.45;
                }
            }

            controls.update();
            uniforms.uCamPos.value.copy(camera.position);
            uniforms.uInvProjection.value.copy(camera.projectionMatrixInverse);
            uniforms.uCamWorld.value.copy(camera.matrixWorld);
            uniforms.uTime.value = elapsed;

            NebulaParticles.tick(elapsed);
            // universal: rotate/pulse any group marked with userData.spin/pulse
            if (currentNebulaGroup) {
                NebulaParticles.tickOrbitals(currentNebulaGroup, delta, elapsed);
            }

            if (composer) {
                composer.render();
            } else {
                renderer.render(objectScene, camera);
            }
        }
    }

    requestAnimationFrame(loop);
}

function buildGalaxyMap() {
    // 1. Distant background starfield
    const bgCount = 16000;
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = new Float32Array(bgCount * 3);
    const bgCol = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) {
        const r = 85.0 + Math.random() * 45.0;
        const u = Math.random() * 2.0 - 1.0;
        const phi = Math.random() * Math.PI * 2.0;
        const theta = Math.acos(u);

        bgPos[i * 3]     = r * Math.sin(theta) * Math.cos(phi);
        bgPos[i * 3 + 1] = r * Math.cos(theta);
        bgPos[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);

        const brightness = 0.48 + Math.random() * 0.38;
        // Slight color variation: warm whites, blue-whites, orange tints
        const tint = Math.random();
        if (tint < 0.15) {
            bgCol[i * 3] = brightness; bgCol[i * 3 + 1] = brightness * 0.78; bgCol[i * 3 + 2] = brightness * 0.55; // orange
        } else if (tint < 0.35) {
            bgCol[i * 3] = brightness * 0.78; bgCol[i * 3 + 1] = brightness * 0.88; bgCol[i * 3 + 2] = brightness; // blue-white
        } else {
            bgCol[i * 3] = brightness; bgCol[i * 3 + 1] = brightness; bgCol[i * 3 + 2] = brightness; // white
        }
    }
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    bgGeo.setAttribute('color', new THREE.BufferAttribute(bgCol, 3));
    const bgMat = new THREE.PointsMaterial({
        size: 1.55,
        sizeAttenuation: false,
        map: createStarTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 0.82,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const bgStars = new THREE.Points(bgGeo, bgMat);
    scene.add(bgStars);

    // Extra bright-star highlights (~800 larger stars scattered in background)
    const brightCount = 520;
    const brightGeo = new THREE.BufferGeometry();
    const brightPos = new Float32Array(brightCount * 3);
    const brightCol = new Float32Array(brightCount * 3);
    for (let i = 0; i < brightCount; i++) {
        const r = 88.0 + Math.random() * 42.0;
        const u = Math.random() * 2.0 - 1.0;
        const phi = Math.random() * Math.PI * 2.0;
        const theta = Math.acos(u);
        brightPos[i * 3]     = r * Math.sin(theta) * Math.cos(phi);
        brightPos[i * 3 + 1] = r * Math.cos(theta);
        brightPos[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);
        const t = Math.random();
        if (t < 0.2) { // orange giant
            brightCol[i * 3] = 1.0; brightCol[i * 3 + 1] = 0.72; brightCol[i * 3 + 2] = 0.42;
        } else if (t < 0.45) { // blue-white O/B
            brightCol[i * 3] = 0.72; brightCol[i * 3 + 1] = 0.88; brightCol[i * 3 + 2] = 1.0;
        } else { // pure white
            brightCol[i * 3] = 1.0; brightCol[i * 3 + 1] = 1.0; brightCol[i * 3 + 2] = 1.0;
        }
    }
    brightGeo.setAttribute('position', new THREE.BufferAttribute(brightPos, 3));
    brightGeo.setAttribute('color', new THREE.BufferAttribute(brightCol, 3));
    const brightMat = new THREE.PointsMaterial({
        size: 3.1,
        sizeAttenuation: false,
        map: createStarTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    scene.add(new THREE.Points(brightGeo, brightMat));

    // 2. Bright stars of the galaxy
    const count = 56000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const cCore = new THREE.Color('#d88932');
    const cArm = new THREE.Color('#5f9dff');
    const cEdge = new THREE.Color('#05071c');

    for (let i = 0; i < count; i++) {
        const r = Math.pow(Math.random(), 2.3) * 24.0;
        const armIdx = i % 2;
        const theta = (armIdx * Math.PI) + (r * 0.65);
        const sx = (Math.random() - 0.5) * (1.45 / (r * 0.1 + 0.5));
        const sy = (Math.random() - 0.5) * (0.72 / (r * 0.15 + 0.5));
        const sz = (Math.random() - 0.5) * (1.45 / (r * 0.1 + 0.5));

        pos[i * 3]     = r * Math.cos(theta) + sx;
        pos[i * 3 + 1] = sy;
        pos[i * 3 + 2] = r * Math.sin(theta) + sz;

        let mc;
        if (r < 3.0) {
            mc = cCore.clone().lerp(cArm, r / 3.0);
            mc.multiplyScalar(0.30 + (r / 3.0) * 0.22);
        } else {
            mc = cArm.clone().lerp(cEdge, (r - 3.0) / 13.0);
            mc.multiplyScalar(0.72);
        }

        col[i * 3]     = mc.r;
        col[i * 3 + 1] = mc.g;
        col[i * 3 + 2] = mc.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
        size: 0.096,
        map: createStarTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 0.54,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    galaxyParticles = new THREE.Points(geo, mat);
    scene.add(galaxyParticles);

    // 3. Volumetric dust/nebula clouds
    const dustCount = 24000;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustCol = new Float32Array(dustCount * 3);
    
    const colorArmA = new THREE.Color('#1f9ed5');
    const colorArmB = new THREE.Color('#a545c8');
    const colorCoreGlow = new THREE.Color('#d88b32');
    
    for (let i = 0; i < dustCount; i++) {
        const r = Math.pow(Math.random(), 1.8) * 24.0;
        const armIdx = i % 2;
        const theta = (armIdx * Math.PI) + (r * 0.65) + (Math.random() - 0.5) * 0.22;
        
        const sx = (Math.random() - 0.5) * (3.9 / (r * 0.1 + 0.5));
        const sy = (Math.random() - 0.5) * (1.15 / (r * 0.15 + 0.5));
        const sz = (Math.random() - 0.5) * (3.9 / (r * 0.1 + 0.5));
        
        dustPos[i * 3]     = r * Math.cos(theta) + sx;
        dustPos[i * 3 + 1] = sy;
        dustPos[i * 3 + 2] = r * Math.sin(theta) + sz;
        
        let c;
        if (r < 3.0) {
            c = colorCoreGlow.clone().lerp(colorArmB, r / 3.0).multiplyScalar(0.38);
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
        size: 2.35,
        map: createNebulaTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 0.085,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    galaxyDust = new THREE.Points(dustGeo, dustMat);
    scene.add(galaxyDust);

    // 4. Central core bulge glow
    const coreSpriteMat = new THREE.SpriteMaterial({
        map: createCoreGlowTexture(),
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    coreSprite = new THREE.Sprite(coreSpriteMat);
    coreSprite.scale.set(5.2, 5.2, 1.0);
    scene.add(coreSprite);

    // 5. System Nodes (type-specific sprites, facing camera)
    const nodeColors = {
        sgr_a: '#ff8a3a',
        orion_nebula: '#ff7aa0',
        aurelia: '#25f0ff',
        crab_nebula: '#b56cff',
        pleiades: '#a8c8ff',
        cygnus: '#b56cff',
        kepler: '#ffcc66'
    };

    const objectTypes = {
        sgr_a: 'blackhole',
        orion_nebula: 'nebula', aurelia: 'planet', crab_nebula: 'nebula', pleiades: 'nebula',
        cygnus: 'wormhole',
        kepler: 'dyson'
    };

    for (const key in OBJECTS) {
        const obj = OBJECTS[key];
        const spriteMat = new THREE.SpriteMaterial({
            map: createNodeTexture(nodeColors[key] || '#ffffff', objectTypes[key] || 'generic'),
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(obj.position).multiplyScalar(2.5);
        sprite.scale.set(2.25, 2.25, 1.0);
        sprite.renderOrder = 999;
        sprite.userData = { id: key, basePos: sprite.position.clone() };
        scene.add(sprite);
        systemNodes.push(sprite);
    }

    // Build floating name labels for galaxy map
    const labelContainer = document.getElementById('node-labels');
    if (labelContainer) {
        for (const key in OBJECTS) {
            const lbl = document.createElement('div');
            lbl.className = 'node-label';
            // Short display: first 2 words of name
            const words = OBJECTS[key].name.split(' ');
            lbl.textContent = words.slice(0, 2).join(' ').toUpperCase();
            lbl.dataset.key = key;
            labelContainer.appendChild(lbl);
            nodeLabels[key] = lbl;
        }
    }
}

function getCurrentNodePosition(id) {
    const node = systemNodes.find(n => n.userData && n.userData.id === id);
    if (node) return node.position.clone();
    const obj = OBJECTS[id];
    return obj ? obj.position.clone().multiplyScalar(2.5) : new THREE.Vector3();
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
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
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

function onTransitionComplete() {
    const obj = OBJECTS[activeObjectId];
    if (!obj) return;

    const shaderSrc = SHADERS[obj.shader];
    if (!shaderSrc) {
        console.error('Shader not found in SHADERS map:', obj.shader);
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

    if (activeObjectId === 'kepler') {
        distG.style.display = 'none';
        dopG.style.display = 'none';
        document.getElementById('accessory-title').innerHTML = '<i class="fas fa-cubes"></i> Panel Grid';
    } else {
        distG.style.display = 'block';
        dopG.style.display = 'block';
        document.getElementById('accessory-title').innerHTML = '<i class="fas fa-circle-notch"></i> Structure';
    }

    // per-object shape mode for legacy nebula shader (0=orion, 2=crab, 3=pleiades)
    const shapeModeMap = { orion_nebula: 0, crab_nebula: 2, pleiades: 3 };
    uniforms.uShapeMode.value = (activeObjectId in shapeModeMap) ? shapeModeMap[activeObjectId] : 0;
    // pleiades reuses uBeamingScale as per-star brightness
    uniforms.uBeamingScale.value = (activeObjectId === 'pleiades') ? 1.6 : 0.0;

    // slider bounds
    const nebulaIds = ['orion_nebula', 'crab_nebula', 'pleiades'];
    if (nebulaIds.indexOf(activeObjectId) !== -1) {
        sliders.rs.min = 0.6; sliders.rs.max = 2.5; sliders.rs.step = 0.05;
        sliders.outer.min = 7.0; sliders.outer.max = 16.0; sliders.outer.step = 0.2;
    } else if (activeObjectId === 'aurelia') {
        sliders.rs.min = 0.8; sliders.rs.max = 2.2; sliders.rs.step = 0.05;
        sliders.outer.min = 5.0; sliders.outer.max = 12.0; sliders.outer.step = 0.1;
    } else if (activeObjectId === 'cygnus') {
        sliders.rs.min = 0.3; sliders.rs.max = 1.8; sliders.rs.step = 0.05;
        sliders.outer.min = 6.0; sliders.outer.max = 15.0; sliders.outer.step = 0.1;
    } else if (activeObjectId === 'kepler') {
        sliders.rs.min = 0.4; sliders.rs.max = 2.0; sliders.rs.step = 0.05;
        sliders.outer.min = 2.0; sliders.outer.max = 5.0; sliders.outer.step = 0.1;
    } else {
        sliders.rs.min = 0.2; sliders.rs.max = 2.2; sliders.rs.step = 0.05;
        sliders.outer.min = 4.0; sliders.outer.max = 15.0; sliders.outer.step = 0.1;
    }

    populatePresetsGrid(obj);
    populateThemesPicker(obj);
    applyPresetConfig(obj, Object.keys(obj.presets)[0]);

    // dispose previous object group if any
    if (currentNebulaGroup) {
        objectScene.remove(currentNebulaGroup);
        NebulaParticles.dispose(currentNebulaGroup);
        currentNebulaGroup = null;
    }
    orthoScene.clear();

    const themeIdx = obj.presets[Object.keys(obj.presets)[0]].theme || 0;
    const theme = obj.themes[themeIdx];
    currentNebulaGroup = new THREE.Group();

    if (obj.renderMode === 'particles' && typeof NebulaParticles !== 'undefined') {
        currentNebulaGroup.add(NebulaParticles.build(obj.particleType, theme, renderer));
        camera.position.set(0, 2.4, obj.orbitRadius || 22.0);
        controls.maxDistance = Math.max(40.0, (obj.orbitRadius || 22.0) * 2.2);
        controls.minDistance = 4.0;
    } else {
        // raymarched shader as fullscreen background plane in objectScene
        shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vtx,
            fragmentShader: shaderSrc,
            uniforms: uniforms,
            depthWrite: false,
            depthTest: false,
            transparent: true,
            glslVersion: THREE.GLSL3
        });
        const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial);
        bgMesh.frustumCulled = false;
        bgMesh.renderOrder = -1000;
        currentNebulaGroup.add(bgMesh);

        // 3D accent particles in front of the shader background
        if (obj.accentParticles && typeof NebulaParticles !== 'undefined') {
            const accent = NebulaParticles.buildAccent(activeObjectId, theme, renderer);
            if (accent) currentNebulaGroup.add(accent);
        }
        camera.position.set(0, 5, 17);
        controls.maxDistance = 35.0;
        controls.minDistance = 3.5;
    }
    objectScene.add(currentNebulaGroup);

    controls.target.set(0, 0, 0);
    autoRotate = true;
    btnAutopilot.classList.add('active');

    appState = 'ORBIT';
    sidebar.classList.remove('collapsed');
    btnBack.classList.remove('hidden');

    // Hide galaxy labels in orbit mode
    Object.values(nodeLabels).forEach(l => l.classList.remove('visible'));
}

// back to galaxy
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-back-to-galaxy').addEventListener('click', () => {
        sidebar.classList.add('collapsed');
        btnBack.classList.add('hidden');

        setTimeout(() => {
            appState = 'GALAXY';
            camera.position.set(0, 32, 72);
            controls.target.set(0, 0, 0);
            controls.maxDistance = 120.0;
            controls.minDistance = 10.0;
            autoRotate = true;
            btnAutopilot.classList.remove('active');
            // free particle nebula memory
            if (currentNebulaGroup) {
                objectScene.remove(currentNebulaGroup);
                NebulaParticles.dispose(currentNebulaGroup);
                currentNebulaGroup = null;
            }
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

    if (activeObjectId === 'kepler') {
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
            const nodePos = getCurrentNodePosition(activeObjectId);
            targetCameraPos.copy(nodePos).add(new THREE.Vector3(0, 3, 7));
            targetLookAt.copy(nodePos);
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
    if (composer) composer.setSize(window.innerWidth, window.innerHeight);
}

// ===== Side Panel Animations =====
function runSidePanels() {
    const gravEl = document.getElementById('bp-grav');
    const fluxEl = document.getElementById('bp-flux');
    const sysEl  = document.getElementById('bp-sys');
    const navEl  = document.getElementById('bp-nav');
    if (!gravEl) return;

    const alive = () => appState === 'BOOT';

    // ── GRAV FIELD SCANNER ──
    const gravSectors = ['SΩ-001','SΩ-002','SΩ-003','SΩ-004','SΩ-005','SΩ-006','SΩ-007','SΩ-008'];
    let gravVals = gravSectors.map(() => 25 + Math.random() * 65);
    function tickGrav() {
        if (!alive()) return;
        gravVals = gravVals.map(v => Math.max(4, Math.min(99, v + (Math.random() * 14 - 7))));
        const lines = gravVals.map((v, i) => {
            const pct = Math.round(v);
            const f   = Math.round(pct / 10);
            return `${gravSectors[i]}  ${'█'.repeat(f)}${'░'.repeat(10 - f)}  ${String(pct).padStart(3)}%`;
        });
        const active  = gravVals.filter(v => v > 20).length;
        const avgPct  = (gravVals.reduce((a, b) => a + b, 0) / gravVals.length).toFixed(1);
        gravEl.textContent = lines.join('\n') + `\n──────────────────\nGRID: ${active}/8   AVG: ${avgPct}%`;
        setTimeout(tickGrav, 520);
    }

    // ── PARTICLE FLUX + TEXT WAVEFORM ──
    const fluxKinds = ['neutrino','photon  ','tachyon ','grav-wav','dark-mat','positron','muon    ','axion   '];
    let fluxHistory = [];
    let waveHistory = Array.from({length: 20}, () => Math.random());
    function tickFlux() {
        if (!alive()) return;
        const v    = (Math.random() * 9998 - 4999).toExponential(3);
        const sign = parseFloat(v) >= 0 ? '+' : '';
        const k    = fluxKinds[Math.floor(Math.random() * fluxKinds.length)];
        fluxHistory.push(`${sign}${v}  ${k}`);
        if (fluxHistory.length > 5) fluxHistory.shift();

        waveHistory.push(Math.random());
        if (waveHistory.length > 20) waveHistory.shift();
        const blocks = '▁▂▃▄▅▆▇█';
        const wave   = waveHistory.map(h => blocks[Math.min(7, Math.floor(h * 8))]).join('');

        const flux = (Math.random() * 28 - 4).toFixed(2);
        fluxEl.textContent =
            fluxHistory.join('\n') +
            '\n──────────────────\n' +
            wave + '\n' +
            `FLUX: ${flux >= 0 ? '+' : ''}${flux} μSv/h`;
        setTimeout(tickFlux, 290);
    }

    // ── SYSTEM RESOURCES ──
    const resLabels = ['CPU ','MEM ','GPU ','NET ','DISK'];
    let resVals = [38, 51, 24, 17, 45];
    let cpuTemp = 45.5;
    function tickSys() {
        if (!alive()) return;
        resVals = resVals.map(v => Math.max(4, Math.min(98, v + (Math.random() - 0.47) * 9)));
        cpuTemp = Math.max(38, Math.min(85, cpuTemp + (Math.random() - 0.5) * 1.4));
        const lines = resLabels.map((n, i) => {
            const pct  = Math.round(resVals[i]);
            const f    = Math.round(pct / 10);
            const flag = pct > 85 ? ' !' : pct > 65 ? ' ~' : '  ';
            return `${n}  ${'█'.repeat(f)}${'░'.repeat(10 - f)}  ${String(pct).padStart(2)}%${flag}`;
        });
        const tStatus = cpuTemp > 72 ? 'WARN' : 'OK';
        sysEl.textContent = lines.join('\n') + `\n──────────────────\nTEMP: ${cpuTemp.toFixed(1)}°C  [${tStatus}]`;
        setTimeout(tickSys, 370);
    }

    // ── NAV CALIBRATION ──
    let navTick = 0;
    function tickNav() {
        if (!alive()) return;
        navTick++;
        const ra_s   = (43.091 + Math.sin(navTick * 0.09) * 0.06).toFixed(3);
        const dec_s  = (41.287 + Math.cos(navTick * 0.07) * 0.04).toFixed(3);
        const dist   = (8.1780 + Math.sin(navTick * 0.05) * 0.0009).toFixed(4);
        const gyroP  = Math.min(100, navTick * 5);
        const starP  = Math.min(100, Math.max(0, (navTick - 5) * 6));
        const gF     = Math.round(gyroP / 10);
        const sF     = Math.round(starP / 10);
        const gBar   = '█'.repeat(gF) + '░'.repeat(10 - gF);
        const sBar   = '█'.repeat(sF) + '░'.repeat(10 - sF);
        const gLbl   = gyroP >= 100 ? 'LOCKED ✓' : `SYNC  ${gyroP}%`;
        const sLbl   = starP >= 100 ? 'LOCKED ✓' : `SYNC  ${starP}%`;
        const now    = new Date();
        const epoch  = 'J' + (2026 + now.getMonth() / 12).toFixed(2);
        navEl.textContent =
            `RA   14h 29m ${ra_s}s\n` +
            `DEC  -62° 28' ${dec_s}"\n` +
            `DIST ${dist} kpc\n` +
            `EPOCH: ${epoch}\n` +
            `──────────────────\n` +
            `GYRO ${gBar}\n` +
            `     ${gLbl}\n` +
            `STAR ${sBar}\n` +
            `     ${sLbl}`;
        setTimeout(tickNav, 240);
    }

    setTimeout(tickGrav,  80);
    setTimeout(tickFlux, 170);
    setTimeout(tickSys,  120);
    setTimeout(tickNav,   40);
}

// ===== Dossier Functions =====
function getDossiers() {
    return dossierLang === 'ru' ? OBJECT_DOSSIERS_RU : OBJECT_DOSSIERS_EN;
}

function buildDossierHTML(id) {
    const obj = OBJECTS[id];
    const d   = getDossiers()[id];
    const L   = DOSSIER_LABELS[dossierLang];
    if (!obj || !d) return '<p class="dossier-text">No dossier available.</p>';

    const paramsRows = d.params.map(([k, v]) =>
        `<span class="dossier-param-key">${k}</span><span class="dossier-param-val">${v}</span>`
    ).join('');

    const featureItems = d.features.map(f => `<li>${f}</li>`).join('');
    const factItems    = d.facts.map(f => `<li>${f}</li>`).join('');

    return `
<div class="dossier-object-name">${obj.name}</div>
<div class="dossier-object-class">${obj.class}</div>

<div class="dossier-section">
    <div class="dossier-section-title">▸ ${L.overview}</div>
    <p class="dossier-text">${d.overview}</p>
</div>

<hr class="dossier-divider">

<div class="dossier-section">
    <div class="dossier-section-title">▸ ${L.params}</div>
    <div class="dossier-param-grid">${paramsRows}</div>
</div>

<hr class="dossier-divider">

<div class="dossier-section">
    <div class="dossier-section-title">▸ ${L.features}</div>
    <ul class="dossier-list">${featureItems}</ul>
</div>

<hr class="dossier-divider">

<div class="dossier-section">
    <div class="dossier-section-title">▸ ${L.facts}</div>
    <ul class="dossier-list">${factItems}</ul>
</div>`;
}

function refreshDossierLangBtn() {
    const btn = document.getElementById('dossier-lang');
    if (!btn) return;
    btn.textContent = dossierLang === 'ru' ? 'EN' : 'RU';
    btn.title = dossierLang === 'ru' ? 'Switch to English' : 'Переключить на русский';
    const esc = document.getElementById('dossier-esc');
    if (esc) esc.textContent = DOSSIER_LABELS[dossierLang].esc;
}

function openDossier(id) {
    const overlay = document.getElementById('dossier-overlay');
    const body    = document.getElementById('dossier-body');
    const title   = document.getElementById('dossier-title');
    const pct     = document.getElementById('dossier-scroll-pct');
    if (!overlay || !body) return;

    const obj = OBJECTS[id];
    const L   = DOSSIER_LABELS[dossierLang];
    title.textContent = `${L.title} — ${obj ? obj.sector : 'CLASSIFIED'}`;
    body.innerHTML = buildDossierHTML(id);
    body.scrollTop = 0;
    pct.textContent = '0%';
    refreshDossierLangBtn();

    body.onscroll = () => {
        const max = body.scrollHeight - body.clientHeight;
        const p   = max > 0 ? Math.round((body.scrollTop / max) * 100) : 100;
        pct.textContent = p + '%';
    };

    overlay.dataset.activeId = id;
    overlay.classList.remove('dossier-hidden');
}

function toggleDossierLang() {
    dossierLang = dossierLang === 'ru' ? 'en' : 'ru';
    const overlay = document.getElementById('dossier-overlay');
    const activeId = overlay && overlay.dataset.activeId;
    if (activeId && !overlay.classList.contains('dossier-hidden')) {
        openDossier(activeId);
    } else {
        refreshDossierLangBtn();
    }
}

function closeDossier() {
    const overlay = document.getElementById('dossier-overlay');
    if (overlay) overlay.classList.add('dossier-hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    // Dossier close button
    const dossierClose = document.getElementById('dossier-close');
    if (dossierClose) dossierClose.addEventListener('click', closeDossier);

    // Dossier language toggle
    const dossierLangBtn = document.getElementById('dossier-lang');
    if (dossierLangBtn) {
        dossierLangBtn.addEventListener('click', toggleDossierLang);
        refreshDossierLangBtn();
    }

    // Dossier backdrop click
    const dossierOverlay = document.getElementById('dossier-overlay');
    if (dossierOverlay) {
        dossierOverlay.addEventListener('click', e => {
            if (e.target === dossierOverlay) closeDossier();
        });
    }

    // Dossier info-card button
    const btnDossierInfo = document.getElementById('btn-dossier-info');
    if (btnDossierInfo) {
        btnDossierInfo.addEventListener('click', () => openDossier(activeObjectId));
    }

    // Dossier orbit sidebar button
    const btnDossierOrbit = document.getElementById('btn-dossier-orbit');
    if (btnDossierOrbit) {
        btnDossierOrbit.addEventListener('click', () => openDossier(activeObjectId));
    }

    // ESC key closes dossier (or guide)
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            const dos = document.getElementById('dossier-overlay');
            if (dos && !dos.classList.contains('dossier-hidden')) {
                closeDossier();
                return;
            }
            const guide = document.getElementById('guide-overlay');
            if (guide && !guide.classList.contains('guide-hidden')) {
                guide.classList.add('guide-hidden');
            }
        }
    });
});

// ===== Entry Point =====
window.onload = async function() {
    runSidePanels();
    await runBootSequence();
    await initApp();
};
