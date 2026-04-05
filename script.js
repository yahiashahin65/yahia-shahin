// ============================================
// YAHIA SHAHIN PORTFOLIO - JAVASCRIPT
// ============================================

// ======== DOM ELEMENTS ========
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

// ======== DARK MODE / LIGHT MODE ========

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme') || 'light';
body.classList.add(currentTheme);
updateThemeIcon(currentTheme);

// Theme Toggle Event
themeToggle.addEventListener('click', toggleTheme);

function toggleTheme() {
    body.classList.toggle('dark');
    body.classList.toggle('light');
    
    const newTheme = body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ======== SMOOTH SCROLLING ========

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ======== SCROLL ANIMATIONS ========

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ======== NAVBAR ACTIVE LINK ========

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ======== LAZY LOADING IMAGES ========

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
    
    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// ======== FORM HANDLING (إذا كان هناك form) ========

const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // جمع البيانات
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // إرسال البيانات (يمكن تعديل هذا لاحقاً)
        console.log('Form Data:', data);
        
        // إظهار رسالة نجاح
        showNotification('Thanks for reaching out! I\'ll get back to you soon.');
        
        // إعادة تعيين النموذج
        this.reset();
    });
}

// ======== NOTIFICATION SYSTEM ========

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // إضافة الأنماط
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 4 ثوان
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ======== COPY TO CLIPBOARD ========

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!');
    }).catch(() => {
        showNotification('Failed to copy', 'error');
    });
}

// ======== ANALYTICS TRACKING ========

// Google Analytics (يمكن إضافة GA ID هنا لاحقاً)
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Track Link Clicks
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('External Links', 'Click', this.href);
    });
});

// ======== NAVIGATION ACTIVE STATE ========

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.style.color = '');
            this.style.color = 'var(--accent)';
        });
    });
});

// ======== PERFORMANCE MONITORING ========

// Web Vitals
if ('web-vital' in window) {
    const vitals = {
        LCP: 0,
        FID: 0,
        CLS: 0
    };
    
    console.log('Web Vitals:', vitals);
}

// ======== KEYBOARD SHORTCUTS ========

document.addEventListener('keydown', function(e) {
    // Alt + H: Home
    if (e.altKey && e.key === 'h') {
        document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Alt + P: Projects
    if (e.altKey && e.key === 'p') {
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Alt + C: Contact
    if (e.altKey && e.key === 'c') {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Alt + T: Toggle Theme
    if (e.altKey && e.key === 't') {
        toggleTheme();
    }
});

// ======== ANIMATIONS ========

// Add CSS animations if not already in CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav-links a.active {
        color: var(--accent);
        border-bottom: 2px solid var(--accent);
    }
`;
document.head.appendChild(style);

// ======== READY EVENT ========

document.addEventListener('DOMContentLoaded', function() {
    console.log('Yahia Shahin Portfolio loaded successfully! ✨');
    console.log('Theme:', currentTheme);
    console.log('Keyboard shortcuts available: Alt+H (Home), Alt+P (Projects), Alt+C (Contact), Alt+T (Theme)');
});

// ======== WINDOW LOAD EVENT ========

window.addEventListener('load', function() {
    // All resources loaded
    console.log('All resources loaded! 🚀');
    
    // Remove loading animation if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
});

// ======== SERVICE WORKER REGISTRATION ========

if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
    navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('Service Worker registered:', registration);
    }).catch(error => {
        console.log('Service Worker registration failed:', error);
    });
}

// ======== HELPER FUNCTIONS ========

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Debounce function
function debounce(func, wait) {
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

// ======== EXPORT FOR TESTING ========

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleTheme,
        showNotification,
        copyToClipboard,
        trackEvent,
        isInViewport,
        getUrlParameter
    };
}

// ======== END OF SCRIPT ========