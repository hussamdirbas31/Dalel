(function initializeTheme() {
    const savedTheme = localStorage.getItem('dalil-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

const translationManager = {
    currentLang: 'ar',
    
    init: function() {
        this.loadLanguage();
        this.initLanguageToggle();
    },
    
    loadLanguage: function() {
        const savedLang = localStorage.getItem('dalil-language') || 'ar';
        this.setLanguage(savedLang);
    },
    
    setLanguage: function(lang) {
        this.currentLang = lang;
        localStorage.setItem('dalil-language', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        
        this.updateContent();
        this.updateComplexTranslations();
        this.updateLanguageToggle();
        this.updateDynamicContent();
    },
    
    updateContent: function() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else if (element.hasAttribute('data-i18n-html')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        });
    },
    
    updateComplexTranslations: function() {
        const complexElements = document.querySelectorAll('[data-i18n-html]');
        complexElements.forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const translation = this.translate(key);
            element.innerHTML = translation;
        });
    },
    
    translate: function(key, params = {}) {
        let translation = translations[this.currentLang][key] || translations['en'][key] || key;
        
        Object.keys(params).forEach(param => {
            translation = translation.replace(`{${param}}`, params[param]);
        });
        
        return translation;
    },
    
    getEventsData: function() {
        return translations[this.currentLang]['events.data'] || translations['en']['events.data'] || [];
    },
    
    getEventById: function(id) {
        const events = this.getEventsData();
        return events.find(event => event.id == id) || events[0];
    },
    
    updateDynamicContent: function() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            const count = document.querySelectorAll('.event-card:not([style*="display: none"])').length;
            resultsCount.textContent = this.translate('events.results', { count });
        }
        
        if (typeof dalilApp !== 'undefined') {
            if (document.getElementById('sliderWrapper')) {
                dalilApp.initSlider();
            }
            
            if (document.getElementById('featuredEventsGrid')) {
                dalilApp.loadFeaturedEvents();
            }
            
            if (document.getElementById('allEventsGrid')) {
                dalilApp.loadAllEvents();
            }
            
            if (document.getElementById('eventDetailContent')) {
                dalilApp.loadEventDetail();
            }
        }
    },
    
    initLanguageToggle: function() {
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                const newLang = this.currentLang === 'ar' ? 'en' : 'ar';
                this.setLanguage(newLang);
            });
        }
    },
    
    updateLanguageToggle: function() {
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            if (this.currentLang === 'ar') {
                langToggle.innerHTML = '<img src="assets/img/flags/america.jpg" alt="USA Flag" class="lang-flag">';
            } else {
                langToggle.innerHTML = '<img src="assets/img/flags/syria.jpg" alt="Syria Flag" class="lang-flag">';
            }
        }
    }
};

const dalilApp = {
    init: function() {
        this.translationManager = translationManager;
        this.translationManager.init();
        this.initTheme();
        this.initScrollToTop();
        this.initNavigation();
        this.initModals();
    },

    initHomePage: function() {
        this.initSlider();
        this.loadFeaturedEvents();
        this.initCategoryFilters();
    },

    initEventsPage: function() {
        this.loadAllEvents();
        this.initEventFilters();
    },

    initEventDetailPage: function() {
        this.loadEventDetail();
    },

    initContactPage: function() {
        this.initContactForm();
    },

    initAboutPage: function() {
        this.initTeamAnimations();
    },

    initTheme: function() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('dalil-theme') || 'light';
        
        this.applyTheme(savedTheme);
        this.updateThemeIcon(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                this.applyTheme(newTheme);
                localStorage.setItem('dalil-theme', newTheme);
                this.updateThemeIcon(newTheme);
            });
        }
    },

    applyTheme: function(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.forceThemeUpdate();
    },

    forceThemeUpdate: function() {
        const root = document.documentElement;
        const currentTheme = root.getAttribute('data-theme') || 'light';
        
        if (currentTheme === 'dark') {
            root.style.setProperty('--primary-color', '#8B75FF');
            root.style.setProperty('--secondary-color', '#00E6BF');
            root.style.setProperty('--accent-color', '#FF7BA9');
            root.style.setProperty('--text-color', '#F7FAFC');
            root.style.setProperty('--text-light', '#CBD5E0');
            root.style.setProperty('--background-color', '#0F1117');
            root.style.setProperty('--card-bg', '#1A1D29');
            root.style.setProperty('--header-bg', '#1A1D29');
            root.style.setProperty('--footer-bg', '#0F1117');
            root.style.setProperty('--border-color', '#2D3246');
        } else {
            root.style.setProperty('--primary-color', '#7B61FF');
            root.style.setProperty('--secondary-color', '#00D4AA');
            root.style.setProperty('--accent-color', '#FF6B9D');
            root.style.setProperty('--text-color', '#2D3748');
            root.style.setProperty('--text-light', '#6B7280');
            root.style.setProperty('--background-color', '#FAFBFF');
            root.style.setProperty('--card-bg', '#FFFFFF');
            root.style.setProperty('--header-bg', '#FFFFFF');
            root.style.setProperty('--footer-bg', '#1A1D29');
            root.style.setProperty('--border-color', '#F0F2F8');
        }
    },

    updateThemeIcon: function(theme) {
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    },

    initScrollToTop: function() {
        const scrollButton = document.getElementById('scrollToTop');
        
        if (scrollButton) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollButton.classList.add('show');
                } else {
                    scrollButton.classList.remove('show');
                }
            });

            scrollButton.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    },

    initNavigation: function() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
    },

    initSlider: function() {
        const sliderWrapper = document.getElementById('sliderWrapper');
        const sliderIndicators = document.getElementById('sliderIndicators');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (!sliderWrapper) return;

        const latestEvents = this.getLatestEvents(3);

        if (latestEvents.length === 0) {
            sliderWrapper.innerHTML = `
                <div class="no-events-slide">
                    <div class="slide-content">
                        <h3>${this.translationManager.translate('common.noEvents')}</h3>
                        <p>${this.translationManager.translate('common.checkBackLater')}</p>
                    </div>
                </div>
            `;
            return;
        }

        sliderWrapper.innerHTML = latestEvents.map((event, index) => `
            <div class="slider-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                <div class="slide-image-container">
                    <img src="${event.image}" alt="${event.title}" 
                         class="slide-image"
                         onerror="this.src='${this.getPlaceholderImage(event.category, event.title)}'">
                </div>
                <div class="slide-content">
                    <span class="slide-category">${event.category}</span>
                    <h2 class="slide-title">${event.title}</h2>
                    <p class="slide-description">${event.description}</p>
                    <div class="slide-meta">
                        <div class="meta-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${event.date}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-tag"></i>
                            <span>${event.price}</span>
                        </div>
                    </div>
                    <div class="slide-actions">
                        <button class="btn btn-primary slide-btn" 
                                data-bs-toggle="modal" 
                                data-bs-target="#bookingModal"
                                data-event-id="${event.id}">
                            <i class="fas fa-ticket-alt me-2"></i>
                            <span data-i18n="common.bookNow">${this.translationManager.translate('common.bookNow')}</span>
                        </button>
                        <a href="event-detail.html?id=${event.id}" class="btn btn-outline-light slide-btn">
                            <i class="fas fa-info-circle me-2"></i>
                            <span data-i18n="common.details">${this.translationManager.translate('common.details')}</span>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');

        if (sliderIndicators) {
            sliderIndicators.innerHTML = latestEvents.map((_, index) => `
                <button class="slider-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
            `).join('');
        }

        let currentSlide = 0;
        const slides = document.querySelectorAll('.slider-slide');
        const indicators = document.querySelectorAll('.slider-indicator');
        const totalSlides = slides.length;

        const goToSlide = (index) => {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            
            slides.forEach(slide => {
                slide.classList.remove('active', 'prev', 'next');
            });
            
            indicators.forEach(indicator => {
                indicator.classList.remove('active');
            });
            
            slides[index].classList.add('active');
            
            if (indicators[index]) {
                indicators[index].classList.add('active');
            }
            
            currentSlide = index;
        };

        indicators.forEach(indicator => {
            indicator.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                goToSlide(index);
            });
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                goToSlide(currentSlide);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                goToSlide(currentSlide);
            });
        }
    },

    getLatestEvents: function(count = 3) {
        const events = this.getSampleEvents();
        const sortedEvents = events.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        return sortedEvents.slice(0, count);
    },

    getSampleEvents: function() {
        return this.translationManager.getEventsData();
    },

    getPlaceholderImage: function(category, title) {
        const colors = {
            'موسيقى': '7B61FF',
            'Music': '7B61FF',
            'فنون': '00D4AA',
            'Arts': '00D4AA',
            'رياضة': 'FF6B9D',
            'Sports': 'FF6B9D',
            'عائلي': '9D4EDD',
            'Family': '9D4EDD',
            'أعمال': '00B8A9',
            'Business': '00B8A9',
            'ثقافة': 'FF8E53',
            'Culture': 'FF8E53'
        };
        
        const color = colors[category] || '1d3557';
        const encodedTitle = encodeURIComponent(title);
        return `https://via.placeholder.com/800x500/${color}/ffffff?text=${encodedTitle}`;
    },

    loadFeaturedEvents: function() {
        const featuredEventsGrid = document.getElementById('featuredEventsGrid');
        if (!featuredEventsGrid) return;

        const events = this.getLatestEvents(2);
        featuredEventsGrid.innerHTML = this.generateEventCards(events, 2);
        this.initEventCardInteractions();
    },

    loadAllEvents: function() {
        const allEventsGrid = document.getElementById('allEventsGrid');
        if (!allEventsGrid) return;

        const events = this.getSampleEvents();
        allEventsGrid.innerHTML = this.generateEventCards(events, 6);
        this.initEventCardInteractions();
        
        this.updateResultsCount(events.length);
        this.updateFilterOptions();
    },

    updateFilterOptions: function() {
        const events = this.getSampleEvents();
        
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            const categories = [...new Set(events.map(event => event.category))];
            categoryFilter.innerHTML = `
                <option value="">${this.translationManager.translate('events.allCategories')}</option>
                ${categories.map(category => `<option value="${category}">${category}</option>`).join('')}
            `;
        }

        const locationFilter = document.getElementById('locationFilter');
        if (locationFilter) {
            const locations = [...new Set(events.map(event => event.location))];
            locationFilter.innerHTML = `
                <option value="">${this.translationManager.translate('events.allLocations')}</option>
                ${locations.map(location => `<option value="${location}">${location}</option>`).join('')}
            `;
        }
    },
    loadEventDetail: function() {
        const eventDetailContent = document.getElementById('eventDetailContent');
        if (!eventDetailContent) return;
    
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('id') || 1;
        
        const event = this.translationManager.getEventById(eventId);
        
        if (!event) {
            eventDetailContent.innerHTML = `
                <div class="container text-center py-5">
                    <h3>${this.translationManager.translate('common.noResults')}</h3>
                    <a href="events.html" class="btn btn-primary mt-3">${this.translationManager.translate('home.viewAll')}</a>
                </div>
            `;
            return;
        }
        
        eventDetailContent.innerHTML = `
            <section class="event-detail-hero">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-lg-10">
                            <h1>${event.title}</h1>
                            <p class="lead">${event.category} • ${event.location}</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <div class="container">
                <div class="event-detail-content">
                    <div class="row align-items-stretch">
                        <div class="col-lg-8">
                            <div class="content-wrapper">
                                <div class="mb-5">
                                    <img src="${event.image}" alt="${event.title}" 
                                         class="img-fluid rounded shadow-lg"
                                         onerror="this.src='${this.getPlaceholderImage(event.category, event.title)}'">
                                </div>
                                
                                <div class="mb-5">
                                    <h3 class="mb-4" data-i18n="event.about">عن الفعالية</h3>
                                    <p class="fs-5 lh-lg">${event.description}</p>
                                    <p class="fs-6 lh-lg text-muted">${event.fullDescription || 'تفاصيل إضافية عن الفعالية ستظهر هنا...'}</p>
                                </div>
                                
                                <div class="mb-5">
                                    <h4 class="mb-4" data-i18n="event.schedule">برنامج الفعالية</h4>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <ul class="list-unstyled">
                                                <li class="mb-3">
                                                    <i class="fas fa-calendar-alt text-primary me-2"></i>
                                                    <strong data-i18n="event.date">التاريخ:</strong> ${event.date}
                                                </li>
                                                <li class="mb-3">
                                                    <i class="fas fa-clock text-primary me-2"></i>
                                                    <strong data-i18n="event.time">الوقت:</strong> ${event.time}
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="col-md-6">
                                            <ul class="list-unstyled">
                                                <li class="mb-3">
                                                    <i class="fas fa-map-marker-alt text-primary me-2"></i>
                                                    <strong data-i18n="event.venue">المكان:</strong> ${event.location}
                                                </li>
                                                <li class="mb-3">
                                                    <i class="fas fa-tag text-primary me-2"></i>
                                                    <strong data-i18n="event.price">السعر:</strong> ${event.price}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
    
                                <div class="mb-5">
                                    <h4 class="mb-4" data-i18n="event.location">موقع الفعالية</h4>
                                    <div class="ratio ratio-16x9">
                                        <div class="d-flex align-items-center justify-content-center bg-light rounded shadow-sm" style="min-height: 300px;">
                                            <div class="text-center">
                                                <i class="fas fa-map-marker-alt fa-3x text-primary mb-3"></i>
                                                <h5 class="text-muted">${event.location}</h5>
                                                <p class="text-muted">دمشق، سوريا</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-4">
                            <div class="card shadow-lg border-0 h-100">
                                <div class="card-body p-4 d-flex flex-column">
                                    <h5 class="card-title mb-4 text-center" data-i18n="event.bookingInfo">معلومات الحجز</h5>
                                    <div class="event-meta flex-grow-1">
                                        <div class="meta-item">
                                            <i class="fas fa-calendar-alt"></i>
                                            <div>
                                                <strong data-i18n="event.date">التاريخ</strong>
                                                <div class="text-muted">${event.date}</div>
                                            </div>
                                        </div>
                                        <div class="meta-item">
                                            <i class="fas fa-clock"></i>
                                            <div>
                                                <strong data-i18n="event.time">الوقت</strong>
                                                <div class="text-muted">${event.time}</div>
                                            </div>
                                        </div>
                                        <div class="meta-item">
                                            <i class="fas fa-map-marker-alt"></i>
                                            <div>
                                                <strong data-i18n="event.venue">المكان</strong>
                                                <div class="text-muted">${event.location}</div>
                                            </div>
                                        </div>
                                        <div class="meta-item">
                                            <i class="fas fa-tag"></i>
                                            <div>
                                                <strong data-i18n="event.price">السعر</strong>
                                                <div class="text-muted">${event.price}</div>
                                            </div>
                                        </div>
                                        <div class="meta-item">
                                            <i class="fas fa-users"></i>
                                            <div>
                                                <strong data-i18n="event.category">التصنيف</strong>
                                                <div class="text-muted">${event.category}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="booking-actions mt-auto">
                                        <button class="btn btn-primary btn-lg w-100 py-3 fs-5" 
                                                data-bs-toggle="modal" 
                                                data-bs-target="#bookingModal"
                                                data-event-id="${event.id}">
                                            <i class="fas fa-ticket-alt me-2"></i>
                                            <span data-i18n="event.bookNow">${this.translationManager.translate('event.bookNow')}</span>
                                        </button>
                                        <div class="text-center mt-3">
                                            <small class="text-muted" data-i18n="event.seatsLimited">${this.translationManager.translate('event.seatsLimited')}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.translationManager.updateContent();
    },

    generateEventCards: function(events, maxCount = 2) {
        const limitedEvents = events.slice(0, maxCount);
        
        return limitedEvents.map(event => `
            <div class="event-card" data-category="${event.category}" data-date="${event.date}" data-location="${event.location}">
                <div class="event-card-image ">
                    <img src="${event.image}" alt="${event.title}"
                         onerror="this.src='${this.getPlaceholderImage(event.category, event.title)}'">
                    <div class="event-card-badge">${event.category}</div>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${event.title}</h3>
                    <p class="card-text">${event.description}</p>
                    <div class="event-meta">
                        <div class="meta-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${event.date}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-tag"></i>
                            <span>${event.price}</span>
                        </div>
                    </div>
                    <div class="event-actions">
                        <button class="btn-book" data-bs-toggle="modal" data-bs-target="#bookingModal" data-event-id="${event.id}">
                            <i class="fas fa-ticket-alt me-2"></i>
                            <span data-i18n="common.bookNow">${this.translationManager.translate('common.bookNow')}</span>
                        </button>
                        <a href="event-detail.html?id=${event.id}" class="btn-details">
                            <i class="fas fa-info-circle me-2"></i>
                            <span data-i18n="common.details">${this.translationManager.translate('common.details')}</span>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    },

    initEventCardInteractions: function() {
        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.btn-book') && !e.target.closest('.btn-details')) {
                    const eventId = this.querySelector('.btn-book')?.getAttribute('data-event-id');
                    if (eventId) {
                        window.location.href = `event-detail.html?id=${eventId}`;
                    }
                }
            });
        });
    },

    initCategoryFilters: function() {
        const filters = document.querySelectorAll('.badge-filter');
        const self = this;
        
        filters.forEach(filter => {
            filter.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                filters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                const eventCards = document.querySelectorAll('.event-card');
                eventCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                const visibleCards = document.querySelectorAll('.event-card[style="display: block"]').length;
                self.updateResultsCount(visibleCards);
            });
        });
    },

    initEventFilters: function() {
        const applyFilters = document.getElementById('applyFilters');
        if (applyFilters) {
            applyFilters.addEventListener('click', () => this.applyEventFilters());
        }

        const filterInputs = ['searchInput', 'categoryFilter', 'dateFilter', 'locationFilter', 'sortFilter'];
        filterInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('change', () => this.applyEventFilters());
            }
        });

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => this.applyEventFilters(), 300);
            });
        }
    },

    applyEventFilters: function() {
        const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const category = document.getElementById('categoryFilter')?.value || '';
        const date = document.getElementById('dateFilter')?.value || '';
        const location = document.getElementById('locationFilter')?.value || '';
        const sort = document.getElementById('sortFilter')?.value || 'date';
        
        const eventCards = document.querySelectorAll('.event-card');
        let visibleCards = 0;

        eventCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const description = card.querySelector('.card-text').textContent.toLowerCase();
            const cardCategory = card.getAttribute('data-category');
            const cardDate = card.getAttribute('data-date');
            const cardLocation = card.getAttribute('data-location');

            let matchesSearch = !search || 
                title.includes(search) || 
                description.includes(search);
            
            let matchesCategory = !category || cardCategory === category;
            let matchesDate = !date || cardDate === date;
            let matchesLocation = !location || cardLocation === location;

            if (matchesSearch && matchesCategory && matchesDate && matchesLocation) {
                card.style.display = 'block';
                visibleCards++;
            } else {
                card.style.display = 'none';
            }
        });

        this.sortEventCards(sort);
        this.updateResultsCount(visibleCards);
        this.showNoResultsMessage(visibleCards === 0);
    },

    updateResultsCount: function(count) {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = this.translationManager.translate('events.results', { count });
        }
    },

    sortEventCards: function(sortBy) {
        const eventsGrid = document.getElementById('allEventsGrid');
        if (!eventsGrid) return;

        const cards = Array.from(eventsGrid.querySelectorAll('.event-card'));
        
        cards.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    const titleA = a.querySelector('.card-title').textContent;
                    const titleB = b.querySelector('.card-title').textContent;
                    return titleA.localeCompare(titleB, this.translationManager.currentLang);
                
                case 'location':
                    const locationA = a.getAttribute('data-location');
                    const locationB = b.getAttribute('data-location');
                    return locationA.localeCompare(locationB, this.translationManager.currentLang);
                
                case 'date':
                default:
                    const dateA = new Date(a.getAttribute('data-date'));
                    const dateB = new Date(b.getAttribute('data-date'));
                    return dateA - dateB;
            }
        });

        cards.forEach(card => eventsGrid.appendChild(card));
    },

    showNoResultsMessage: function(show) {
        let message = document.getElementById('noResultsMessage');
        
        if (show && !message) {
            message = document.createElement('div');
            message.id = 'noResultsMessage';
            message.className = 'col-12 text-center py-5';
            message.innerHTML = `
                <div class="text-muted">
                    <i class="fas fa-search fa-3x mb-3"></i>
                    <h4 data-i18n="common.noResults">${this.translationManager.translate('common.noResults')}</h4>
                    <p data-i18n="common.tryAgain">${this.translationManager.translate('common.tryAgain')}</p>
                </div>
            `;
            document.querySelector('.events-grid').appendChild(message);
            this.translationManager.updateContent();
        } else if (!show && message) {
            message.remove();
        }
    },

    initModals: function() {
        const confirmBooking = document.getElementById('confirmBooking');
        if (confirmBooking) {
            confirmBooking.addEventListener('click', () => this.handleBooking());
        }

        const bookingModal = document.getElementById('bookingModal');
        if (bookingModal) {
            bookingModal.addEventListener('show.bs.modal', (event) => {
                const button = event.relatedTarget;
                const eventId = button?.getAttribute('data-event-id');
                if (eventId) {
                    const event = this.translationManager.getEventById(eventId);
                    if (event) {
                        const modalTitle = document.querySelector('.modal-title');
                        if (modalTitle) {
                            modalTitle.textContent = this.translationManager.translate('booking.title') + ': ' + event.title;
                        }
                    }
                }
            });
        }
    },

    handleBooking: function() {
        const userName = document.getElementById('userName')?.value;
        const userEmail = document.getElementById('userEmail')?.value;
        const userPhone = document.getElementById('userPhone')?.value;
        const ticketCount = document.getElementById('ticketCount')?.value || '1';
        
        if (userName && userEmail && userPhone) {
            this.showAlert('success', `
                <h5 class="alert-heading" data-i18n="booking.success">${this.translationManager.translate('booking.success')}</h5>
                <p class="mb-2"><strong data-i18n="booking.name">${this.translationManager.translate('booking.name')}:</strong> ${userName}</p>
                <p class="mb-2"><strong data-i18n="booking.tickets">${this.translationManager.translate('booking.tickets')}:</strong> ${ticketCount}</p>
                <p class="mb-0" data-i18n="booking.successDetails">${this.translationManager.translate('booking.successDetails', { email: userEmail, phone: userPhone })}</p>
            `);
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
            if (modal) {
                modal.hide();
            }
            
            document.getElementById('bookingForm')?.reset();
        } else {
            this.showAlert('error', 'يرجى ملء جميع الحقول المطلوبة');
        }
    },

    initContactForm: function() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm();
            });
        }
    },

    handleContactForm: function() {
        const name = document.getElementById('contactName')?.value;
        const email = document.getElementById('contactEmail')?.value;
        const subject = document.getElementById('contactSubject')?.value;
        const message = document.getElementById('contactMessage')?.value;
        
        if (name && email && subject && message) {
            this.showAlert('success', `
                <h5 class="alert-heading">تم إرسال رسالتك بنجاح!</h5>
                <p class="mb-0">شكراً ${name}، سنقوم بالرد على استفسارك في أقرب وقت ممكن.</p>
            `);
            document.getElementById('contactForm').reset();
        } else {
            this.showAlert('error', 'يرجى ملء جميع الحقول المطلوبة');
        }
    },

    initTeamAnimations: function() {
        const teamMembers = document.querySelectorAll('.team-member');
        teamMembers.forEach((member, index) => {
            member.style.animationDelay = `${index * 0.1}s`;
        });
    },

    showAlert: function(type, message) {
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const alert = document.createElement('div');
        alert.className = `custom-alert alert ${alertClass} alert-dismissible fade show position-fixed`;
        alert.style.cssText = `
            top: 2rem;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            min-width: 300px;
            max-width: 500px;
        `;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alert);

        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    dalilApp.init();
    
    if (window.location.pathname.includes('events.html')) {
        dalilApp.initEventsPage();
    } else if (window.location.pathname.includes('event-detail.html')) {
        dalilApp.initEventDetailPage();
    } else if (window.location.pathname.includes('contact.html')) {
        dalilApp.initContactPage();
    } else if (window.location.pathname.includes('about.html')) {
        dalilApp.initAboutPage();
    } else {
        dalilApp.initHomePage();
    }
});