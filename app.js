// ===== Inline Shaders (loaded from script tags, no fetch needed) =====
const SHADERS = {};

// ===== Object Catalog =====
const OBJECTS = {
    gargantua: {
        name: "Gargantua Singularity",
        class: "SCHWARZSCHILD BLACK HOLE",
        sector: "SECTOR 04-A",
        coords: "X: -1.00 / Y: 0.60 / Z: 3.90",
        mass: "4.3e6 M☉",
        rad: "STABLE CORE",
        desc: "Supermassive singularity at galactic center. Accretion disk with Keplerian velocity profiles, relativistic Doppler beaming, and gravitational lensing geodesics.",
        shader: "shaders/black-hole.frag",
        position: new THREE.Vector3(-1.0, 0.6, 3.9),
        presets: {
            "gargantua": { rs: 1.0, distortion: 1.0, outer: 9.5, speed: 1.6, doppler: 1.0, stars: 1.0, theme: 0 },
            "supermassive": { rs: 1.8, distortion: 0.7, outer: 14.5, speed: 0.8, doppler: 0.5, stars: 1.2, theme: 1 }
        },
        themes: [
            { c1: '#ffc000', c2: '#ff2200', name: 'Gargantua Orange', temp: '8.4e6' },
            { c1: '#00f0ff', c2: '#0011ff', name: 'Cosmic Cyan', temp: '1.2e7' },
            { c1: '#ea00ff', c2: '#5100ff', name: 'Quantum Purple', temp: '9.8e6' }
        ],
        labels: { rs: "Horizon Mass (Rs)", distortion: "Warp Lensing", outer: "Disk Outer Bound", speed: "Disk Rotation", doppler: "Doppler Beaming" }
    },
    vela: {
        name: "Vela Pulsar",
        class: "ROTATING NEUTRON STAR",
        sector: "SECTOR 12-C",
        coords: "X: 0.90 / Y: 0.50 / Z: -3.90",
        mass: "1.44 M☉",
        rad: "EXTREME PULSATION",
        desc: "Highly magnetized neutron star. Precessing radio jet cones from magnetic poles, dipole magnetosphere field-line grid.",
        shader: "shaders/pulsar.frag",
        position: new THREE.Vector3(0.9, 0.5, -3.9),
        presets: {
            "vela": { rs: 0.8, distortion: 1.0, outer: 12.0, speed: 2.0, doppler: 1.0, stars: 1.0, theme: 0 },
            "magnetar": { rs: 1.2, distortion: 1.8, outer: 16.0, speed: 0.6, doppler: 2.2, stars: 0.5, theme: 1 }
        },
        themes: [
            { c1: '#00e5ff', c2: '#5100ff', name: 'Gamma Blue', temp: '2.5e8' },
            { c1: '#ff4040', c2: '#ea00ff', name: 'Magnetar Purple', temp: '4.1e8' }
        ],
        labels: { rs: "Core Size (Rs)", distortion: "Magneto-Warp", outer: "Field Boundary", speed: "Spin Frequency", doppler: "Jet Intensity" }
    },
    cygnus: {
        name: "Cygnus Wormhole",
        class: "MORRIS-THORNE BRIDGE",
        sector: "SECTOR 07-F",
        coords: "X: 5.40 / Y: -0.80 / Z: -2.50",
        mass: "N/A (Exotic)",
        rad: "STABLE GATEWAY",
        desc: "Topological shortcut through curved spacetime. Light crosses the coordinate boundary to sample an alternate-universe background.",
        shader: "shaders/wormhole.frag",
        position: new THREE.Vector3(5.4, -0.8, -2.5),
        presets: {
            "stable-gate": { rs: 1.0, distortion: 1.0, outer: 10.0, speed: 1.0, doppler: 1.0, stars: 1.0, theme: 0 },
            "einstein-rosen": { rs: 0.65, distortion: 2.2, outer: 12.0, speed: 2.5, doppler: 1.8, stars: 1.2, theme: 1 }
        },
        themes: [
            { c1: '#ea00ff', c2: '#00e5ff', name: 'Nebula Portal', temp: '0' },
            { c1: '#ffc000', c2: '#00ff66', name: 'Gold-Emerald', temp: '12' }
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
        desc: "Swarm of rotating geometric solar collectors around a star. Light escapes through panel gaps, exposing flares and backlit plates.",
        shader: "shaders/dyson-sphere.frag",
        position: new THREE.Vector3(7.0, 1.0, 0.5),
        presets: {
            "dyson-orbit": { rs: 0.9, distortion: 0.0, outer: 2.8, speed: 1.5, doppler: 1.8, stars: 1.0, theme: 0 },
            "closed-swarm": { rs: 1.15, distortion: 0.0, outer: 2.8, speed: 0.7, doppler: 0.9, stars: 1.2, theme: 1 }
        },
        themes: [
            { c1: '#ff9d00', c2: '#ffcc00', name: 'Solar Gold', temp: '5780' },
            { c1: '#00e5ff', c2: '#ffffff', name: 'Sirius White-Blue', temp: '9940' }
        ],
        labels: { rs: "Star Diameter", distortion: "Gravity Flex", outer: "Shell Size", speed: "Orbital Speed", doppler: "Circuit Radiance" }
    },
    sgr_a: {
        name: "Sagittarius A*",
        class: "SUPERMASSIVE BLACK HOLE",
        sector: "SECTOR 00-CORE",
        coords: "X: 0.00 / Y: 0.00 / Z: 0.00",
        mass: "4.15e6 M☉",
        rad: "EVENT HORIZON DETECTED",
        desc: "The supermassive black hole at the center of the Milky Way. Creates intense gravitational lensing of background stars and features a highly energetic plasma accretion flow.",
        shader: "shaders/black-hole.frag",
        position: new THREE.Vector3(0, 0, 0),
        presets: {
            "core-singularity": { rs: 1.5, distortion: 1.4, outer: 11.0, speed: 2.2, doppler: 1.3, stars: 1.2, theme: 0 },
            "quiet-horizon": { rs: 0.8, distortion: 0.8, outer: 8.0, speed: 1.2, doppler: 0.8, stars: 1.0, theme: 1 }
        },
        themes: [
            { c1: '#ff3300', c2: '#ff9900', name: 'Plasma Flare', temp: '1.5e7' },
            { c1: '#00ffcc', c2: '#0055ff', name: 'Core Cyan', temp: '8.9e6' }
        ],
        labels: { rs: "Horizon Mass (Rs)", distortion: "Warp Lensing", outer: "Disk Outer Bound", speed: "Disk Rotation", doppler: "Doppler Beaming" }
    },
    andromeda: {
        name: "Andromeda Gateway",
        class: "INTERGALACTIC WORMHOLE",
        sector: "SECTOR 99-Z",
        coords: "X: -7.20 / Y: 2.50 / Z: -3.50",
        mass: "N/A (Exotic Matter)",
        rad: "STABLE ALIEN BRIDGE",
        desc: "A massive, artificially-stabilized Morris-Thorne wormhole connecting our galaxy to the Andromeda galaxy. Gravitational lensing warps our view of the Andromeda starfield inside the throat.",
        shader: "shaders/wormhole.frag",
        position: new THREE.Vector3(-7.2, 2.5, -3.5),
        presets: {
            "intergalactic": { rs: 1.2, distortion: 1.5, outer: 11.5, speed: 1.8, doppler: 1.4, stars: 1.0, theme: 0 },
            "void-gate": { rs: 0.7, distortion: 2.5, outer: 9.0, speed: 0.5, doppler: 0.8, stars: 1.5, theme: 1 }
        },
        themes: [
            { c1: '#cc00ff', c2: '#330066', name: 'Andromeda Magenta', temp: '0' },
            { c1: '#00ffaa', c2: '#003311', name: 'Bio-Green Portal', temp: '6' }
        ],
        labels: { rs: "Throat Radius (Rs)", distortion: "Throat Bending", outer: "Lensing Zone", speed: "Chromatic Drift", doppler: "Alternate Lumens" }
    },
    magnetar_1806: {
        name: "SGR 1806-20 Magnetar",
        class: "EXTREME MAGNETAR",
        sector: "SECTOR 18-F",
        coords: "X: -5.40 / Y: -1.20 / Z: 2.50",
        mass: "2.1 M☉",
        rad: "MAGNETIC FIELD BURST",
        desc: "An ultradense magnetosphere generator. The strongest magnetic field observed in the universe, distorting the surrounding space and emitting violent gamma-ray flares.",
        shader: "shaders/pulsar.frag",
        position: new THREE.Vector3(-5.4, -1.2, 2.5),
        presets: {
            "magnetar-burst": { rs: 0.8, distortion: 2.5, outer: 16.0, speed: 4.2, doppler: 2.4, stars: 0.7, theme: 0 },
            "rest-state": { rs: 0.6, distortion: 1.5, outer: 11.0, speed: 1.2, doppler: 1.0, stars: 1.1, theme: 1 }
        },
        themes: [
            { c1: '#ff3300', c2: '#5500ff', name: 'Magnetic Red-Violet', temp: '5.2e8' },
            { c1: '#00ffcc', c2: '#003366', name: 'Hyper-Gamma Cyan', temp: '6.5e8' }
        ],
        labels: { rs: "Core Size (Rs)", distortion: "Magneto-Warp", outer: "Field Boundary", speed: "Spin Frequency", doppler: "Jet Intensity" }
    }
};
// ===== Dossier Data (English) =====
const OBJECT_DOSSIERS_EN = {
    gargantua: {
        overview: `Gargantua Singularity is a Schwarzschild-class supermassive black hole catalogued in Sector 04-A. With a mass of 4.3 × 10⁶ solar masses it generates one of the strongest gravitational lensing fields in the registry, bending background starlight into a complete Einstein ring at observer approach.

The surrounding accretion disk spans from 2.2 Rs to 9.5 Rs and rotates with Keplerian velocity profiles. Near the inner edge, gas reaches 0.42c, producing highly visible relativistic Doppler beaming — the approaching side appears blue-shifted and dramatically brighter, the receding side red and dim.`,
        params: [
            ['Mass',               '4.3 × 10⁶ M☉'],
            ['Schwarzschild Radius','Rs ≈ 12.7 × 10⁹ km'],
            ['Photon Sphere',       '1.5 Rs (unstable)'],
            ['ISCO',               '3 Rs (innermost stable orbit)'],
            ['Disk Temperature',    '8.4 × 10⁶ K (inner edge)'],
            ['Hawking Temperature', '~10⁻¹⁴ K (effectively 0)'],
            ['Sector',             '04-A  |  Coords: −3.50 / 0.80 / −2.00'],
        ],
        features: [
            'Full Schwarzschild geodesic raymarching — 130 GPU steps per ray',
            'Volumetric 3D accretion disk with Perlin fbm warp noise',
            'Relativistic Doppler beaming: D = 1/(γ(1 − β·cosθ))³ per pixel',
            'Gravitational redshift applied radially: √(1 − Rs/r)',
            'Photon-ring glow halo at the event horizon boundary',
            'Tone-mapped with Reinhard operator to handle HDR bloom',
        ],
        facts: [
            'A clock at 1.1 Rs runs 3× slower than one at infinity — visible as color shift',
            'The photon sphere at 1.5 Rs lets light orbit; any photon that grazes it spirals in',
            'Hawking radiation at this mass would take 10⁸⁴ years to evaporate the black hole',
            'The shadow diameter as seen from Earth would subtend ~52 μas — resolvable by EHT',
            'Tidal forces at the horizon are gentle enough that a human would not feel the crossing',
        ],
    },
    vela: {
        overview: `Vela Pulsar is a rapidly rotating neutron star born from a core-collapse supernova approximately 11,000 years ago. Its spin axis is tilted 45° from the rotation plane, causing its relativistic radio jets to sweep a cone pattern — the lighthouse effect that produces periodic pulses detected across the galaxy.

The precessing dipole magnetosphere visualised here follows actual field-line topology: field lines bow outward near the equator and converge at the magnetic poles where pair-production generates the jet beams.`,
        params: [
            ['Mass',             '1.44 M☉'],
            ['Radius',           '~12 km'],
            ['Spin Period',      '89 ms  (11.2 Hz)'],
            ['Surface B-field',  '3.4 × 10¹² G'],
            ['Jet Half-angle',   '7° (conical beam)'],
            ['Surface Temp',     '~7 × 10⁵ K'],
            ['Sector',           '12-C  |  Coords: 5.00 / 1.00 / −4.00'],
        ],
        features: [
            'Precessing dipole magnetosphere with full field-line grid overlay',
            'Conical relativistic jet from magnetic poles (GLSL raymarching, 90 steps)',
            'Pulse modulation: glow intensity follows 1 + 0.3·sin(r·1.5 − t·12)',
            'Surface hotspot aligned to magnetic axis (bolometric brightness peak)',
            'Configurable jet opening half-angle via Beaming Scale slider',
        ],
        facts: [
            'Neutron star matter is so dense that a teaspoon weighs ~10¹⁴ kg',
            'The surface gravity is ~2 × 10¹¹ g — a feather dropped there hits at 0.6c',
            'Vela pulses are used as a natural clock to test general relativity to 10⁻⁵ precision',
            'Glitch events — sudden spin-ups — reveal superfluid neutron layers in the crust',
            'The radio jet deposits so much energy it inflates a 250-light-year pulsar wind nebula',
        ],
    },
    cygnus: {
        overview: `Cygnus Wormhole is a stable Morris–Thorne traversable wormhole in Sector 07-F. Unlike a black hole, the throat does not have a singularity — spacetime is smooth at the crossing point, and a ray that penetrates to r < Rs experiences coordinate inversion, emerging into an independent alternate-universe coordinate space with its own stellar background.

The throat must be threaded by exotic matter with negative energy density to remain open. The rendered ring glow represents the gravitational focusing of background photons around the throat.`,
        params: [
            ['Throat Radius',     'Rs (tunable: 0.35 – 1.2)'],
            ['Exotic Matter',     'Required: ρ < 0 (Casimir-like)'],
            ['Lensing Equation',  'Morris–Thorne metric, ℓ-coordinate'],
            ['Throat Crossing',   'p_new = −p × 1.01 (coord inversion)'],
            ['Ring Color Shift',  'Oscillates orange ↔ cyan at spin rate'],
            ['Stability Class',   'STABLE GATEWAY (positive feedback null)'],
            ['Sector',            '07-F  |  Coords: −6.00 / −1.00 / 5.00'],
        ],
        features: [
            'Dual-universe starfields: our universe (blue nebula) vs alternate (warm gold-orange)',
            'Smooth throat crossing — ray direction inverted and coordinates negated at r < Rs',
            'Chromatic ring glow that cycles hue based on spin parameter',
            'Alternate nebula brightness controlled by Doppler slider (alternate luminosity)',
            'Independent 3D noise fbm for each universe\'s nebula texture',
        ],
        facts: [
            'The Morris–Thorne paper (1988) was the first rigorous proof that GR permits wormholes',
            'Exotic matter with ρ < 0 exists in the Casimir effect — but at negligible scale today',
            'A wormhole could theoretically allow time travel if one mouth is accelerated relativistically',
            'Passing through at c would take zero proper time regardless of how far the other end is',
            'Hawking\'s chronology protection conjecture suggests quantum effects collapse them before use',
        ],
    },
    kepler: {
        overview: `Kepler Dyson Sphere is a Type II civilisation megastructure consisting of a rotating geometric swarm of solar collector panels surrounding a 1.08 M☉ host star. The panels are arranged in a geodesic grid pattern, leaving systematic gaps through which stellar flares and corona activity are visible.

Unlike a solid shell (which would be dynamically unstable), this design uses orbital mechanics to maintain gap spacing. The inner surface converts incident starlight to usable energy; the outer surface radiates waste heat as thermal infrared.`,
        params: [
            ['Host Star Mass',   '1.08 M☉'],
            ['Shell Radius',     '2.8 Rs (tunable)'],
            ['Panel Coverage',   '~94% (6% gap fraction)'],
            ['Host Temp',        '5780 K (solar-type)'],
            ['Thermal Output',   'Full stellar luminosity intercepted'],
            ['Structure Class',  'Kardashev Type II megastructure'],
            ['Sector',           '19-B  |  Coords: 3.00 / −2.00 / 7.00'],
        ],
        features: [
            'Analytic sphere intersection — no raymarching required for shell geometry',
            'Procedural panel grid via fract(θ·freq) and fract(φ·freq) with gap threshold',
            'Circuit-line detail rendered on each panel face (photovoltaic circuitry)',
            'Star corona visible through gaps with exponential decay glow',
            'Back-panel and through-gap parallax: shell inner surface visible behind gaps',
        ],
        facts: [
            'A Dyson sphere at 1 AU would intercept all 3.8 × 10²⁶ watts of solar output',
            'Freeman Dyson originally proposed the concept in 1960 as a SETI search target',
            'The Tabby\'s Star (KIC 8462852) mystery was partly explained by megastructure hypotheses',
            'Building one requires dismantling Jupiter — ~1.9 × 10²⁷ kg of material',
            'Waste heat means it would glow in infrared at ~300 K — identifiable by telescopes',
        ],
    },
    sgr_a: {
        overview: `Sagittarius A* is the supermassive black hole at the gravitational centre of the Milky Way, residing in Sector 00-CORE at the galactic coordinate origin. First imaged by the Event Horizon Telescope in 2022, it is the second-ever black hole to be directly imaged, showing a characteristic shadow surrounded by a bright emission ring.

The plasma accretion rate is low (a Seyfert-like quiescent phase), but near-infrared flares from infalling material are observed several times per day. Stars in the central parsec orbit it at up to 3% of the speed of light.`,
        params: [
            ['Mass',               '4.154 × 10⁶ M☉'],
            ['Schwarzschild Radius','Rs = 1.23 × 10⁷ km'],
            ['Shadow Diameter',    '52 μarcseconds (EHT measured)'],
            ['Distance from Earth','~26,670 light-years (8.178 kpc)'],
            ['Accretion Rate',     '~10⁻⁸ M☉/yr (radiatively inefficient)'],
            ['Disk Temperature',   '1.5 × 10⁷ K (flare episodes)'],
            ['Sector',             '00-CORE  |  Coords: 0.00 / 0.00 / 0.00'],
        ],
        features: [
            'Same Schwarzschild shader as Gargantua but with higher mass / distortion preset',
            'Placed at scene origin — all other objects orbit around this galactic centre',
            'High-spin preset dramatically increases lensing and disk angular size',
            '"Quiet horizon" preset mimics observed low accretion quiescent state',
        ],
        facts: [
            'S2, the closest orbiting star, completes one orbit in just 16.0 years at 0.77% of c',
            'Sgr A* was radio-silent until 1974 — it was so faint astronomers assumed it was background noise',
            'Its mass was proven by stellar orbits long before direct imaging confirmed the silhouette',
            'A photon released from just outside the event horizon takes 40 seconds to escape 1 Rs',
            'In ~5 billion years it will merge with the Andromeda galaxy\'s central black hole',
        ],
    },
    andromeda: {
        overview: `Andromeda Gateway is a hypothetical Class-M artificially-stabilised wormhole connecting our Local Group to the Andromeda Galaxy (M31) at 2.537 million light-years. The alternate starfield visible through the throat shows the denser stellar population of Andromeda's galactic core with a characteristic warm-orange tinge from its older stellar population.

The throat is maintained by exotic matter seeded at the boundary, and the large-scale gravitational lens produces a distorted, warped view of the Andromeda side even before crossing.`,
        params: [
            ['Connection Target', 'M31 — Andromeda Galaxy'],
            ['Distance Bridged',  '2.537 × 10⁶ light-years'],
            ['Throat Radius',     'Rs ≈ 1.2 (tunable)'],
            ['Transit Time',      '~0 proper time (instantaneous at c)'],
            ['Alternate Density', '1.4× our starfield (older population)'],
            ['Stability Class',   'STABLE ALIEN BRIDGE (Type-X)'],
            ['Sector',            '99-Z  |  Coords: 8.00 / −3.00 / −8.00'],
        ],
        features: [
            'Alternate-universe starfield uses distinct hash offset (+100) for different star positions',
            'Gold-orange star colour bias reflects Andromeda\'s older, redder stellar population',
            'Larger-than-average distortion preset creates more dramatic lensing before threshold',
            '"Void Gate" preset opens a narrower, more unstable looking throat with extreme bending',
        ],
        facts: [
            'M31 and the Milky Way are on a collision course — merger expected in ~4.5 billion years',
            'Andromeda contains ~1 trillion stars vs our ~300 billion — 3× more massive',
            'Its central black hole (M31*) masses ~1.1 × 10⁸ M☉ — 26× larger than Sgr A*',
            'Andromeda is the most distant object visible to the naked eye on a dark night',
            'The merger will reshape both galaxies into a giant elliptical — most stars won\'t collide',
        ],
    },
    magnetar_1806: {
        overview: `SGR 1806-20 is the most extreme magnetar ever detected. On December 27, 2004, it emitted a magnetar flare that briefly outshone the full Moon in gamma rays — the brightest transient event ever observed from outside the Solar System. The pulse lasted only 0.2 seconds but deposited more energy than the Sun radiates in 250,000 years.

The simulated pulsar jets represent the polar emission cones, while the dipole field lines visualise the record-setting 1.6 × 10¹⁵ G magnetic field — strong enough to distort the electron orbitals of hydrogen atoms.`,
        params: [
            ['Mass',           '2.1 M☉'],
            ['Radius',         '~11 km'],
            ['Spin Period',    '7.56 s  (slow magnetar rotation)'],
            ['B-field',        '1.6 × 10¹⁵ G  (strongest known)'],
            ['Distance',       '~50,000 light-years (Galactic far side)'],
            ['Flare Energy',   '~10⁴⁶ erg (2004 giant flare)'],
            ['Sector',         '18-F  |  Coords: −7.00 / −5.00 / 2.00'],
        ],
        features: [
            'Magnetar-Burst preset: max distortion 2.5, spin 4.2, doppler 2.4 — violent field lines',
            'Magnetic Red-Violet palette: red for thermal X-ray + purple for hard gamma emission',
            'Dipole field line density at maximum — 16 azimuthal slices visible',
            'Rest-state preset shows quieter inter-burst phase with calmer field topology',
        ],
        facts: [
            'The 2004 flare ionised Earth\'s upper ionosphere from 50,000 light-years away',
            'If SGR 1806-20 were within 10 light-years, the flare would have caused mass extinction',
            'The field is so strong it bends X-ray photon paths — a phenomenon called vacuum birefringence',
            'At 1.6 × 10¹⁵ G, quantum effects dominate — B > B_QED (4.4 × 10¹³ G)',
            'Magnetar fields decay on timescales of ~10,000 years — they are cosmically short-lived',
        ],
    },
};

// ===== Dossier Data (Russian) =====
const OBJECT_DOSSIERS_RU = {
    gargantua: {
        overview: `Сингулярность Гаргантюа — сверхмассивная чёрная дыра шварцшильдовского класса в секторе 04-A. С массой 4.3 × 10⁶ солнечных она создаёт одно из самых мощных гравитационных линзирований в каталоге, искривляя свет фоновых звёзд в полное эйнштейновское кольцо при сближении.

Окружающий аккреционный диск простирается от 2.2 Rs до 9.5 Rs и вращается с кеплеровским профилем скоростей. У внутреннего края газ достигает 0.42c — заметен релятивистский Доплер-биминг: приближающаяся сторона выглядит ярче и голубее, удаляющаяся — тусклее и краснее.`,
        params: [
            ['Масса',               '4.3 × 10⁶ M☉'],
            ['Радиус Шварцшильда',  'Rs ≈ 12.7 × 10⁹ км'],
            ['Фотонная сфера',      '1.5 Rs (нестабильная)'],
            ['ISCO',                '3 Rs (мин. стабильная орбита)'],
            ['Температура диска',   '8.4 × 10⁶ K (внутр. край)'],
            ['Температура Хокинга', '~10⁻¹⁴ K (≈ 0)'],
            ['Сектор',              '04-A  |  Координаты: −1.00 / 0.60 / 3.90'],
        ],
        features: [
            'Полный реймарчинг геодезик Шварцшильда — 130 шагов GPU на луч',
            'Объёмный 3D аккреционный диск с искажающим fbm-шумом Перлина',
            'Релятивистский Доплер-биминг: D = 1/(γ(1 − β·cosθ))³ по пикселю',
            'Гравитационное красное смещение по радиусу: √(1 − Rs/r)',
            'Свечение фотонного кольца у границы горизонта событий',
            'Тонмаппинг Рейнхарда для HDR-блюма',
        ],
        facts: [
            'Часы на 1.1 Rs идут в 3 раза медленнее, чем на бесконечности — видно как цветовой сдвиг',
            'Фотонная сфера на 1.5 Rs ловит свет на орбиту — задевший её фотон сваливается внутрь',
            'Излучение Хокинга при такой массе испарит дыру за 10⁸⁴ лет',
            'С Земли тень такой дыры была бы ~52 мкс — разрешается телескопом EHT',
            'Приливные силы у горизонта так слабы, что человек не почувствовал бы пересечения',
        ],
    },
    vela: {
        overview: `Пульсар Vela — быстро вращающаяся нейтронная звезда, рождённая в коллапсе сверхновой ~11 000 лет назад. Ось вращения наклонена на 45° относительно магнитной оси, поэтому релятивистские радиоджеты заметают пространство конусом — эффект маяка, дающий периодические импульсы, регистрируемые по всей галактике.

Прецессирующая дипольная магнитосфера здесь отрисована по реальной топологии силовых линий: они выгибаются у экватора и сходятся к магнитным полюсам, где парное рождение электронов и позитронов порождает джеты.`,
        params: [
            ['Масса',                '1.44 M☉'],
            ['Радиус',               '~12 км'],
            ['Период вращения',      '89 мс  (11.2 Гц)'],
            ['Поверхностное B-поле', '3.4 × 10¹² Гс'],
            ['Полуугол джета',       '7° (конический пучок)'],
            ['Температура поверхн.', '~7 × 10⁵ K'],
            ['Сектор',               '12-C  |  Координаты: 0.90 / 0.50 / −3.90'],
        ],
        features: [
            'Прецессирующая дипольная магнитосфера с сеткой силовых линий',
            'Конический релятивистский джет от полюсов (GLSL реймарчинг, 90 шагов)',
            'Импульсная модуляция: яркость следует 1 + 0.3·sin(r·1.5 − t·12)',
            'Магнитное «горячее пятно» на поверхности (пик яркости)',
            'Настраиваемый полуугол джета через слайдер Beaming Scale',
        ],
        facts: [
            'Вещество нейтронной звезды настолько плотное, что чайная ложка весит ~10¹⁴ кг',
            'Сила тяжести на поверхности ~2 × 10¹¹ g — упавшее перо разгоняется до 0.6c',
            'Импульсы Vela — естественные часы для проверки ОТО с точностью 10⁻⁵',
            '«Глитчи» — внезапные ускорения вращения — выдают сверхтекучий слой в коре',
            'Звёздный ветер раздул туманность пульсара протяжённостью ~250 световых лет',
        ],
    },
    cygnus: {
        overview: `Червоточина Cygnus — стабильная проходимая Морриса–Торна в секторе 07-F. В отличие от чёрной дыры, горло не содержит сингулярности — пространство-время гладкое в точке перехода, а луч, проникший в r < Rs, испытывает инверсию координат и выходит в независимое пространство альтернативной вселенной с собственным звёздным фоном.

Горло поддерживается экзотической материей с отрицательной плотностью энергии. Светящееся кольцо — гравитационная фокусировка фотонов фона вокруг горла.`,
        params: [
            ['Радиус горла',         'Rs (настраивается: 0.35 – 1.2)'],
            ['Экзотическая материя', 'Требуется: ρ < 0 (типа Казимира)'],
            ['Уравнение линзы',      'Метрика Морриса–Торна, ℓ-координата'],
            ['Переход горла',        'p_new = −p × 1.01 (инверсия)'],
            ['Цветовой сдвиг',       'Кольцо: оранж ↔ циан по скорости'],
            ['Класс стабильности',   'STABLE GATEWAY (без отриц. обр. связи)'],
            ['Сектор',               '07-F  |  Координаты: 5.40 / −0.80 / −2.50'],
        ],
        features: [
            'Два звёздных фона: наша вселенная (синяя туманность) и альтернативная (тёплое золото)',
            'Гладкий переход горла — инверсия направления и координат при r < Rs',
            'Хроматическое кольцо вокруг горла, цикл оттенков по spin-параметру',
            'Яркость альтернативной туманности — слайдер Doppler',
            'Независимый 3D fbm-шум для текстуры каждой вселенной',
        ],
        facts: [
            'Статья Морриса–Торна (1988) — первое строгое доказательство, что ОТО допускает червоточины',
            'Экзотическая материя с ρ < 0 существует в эффекте Казимира, но в ничтожном масштабе',
            'Червоточина теоретически позволяет путешествия во времени при релятивистском разгоне одного устья',
            'Прохождение со скоростью c заняло бы нулевое собственное время независимо от расстояния',
            'Гипотеза защиты хронологии Хокинга: квантовые эффекты схлопывают такие червоточины до использования',
        ],
    },
    kepler: {
        overview: `Сфера Дайсона Kepler — мегаструктура цивилизации II типа: вращающийся геометрический рой солнечных коллекторов вокруг звезды массой 1.08 M☉. Панели образуют геодезическую сетку с систематическими зазорами, через которые видны вспышки звезды и активность короны.

В отличие от сплошной оболочки (которая была бы динамически нестабильной), рой использует орбитальную механику для поддержания зазоров. Внутренняя поверхность превращает свет в энергию, внешняя излучает отходное тепло в ИК.`,
        params: [
            ['Масса звезды-хозяина',   '1.08 M☉'],
            ['Радиус оболочки',        '2.8 Rs (настраивается)'],
            ['Покрытие панелями',      '~94% (зазоры — 6%)'],
            ['Температура звезды',     '5780 K (солнечный тип)'],
            ['Тепловой выход',         'Полная светимость звезды перехвачена'],
            ['Класс структуры',        'Кардашев II типа'],
            ['Сектор',                 '19-B  |  Координаты: 7.00 / 1.00 / 0.50'],
        ],
        features: [
            'Аналитическое пересечение сферы — без реймарчинга для оболочки',
            'Процедурная сетка панелей через fract(θ·freq) и fract(φ·freq) с порогом зазора',
            'Детали схем на каждой панели (фотовольтаика)',
            'Корона звезды видна сквозь зазоры с экспоненциальным затуханием',
            'Параллакс задней панели и щелей: видна внутренняя поверхность сквозь зазоры',
        ],
        facts: [
            'Сфера Дайсона на 1 а.е. перехватывала бы все 3.8 × 10²⁶ Вт солнечного выхода',
            'Фримен Дайсон предложил концепцию в 1960 как цель поиска SETI',
            'Тайна «звезды Табби» (KIC 8462852) частично объяснялась гипотезой мегаструктуры',
            'Для постройки нужно разобрать Юпитер — ~1.9 × 10²⁷ кг материала',
            'Отходное тепло заставит её светиться в ИК при ~300 K — обнаружимо телескопами',
        ],
    },
    sgr_a: {
        overview: `Стрелец A* — сверхмассивная чёрная дыра в гравитационном центре Млечного Пути, в секторе 00-CORE на галактическом начале координат. Впервые сфотографирована телескопом EHT в 2022 году — вторая в истории прямо снятая ЧД, с характерной тенью и ярким эмиссионным кольцом.

Темп аккреции плазмы низкий (тихая фаза, как у Сейфертов), но ИК-вспышки от падающего вещества наблюдаются по несколько раз в день. Звёзды в центральном парсеке вращаются вокруг неё со скоростью до 3% от скорости света.`,
        params: [
            ['Масса',               '4.154 × 10⁶ M☉'],
            ['Радиус Шварцшильда',  'Rs = 1.23 × 10⁷ км'],
            ['Диаметр тени',        '52 мкс (измерение EHT)'],
            ['Расстояние от Земли', '~26 670 св. лет (8.178 кпк)'],
            ['Темп аккреции',       '~10⁻⁸ M☉/год (низкоэффективный)'],
            ['Температура диска',   '1.5 × 10⁷ K (эпизоды вспышек)'],
            ['Сектор',              '00-CORE  |  Координаты: 0.00 / 0.00 / 0.00'],
        ],
        features: [
            'Тот же Шварцшильдовский шейдер, что у Гаргантюа, но с пресетом большей массы / искажения',
            'Помещён в начало сцены — все другие объекты вращаются вокруг этого центра',
            'Пресет «high-spin» резко усиливает линзирование и угловой размер диска',
            'Пресет «quiet horizon» имитирует наблюдаемое состояние тихой аккреции',
        ],
        facts: [
            'S2 — ближайшая звезда — обходит её за 16 лет на 0.77% от c',
            'Sgr A* был радиомолчалив до 1974 — настолько тусклый, что его считали шумом',
            'Массу доказали по орбитам звёзд задолго до прямого снимка силуэта',
            'Фотон, испущенный сразу за горизонтом, выходит на 1 Rs за 40 секунд',
            'Через ~5 млрд лет сольётся с центральной ЧД Андромеды',
        ],
    },
    andromeda: {
        overview: `Шлюз Андромеды — гипотетическая искусственно стабилизированная червоточина класса M, соединяющая нашу Местную группу с галактикой Андромеда (M31) на расстоянии 2.537 млн световых лет. Альтернативный звёздный фон через горло показывает плотную звёздную популяцию галактического ядра Андромеды с характерным тёплым оранжевым оттенком от старых звёзд.

Горло удерживается экзотической материей, посеянной на границе, и крупномасштабная гравитационная линза создаёт искажённый вид со стороны Андромеды ещё до пересечения.`,
        params: [
            ['Цель соединения',     'M31 — галактика Андромеда'],
            ['Перекрытое расст.',   '2.537 × 10⁶ св. лет'],
            ['Радиус горла',        'Rs ≈ 1.2 (настраивается)'],
            ['Время прохождения',   '~0 собств. времени (на скорости c)'],
            ['Плотность альт.',     '1.4× нашего звёздного фона (старая поп.)'],
            ['Класс стабильности',  'STABLE ALIEN BRIDGE (Тип-X)'],
            ['Сектор',              '99-Z  |  Координаты: −7.20 / 2.50 / −3.50'],
        ],
        features: [
            'Звёздный фон альт. вселенной использует hash-сдвиг (+100) — другие позиции звёзд',
            'Золотисто-оранжевый цвет звёзд отражает старую красную популяцию Андромеды',
            'Увеличенный пресет distortion создаёт более драматичное линзирование до перехода',
            'Пресет «Void Gate» — узкое нестабильное горло с экстремальным искривлением',
        ],
        facts: [
            'M31 и Млечный Путь летят навстречу — слияние через ~4.5 млрд лет',
            'В Андромеде ~1 трлн звёзд против наших ~300 млрд — в 3 раза массивнее',
            'Её центральная ЧД (M31*) массой ~1.1 × 10⁸ M☉ — в 26 раз больше Sgr A*',
            'Андромеда — самый далёкий объект, видимый невооружённым глазом в тёмную ночь',
            'Слияние превратит обе галактики в гигантский эллипс — большинство звёзд не столкнутся',
        ],
    },
    magnetar_1806: {
        overview: `SGR 1806-20 — самый экстремальный магнетар из когда-либо обнаруженных. 27 декабря 2004 года он испустил вспышку, которая ненадолго затмила полную Луну в гамма-диапазоне — ярчайшее транзиентное событие, наблюдаемое вне Солнечной системы. Импульс длился 0.2 секунды, но выделил больше энергии, чем Солнце излучает за 250 000 лет.

Смоделированные джеты — полярные эмиссионные конусы, а дипольные линии визуализируют рекордное магнитное поле 1.6 × 10¹⁵ Гс — достаточное, чтобы исказить орбитали электронов в атомах водорода.`,
        params: [
            ['Масса',           '2.1 M☉'],
            ['Радиус',          '~11 км'],
            ['Период вращения', '7.56 с  (медленный магнетар)'],
            ['B-поле',          '1.6 × 10¹⁵ Гс  (рекордное)'],
            ['Расстояние',      '~50 000 св. лет (дальняя сторона Галактики)'],
            ['Энергия вспышки', '~10⁴⁶ эрг (гигантская вспышка 2004)'],
            ['Сектор',          '18-F  |  Координаты: −5.40 / −1.20 / 2.50'],
        ],
        features: [
            'Пресет «Magnetar-Burst»: distortion 2.5, spin 4.2, doppler 2.4 — буйные линии поля',
            'Палитра Red-Violet: красный для теплового X-ray + фиолет для жёсткого гамма',
            'Максимальная плотность дипольных линий — 16 азимутальных секторов',
            'Пресет «rest-state» — спокойная межвспышечная фаза',
        ],
        facts: [
            'Вспышка 2004 ионизировала верхнюю ионосферу Земли с 50 000 св. лет',
            'Будь SGR 1806-20 ближе 10 св. лет — вспышка вызвала бы массовое вымирание',
            'Поле так сильно, что искривляет пути X-ray фотонов — вакуумное двулучепреломление',
            'При 1.6 × 10¹⁵ Гс квантовые эффекты доминируют — B > B_QED (4.4 × 10¹³ Гс)',
            'Магнетарные поля распадаются за ~10 000 лет — космически короткоживущие',
        ],
    },
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
let activeObjectId = 'gargantua';
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
    camera.position.set(0, 20, 45);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 80.0;
    controls.minDistance = 3.0;

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    buildGalaxyMap();

    // ortho scene for shaders
    orthoScene = new THREE.Scene();
    orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

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
            transitionProgress += delta * 1.5;
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
            if (galaxyParticles) galaxyParticles.rotation.y = elapsed * 0.03;
            if (galaxyDust) galaxyDust.rotation.y = elapsed * 0.03;

            systemNodes.forEach(node => {
                const pulse = 2.0 + 0.18 * Math.sin(elapsed * 4.0 + node.position.x);
                node.scale.set(pulse, pulse, 1.0);
            });

            if (autoRotate && transitionProgress === 1.0) {
                const mt = elapsed * 0.03;
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
            if (controls && autoRotate) {
                const mt = elapsed * 0.04;
                camera.position.x = 17.0 * Math.cos(mt);
                camera.position.z = 17.0 * Math.sin(mt);
            }

            controls.update();
            uniforms.uCamPos.value.copy(camera.position);
            uniforms.uInvProjection.value.copy(camera.projectionMatrixInverse);
            uniforms.uCamWorld.value.copy(camera.matrixWorld);
            uniforms.uTime.value = elapsed;
            
            renderer.autoClear = false;
            renderer.clear();
            systemNodes.forEach(n => n.visible = false);
            if (galaxyDust) galaxyDust.visible = false;
            if (galaxyParticles) galaxyParticles.visible = false;
            if (coreSprite) coreSprite.visible = false;
            renderer.render(scene, camera);
            
            renderer.render(orthoScene, orthoCamera);
            
            systemNodes.forEach(n => n.visible = true);
            if (galaxyDust) galaxyDust.visible = true;
            if (galaxyParticles) galaxyParticles.visible = true;
            if (coreSprite) coreSprite.visible = true;
            renderer.autoClear = true;
        }
    }

    requestAnimationFrame(loop);
}

function buildGalaxyMap() {
    // 1. Distant background starfield
    const bgCount = 10000;
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

        const brightness = 0.72 + Math.random() * 0.28;
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
        size: 2.2,
        sizeAttenuation: false,
        map: createStarTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const bgStars = new THREE.Points(bgGeo, bgMat);
    scene.add(bgStars);

    // Extra bright-star highlights (~800 larger stars scattered in background)
    const brightCount = 800;
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
        size: 4.0,
        sizeAttenuation: false,
        map: createStarTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    scene.add(new THREE.Points(brightGeo, brightMat));

    // 2. Bright stars of the galaxy (40000 particles)
    const count = 40000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const cCore = new THREE.Color('#ffe199');
    const cArm = new THREE.Color('#4d66ff');
    const cEdge = new THREE.Color('#03011c');

    for (let i = 0; i < count; i++) {
        const r = Math.pow(Math.random(), 2.3) * 24.0;
        const armIdx = i % 2;
        const theta = (armIdx * Math.PI) + (r * 0.45);
        const sx = (Math.random() - 0.5) * (1.8 / (r * 0.1 + 0.5));
        const sy = (Math.random() - 0.5) * (1.2 / (r * 0.15 + 0.5));
        const sz = (Math.random() - 0.5) * (1.8 / (r * 0.1 + 0.5));

        pos[i * 3]     = r * Math.cos(theta) + sx;
        pos[i * 3 + 1] = sy;
        pos[i * 3 + 2] = r * Math.sin(theta) + sz;

        let mc;
        if (r < 3.0) mc = cCore.clone().lerp(cArm, r / 3.0);
        else mc = cArm.clone().lerp(cEdge, (r - 3.0) / 13.0);

        col[i * 3]     = mc.r;
        col[i * 3 + 1] = mc.g;
        col[i * 3 + 2] = mc.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
        size: 0.14,
        map: createStarTexture(),
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    galaxyParticles = new THREE.Points(geo, mat);
    scene.add(galaxyParticles);

    // 3. Volumetric dust/nebula clouds (15000 particles)
    const dustCount = 15000;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustCol = new Float32Array(dustCount * 3);
    
    const colorArmA = new THREE.Color('#38bdf8');
    const colorArmB = new THREE.Color('#ea00ff');
    const colorCoreGlow = new THREE.Color('#f0a030');
    
    for (let i = 0; i < dustCount; i++) {
        const r = Math.pow(Math.random(), 1.8) * 24.0;
        const armIdx = i % 2;
        const theta = (armIdx * Math.PI) + (r * 0.45) + (Math.random() - 0.5) * 0.22;
        
        const sx = (Math.random() - 0.5) * (3.3 / (r * 0.1 + 0.5));
        const sy = (Math.random() - 0.5) * (1.8 / (r * 0.15 + 0.5));
        const sz = (Math.random() - 0.5) * (3.3 / (r * 0.1 + 0.5));
        
        dustPos[i * 3]     = r * Math.cos(theta) + sx;
        dustPos[i * 3 + 1] = sy;
        dustPos[i * 3 + 2] = r * Math.sin(theta) + sz;
        
        let c;
        if (r < 3.0) {
            c = colorCoreGlow.clone().lerp(colorArmB, r / 3.0);
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
        size: 2.0,
        map: createNebulaTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    galaxyDust = new THREE.Points(dustGeo, dustMat);
    scene.add(galaxyDust);

    // 4. Central core bulge glow
    const coreSpriteMat = new THREE.SpriteMaterial({
        map: createCoreGlowTexture(),
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    coreSprite = new THREE.Sprite(coreSpriteMat);
    coreSprite.scale.set(7.0, 7.0, 1.0);
    scene.add(coreSprite);

    // 5. System Nodes (type-specific sprites, facing camera)
    const nodeColors = {
        gargantua: '#f0a030',
        vela: '#00ffff',
        cygnus: '#ff00ff',
        kepler: '#ffcc00',
        sgr_a: '#ff4500',
        andromeda: '#bf55ec',
        magnetar_1806: '#ff3366'
    };

    const objectTypes = {
        gargantua: 'blackhole', sgr_a: 'blackhole',
        vela: 'pulsar', magnetar_1806: 'pulsar',
        cygnus: 'wormhole', andromeda: 'wormhole',
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
        sprite.scale.set(2.8, 2.8, 1.0);
        sprite.renderOrder = 999;
        sprite.userData = { id: key };
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

    // slider bounds
    if (activeObjectId === 'vela' || activeObjectId === 'magnetar_1806') {
        sliders.rs.min = 0.2; sliders.rs.max = 1.6; sliders.rs.step = 0.05;
        sliders.outer.min = 6.0; sliders.outer.max = 20.0; sliders.outer.step = 0.2;
    } else if (activeObjectId === 'cygnus' || activeObjectId === 'andromeda') {
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

    shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vtx,
        fragmentShader: shaderSrc,
        uniforms: uniforms,
        depthWrite: false,
        depthTest: false,
        transparent: true,
        glslVersion: THREE.GLSL3
    });

    orthoScene.clear();
    orthoScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

    camera.position.set(0, 5, 17);
    controls.target.set(0, 0, 0);
    controls.maxDistance = 35.0;
    controls.minDistance = 3.5;
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
            camera.position.set(0, 20, 45);
            controls.target.set(0, 0, 0);
            controls.maxDistance = 80.0;
            controls.minDistance = 6.0;
            autoRotate = true;
            btnAutopilot.classList.remove('active');
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
            targetCameraPos.copy(obj.position).multiplyScalar(2.5).add(new THREE.Vector3(0, 3, 7));
            targetLookAt.copy(obj.position).multiplyScalar(2.5);
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
