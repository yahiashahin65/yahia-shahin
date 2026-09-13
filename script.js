// ============================================
// YAHIA SHAHIN PORTFOLIO
// JavaScript
// Full-Stack • AI/ML • Data Analytics
// ============================================

'use strict';


// ============================================
// GLOBAL HELPERS
// ============================================

const $ = (selector, scope = document) => scope.querySelector(selector);

const $$ = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

const body = document.body;

const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;


// ============================================
// DOM ELEMENTS
// ============================================

const themeToggle = $('#themeToggle');
const themeIcon = $('#themeIcon');

const nav = $('nav');
const navContainer = $('.nav-container');
const navLinksContainer = $('.nav-links');

const navLinks = $$('.nav-links a');


// ============================================
// THEME
// ============================================

const THEME_STORAGE_KEY = 'theme';

function getSavedTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
    }

    // Keep the portfolio's original default.
    return 'light';
}


function applyTheme(theme) {
    const safeTheme =
        theme === 'dark'
            ? 'dark'
            : 'light';

    // Important:
    // Never allow both "light" and "dark" simultaneously.
    body.classList.remove('light', 'dark');
    body.classList.add(safeTheme);

    body.dataset.theme = safeTheme;

    updateThemeIcon(safeTheme);

    if (themeToggle) {
        themeToggle.setAttribute(
            'aria-label',
            safeTheme === 'dark'
                ? 'Switch to light mode'
                : 'Switch to dark mode'
        );

        themeToggle.setAttribute(
            'title',
            safeTheme === 'dark'
                ? 'Switch to light mode'
                : 'Switch to dark mode'
        );
    }

    const themeColor = $('meta[name="theme-color"]');

    if (themeColor) {
        themeColor.setAttribute(
            'content',
            safeTheme === 'dark'
                ? '#090909'
                : '#b8956a'
        );
    }
}


function updateThemeIcon(theme) {
    if (!themeIcon) return;

    themeIcon.textContent =
        theme === 'dark'
            ? '☀️'
            : '🌙';
}


function toggleTheme() {
    const newTheme =
        body.classList.contains('dark')
            ? 'light'
            : 'dark';

    applyTheme(newTheme);

    localStorage.setItem(
        THEME_STORAGE_KEY,
        newTheme
    );

    trackEvent(
        'Appearance',
        'theme_change',
        newTheme
    );
}


// Apply immediately.
const currentTheme = getSavedTheme();

applyTheme(currentTheme);


if (themeToggle) {
    themeToggle.addEventListener(
        'click',
        toggleTheme
    );
}


// ============================================
// MOBILE NAVIGATION
// ============================================

let mobileMenuButton = null;


function createMobileMenuButton() {
    if (
        !navContainer ||
        !navLinksContainer ||
        $('#mobileMenuToggle')
    ) {
        return;
    }

    mobileMenuButton =
        document.createElement('button');

    mobileMenuButton.id =
        'mobileMenuToggle';

    mobileMenuButton.className =
        'mobile-menu-toggle';

    mobileMenuButton.type =
        'button';

    mobileMenuButton.setAttribute(
        'aria-label',
        'Open navigation menu'
    );

    mobileMenuButton.setAttribute(
        'aria-expanded',
        'false'
    );

    mobileMenuButton.setAttribute(
        'aria-controls',
        'primaryNavigation'
    );

    navLinksContainer.id =
        'primaryNavigation';

    mobileMenuButton.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    // Put the button before the theme button.
    if (themeToggle) {
        navContainer.insertBefore(
            mobileMenuButton,
            themeToggle
        );
    } else {
        navContainer.appendChild(
            mobileMenuButton
        );
    }

    mobileMenuButton.addEventListener(
        'click',
        toggleMobileMenu
    );
}


function isMobileNavigation() {
    return window.matchMedia(
        '(max-width: 980px)'
    ).matches;
}


function openMobileMenu() {
    if (
        !navLinksContainer ||
        !mobileMenuButton
    ) {
        return;
    }

    navLinksContainer.classList.add(
        'mobile-open'
    );

    mobileMenuButton.classList.add(
        'is-open'
    );

    mobileMenuButton.setAttribute(
        'aria-expanded',
        'true'
    );

    mobileMenuButton.setAttribute(
        'aria-label',
        'Close navigation menu'
    );

    body.classList.add(
        'nav-open'
    );
}


function closeMobileMenu() {
    if (!navLinksContainer) {
        return;
    }

    navLinksContainer.classList.remove(
        'mobile-open'
    );

    if (mobileMenuButton) {
        mobileMenuButton.classList.remove(
            'is-open'
        );

        mobileMenuButton.setAttribute(
            'aria-expanded',
            'false'
        );

        mobileMenuButton.setAttribute(
            'aria-label',
            'Open navigation menu'
        );
    }

    body.classList.remove(
        'nav-open'
    );
}


function toggleMobileMenu() {
    if (!navLinksContainer) {
        return;
    }

    if (
        navLinksContainer.classList.contains(
            'mobile-open'
        )
    ) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}


createMobileMenuButton();


// Close menu when navigation link is selected.
navLinks.forEach(link => {
    link.addEventListener(
        'click',
        () => {
            if (isMobileNavigation()) {
                closeMobileMenu();
            }
        }
    );
});


// Close by Escape.
document.addEventListener(
    'keydown',
    event => {
        if (
            event.key === 'Escape' &&
            navLinksContainer?.classList.contains(
                'mobile-open'
            )
        ) {
            closeMobileMenu();

            mobileMenuButton?.focus();
        }
    }
);


// Click outside.
document.addEventListener(
    'click',
    event => {
        if (
            !isMobileNavigation() ||
            !navLinksContainer?.classList.contains(
                'mobile-open'
            )
        ) {
            return;
        }

        const clickedInsideNav =
            navContainer?.contains(
                event.target
            );

        if (!clickedInsideNav) {
            closeMobileMenu();
        }
    }
);


// Reset when changing to desktop.
window.addEventListener(
    'resize',
    debounce(() => {
        if (!isMobileNavigation()) {
            closeMobileMenu();
        }
    }, 150)
);


// ============================================
// SMOOTH SCROLLING
// ============================================

function getNavHeight() {
    return nav
        ? nav.offsetHeight
        : 0;
}


function scrollToSection(
    section,
    updateHash = false
) {
    if (!section) return;

    const sectionTop =
        section.getBoundingClientRect().top +
        window.pageYOffset;

    const offset =
        getNavHeight() + 18;

    const destination =
        Math.max(
            sectionTop - offset,
            0
        );

    window.scrollTo({
        top: destination,
        behavior: reduceMotion
            ? 'auto'
            : 'smooth'
    });

    if (
        updateHash &&
        section.id
    ) {
        history.replaceState(
            null,
            '',
            `#${section.id}`
        );
    }
}


$$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener(
        'click',
        event => {
            const href =
                anchor.getAttribute('href');

            if (
                !href ||
                href === '#'
            ) {
                return;
            }

            const target =
                document.querySelector(href);

            if (!target) {
                return;
            }

            event.preventDefault();

            scrollToSection(
                target,
                true
            );
        }
    );
});


// Correct scroll position when page opens with a hash.
window.addEventListener(
    'load',
    () => {
        if (!window.location.hash) {
            return;
        }

        const section =
            $(window.location.hash);

        if (!section) {
            return;
        }

        setTimeout(() => {
            scrollToSection(
                section,
                false
            );
        }, 80);
    }
);


// ============================================
// NAVBAR SCROLLED STATE
// ============================================

function updateNavbarState() {
    if (!nav) return;

    nav.classList.toggle(
        'nav-scrolled',
        window.scrollY > 20
    );
}


updateNavbarState();


// ============================================
// ACTIVE NAVIGATION
// ============================================

const sections =
    $$('section[id]');


function updateActiveNavigation() {
    if (!sections.length) {
        return;
    }

    const scrollPosition =
        window.scrollY +
        getNavHeight() +
        160;

    let currentSection = '';

    sections.forEach(section => {
        if (
            scrollPosition >=
            section.offsetTop
        ) {
            currentSection =
                section.id;
        }
    });

    // Near bottom of the page.
    const nearBottom =
        window.innerHeight +
        window.scrollY >=
        document.documentElement.scrollHeight -
        80;

    if (
        nearBottom &&
        $('#contact')
    ) {
        currentSection =
            'contact';
    }

    navLinks.forEach(link => {
        const targetId =
            link
                .getAttribute('href')
                ?.replace('#', '');

        const isActive =
            targetId ===
            currentSection;

        link.classList.toggle(
            'active',
            isActive
        );

        if (isActive) {
            link.setAttribute(
                'aria-current',
                'page'
            );
        } else {
            link.removeAttribute(
                'aria-current'
            );
        }
    });
}


// ============================================
// OPTIMIZED SCROLL HANDLER
// ============================================

let scrollTicking = false;


function handleScroll() {
    if (scrollTicking) {
        return;
    }

    scrollTicking = true;

    window.requestAnimationFrame(() => {
        updateNavbarState();
        updateActiveNavigation();

        scrollTicking = false;
    });
}


window.addEventListener(
    'scroll',
    handleScroll,
    {
        passive: true
    }
);


updateActiveNavigation();


// ============================================
// SCROLL REVEAL
// ============================================

function setupScrollReveal() {
    const revealElements = [
        ...$$('.section-title'),
        ...$$('.about-card'),
        ...$$('.project-card'),
        ...$$('.skill-category'),
        ...$$('.contact-method')
    ];

    if (
        reduceMotion ||
        !('IntersectionObserver' in window)
    ) {
        revealElements.forEach(element => {
            element.classList.add(
                'reveal-visible'
            );
        });

        return;
    }

    revealElements.forEach(
        (element, index) => {
            element.classList.add(
                'reveal-item'
            );

            // Very small stagger.
            element.style.setProperty(
                '--reveal-delay',
                `${Math.min(
                    index % 4,
                    3
                ) * 60}ms`
            );
        }
    );

    const revealObserver =
        new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add(
                        'reveal-visible'
                    );

                    revealObserver.unobserve(
                        entry.target
                    );
                });
            },
            {
                threshold: 0.08,
                rootMargin:
                    '0px 0px -40px 0px'
            }
        );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}


setupScrollReveal();


// ============================================
// HERO STATS ANIMATION
// ============================================

function animateStatNumber(element) {
    if (!element) return;

    const originalText =
        element.textContent.trim();

    const match =
        originalText.match(
            /^([\d.]+)(.*)$/
        );

    if (!match) {
        return;
    }

    const target =
        Number(match[1]);

    const suffix =
        match[2] || '';

    if (
        !Number.isFinite(target) ||
        reduceMotion
    ) {
        return;
    }

    const duration = 900;

    let startTime = null;


    function frame(timestamp) {
        if (!startTime) {
            startTime = timestamp;
        }

        const progress =
            Math.min(
                (
                    timestamp -
                    startTime
                ) / duration,
                1
            );

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        const current =
            target *
            eased;

        let displayValue;

        if (
            String(target).includes('.')
        ) {
            displayValue =
                current.toFixed(1);
        } else {
            displayValue =
                Math.floor(current);
        }

        element.textContent =
            `${displayValue}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(
                frame
            );
        } else {
            element.textContent =
                originalText;
        }
    }


    requestAnimationFrame(frame);
}


function setupStatsAnimation() {
    const statsSection =
        $('.stats');

    if (!statsSection) {
        return;
    }

    if (
        reduceMotion ||
        !('IntersectionObserver' in window)
    ) {
        return;
    }

    const statObserver =
        new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    $$('.stat-item h3').forEach(
                        animateStatNumber
                    );

                    statObserver.disconnect();
                });
            },
            {
                threshold: 0.5
            }
        );

    statObserver.observe(
        statsSection
    );
}


setupStatsAnimation();


// ============================================
// LAZY LOADING
// ============================================

function setupLazyImages() {
    const lazyImages =
        $$('img.lazy[data-src]');

    if (!lazyImages.length) {
        return;
    }

    function loadImage(img) {
        const source =
            img.dataset.src;

        if (!source) {
            return;
        }

        img.src = source;

        if (img.dataset.srcset) {
            img.srcset =
                img.dataset.srcset;
        }

        img.removeAttribute(
            'data-src'
        );

        img.removeAttribute(
            'data-srcset'
        );

        img.classList.remove(
            'lazy'
        );

        img.classList.add(
            'lazy-loaded'
        );
    }


    if (
        !('IntersectionObserver' in window)
    ) {
        lazyImages.forEach(
            loadImage
        );

        return;
    }


    const imageObserver =
        new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    loadImage(
                        entry.target
                    );

                    imageObserver.unobserve(
                        entry.target
                    );
                });
            },
            {
                rootMargin:
                    '200px 0px'
            }
        );


    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}


setupLazyImages();


// ============================================
// CONTACT FORM
// ============================================

function setupContactForm() {
    const contactForm =
        $('form');

    if (!contactForm) {
        return;
    }

    contactForm.addEventListener(
        'submit',
        event => {
            event.preventDefault();

            const formData =
                new FormData(
                    contactForm
                );

            const data =
                Object.fromEntries(
                    formData.entries()
                );

            console.log(
                'Contact Form:',
                data
            );

            showNotification(
                "Thanks for reaching out! I'll get back to you soon."
            );

            trackEvent(
                'Contact',
                'form_submit',
                'Portfolio contact form'
            );

            contactForm.reset();
        }
    );
}


setupContactForm();


// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(
    message,
    type = 'success'
) {
    const oldNotification =
        $('.notification');

    if (oldNotification) {
        oldNotification.remove();
    }

    const notification =
        document.createElement('div');

    notification.className =
        `notification notification-${type}`;

    notification.setAttribute(
        'role',
        type === 'error'
            ? 'alert'
            : 'status'
    );

    const icon =
        type === 'error'
            ? 'fa-circle-exclamation'
            : 'fa-circle-check';

    notification.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span></span>
    `;

    const textElement =
        $('span', notification);

    if (textElement) {
        textElement.textContent =
            message;
    }

    document.body.appendChild(
        notification
    );

    requestAnimationFrame(() => {
        notification.classList.add(
            'notification-visible'
        );
    });

    const removeNotification = () => {
        notification.classList.remove(
            'notification-visible'
        );

        setTimeout(() => {
            notification.remove();
        }, 300);
    };

    const timeout =
        setTimeout(
            removeNotification,
            4000
        );

    notification.addEventListener(
        'click',
        () => {
            clearTimeout(timeout);

            removeNotification();
        }
    );
}


// ============================================
// COPY TO CLIPBOARD
// ============================================

async function copyToClipboard(text) {
    if (!text) {
        return false;
    }

    try {
        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {
            await navigator.clipboard.writeText(
                text
            );
        } else {
            const textarea =
                document.createElement(
                    'textarea'
                );

            textarea.value =
                text;

            textarea.style.position =
                'fixed';

            textarea.style.opacity =
                '0';

            textarea.style.pointerEvents =
                'none';

            document.body.appendChild(
                textarea
            );

            textarea.select();

            document.execCommand(
                'copy'
            );

            textarea.remove();
        }

        showNotification(
            'Copied to clipboard!'
        );

        return true;

    } catch (error) {

        console.error(
            'Clipboard error:',
            error
        );

        showNotification(
            'Failed to copy.',
            'error'
        );

        return false;
    }
}


// ============================================
// ANALYTICS TRACKING
// ============================================

function trackEvent(
    category,
    action,
    label = ''
) {
    if (
        typeof window.gtag !==
        'function'
    ) {
        return;
    }

    window.gtag(
        'event',
        action,
        {
            event_category:
                category,

            event_label:
                label
        }
    );
}


// Track external links.
$$(
    'a[target="_blank"]'
).forEach(link => {
    link.addEventListener(
        'click',
        () => {
            trackEvent(
                'External Links',
                'click',
                link.href
            );
        }
    );
});


// Track project links.
$$(
    '.project-links a'
).forEach(link => {
    link.addEventListener(
        'click',
        () => {
            const projectCard =
                link.closest(
                    '.project-card'
                );

            const projectTitle =
                projectCard
                    ?.querySelector(
                        '.project-title'
                    )
                    ?.textContent
                    ?.trim() ||
                'Unknown Project';

            trackEvent(
                'Portfolio Projects',
                'project_click',
                projectTitle
            );
        }
    );
});


// ============================================
// CONTACT LINKS TRACKING
// ============================================

$$(
    '.contact-method'
).forEach(link => {
    link.addEventListener(
        'click',
        () => {
            const name =
                link
                    .querySelector('h3')
                    ?.textContent
                    ?.trim() ||
                'Contact';

            trackEvent(
                'Contact',
                'contact_click',
                name
            );
        }
    );
});


// ============================================
// KEYBOARD SHORTCUTS
// ============================================

function isTypingElement(element) {
    if (!element) {
        return false;
    }

    const tag =
        element.tagName
            ?.toLowerCase();

    return (
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        element.isContentEditable
    );
}


document.addEventListener(
    'keydown',
    event => {
        if (
            isTypingElement(
                document.activeElement
            )
        ) {
            return;
        }

        if (!event.altKey) {
            return;
        }

        const key =
            event.key.toLowerCase();

        const sectionMap = {
            h: 'home',
            a: 'analytics',
            p: 'projects',
            e: 'experience',
            s: 'skills',
            c: 'contact'
        };

        if (sectionMap[key]) {
            event.preventDefault();

            const section =
                document.getElementById(
                    sectionMap[key]
                );

            scrollToSection(
                section,
                true
            );

            return;
        }

        if (key === 't') {
            event.preventDefault();

            toggleTheme();
        }
    }
);


// ============================================
// URL PARAMETERS
// ============================================

function getUrlParameter(name) {
    if (!name) {
        return '';
    }

    const params =
        new URLSearchParams(
            window.location.search
        );

    return (
        params.get(name) || ''
    );
}


// ============================================
// VIEWPORT HELPER
// ============================================

function isInViewport(element) {
    if (!element) {
        return false;
    }

    const rect =
        element.getBoundingClientRect();

    return (
        rect.top <
            window.innerHeight &&
        rect.bottom > 0 &&
        rect.left <
            window.innerWidth &&
        rect.right > 0
    );
}


// ============================================
// DEBOUNCE
// ============================================

function debounce(
    func,
    wait = 150
) {
    let timeout;

    return function debounced(
        ...args
    ) {
        clearTimeout(timeout);

        timeout =
            setTimeout(
                () => {
                    func.apply(
                        this,
                        args
                    );
                },
                wait
            );
    };
}


// ============================================
// DYNAMIC SUPPORT STYLES
// ============================================

const portfolioRuntimeStyles =
    document.createElement('style');

portfolioRuntimeStyles.id =
    'portfolio-runtime-styles';

portfolioRuntimeStyles.textContent = `

/* ============================================
   ACTIVE NAV LINK
   ============================================ */

.nav-links a.active {
    color: var(--accent);
}

.nav-links a.active::after {
    width: 45%;
}


/* ============================================
   SCROLLED NAV
   ============================================ */

nav.nav-scrolled {
    box-shadow:
        0 12px 35px rgba(0, 0, 0, 0.06);
}

body.dark nav.nav-scrolled {
    box-shadow:
        0 12px 35px rgba(0, 0, 0, 0.24);
}


/* ============================================
   REVEAL
   ============================================ */

.reveal-item {
    opacity: 0;

    transform:
        translateY(24px);

    transition:
        opacity 0.65s cubic-bezier(.22, 1, .36, 1),
        transform 0.65s cubic-bezier(.22, 1, .36, 1);

    transition-delay:
        var(--reveal-delay, 0ms);
}

.reveal-item.reveal-visible {
    opacity: 1;

    transform:
        translateY(0);
}


/* ============================================
   MOBILE MENU BUTTON
   ============================================ */

.mobile-menu-toggle {
    display: none;

    width: 43px;
    height: 43px;

    flex-shrink: 0;

    align-items: center;
    justify-content: center;

    flex-direction: column;

    gap: 5px;

    border:
        1px solid var(--border-color);

    border-radius: 50%;

    background: var(--card-bg);

    color: var(--text-primary);

    cursor: pointer;

    box-shadow: var(--shadow-sm);

    transition:
        transform 0.25s ease,
        border-color 0.25s ease,
        background-color 0.25s ease;
}

.mobile-menu-toggle:hover {
    transform:
        translateY(-2px);

    border-color:
        var(--border-strong);
}

.mobile-menu-toggle span {
    display: block;

    width: 17px;
    height: 1.5px;

    border-radius: 10px;

    background: var(--text-primary);

    transition:
        transform 0.25s ease,
        opacity 0.25s ease;
}

.mobile-menu-toggle.is-open span:nth-child(1) {
    transform:
        translateY(6.5px)
        rotate(45deg);
}

.mobile-menu-toggle.is-open span:nth-child(2) {
    opacity: 0;
}

.mobile-menu-toggle.is-open span:nth-child(3) {
    transform:
        translateY(-6.5px)
        rotate(-45deg);
}


/* ============================================
   NOTIFICATION
   ============================================ */

.notification {
    position: fixed;

    top: 92px;
    right: 22px;

    z-index: 99999;

    max-width:
        min(
            380px,
            calc(100vw - 32px)
        );

    display: flex;

    align-items: center;

    gap: 0.75rem;

    padding:
        0.9rem
        1.15rem;

    border-radius: 14px;

    border:
        1px solid var(--border-color);

    background: var(--card-bg);

    color: var(--text-primary);

    box-shadow:
        var(--shadow-lg);

    font-size: 0.85rem;

    opacity: 0;

    transform:
        translateX(
            calc(100% + 40px)
        );

    cursor: pointer;

    transition:
        opacity 0.3s ease,
        transform 0.3s cubic-bezier(.22, 1, .36, 1);
}

.notification-visible {
    opacity: 1;

    transform:
        translateX(0);
}

.notification-success i {
    color: #36a269;
}

.notification-error i {
    color: #d94a4a;
}


/* ============================================
   LAZY IMAGES
   ============================================ */

img.lazy {
    opacity: 0;

    transition:
        opacity 0.4s ease;
}

img.lazy-loaded {
    opacity: 1;
}


/* ============================================
   MOBILE NAVIGATION
   ============================================ */

@media (max-width: 980px) {

    .mobile-menu-toggle {
        display: inline-flex;
    }

    .nav-container {
        position: relative;
    }

    .nav-links {
        position: fixed;

        top: 78px;
        left: 16px;
        right: 16px;

        display: flex;

        flex-direction: column;

        align-items: stretch;

        justify-content: flex-start;

        gap: 0.3rem;

        max-height:
            calc(100vh - 100px);

        padding: 0.8rem;

        overflow-y: auto;

        border:
            1px solid var(--border-color);

        border-radius: 18px;

        background:
            var(--card-bg);

        box-shadow:
            var(--shadow-lg);

        opacity: 0;

        visibility: hidden;

        pointer-events: none;

        transform:
            translateY(-14px)
            scale(0.98);

        transform-origin:
            top center;

        transition:
            opacity 0.25s ease,
            visibility 0.25s ease,
            transform 0.25s cubic-bezier(.22, 1, .36, 1);
    }

    .nav-links.mobile-open {
        opacity: 1;

        visibility: visible;

        pointer-events: auto;

        transform:
            translateY(0)
            scale(1);
    }

    .nav-links a {
        width: 100%;

        padding:
            0.85rem
            1rem;

        font-size: 0.83rem;

        border-radius: 11px;
    }

    .nav-links a::after {
        display: none;
    }

    .nav-links a.active {
        background:
            var(--accent-extra-soft);

        color:
            var(--accent);
    }

    body.nav-open {
        overflow: hidden;
    }

}


/* ============================================
   MOBILE
   ============================================ */

@media (max-width: 700px) {

    .notification {
        top: 82px;

        left: 16px;
        right: 16px;

        max-width: none;
    }

}


@media (prefers-reduced-motion: reduce) {

    .reveal-item {
        opacity: 1;

        transform: none;

        transition: none;
    }

}

`;

document.head.appendChild(
    portfolioRuntimeStyles
);


// ============================================
// READY
// ============================================

document.addEventListener(
    'DOMContentLoaded',
    () => {
        updateNavbarState();
        updateActiveNavigation();

        console.log(
            'Yahia Shahin Portfolio loaded successfully.'
        );

        console.log(
            `Theme: ${
                body.classList.contains('dark')
                    ? 'dark'
                    : 'light'
            }`
        );
    }
);


// ============================================
// WINDOW LOAD
// ============================================

window.addEventListener(
    'load',
    () => {
        const loader =
            $('.loader');

        if (loader) {
            loader.classList.add(
                'loader-hidden'
            );

            setTimeout(() => {
                loader.remove();
            }, 400);
        }
    }
);


// ============================================
// OPTIONAL SERVICE WORKER
// ============================================

/*
IMPORTANT:

The previous script automatically tried to register /sw.js.
That creates a 404/error when sw.js does not exist.

When you actually create a Service Worker,
uncomment this block.

if (
    'serviceWorker' in navigator &&
    location.protocol === 'https:'
) {
    window.addEventListener('load', () => {

        navigator.serviceWorker
            .register('/sw.js')
            .then(registration => {
                console.log(
                    'Service Worker registered:',
                    registration.scope
                );
            })
            .catch(error => {
                console.error(
                    'Service Worker registration failed:',
                    error
                );
            });

    });
}
*/


// ============================================
// OPTIONAL TEST EXPORTS
// ============================================

if (
    typeof module !== 'undefined' &&
    module.exports
) {
    module.exports = {
        toggleTheme,
        applyTheme,
        showNotification,
        copyToClipboard,
        trackEvent,
        isInViewport,
        getUrlParameter,
        debounce,
        scrollToSection
    };
}


// ============================================
// END
// ============================================
