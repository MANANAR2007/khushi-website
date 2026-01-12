/* =============================================
   KHÜSHI - Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initColorSelectors();
    initSmoothScrolling();
    initNavHighlight();
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
