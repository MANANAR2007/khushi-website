/* =============================================
   KHÜSHI - Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initColorSelectors();
    initSmoothScrolling();
    initNavHighlight();
    initLightbox();
    initMobileNav();
    initScrollReveal();
    initStickyNav();
    initCounters();
});

/**
 * Initialize color selector functionality
 * Clicking a color button swaps the visible product image
 */
function initColorSelectors() {
    const colorButtons = document.querySelectorAll('.color-btn');
    
    colorButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = button.closest('.size-card');
            const allImages = card.querySelectorAll('.product-img');
            const allButtons = card.querySelectorAll('.color-btn');
            
            // Remove active class from all buttons in this card
            allButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get selected color
            const selectedColor = button.dataset.color;
            
            // Hide all images first
            allImages.forEach(img => img.classList.remove('active'));
            
            // Show the image matching the selected color
            const targetImage = card.querySelector(`.product-img[data-color="${selectedColor}"]`);
            if (targetImage) {
                targetImage.classList.add('active');
            }

            updateCardColorState(card, selectedColor);
        });
    });

    // Initialize background state based on default active buttons
    const cards = document.querySelectorAll('.size-card');
    cards.forEach(card => {
        const activeButton = card.querySelector('.color-btn.active');
        if (activeButton) {
            updateCardColorState(card, activeButton.dataset.color);
        }
    });
}

function updateCardColorState(card, color) {
    card.classList.remove('color-white', 'color-black', 'color-transparent');
    if (color) {
        card.classList.add(`color-${color}`);
    }
}

/**
 * Initialize smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a, .nav-logo');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Initialize mobile navigation toggle
 */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!navToggle || !navOverlay) {
        return;
    }

    const closeMenu = () => {
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
        const isOpen = document.body.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navOverlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            closeMenu();
        }
    });
}

/**
 * Initialize navigation highlight based on scroll position
 */
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Throttle scroll event for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial check
    updateActiveLink();
}

/**
 * Initialize sticky nav styling
 */
function initStickyNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let ticking = false;
    const updateNav = () => {
        nav.classList.toggle('is-scrolled', window.scrollY > 10);
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateNav();
                ticking = false;
            });
            ticking = true;
        }
    });

    updateNav();
}

/**
 * Initialize scroll reveal animations
 */
function initScrollReveal() {
    const targets = document.querySelectorAll(
        '.size-card, .about-intro, .about-manufacturing, .about-expertise, .about-thinwall, .about-features, .about-values, .sustainability-card, .contact-item, .stat-card, .value-item'
    );

    if (!targets.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        targets.forEach(target => target.classList.add('is-visible'));
        return;
    }

    targets.forEach((target, index) => {
        target.classList.add('reveal');
        target.style.transitionDelay = `${Math.min(index * 40, 320)}ms`;
    });

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    targets.forEach(target => observer.observe(target));
}

/**
 * Animate manufacturing stats on reveal
 */
function initCounters() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const animateValue = (el) => {
        const original = el.textContent.trim();
        const match = original.match(/([~≈]?)([0-9]+(?:\\.[0-9]+)?)/);
        if (!match) return;

        const prefix = match[1] || '';
        const targetValue = parseFloat(match[2]);
        const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0;
        const duration = 900;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const current = targetValue * progress;
            el.textContent = `${prefix}${current.toFixed(decimals)}`;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = original;
            }
        };

        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateValue(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 }
    );

    stats.forEach(stat => observer.observe(stat));
}

/**
 * Initialize lightbox functionality for product images
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const containerImages = document.querySelectorAll('.container-image');
    
    // Open lightbox when clicking on a container image
    containerImages.forEach(container => {
        container.addEventListener('click', (e) => {
            // Get the active (visible) image in this container
            const activeImg = container.querySelector('.product-img.active');
            
            if (activeImg) {
                // Get the card to extract product info
                const card = container.closest('.size-card');
                const shape = card.dataset.shape;
                const size = card.dataset.size;
                const color = activeImg.dataset.color;
                
                // Set the lightbox image and caption
                lightboxImg.src = activeImg.src;
                lightboxImg.alt = activeImg.alt;
                lightboxCaption.textContent = `${shape.charAt(0).toUpperCase() + shape.slice(1)} Container - ${size} (${color.charAt(0).toUpperCase() + color.slice(1)})`;
                
                // Show lightbox
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });
    
    // Close lightbox when clicking the close button
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}
