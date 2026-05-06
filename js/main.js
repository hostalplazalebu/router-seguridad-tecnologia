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
