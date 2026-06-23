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
                highlights: ['Lorentz', 'pole magnetyczne', 'Maxwell']
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
                title: 'Lorentz force',
                subtitle: 'Relacja między ładunkiem, prędkością i polem B',
                link: 'electromagnetism.html#lorentz',
                category: 'Podtemat'
            },
            {
                title: 'Magnetic field geometry',
                subtitle: 'Kształt pola wokół prądu i ładunku w ruchu',
                link: 'electromagnetism.html#field-geometry',
                category: 'Podtemat'
            },
            {
                title: 'Fale elektromagnetyczne',
                subtitle: 'Skąd wynika jedność E i B',
                link: 'electromagnetism.html#full-picture',
                category: 'Podtemat'
            },
            {
                title: 'Ampère and Biot-Savart',
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
    },

    renderArticleCards() {
        const articleGrid = document.getElementById('articleGrid');
        if (!articleGrid) {
            return;
        }

        articleGrid.innerHTML = StronaFiz.data.articles.map(article => {
            const chips = article.highlights.map(item => `<span class="article-chip">${item}</span>`).join('');
            return `
                <article class="article-card">
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <div class="article-meta">${chips}</div>
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
});
