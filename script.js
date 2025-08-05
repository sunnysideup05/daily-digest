// Analytics tracking
function trackEvent(eventName, properties = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Console log for development
    console.log('Event tracked:', eventName, properties);
}

// Smooth scroll to signup section
function scrollToSignup() {
    const signupSection = document.getElementById('signup');
    if (signupSection) {
        signupSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Track the CTA click
        trackEvent('cta_click', {
            source: 'hero_button'
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle form submission
function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const emailInput = form.querySelector('#email');
    const email = emailInput.value.trim();
    
    // Validate email
    if (!email) {
        showError('Please enter your email address');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Track form submission attempt
    trackEvent('email_signup_attempt', {
        email_domain: email.split('@')[1]
    });
    
    // Simulate form submission (replace with actual backend call)
    submitEmail(email)
        .then(() => {
            showSuccess();
            trackEvent('email_signup_success', {
                email_domain: email.split('@')[1]
            });
        })
        .catch((error) => {
            showError('Something went wrong. Please try again.');
            trackEvent('email_signup_error', {
                error: error.message
            });
        });
}

// Simulate email submission (replace with actual API call)
function submitEmail(email) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // For demo purposes, always resolve
            // In production, make actual API call here
            resolve({ success: true });
        }, 1000);
    });
}

function showError(message) {
    // Remove existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        color: #dc2626;
        font-size: 14px;
        margin-top: 8px;
        text-align: center;
    `;
    errorDiv.textContent = message;
    
    // Insert after form
    const form = document.getElementById('signupForm');
    form.parentNode.insertBefore(errorDiv, form.nextSibling);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

function showSuccess() {
    const form = document.getElementById('signupForm');
    const successMessage = document.getElementById('successMessage');
    
    // Hide form and show success message
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Add animation
    successMessage.style.opacity = '0';
    successMessage.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        successMessage.style.transition = 'all 0.3s ease';
        successMessage.style.opacity = '1';
        successMessage.style.transform = 'translateY(0)';
    }, 100);
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Track section view
                const sectionId = entry.target.id || entry.target.className;
                trackEvent('section_view', {
                    section: sectionId
                });
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    const animatedElements = document.querySelectorAll('.feature-card, .problem-card, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Navigation scroll effect
function initializeNavigation() {
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            nav.style.background = 'rgba(250, 250, 250, 0.95)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(250, 250, 250, 0.8)';
            nav.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Track page interactions
function initializeInteractionTracking() {
    // Track navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            trackEvent('nav_click', {
                target: e.target.textContent,
                href: e.target.href
            });
        });
    });
    
    // Track feature card interactions
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            trackEvent('feature_hover', {
                feature_index: index,
                feature_title: card.querySelector('h3').textContent
            });
        });
    });
    
    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
        const scrollDepth = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            if (maxScrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                trackEvent('scroll_depth', {
                    depth: maxScrollDepth
                });
            }
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleFormSubmission);
    }
    
    // Initialize animations and interactions
    initializeAnimations();
    initializeNavigation();
    initializeInteractionTracking();
    
    // Track page load
    trackEvent('page_load', {
        page: 'landing',
        user_agent: navigator.userAgent,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight
    });
    
    console.log('Morning Digest landing page initialized');
});

// Handle page visibility changes (for analytics)
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        trackEvent('page_exit', {
            time_on_page: Date.now() - pageLoadTime
        });
    }
});

// Track page load time
const pageLoadTime = Date.now();