// Main JavaScript file for StronaFiz
// Global configuration and searchable article data

const StronaFiz = {
    config: {
        debug: true,
        theme: 'dark'
    },

    data: {
        articles: [
            {
                title: 'Elektromagnetyzm',
                description: 'Płynne przejście od pola i siły do pełnego obrazu pola elektromagnetycznego.',
                link: 'electromagnetism.html',
                tags: ['elektromagnetyzm', 'pole', 'magnetyzm', 'prąd', 'Lorentz'],
                highlights: ['Lorentz', 'pole magnetyczne', 'Maxwell'],
                subtopics: [
                    {
                        title: 'Siła Lorentza',
                        subtitle: 'Jak prędkość i pole definiują siłę',
                        link: 'electromagnetism.html#lorentz',
                        level: 'Podstawy'
                    },
                    {
                        title: 'Geometria pola magnetycznego',
                        subtitle: 'Kierunek i struktura linii B',
                        link: 'electromagnetism.html#field-geometry',
                        level: 'Podstawy'
                    },
                    {
                        title: 'Prawo Ampère’a',
                        subtitle: 'Jak prąd tworzy pole magnetyczne',
                        link: 'electromagnetism.html#ampere',
                        level: 'Średnio zaawansowane'
                    },
                    {
                        title: 'Fale elektromagnetyczne',
                        subtitle: 'Jak E i B tworzą ruch falowy',
                        link: 'electromagnetism.html#waves',
                        level: 'Pełny obraz'
                    }
                ]
            }
        ],
        searchIndex: [
            {
                title: 'Elektromagnetyzm',
                subtitle: 'Pełny artykuł o polach E i B',
                link: 'electromagnetism.html',
                category: 'Artykuł'
            },
            {
                title: 'Siła Lorentza',
                subtitle: 'Relacja między ładunkiem, prędkością i polem B',
                link: 'electromagnetism.html#lorentz',
                category: 'Podtemat'
            },
            {
                title: 'Geometria pola magnetycznego',
                subtitle: 'Kształt pola wokół prądu i ładunku w ruchu',
                link: 'electromagnetism.html#field-geometry',
                category: 'Podtemat'
            },
            {
                title: 'Fale elektromagnetyczne',
                subtitle: 'Skąd wynika jedność E i B',
                link: 'electromagnetism.html#waves',
                category: 'Podtemat'
            },
            {
                title: 'Prawo Ampère’a',
                subtitle: 'Jak prąd buduje pole magnetyczne',
                link: 'electromagnetism.html#ampere',
                category: 'Podtemat'
            }
        ]
    },

    utils: {
        log(message) {
            if (StronaFiz.config.debug) {
                console.log('[StronaFiz]', message);
            }
        }
    },

    init() {
        StronaFiz.utils.log('StronaFiz initialized');
        StronaFiz.setupEventListeners();
        StronaFiz.renderArticleCards();
    },

    setupEventListeners() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            const resultsContainer = document.getElementById('searchResults');
            searchInput.addEventListener('input', function() {
                const query = this.value.trim().toLowerCase();
                StronaFiz.updateSearchResults(query, resultsContainer);
            });

            // populate with default suggestions
            StronaFiz.updateSearchResults('', resultsContainer);
        }

        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        const navInner = document.querySelector('.navbar-inner');
        const logo = document.querySelector('.logo');
        if (navToggle && navLinks && navInner) {
            navToggle.addEventListener('click', () => {
                const isOpen = navLinks.classList.toggle('open');
                navInner.classList.toggle('menu-open', isOpen);
                navToggle.setAttribute('aria-expanded', String(isOpen));
                if (logo) {
                    logo.style.opacity = isOpen ? '0' : '1';
                    logo.style.pointerEvents = isOpen ? 'none' : 'auto';
                }
            });

            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (navLinks.classList.contains('open')) {
                        navLinks.classList.remove('open');
                        navInner.classList.remove('menu-open');
                        navToggle.setAttribute('aria-expanded', 'false');
                        if (logo) {
                            logo.style.opacity = '1';
                            logo.style.pointerEvents = 'auto';
                        }
                    }
                });
            });
        }
    },

    setupInteractivePanels() {
        StronaFiz.setupLorentzPanel();
        StronaFiz.setupWavePanel();
    },

    setupLorentzPanel() {
        const panel = document.getElementById('lorentz-interactive');
        if (!panel) {
            console.warn('[StronaFiz] lorentz-interactive panel not found');
            return;
        }

        const qInput = document.getElementById('lorentz-q');
        const vInput = document.getElementById('lorentz-v');
        const bInput = document.getElementById('lorentz-b');
        const angleInput = document.getElementById('lorentz-angle');
        const qOutput = document.getElementById('lorentz-q-output');
        const vOutput = document.getElementById('lorentz-v-output');
        const bOutput = document.getElementById('lorentz-b-output');
        const angleOutput = document.getElementById('lorentz-angle-output');
        const resultOutput = document.getElementById('lorentz-force');

        if (!qInput || !vInput || !bInput || !angleInput || !resultOutput) {
            console.warn('[StronaFiz] Some lorentz inputs not found');
            return;
        }

        const update = () => {
            const q = Number(qInput.value);
            const v = Number(vInput.value);
            const b = Number(bInput.value);
            const angle = Number(angleInput.value) * Math.PI / 180;
            const magnitude = q * v * b * Math.sin(angle);

            qOutput.textContent = `${q.toFixed(2)} C`;
            vOutput.textContent = `${v.toFixed(2)} m/s`;
            bOutput.textContent = `${b.toFixed(2)} T`;
            angleOutput.textContent = `${angleInput.value}°`;
            resultOutput.textContent = `${Math.abs(magnitude).toFixed(3)}`;
        };

        [qInput, vInput, bInput, angleInput].forEach(input => {
            input.addEventListener('input', update);
        });

        update();
        // Lorentz canvas animation - current through wire and magnetic field
        const canvas = document.getElementById('lorentz-canvas');
        if (canvas && canvas.getContext) {
            const ctx = canvas.getContext('2d');
            let phase = 0;
            const draw = () => {
                const W = canvas.width = Math.min(640, canvas.clientWidth);
                const H = canvas.height = 200;
                ctx.clearRect(0,0,W,H);
                
                const q = Number(qInput.value);
                const vVal = Number(vInput.value);
                const bVal = Number(bInput.value);
                const angleDeg = Number(angleInput.value);
                const mag = Math.abs(q * vVal * bVal * Math.sin(angleDeg*Math.PI/180));
                
                // Draw wire with current - thicker, centered
                ctx.strokeStyle = 'rgba(255,255,255,0.15)';
                ctx.lineWidth = 10;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(40, H/2);
                ctx.lineTo(W-40, H/2);
                ctx.stroke();
                
                // Draw animated current electrons - count depends on q
                const electronCount = Math.max(3, Math.min(12, Math.abs(Math.round(q * 3))));
                const speed = vVal * 0.5; // speed based on v
                for (let i = 0; i < electronCount; i++) {
                    const x = (40 + (phase * speed) + (W-80) * i / electronCount) % (W-80) + 40;
                    ctx.fillStyle = q > 0 ? '#7dfcff' : '#ff6b9d';
                    ctx.beginPath();
                    ctx.arc(x, H/2, 4, 0, Math.PI*2);
                    ctx.fill();
                }
                
                // Label for current
                ctx.fillStyle = '#7dfcff';
                ctx.font = 'bold 11px monospace';
                ctx.fillText('I (' + Math.abs(Math.round(q*10))/10 + ' A)', 45, 25);
                
                // Draw magnetic field lines - perpendicular field as crosses
                ctx.strokeStyle = '#ffb86b';
                ctx.lineWidth = 2;
                for (let i = 0; i < 6; i++) {
                    const xOffset = 60 + i * (W-120) / 5;
                    // Draw X pattern (field into page for positive current)
                    const size = 12 + Math.sin(phase * 0.05) * 2;
                    ctx.beginPath();
                    ctx.moveTo(xOffset - size, H/2 - size);
                    ctx.lineTo(xOffset + size, H/2 + size);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(xOffset + size, H/2 - size);
                    ctx.lineTo(xOffset - size, H/2 + size);
                    ctx.stroke();
                }
                
                // Label for field
                ctx.fillStyle = '#ffb86b';
                ctx.font = 'bold 11px monospace';
                ctx.fillText('B ⊗ (' + bVal.toFixed(1) + ' T)', W-130, 25);
                
                // Draw force magnitude bar at bottom - cleaner layout
                const barHeight = 10;
                const barY = H - 25;
                ctx.fillStyle = 'rgba(125,92,255,0.3)';
                ctx.fillRect(40, barY, W-80, barHeight);
                ctx.fillStyle = '#7d5cff';
                ctx.fillRect(40, barY, Math.min(W-80, mag*3), barHeight);
                ctx.strokeStyle = 'rgba(125,92,255,0.6)';
                ctx.lineWidth = 1;
                ctx.strokeRect(40, barY, W-80, barHeight);
                
                ctx.fillStyle = '#dbeafe';
                ctx.font = '11px monospace';
                ctx.fillText('F = ' + mag.toFixed(2) + ' N', 45, H-8);
                
                // Angle indicator
                ctx.fillStyle = 'rgba(200,220,255,0.7)';
                ctx.font = '10px monospace';
                ctx.fillText('θ = ' + angleDeg + '°', W-90, H-8);
                
                phase += 1;
            };
            let raf = null;
            const tick = () => { draw(); raf = requestAnimationFrame(tick); };
            tick();
        }
    },

    setupWavePanel() {
        const panel = document.getElementById('wave-interactive');
        if (!panel) {
            console.warn('[StronaFiz] wave-interactive panel not found');
            return;
        }

        const lambdaInput = document.getElementById('wave-lambda');
        const freqInput = document.getElementById('wave-frequency');
        const lambdaOutput = document.getElementById('wave-lambda-output');
        const freqOutput = document.getElementById('wave-frequency-output');
        const speedOutput = document.getElementById('wave-speed');

        if (!lambdaInput || !freqInput || !speedOutput) {
            console.warn('[StronaFiz] Some wave inputs not found');
            return;
        }

        const update = () => {
            const wavelength = Number(lambdaInput.value);
            const frequency = Number(freqInput.value);
            const speed = wavelength * frequency;

            lambdaOutput.textContent = `${wavelength.toFixed(2)} m`;
            freqOutput.textContent = `${frequency.toFixed(1)} Hz`;
            speedOutput.textContent = `${speed.toFixed(2)} m/s`;
        };

        [lambdaInput, freqInput].forEach(input => {
            input.addEventListener('input', update);
        });

        update();
        // Wave canvas animation
        const wcanvas = document.getElementById('wave-canvas');
        if (wcanvas && wcanvas.getContext) {
            const ctx = wcanvas.getContext('2d');
            let phase = 0;
            const draw = () => {
                const W = wcanvas.width = Math.min(640, wcanvas.clientWidth);
                const H = wcanvas.height = 140;
                ctx.clearRect(0,0,W,H);
                const lambda = Number(lambdaInput.value);
                const freq = Number(freqInput.value);
                const k = 2*Math.PI / (lambda*40);
                const omega = 2*Math.PI*freq/10;
                ctx.strokeStyle = '#5be6ff'; ctx.lineWidth = 2;
                ctx.beginPath();
                for (let x=0;x<W;x++){
                    const y = H/2 + Math.sin(k*x - phase) * 24;
                    if (x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                }
                ctx.stroke();
                phase += omega*0.03;
            };
            let raf2 = null;
            const tick2 = () => { draw(); raf2 = requestAnimationFrame(tick2); };
            tick2();
        }
    },

    renderArticleCards() {
        const articleGrid = document.getElementById('articleGrid');
        if (!articleGrid) {
            return;
        }

        articleGrid.innerHTML = StronaFiz.data.articles.map(article => {
            const chips = article.highlights.map(item => `<span class="article-chip">${item}</span>`).join('');
            const subtopics = article.subtopics ? `
                <details class="subtopics-dropdown">
                    <summary>Podtematy</summary>
                    <ul class="subtopic-list">
                        ${article.subtopics.map(sub => `
                            <li>
                                <a class="subtopic-link" href="${sub.link}">${sub.title}</a>
                                <span class="subtopic-level">${sub.level}</span>
                            </li>
                        `).join('')}
                    </ul>
                </details>
            ` : '';

            return `
                <article class="article-card">
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <div class="article-meta">${chips}</div>
                    ${subtopics}
                    <a class="btn" href="${article.link}">Otwórz artykuł</a>
                </article>
            `;
        }).join('');
    },

    updateSearchResults(query, container) {
        if (!container) {
            return;
        }

        const normalizedQuery = query.toLowerCase();
        const results = StronaFiz.data.searchIndex.filter(item => {
            if (!normalizedQuery) {
                return true;
            }
            return item.title.toLowerCase().includes(normalizedQuery) || item.subtitle.toLowerCase().includes(normalizedQuery) || item.category.toLowerCase().includes(normalizedQuery);
        }).slice(0, 6);

        if (!results.length) {
            container.innerHTML = `<div class="search-result"><div><p class="search-result-title">Brak wyników</p><p class="search-result-subtitle">Spróbuj innego słowa kluczowego.</p></div></div>`;
            return;
        }

        container.innerHTML = results.map(item => `
            <a class="search-result" href="${item.link}">
                <div>
                    <p class="search-result-title">${item.title}</p>
                    <p class="search-result-subtitle">${item.subtitle}</p>
                </div>
                <span class="search-result-badge">${item.category}</span>
            </a>
        `).join('');
    }
};

window.addEventListener('DOMContentLoaded', function() {
    StronaFiz.init();
    StronaFiz.setupInteractivePanels();
});
