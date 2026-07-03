// Ensure products and outcome section videos play (autoplay + programmatic play fallback)
document.addEventListener('DOMContentLoaded', function() {
    var productsVideo = document.querySelector('.products-video');
    if (productsVideo && productsVideo.tagName === 'VIDEO') {
        productsVideo.muted = true;
        productsVideo.play().catch(function() {});
    }
    var outcomeVideo = document.querySelector('.outcome-video');
    if (outcomeVideo && outcomeVideo.tagName === 'VIDEO') {
        outcomeVideo.muted = true;
        outcomeVideo.play().catch(function() {});
    }
    var acclaimSidebarVid = document.querySelector('.acclaim-sidebar-img');
    if (acclaimSidebarVid && acclaimSidebarVid.tagName === 'VIDEO') {
        acclaimSidebarVid.muted = true;
        acclaimSidebarVid.play().catch(function() {});
    }

    // Division card videos: defer download/play until near viewport (preload="none" on index)
    var divisionVideos = document.querySelectorAll('video.division-logo');
    function playDivisionVideo(v) {
        v.muted = true;
        if (v.readyState < 1) v.load();
        var p = v.play();
        if (p && p.catch) p.catch(function() {});
    }
    if (divisionVideos.length) {
        if ('IntersectionObserver' in window) {
            var divIo = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) playDivisionVideo(entry.target);
                });
            }, { rootMargin: '120px', threshold: 0.02 });
            divisionVideos.forEach(function(v) { divIo.observe(v); });
        } else {
            divisionVideos.forEach(playDivisionVideo);
        }
    }

    // Products & Outcome sidebars: appear with first item, fix in middle while in section, move away with last item
    var productsSection = document.querySelector('.products-section');
    var productsSidebar = document.querySelector('.products-sidebar-video');
    // Always track the actual last product card (Charging Accessories)
    var productsLastItem = document.querySelector('.products-section .products-content-layered .product-item:last-child');
    var outcomeSection = document.querySelector('.outcome-section');
    var outcomeSidebar = document.querySelector('.outcome-sidebar-video');
    var outcomeLastItem = document.querySelector('.outcome-section .outcome-content-layered--beginner .outcome-item:last-child');
    var mainNav = document.querySelector('.main-nav');
    var ticking = false;
    function checkStickySections() {
        var stickPoint = window.innerHeight * 0.5;
        if (productsSidebar && productsSection) {
            var prRect = productsSidebar.getBoundingClientRect();
            var prSecRect = productsSection.getBoundingClientRect();
            var lastProductRect = productsLastItem ? productsLastItem.getBoundingClientRect() : null;
            // Keep products video/header fixed until the TOP of the Charging Accessories card
            // reaches the same vertical level as the sticky video (stickPoint).
            // Unstick when last product's top crosses the stickPoint.
            var lastProductLeaving = lastProductRect
                ? lastProductRect.top <= stickPoint
                : prSecRect.bottom <= 0;
            if (prRect.top <= stickPoint && prSecRect.bottom > 0 && !lastProductLeaving) {
                productsSidebar.classList.add('is-stuck');
            } else {
                productsSidebar.classList.remove('is-stuck');
            }
        }
        if (outcomeSidebar && outcomeSection) {
            var orRect = outcomeSidebar.getBoundingClientRect();
            var orSecRect = outcomeSection.getBoundingClientRect();
            var lastOutcomeRect = outcomeLastItem ? outcomeLastItem.getBoundingClientRect() : null;
            var lastOutcomeLeaving = lastOutcomeRect
                ? lastOutcomeRect.top <= stickPoint
                : orSecRect.bottom <= 0;
            if (orRect.top <= stickPoint && orSecRect.bottom > 0 && !lastOutcomeLeaving) {
                outcomeSidebar.classList.add('is-stuck');
            } else {
                outcomeSidebar.classList.remove('is-stuck');
            }
        }
        ticking = false;
    }
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(checkStickySections);
            ticking = true;
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    checkStickySections();
});

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Add active state to navigation
            document.querySelectorAll('.floating-nav-item').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Enhanced floating navigation functionality
const floatingNavToggle = document.getElementById('floatingNavToggle');
const floatingNavMenu = document.getElementById('floatingNavMenu');

if (floatingNavToggle && floatingNavMenu) {
    floatingNavToggle.addEventListener('click', () => {
        floatingNavMenu.classList.toggle('active');
        floatingNavToggle.style.transform = floatingNavMenu.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!floatingNavToggle.contains(e.target) && !floatingNavMenu.contains(e.target)) {
            floatingNavMenu.classList.remove('active');
            floatingNavToggle.style.transform = 'rotate(0deg)';
        }
    });
}



// Enhanced Scroll Animation System
const scrollObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, scrollObserverOptions);

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    
    animatedElements.forEach((element) => {
        scrollObserver.observe(element);
    });
    
    // Add special handling for staggered elements
    const staggeredElements = document.querySelectorAll('.stagger-1, .stagger-2, .stagger-3, .stagger-4, .stagger-5, .stagger-6');
    staggeredElements.forEach((element) => {
        scrollObserver.observe(element);
    });

    // Products: make video and first product (Gas Monitoring) appear together
    const productsSideways = document.querySelector('.products-section .sideways-section');
    const productsSidebarVideo = document.querySelector('.products-section .products-sidebar-video');
    const firstProductItem = document.querySelector('.products-section .products-content-layered .product-item:nth-child(1)');
    if (productsSideways && productsSidebarVideo && firstProductItem) {
        const productsPairObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    productsSidebarVideo.classList.add('visible');
                    firstProductItem.classList.add('visible');
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
        productsPairObserver.observe(productsSideways);
    }

    // Outcome: sidebar image and first block appear together (Beginner-style pair)
    const outcomeShowcase = document.querySelector('.outcome-section .outcome-showcase-component');
    const outcomeSidebarVideo = document.querySelector('.outcome-section .outcome-sidebar-video');
    const firstOutcomeItem = document.querySelector('.outcome-section .outcome-content-layered--beginner .outcome-item:nth-child(1)');
    if (outcomeShowcase && outcomeSidebarVideo && firstOutcomeItem) {
        const outcomePairObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    outcomeSidebarVideo.classList.add('visible');
                    firstOutcomeItem.classList.add('visible');
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
        outcomePairObserver.observe(outcomeShowcase);
    }

});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                alert('Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
                contactForm.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Sorry, there was an error sending your message. Please try again or contact us directly.');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Card hover is handled by CSS (scale + shadow) for consistent premium feel

// Scroll progress indicator
window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    // Add scroll progress to floating nav
    if (floatingNavToggle) {
        floatingNavToggle.style.background = `conic-gradient(#ff6b35 ${scrolled}%, rgba(255, 107, 53, 0.3) ${scrolled}%)`;
    }
});

// Enhanced intersection observer for better animations
const enhancedObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const enhancedObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Remove inline opacity/transform so element becomes visible (inline overrides CSS)
            entry.target.style.opacity = '1';
            entry.target.style.transform = '';
            
            // Add staggered animation for grid items
            if (entry.target.classList.contains('division-card') || 
                entry.target.classList.contains('acclaim-quote-item') ||
                entry.target.classList.contains('metric-item') ||
                entry.target.classList.contains('contact-item')) {
                const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
        }
    });
}, enhancedObserverOptions);

// Observe all enhanced elements
document.addEventListener('DOMContentLoaded', () => {
    /* Exclude .product-item — was breaking motion; float now uses script sectionFloatRaf */
    const enhancedElements = document.querySelectorAll('.division-card, .acclaim-quote-item, .metric-item, .contact-item, .bento-card, .section-header');
    
    enhancedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        enhancedObserver.observe(el);
    });

    // Acclaim: grow quotes as their vertical position aligns with the sticky header column (branding + CTA)
    const acclaimComments = document.querySelectorAll('.acclaim-quote-item .acclaim-quote-text');
    const acclaimHeaderEl = document.querySelector('.acclaim-quotes-right-inner');

    if (acclaimComments.length > 0 && acclaimHeaderEl) {
        acclaimComments.forEach(blockquote => {
            blockquote.style.transition = 'transform 0.35s ease';
            blockquote.style.transformOrigin = 'left center';
        });

        const emphasizeCommentsOnScroll = () => {
            const headerRect = acclaimHeaderEl.getBoundingClientRect();
            // Target: vertical middle of the acclaim header block (tracks sticky column)
            const targetY = (headerRect.top + headerRect.bottom) / 2;
            const threshold = Math.min(
                Math.max(headerRect.height * 1.35, 200),
                window.innerHeight * 0.45
            );

            acclaimComments.forEach(blockquote => {
                const rect = blockquote.getBoundingClientRect();
                const commentCenterY = (rect.top + rect.bottom) / 2;
                const distance = Math.abs(commentCenterY - targetY);

                if (distance < threshold) {
                    const proximity = 1 - distance / threshold;
                    const eased = proximity * proximity;
                    const scale = 1 + eased * 0.18;
                    blockquote.style.transform = `scale(${scale})`;
                } else {
                    blockquote.style.transform = 'scale(1)';
                }
            });
        };

        window.addEventListener('scroll', emphasizeCommentsOnScroll, { passive: true });
        window.addEventListener('resize', emphasizeCommentsOnScroll, { passive: true });
        emphasizeCommentsOnScroll();
    }
});

// Parallax effect for floating elements and text
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
    
    // Parallax text movement (exclude hero - hero stays fixed)
    const parallaxTexts = document.querySelectorAll('.parallax-text');
    parallaxTexts.forEach((text, index) => {
        if (text.closest('.hero')) return;
        const speed = 0.3 + (index * 0.1);
        const yPos = -(scrolled * speed);
        text.style.transform = `translateY(${yPos}px)`;
    });
    
    // Hero stays fixed - no scroll-based movement, fade, or scale
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    if (heroTitle) heroTitle.style.transform = '';
    if (heroSubtitle) { heroSubtitle.style.opacity = '1'; heroSubtitle.style.transform = ''; }
    if (heroCta) { heroCta.style.opacity = '1'; heroCta.style.transform = ''; }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    if (floatingNavToggle) {
        floatingNavToggle.style.background = `conic-gradient(#ff6b35 ${scrolled}%, rgba(255, 107, 53, 0.3) ${scrolled}%)`;
    }
    
    const scrolledY = window.scrollY;
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolledY * speed}px) rotate(${scrolledY * 0.1}deg)`;
    });
}, 16); // 60fps

window.addEventListener('scroll', throttledScrollHandler);

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        }
    });
});

// Observe all lazy images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
});

// Mouse movement effects for text animation
document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Calculate mouse position relative to center
    const deltaX = (clientX - centerX) / centerX;
    const deltaY = (clientY - centerY) / centerY;
    
    // Apply subtle movement to hero text elements
    const heroTitle = document.querySelector('.hero-title');
    const heroTagline = document.querySelector('.hero-tagline');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    
    if (heroTitle) {
        const moveX = deltaX * 10;
        const moveY = deltaY * 5;
        heroTitle.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    
    if (heroTagline) {
        const moveX = deltaX * 6;
        const moveY = deltaY * 3;
        heroTagline.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    
    if (heroSubtitle) {
        const moveX = deltaX * 5;
        const moveY = deltaY * 3;
        heroSubtitle.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    
    if (heroCta) {
        const moveX = deltaX * 8;
        const moveY = deltaY * 4;
        heroCta.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    
    // Add floating effect to section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach((title, index) => {
        const moveX = deltaX * (3 + index * 0.5);
        const moveY = deltaY * (2 + index * 0.3);
        title.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// Text typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize text effects when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add parallax-text class to elements for scroll effects
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    
    if (heroTitle) heroTitle.classList.add('parallax-text');
    if (heroSubtitle) heroSubtitle.classList.add('parallax-text');
    if (heroCta) heroCta.classList.add('parallax-text');
    
    // Add floating-text class to section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.classList.add('floating-text');
    });
    
    // Add text-glow effect to important elements
    const importantTexts = document.querySelectorAll('.hero-title, .section-title, .cta-button');
    importantTexts.forEach(text => {
        text.classList.add('text-glow');
    });
});

// Division card debugging and enhancement
document.addEventListener('DOMContentLoaded', function() {
    const divisionCards = document.querySelectorAll('.division-card');
    
    divisionCards.forEach((card, index) => {
        // Ensure card is clickable
        card.style.cursor = 'pointer';
        card.style.pointerEvents = 'auto';
        
        // Add click event listener for debugging
        card.addEventListener('click', function(e) {
            console.log(`Division card ${index + 1} clicked!`);
            console.log('Href:', this.href);
            console.log('Target file:', this.getAttribute('href'));
            
            // Force navigation if needed
            if (this.href) {
                console.log('Navigating to:', this.href);
            }
        });
        
        // Touch/mouse feedback: minimal so CSS hover (scale + shadow) remains primary
        card.addEventListener('touchstart', function() { this.style.opacity = '0.95'; });
        card.addEventListener('touchend', function() { this.style.opacity = ''; });
        card.addEventListener('mousedown', function() { this.style.opacity = '0.95'; });
        card.addEventListener('mouseup', function() { this.style.opacity = ''; });
        
        // Debug: Log card information
        console.log(`Division card ${index + 1}:`, {
            href: card.href,
            target: card.getAttribute('href'),
            className: card.className,
            cursor: card.style.cursor,
            pointerEvents: card.style.pointerEvents
        });
    });
    
    // Test if all division files exist
    const divisionFiles = [
        'drilling-tools.html',
        'fire-solutions.html',
        'fluid-solutions.html',
        'mining-technologies.html',
        'strata-solutions.html'
    ];
    
    divisionFiles.forEach(file => {
        fetch(file)
            .then(response => {
                if (response.ok) {
                    console.log(`✅ ${file} exists and is accessible`);
                } else {
                    console.log(`❌ ${file} not accessible (${response.status})`);
                }
            })
            .catch(error => {
                console.log(`❌ ${file} error:`, error.message);
            });
    });
});

// Acclaim and outcome hover handled by CSS for consistent transitions

// Enhanced Background Movement Effects
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
        
        // Add subtle rotation to background elements on scroll
        const floatingElements = hero.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const rotationRate = (scrolled * 0.1) + (index * 45);
            const scaleRate = 1 + (scrolled * 0.0001);
            element.style.transform = `rotate(${rotationRate}deg) scale(${scaleRate})`;
        });
    }
});

// Mouse movement effect for floating elements
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const floatingElements = hero.querySelectorAll('.floating-element');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        floatingElements.forEach((element, index) => {
            const moveX = (mouseX - 0.5) * (20 + index * 5);
            const moveY = (mouseY - 0.5) * (15 + index * 3);
            element.style.transform += ` translate(${moveX}px, ${moveY}px)`;
        });
    }
});

// Continuous floating animation enhancement
function enhanceFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 2}s`;
        element.style.animationDuration = `${15 + index * 2}s`;
    });
}

// Initialize enhanced floating animations
document.addEventListener('DOMContentLoaded', enhanceFloatingAnimation);

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to all buttons
document.querySelectorAll('.cta-btn, .process-btn, .submit-btn').forEach(button => {
    button.addEventListener('click', createRipple);
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .cta-btn, .process-btn, .submit-btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Lazy loading for images (if any are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    z-index: 10000;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
});

// Hide nav exactly when entering the white Divisions section
document.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.querySelector('.main-nav');
    const divisionsSection = document.querySelector('.divisions-section');

    if (!mainNav || !divisionsSection) return;

    const navHeight = mainNav.offsetHeight || 80;

    const handleNavOnLight = () => {
        const rect = divisionsSection.getBoundingClientRect();
        const start = rect.top - navHeight; // when top of divisions hits just under nav
        const end = rect.bottom;

        if (start <= 0 && end > 0) {
            mainNav.classList.add('nav-hidden');
            mainNav.classList.remove('nav-on-light');
        } else {
            mainNav.classList.remove('nav-hidden');
        }
    };

    window.addEventListener('scroll', handleNavOnLight, { passive: true });
    handleNavOnLight();
});

// Header nav: highlight active section link when section is in view
document.addEventListener('DOMContentLoaded', () => {
    const sections = ['home', 'metrics', 'products', 'outcome', 'acclaim', 'divisions', 'about'];
    const navLinks = document.querySelectorAll('.main-nav .nav-link');

    const setActiveNavLink = () => {
        const viewportHeight = window.innerHeight;
        const triggerPoint = viewportHeight * 0.35;
        let activeId = 'home';

        sections.forEach(id => {
            const section = document.getElementById(id);
            if (!section) return;
            const rect = section.getBoundingClientRect();
            if (rect.top <= triggerPoint && rect.bottom > 0) {
                activeId = id;
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const targetId = href ? href.slice(1) : '';
            link.classList.toggle('active', targetId === activeId);
        });
    };

    window.addEventListener('scroll', setActiveNavLink, { passive: true });
    setActiveNavLink();
});

// More button: switch to black when floating over divisions section (white background)
document.addEventListener('DOMContentLoaded', () => {
    const floatingMore = document.querySelector('.floating-more');
    const floatingMoreBtn = document.getElementById('floatingMoreButton');
    const divisionsSection = document.querySelector('.divisions-section');
    if (!floatingMore || !divisionsSection || !floatingMoreBtn) return;

    const handleMoreButtonOnDivisions = () => {
        const divRect = divisionsSection.getBoundingClientRect();
        const btnRect = floatingMoreBtn.getBoundingClientRect();
        // Check if button overlaps divisions section (vertical overlap)
        const overlapsVertically = btnRect.top < divRect.bottom && btnRect.bottom > divRect.top;
        const overlapsHorizontally = btnRect.left < divRect.right && btnRect.right > divRect.left;
        const isOverDivisions = overlapsVertically && overlapsHorizontally;

        floatingMore.classList.toggle('over-divisions', isOverDivisions);
    };

    window.addEventListener('scroll', handleMoreButtonOnDivisions, { passive: true });
    window.addEventListener('resize', handleMoreButtonOnDivisions);
    handleMoreButtonOnDivisions();
});

// Initialize all animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add staggered animation to process cards
    const processCards = document.querySelectorAll('.process-card');
    processCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add staggered animation to outcome cards
    const outcomeCards = document.querySelectorAll('.outcome-card');
    outcomeCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add staggered animation to acclaim quote items
    const acclaimCards = document.querySelectorAll('.acclaim-quote-item');
    acclaimCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// Floating Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    const floatingNavToggle = document.getElementById('floatingNavToggle');
    const floatingNavMenu = document.getElementById('floatingNavMenu');
    
    if (floatingNavToggle && floatingNavMenu) {
        // Toggle menu visibility
        floatingNavToggle.addEventListener('click', function() {
            floatingNavMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!floatingNavToggle.contains(event.target) && !floatingNavMenu.contains(event.target)) {
                floatingNavMenu.classList.remove('active');
            }
        });
        
        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('.floating-nav-item');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Close menu
                    floatingNavMenu.classList.remove('active');
                    
                    // Smooth scroll to section
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Close menu on scroll
        window.addEventListener('scroll', function() {
            floatingNavMenu.classList.remove('active');
        });
    }
});

// Floating More Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    const floatingMoreButton = document.getElementById('floatingMoreButton');
    const floatingMoreMenu = document.getElementById('floatingMoreMenu');
    
    if (floatingMoreButton && floatingMoreMenu) {
        // Toggle menu visibility
        floatingMoreButton.addEventListener('click', function() {
            floatingMoreButton.classList.toggle('active');
            floatingMoreMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!floatingMoreButton.contains(event.target) && !floatingMoreMenu.contains(event.target)) {
                floatingMoreButton.classList.remove('active');
                floatingMoreMenu.classList.remove('active');
            }
        });
        
        // Smooth scrolling for more menu links + About submenu toggle
        const moreLinks = document.querySelectorAll('.floating-more-link');
        moreLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');

                // Special case: About link should toggle its submenu (Background / Who we are / Contacts)
                if (this.textContent.trim().toLowerCase() === 'about') {
                    e.preventDefault();
                    const parentItem = this.closest('.more-menu-item');
                    if (parentItem) {
                        parentItem.classList.toggle('about-open');
                    }
                    return;
                }

                // Fire Solutions page: accordion toggles (Who we are / mission / vision / core values)
                if (this.classList.contains('fire-more-accordion-toggle')) {
                    e.preventDefault();
                    const parentItem = this.closest('.more-menu-item');
                    if (parentItem) {
                        parentItem.classList.toggle('is-open');
                    }
                    return;
                }
                
                // Check if it's an external link (starts with http or is a .html file)
                if (targetId.startsWith('http') || targetId.endsWith('.html')) {
                    // Allow normal navigation for external links
                    return;
                }
                
                // For hash links, prevent default and scroll
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Close menu
                    floatingMoreButton.classList.remove('active');
                    floatingMoreMenu.classList.remove('active');
                    
                    // Smooth scroll to section
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Handle submenu links (sublinks) - allow external links to work normally
        const moreSublinks = document.querySelectorAll('.floating-more-sublink');
        moreSublinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                // Check if it's an external link (starts with http)
                if (targetId.startsWith('http')) {
                    // Allow normal navigation for external links
                    // Close menu after clicking
                    setTimeout(() => {
                        floatingMoreButton.classList.remove('active');
                        floatingMoreMenu.classList.remove('active');
                    }, 100);
                    return;
                }
                
                // Check if it's an HTML file link
                if (targetId.endsWith('.html')) {
                    // Allow normal navigation for HTML file links
                    // Close menu after clicking
                    setTimeout(() => {
                        floatingMoreButton.classList.remove('active');
                        floatingMoreMenu.classList.remove('active');
                    }, 100);
                    return;
                }
                
                // For hash links, prevent default and scroll
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Close menu
                    floatingMoreButton.classList.remove('active');
                    floatingMoreMenu.classList.remove('active');
                    
                    // Smooth scroll to section
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
});
