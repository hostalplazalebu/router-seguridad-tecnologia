document.addEventListener('DOMContentLoaded', () => {

    // Smooth Scroll with Header Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Sticky Header Effect
    const header = document.querySelector('.header');

    // Initial check
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-list a');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            nav.classList.toggle('active');

            // Updates aria-expanded for accessibility
            const isExpanded = mobileToggle.classList.contains('active');
            mobileToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Simple Intersection Observer for Fade-in effects
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Hero Slider Logic
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 5000; // 5 seconds

        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, slideInterval);
    }

    // Services Showcase Carousel Logic
    const showcaseSlides = document.querySelectorAll('.showcase-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (showcaseSlides.length > 0) {
        let currentShowcaseSlide = 0;
        let autoPlayInterval;

        const showSlide = (index) => {
            showcaseSlides[currentShowcaseSlide].classList.remove('active');
            currentShowcaseSlide = (index + showcaseSlides.length) % showcaseSlides.length;
            showcaseSlides[currentShowcaseSlide].classList.add('active');
        };

        const nextSlide = () => showSlide(currentShowcaseSlide + 1);
        const prevSlide = () => showSlide(currentShowcaseSlide - 1);

        const startAutoPlay = () => {
            autoPlayInterval = setInterval(nextSlide, 6000);
        };

        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoPlay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoPlay();
            });
        }

        startAutoPlay();
    }

    // Generic Form Handler
    const contactForms = document.querySelectorAll('form.contact-form');

    contactForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Loading State
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Simulate Server Request (or replace with EmailJS)
            setTimeout(() => {
                // Success State
                submitBtn.textContent = '¡Enviado!';
                submitBtn.style.backgroundColor = '#25d366'; // WhatsApp green for success feel
                submitBtn.style.color = '#fff';

                alert('¡Gracias por contactar a ROUTER! Hemos recibido tu solicitud y te responderemos a la brevedad.');

                form.reset();

                // Reset Button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.backgroundColor = ''; // Revert to CSS default
                    submitBtn.style.color = '';
                }, 3000);

            }, 1500);
        });
    });

    // --- Dynamic News Render Module ---
    const newsGrid = document.getElementById('publicNewsGrid');
    const newsModal = document.getElementById('newsDetailModal');
    const newsModalBody = document.getElementById('newsModalBody');

    function renderPublicNews() {
        if (!newsGrid) return;
        
        const newsList = (typeof ROUTER_NEWS_DATA !== 'undefined' && Array.isArray(ROUTER_NEWS_DATA)) ? ROUTER_NEWS_DATA : [];
        
        if (newsList.length === 0) {
            newsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--color-text-grey);">
                    <p>No hay noticias publicadas en este momento.</p>
                </div>
            `;
            return;
        }

        newsGrid.innerHTML = '';
        
        newsList.forEach((article) => {
            const card = document.createElement('article');
            card.className = 'news-card';
            card.innerHTML = `
                <div class="news-card-image-wrapper">
                    <img src="${article.image || 'assets/images/security-camera.png'}" alt="${article.title}" class="news-card-image" onerror="this.src='assets/images/security-camera.png'">
                </div>
                <div class="news-card-content">
                    <span class="news-card-date">📅 ${article.date}</span>
                    <h3 class="news-card-title">${article.title}</h3>
                    <p class="news-card-desc">${article.desc}</p>
                    <button class="news-card-btn" onclick="openNewsModal(${article.id})">Leer Más &rarr;</button>
                </div>
            `;
            newsGrid.appendChild(card);
        });
    }

    function openNewsModal(id) {
        if (!newsModal || !newsModalBody) return;
        
        const newsList = (typeof ROUTER_NEWS_DATA !== 'undefined' && Array.isArray(ROUTER_NEWS_DATA)) ? ROUTER_NEWS_DATA : [];
        const article = newsList.find(item => item.id === id);
        
        if (!article) return;

        newsModalBody.innerHTML = `
            <div class="news-modal-hero">
                <img src="${article.image || 'assets/images/security-camera.png'}" alt="${article.title}" class="news-modal-img" onerror="this.src='assets/images/security-camera.png'">
            </div>
            <div class="news-modal-details">
                <span class="news-modal-date">📅 Publicado el ${article.date} · Por Aura (AI)</span>
                <h2 class="news-modal-title">${article.title}</h2>
                <div class="news-modal-text">${article.content}</div>
                <div class="news-modal-cta-box">
                    <p>¿Te interesa implementar esta tecnología de seguridad o conectividad?</p>
                    <a href="https://wa.me/56978589090?text=Hola,%20leí%20su%20artículo%20sobre%20${encodeURIComponent(article.title)}%20y%20me%20gustaría%20cotizar" class="btn btn-primary" target="_blank">Cotizar por WhatsApp</a>
                </div>
            </div>
        `;

        newsModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeNewsModal() {
        if (!newsModal) return;
        newsModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    window.openNewsModal = openNewsModal;
    window.closeNewsModal = closeNewsModal;

    // Run render
    renderPublicNews();

    // CSS class for visible state
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});
