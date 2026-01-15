/* =============================================
   KHÜSHI - Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initColorSelectors();
    initSmoothScrolling();
    initNavHighlight();
    initLightbox();
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
        });
    });
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
