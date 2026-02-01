// ===================================
// Mobile Navigation Menu Toggle
// ===================================

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
        // Toggle active class on hamburger for animation
        this.classList.toggle('active');
        
        // Toggle active class on nav links to show/hide menu
        navLinks.classList.toggle('active');
        
        // Update aria-expanded attribute for accessibility
        const isExpanded = this.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);
        
        // Prevent body scroll when menu is open
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when a nav link is clicked
    const navLinksItems = document.querySelectorAll('.nav-link');
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

// ===================================
// Smooth Scrolling for Navigation Links
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only prevent default for actual hash links (not just "#")
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===================================
// Active Navigation Link on Scroll
// ===================================

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// ===================================
// Hero Slideshow with Lazy Loading
// ===================================

let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const slideshowInterval = 5000; // 5 seconds

// Lazy load background images for hero slideshow
function lazyLoadSlideImages() {
    slides.forEach((slide, index) => {
        const bgImage = slide.getAttribute('data-lazy-bg');
        if (bgImage) {
            // Load first image immediately, others after a delay
            if (index === 0) {
                slide.style.backgroundImage = `url('${bgImage}')`;
            } else {
                setTimeout(() => {
                    slide.style.backgroundImage = `url('${bgImage}')`;
                }, index * 500); // Stagger loading
            }
        }
    });
}

// Initialize slideshow
function initSlideshow() {
    if (slides.length > 0) {
        // Load images
        lazyLoadSlideImages();
        
        // Start automatic slideshow
        setInterval(() => {
            slides[currentSlideIndex].classList.remove('active');
            
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            
            slides[currentSlideIndex].classList.add('active');
        }, slideshowInterval);
    }
}

// Start slideshow when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlideshow);
} else {
    initSlideshow();
}

// ===================================
// Lazy Load Images for Square Image Links
// ===================================

function lazyLoadImageCards() {
    const imagePlaceholders = document.querySelectorAll('.image-placeholder[data-lazy-bg]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const placeholder = entry.target;
                const bgImage = placeholder.getAttribute('data-lazy-bg');
                
                if (bgImage) {
                    // Create a new image to preload
                    const img = new Image();
                    img.onload = () => {
                        placeholder.style.backgroundImage = `url('${bgImage}')`;
                    };
                    img.src = bgImage;
                }
                
                observer.unobserve(placeholder);
            }
        });
    }, {
        rootMargin: '50px' // Start loading 50px before entering viewport
    });
    
    imagePlaceholders.forEach(placeholder => {
        imageObserver.observe(placeholder);
    });
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lazyLoadImageCards);
} else {
    lazyLoadImageCards();
}

// ===================================
// Back to Top Button
// ===================================

const backToTopButton = document.querySelector('.back-to-top');

if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Keyboard accessibility
    backToTopButton.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

// ===================================
// Button and Link Hover Animations
// ===================================

// Add ripple effect to buttons (optional enhancement)
function createRipple(event) {
    const button = event.currentTarget;
    
    // Remove existing ripples
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    const rect = button.getBoundingClientRect();
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Apply ripple effect to buttons with specific classes
const rippleButtons = document.querySelectorAll('.cta-button, .form-button, .social-button');
rippleButtons.forEach(button => {
    button.addEventListener('click', createRipple);
});

// ===================================
// Image Link Cards - Enhanced Hover Effect
// ===================================

const imageCards = document.querySelectorAll('.image-link-card');

imageCards.forEach(card => {
    // Add subtle parallax effect on mouse move
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        const image = card.querySelector('.image-placeholder');
        if (image) {
            image.style.transform = `scale(1.1) translate(${deltaX * 10}px, ${deltaY * 10}px)`;
        }
    });
    
    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
        const image = card.querySelector('.image-placeholder');
        if (image) {
            image.style.transform = 'scale(1.1)';
        }
    });
});

// ===================================
// Accessibility Enhancements
// ===================================

// Trap focus in mobile menu when open
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
        
        // Close menu on Escape key
        if (e.key === 'Escape' && navLinks && hamburger) {
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                hamburger.focus();
            }
        }
    });
}

// Apply focus trap to mobile nav when it's open
if (navLinks) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (navLinks.classList.contains('active')) {
                    trapFocus(navLinks);
                }
            }
        });
    });
    
    observer.observe(navLinks, { attributes: true });
}

// ===================================
// Performance Optimization
// ===================================

// Debounce scroll events for better performance
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll-based functions
const debouncedActiveNav = debounce(updateActiveNavLink, 50);
window.removeEventListener('scroll', updateActiveNavLink);
window.addEventListener('scroll', debouncedActiveNav);

// ===================================
// Preload Critical Resources
// ===================================

// Preload hero images for faster display
function preloadHeroImages() {
    const heroSlides = document.querySelectorAll('.slide[data-lazy-bg]');
    heroSlides.forEach((slide, index) => {
        const bgImage = slide.getAttribute('data-lazy-bg');
        if (bgImage && index < 2) { // Preload first 2 images
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = bgImage;
            document.head.appendChild(link);
        }
    });
}

// Call on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadHeroImages);
} else {
    preloadHeroImages();
}

// ===================================
// Social Button Animation Enhancement
// ===================================

const socialButtons = document.querySelectorAll('.social-button');

socialButtons.forEach(button => {
    // Add scale animation on hover
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.08)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Add active state animation
    button.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(-1px) scale(1.05)';
    });
    
    button.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-3px) scale(1.08)';
    });
});

// ===================================
// Console Welcome Message
// ===================================

console.log('%c🏐 Cal High Boys Volleyball', 'font-size: 20px; font-weight: bold; color: #ff8c00;');
console.log('%cWebsite loaded successfully!', 'font-size: 14px; color: #333;');
console.log('%cCompete. Commit. Conquer.', 'font-size: 12px; font-style: italic; color: #666;');
