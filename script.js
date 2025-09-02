// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const talkRequestForm = document.getElementById('talkRequestForm');
const calendlyButtons = document.querySelectorAll('.calendly-btn');
const statNumbers = document.querySelectorAll('.stat-number');
const aboutCards = document.querySelectorAll('.about-card');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Link Highlighting
function updateActiveNavLink() {
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

// Scroll Animation for Sections
function animateOnScroll() {
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionVisible = 150;
        
        if (sectionTop < window.innerHeight - sectionVisible) {
            section.classList.add('visible');
        }
    });
}

// Initialize sections animation
function initializeSections() {
    sections.forEach(section => {
        section.classList.remove('visible');
    });
    // Show the first section immediately
    if (sections.length > 0) {
        sections[0].classList.add('visible');
    }
}

// Talk Request Form Handler
function initializeTalkForm() {
    if (talkRequestForm) {
        talkRequestForm.addEventListener('submit', handleTalkFormSubmit);
    }
}

function handleTalkFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitTalkRequest');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Use Formspree for form submission
    const formData = new FormData(talkRequestForm);
    
    // Submit to Formspree (replace with your actual form ID)
    fetch(talkRequestForm.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showNotification('Thank you for your talk request! I\'ll get back to you within 24 hours.', 'success');
            talkRequestForm.reset();
        } else {
            return response.json().then(data => {
                if (data.errors) {
                    throw new Error(data.errors.map(error => error.message).join(', '));
                } else {
                    throw new Error('Something went wrong!');
                }
            });
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        showNotification('Sorry, there was an error submitting your request. Please try again or email me directly.', 'error');
    })
    .finally(() => {
        // Reset loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
        border-radius: 8px;
        padding: 1rem;
        max-width: 400px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Typing Animation for Home Section
function initializeTypingAnimation() {
    const subtitle = document.querySelector('.home-subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.borderRight = '2px solid #ffd700';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    subtitle.style.borderRight = 'none';
                }, 1000);
            }
        }
        
        // Start typing animation after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Parallax Effect for Home Section
function initializeParallax() {
    const homeSection = document.querySelector('.home-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (homeSection) {
            homeSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// Project Card Hover Effects
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Statistics Counter Animation
function animateStatCounters() {
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            }
        }, 16);
    };

    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        if (target) {
            // Reset counter
            stat.textContent = '0';
            // Start animation
            setTimeout(() => {
                animateCounter(stat, target);
            }, 500);
        }
    });
}

// Code Snippet Typing Animation
function initializeCodeTyping() {
    const codeLines = document.querySelectorAll('.code-line');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Use requestAnimationFrame for smoother animation
                requestAnimationFrame(() => {
                    animateCodeTyping();
                });
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '0px 0px -20px 0px' 
    });
    
    const codeSnippet = document.querySelector('.code-snippet');
    if (codeSnippet) {
        observer.observe(codeSnippet);
    }
}

function animateCodeTyping() {
    const codeLines = document.querySelectorAll('.code-line');
    
    // Add smooth fade-in animation instead of flickering typing effect
    codeLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-10px)';
        line.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        }, index * 200);
    });
}

// Removed typeText function as it was causing flickering

// Enhanced Scroll Animations - Simplified like Fun Facts
function initializeAboutAnimations() {
    // Get all elements that should have simple fade-in animation
    const animatedElements = document.querySelectorAll(
        '.about-card, .fun-fact, .stat-item, .timeline-item, .skill-category-modern, .value-item'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'none'; // Ensure no movement
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.6s ease';
        element.style.transform = 'none'; // Ensure no initial transform
        observer.observe(element);
    });
}

// Statistics Observer
function initializeStatsObserver() {
    const statsSection = document.querySelector('.intro-stats');
    
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStatCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
}

// Skill Pills Hover Animation
function initializeSkillPills() {
    const skillPills = document.querySelectorAll('.skill-pill');
    
    skillPills.forEach(pill => {
        pill.addEventListener('mouseenter', () => {
            pill.style.transform = 'scale(1.1) rotate(2deg)';
            pill.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
        
        pill.addEventListener('mouseleave', () => {
            pill.style.transform = 'scale(1) rotate(0deg)';
            pill.style.boxShadow = 'none';
        });
    });
}

// Parallax Effect for Cards - DISABLED to prevent movement
function initializeCardParallax() {
    // Removed parallax effect to prevent cards from moving while scrolling
}

// Dark Mode Toggle (optional feature)
function initializeDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
        
        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }
}

// Form Validation Helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Scroll to Top Button
function initializeScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.transform = 'translateY(0)';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.transform = 'translateY(10px)';
        }
    });
    
    // Scroll to top when clicked
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Performance Optimization: Throttle scroll events
function throttle(func, wait) {
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

// Form Auto-save (optional feature)
function initializeFormAutoSave() {
    const formInputs = talkRequestForm?.querySelectorAll('input, textarea, select');
    
    formInputs?.forEach(input => {
        input.addEventListener('input', () => {
            const formData = new FormData(talkRequestForm);
            const data = Object.fromEntries(formData);
            localStorage.setItem('talkFormData', JSON.stringify(data));
        });
    });
    
    // Restore form data on page load
    const savedData = localStorage.getItem('talkFormData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = talkRequestForm?.querySelector(`[name="${key}"]`);
                if (input && data[key]) {
                    input.value = data[key];
                }
            });
        } catch (e) {
            console.error('Error restoring form data:', e);
        }
    }
}

// Clear saved form data after successful submission
function clearFormAutoSave() {
    localStorage.removeItem('talkFormData');
}

// Calendly Integration - Production Ready
function initializeCalendly() {
    // Function to setup buttons once Calendly is available
    function setupCalendlyButtons() {
        const calendlyButtons = document.querySelectorAll('.calendly-btn');
        
        calendlyButtons.forEach((button, index) => {
            // Remove any existing listeners to prevent duplicates
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const calendlyUrl = newButton.getAttribute('data-calendly-url');
                
                if (!calendlyUrl) {
                    return;
                }
                
                // For local development, always use new tab if on localhost
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                
                if (isLocalhost) {
                    window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
                    return;
                }
                
                // Check if Calendly is available for production
                if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
                    try {
                        window.Calendly.initPopupWidget({
                            url: calendlyUrl,
                            pageSettings: {
                                backgroundColor: 'ffffff',
                                hideEventTypeDetails: false,
                                hideLandingPageDetails: false,
                                primaryColor: '667eea',
                                textColor: '4d4d4d'
                            }
                        });
                    } catch (error) {
                        window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
                    }
                } else {
                    window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
                }
            });
        });
    }
    
    // Wait for Calendly to be available
    function waitForCalendly(attempts = 0) {
        const maxAttempts = 20;
        
        if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
            setupCalendlyButtons();
        } else if (attempts < maxAttempts) {
            setTimeout(() => waitForCalendly(attempts + 1), 100);
        } else {
            setupCalendlyButtons(); // Still setup buttons, they'll just open in new tab
        }
    }
    
    // Start waiting for Calendly
    waitForCalendly();
    
    // Add event listeners for Calendly events
    window.addEventListener('message', function(e) {
        if (e.data.event && e.data.event.indexOf('calendly') === 0) {
            if (e.data.event === 'calendly.event_scheduled') {
                showNotification('Great! Your mentorship session has been scheduled. You should receive a confirmation email shortly.', 'success');
                
                // Track successful bookings (optional)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'mentorship_booked', {
                        'event_category': 'conversion',
                        'event_label': 'calendly_booking'
                    });
                }
            }
        }
    });
}

// Enhanced Calendly URL Validation
function validateCalendlyUrls() {
    const calendlyButtons = document.querySelectorAll('.calendly-btn');
    let allValid = true;
    
    calendlyButtons.forEach(button => {
        const url = button.getAttribute('data-calendly-url');
        if (!url || !url.includes('calendly.com')) {
            console.warn('Invalid or missing Calendly URL for button:', button);
            allValid = false;
            
            // Disable button with invalid URL
            button.disabled = true;
            button.title = 'Calendly URL not configured';
            button.style.opacity = '0.5';
        }
    });
    
    return allValid;
}

// Mobile and Touch Device Enhancements
function initializeMobileEnhancements() {
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Prevent zoom on double tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Add touch feedback for interactive elements
    const touchElements = document.querySelectorAll('.btn, .calendly-btn, .nav-link, .social-link, .project-link');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.opacity = '1';
            }, 150);
        });
    });

    // Optimize scroll performance for mobile
    let ticking = false;
    function optimizedScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavLink();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Replace existing scroll event with optimized version
    window.removeEventListener('scroll', updateActiveNavLink);
    window.addEventListener('scroll', optimizedScroll, { passive: true });
}

// Device Detection and Orientation Handling
function handleDeviceOrientation() {
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        // Close mobile menu on orientation change
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Refresh layout after orientation change
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    });

    // Detect if it's a touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    }

    // Add viewport height CSS variable for mobile browsers
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
}

// Enhanced Responsive Image Loading
function initializeResponsiveImages() {
    const images = document.querySelectorAll('img');
    
    // Add loading=lazy for better performance
    images.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });

    // Intersection Observer for image loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Blog Category Filter Functionality
function initializeBlogFilter() {
    const categoryLinks = document.querySelectorAll('.category-link');
    const blogItems = document.querySelectorAll('.blog-item');

    console.log('Initializing blog filter:', categoryLinks.length, 'links found');
    console.log('Blog items found:', blogItems.length);

    // Add click event listeners to category links
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            console.log('Category clicked:', category);
            
            // Update active link
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Filter blog items
            filterBlogItems(category, blogItems);
        });
    });
}

function filterBlogItems(category, blogItems) {
    blogItems.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        const shouldShow = category === 'all' || itemCategory === category;
        
        if (shouldShow) {
            // Show the item with animation
            setTimeout(() => {
                item.classList.remove('hidden');
                item.classList.add('show');
            }, index * 100);
        } else {
            // Hide the item
            item.classList.add('hidden');
            item.classList.remove('show');
        }
    });
}

// Initialize blog filter counter animation
function initializeBlogStats() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Add count to filter buttons (optional)
    filterButtons.forEach(button => {
        const category = button.getAttribute('data-category');
        if (category !== 'all') {
            const count = document.querySelectorAll(`[data-category="${category}"]`).length;
            if (count > 0) {
                button.innerHTML += ` <span class="filter-count">(${count})</span>`;
            }
        } else {
            const totalCount = document.querySelectorAll('.blog-item').length;
            button.innerHTML += ` <span class="filter-count">(${totalCount})</span>`;
        }
    });
}

// Enhanced blog item hover effects
function initializeBlogInteractions() {
    const blogItems = document.querySelectorAll('.blog-item');
    
    blogItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px)';
            item.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
            item.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
        });
    });
}

// Updated Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core features
    initializeSections();
    initializeTalkForm();
    initializeCalendly();
    initializeFormAutoSave();
    initializeTypingAnimation();
    initializeParallax();
    initializeProjectCards();
    initializeDarkMode();
    initializeScrollToTop();
    
    // New About section features
    initializeCodeTyping();
    initializeAboutAnimations();
    initializeStatsObserver();
    initializeSkillPills();
    initializeCardParallax();
    
    // Mobile and responsive enhancements
    initializeMobileEnhancements();
    handleDeviceOrientation();
    initializeResponsiveImages();
    
    // Validate Calendly integration
    setTimeout(() => {
        validateCalendlyUrls();
    }, 1000);
    
    // Initialize blog features
    initializeBlogFilter();
    initializeBlogStats();
    initializeBlogInteractions();
    
    // Initial scroll check
    animateOnScroll();
    updateActiveNavLink();
});

// Throttled scroll events for better performance
window.addEventListener('scroll', throttle(() => {
    updateActiveNavLink();
    animateOnScroll();
}, 16));

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Prevent default behavior for anchor links that don't exist
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') === '#') {
        e.preventDefault();
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add loading styles if not already present
    if (!document.querySelector('#loading-styles')) {
        const style = document.createElement('style');
        style.id = 'loading-styles';
        style.textContent = `
            body:not(.loaded) {
                overflow: hidden;
            }
            body:not(.loaded)::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #667eea;
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            body:not(.loaded)::after {
                content: '';
                position: fixed;
                top: 50%;
                left: 50%;
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                z-index: 10002;
                transform: translate(-50%, -50%);
            }
            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
});

// Simplified Animation Observer - No Movement, Just Fade
function initializeAnimationObserver() {
    // This function is now simplified and delegates to initializeAboutAnimations
    // All elements will use the same simple fade-in without movement
}

// Initialize animation observer when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAnimationObserver);

// Export functions for potential external use
window.portfolioJS = {
    showNotification,
    animateCounter,
    validateEmail,
    throttle
};
