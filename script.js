// ============================================
// YAHIA SHAHIN PORTFOLIO
// JavaScript
// Full-Stack • AI/ML • Data Analytics
// ============================================

'use strict';


// ============================================
// GLOBAL HELPERS
// ============================================

const $ = (selector, scope = document) =>
    scope.querySelector(selector);

const $$ = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

const body = document.body;

const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;


function debounce(func, wait = 150) {
    let timeout;

    return function debounced(...args) {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}


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


function isImageUrl(url = '') {
    return /\.(avif|webp|png|jpe?g|gif|svg)(\?.*)?$/i.test(url);
}


function getFileNameFromUrl(url = '') {
    try {
        const cleanUrl =
            url.split('?')[0];

        const filename =
            cleanUrl
                .split('/')
                .pop()
                ?.replace(/\.[^.]+$/, '')
                ?.replace(/[-_]+/g, ' ');

        if (!filename) {
            return 'Portfolio Image';
        }

        return filename.replace(
            /\b\w/g,
            letter => letter.toUpperCase()
        );
    } catch {
        return 'Portfolio Image';
    }
}


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
    try {
        const savedTheme =
            localStorage.getItem(
                THEME_STORAGE_KEY
            );

        if (
            savedTheme === 'dark' ||
            savedTheme === 'light'
        ) {
            return savedTheme;
        }
    } catch {
        // localStorage unavailable.
    }

    return 'light';
}


function updateThemeIcon(theme) {
    if (!themeIcon) {
        return;
    }

    themeIcon.textContent =
        theme === 'dark'
            ? '☀️'
            : '🌙';
}


function applyTheme(theme) {
    const safeTheme =
        theme === 'dark'
            ? 'dark'
            : 'light';

    body.classList.remove(
        'light',
        'dark'
    );

    body.classList.add(
        safeTheme
    );

    body.dataset.theme =
        safeTheme;

    updateThemeIcon(
        safeTheme
    );


    if (themeToggle) {
        const label =
            safeTheme === 'dark'
                ? 'Switch to light mode'
                : 'Switch to dark mode';

        themeToggle.setAttribute(
            'aria-label',
            label
        );

        themeToggle.setAttribute(
            'title',
            label
        );
    }


    const themeColor =
        $('meta[name="theme-color"]');

    if (themeColor) {
        themeColor.setAttribute(
            'content',
            safeTheme === 'dark'
                ? '#090909'
                : '#b8956a'
        );
    }
}


function toggleTheme() {
    const newTheme =
        body.classList.contains('dark')
            ? 'light'
            : 'dark';

    applyTheme(
        newTheme
    );

    try {
        localStorage.setItem(
            THEME_STORAGE_KEY,
            newTheme
        );
    } catch {
        // Ignore unavailable storage.
    }

    trackEvent(
        'Appearance',
        'theme_change',
        newTheme
    );
}


const currentTheme =
    getSavedTheme();

applyTheme(
    currentTheme
);


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
        document.createElement(
            'button'
        );

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


    const isOpen =
        navLinksContainer.classList.contains(
            'mobile-open'
        );


    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}


createMobileMenuButton();


navLinks.forEach(link => {
    link.addEventListener(
        'click',
        () => {
            if (
                isMobileNavigation()
            ) {
                closeMobileMenu();
            }
        }
    );
});


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


        if (
            !navContainer?.contains(
                event.target
            )
        ) {
            closeMobileMenu();
        }
    }
);


window.addEventListener(
    'resize',
    debounce(() => {
        if (
            !isMobileNavigation()
        ) {
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
    if (!section) {
        return;
    }


    const sectionTop =
        section.getBoundingClientRect().top +
        window.scrollY;


    const destination =
        Math.max(
            sectionTop -
            getNavHeight() -
            18,
            0
        );


    window.scrollTo({
        top: destination,

        behavior:
            reduceMotion
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
                anchor.getAttribute(
                    'href'
                );


            if (
                !href ||
                href === '#'
            ) {
                return;
            }


            const id =
                href.slice(1);

            const target =
                document.getElementById(
                    id
                );


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


window.addEventListener(
    'load',
    () => {
        if (
            !window.location.hash
        ) {
            return;
        }


        let id;

        try {
            id =
                decodeURIComponent(
                    window.location.hash.slice(1)
                );
        } catch {
            id =
                window.location.hash.slice(1);
        }


        const section =
            document.getElementById(
                id
            );


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
// NAVBAR STATE
// ============================================

function updateNavbarState() {
    if (!nav) {
        return;
    }


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


    let currentSection =
        sections[0]?.id || 'home';


    sections.forEach(section => {
        if (
            scrollPosition >=
            section.offsetTop
        ) {
            currentSection =
                section.id;
        }
    });


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
// OPTIMIZED SCROLL
// ============================================

let scrollTicking = false;


function handleScroll() {
    if (scrollTicking) {
        return;
    }


    scrollTicking = true;


    requestAnimationFrame(() => {
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
        revealElements.forEach(
            element => {
                element.classList.add(
                    'reveal-visible'
                );
            }
        );

        return;
    }


    revealElements.forEach(
        (element, index) => {
            element.classList.add(
                'reveal-item'
            );


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
                entries.forEach(
                    entry => {
                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        entry.target.classList.add(
                            'reveal-visible'
                        );


                        revealObserver.unobserve(
                            entry.target
                        );
                    }
                );
            },

            {
                threshold: 0.08,

                rootMargin:
                    '0px 0px -40px 0px'
            }
        );


    revealElements.forEach(
        element => {
            revealObserver.observe(
                element
            );
        }
    );
}


setupScrollReveal();


// ============================================
// HERO STATS
// ============================================

function animateStatNumber(element) {
    if (!element) {
        return;
    }


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


    const duration =
        900;

    let startTime =
        null;


    function frame(timestamp) {
        if (!startTime) {
            startTime =
                timestamp;
        }


        const progress =
            Math.min(
                (
                    timestamp -
                    startTime
                ) /
                duration,

                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const current =
            target * eased;


        const displayValue =
            String(target).includes('.')
                ? current.toFixed(1)
                : Math.floor(current);


        element.textContent =
            `${displayValue}${suffix}`;


        if (
            progress < 1
        ) {
            requestAnimationFrame(
                frame
            );
        } else {
            element.textContent =
                originalText;
        }
    }


    requestAnimationFrame(
        frame
    );
}


function setupStatsAnimation() {
    const statsSection =
        $('.stats');


    if (
        !statsSection ||
        reduceMotion ||
        !('IntersectionObserver' in window)
    ) {
        return;
    }


    const statObserver =
        new IntersectionObserver(
            entries => {
                entries.forEach(
                    entry => {
                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        $$(
                            '.stat-item h3',
                            statsSection
                        ).forEach(
                            animateStatNumber
                        );


                        statObserver.disconnect();
                    }
                );
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
// IMAGE LOADING STATES
// ============================================

function setupImageLoadingStates() {
    $$(
        '.project-image img, .analytics-gallery img'
    ).forEach(img => {

        const completeImage = () => {
            img.classList.add(
                'image-loaded'
            );
        };


        if (
            img.complete &&
            img.naturalWidth > 0
        ) {
            completeImage();
        } else {
            img.addEventListener(
                'load',
                completeImage,
                {
                    once: true
                }
            );
        }


        img.addEventListener(
            'error',
            () => {
                img.classList.add(
                    'image-error'
                );

                const parent =
                    img.closest(
                        '.project-image'
                    );


                if (parent) {
                    parent.classList.add(
                        'has-image-error'
                    );
                }
            },

            {
                once: true
            }
        );
    });
}


setupImageLoadingStates();


// ============================================
// LEGACY LAZY LOADING SUPPORT
// ============================================

function setupLazyImages() {
    const lazyImages =
        $$(
            'img.lazy[data-src]'
        );


    if (!lazyImages.length) {
        return;
    }


    function loadImage(img) {
        const source =
            img.dataset.src;


        if (!source) {
            return;
        }


        img.src =
            source;


        if (
            img.dataset.srcset
        ) {
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
                entries.forEach(
                    entry => {
                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        loadImage(
                            entry.target
                        );


                        imageObserver.unobserve(
                            entry.target
                        );
                    }
                );
            },

            {
                rootMargin:
                    '200px 0px'
            }
        );


    lazyImages.forEach(
        img => {
            imageObserver.observe(
                img
            );
        }
    );
}


setupLazyImages();


// ============================================
// LIGHTBOX
// ============================================

let lightbox = null;
let lightboxImage = null;
let lightboxTitle = null;
let lightboxCounter = null;
let lightboxPreviousButton = null;
let lightboxNextButton = null;

let lightboxItems = [];
let lightboxIndex = 0;

let lightboxTrigger = null;

let lightboxTouchStartX = 0;
let lightboxTouchEndX = 0;


function createLightbox() {
    if ($('#portfolioLightbox')) {
        return;
    }


    lightbox =
        document.createElement(
            'div'
        );


    lightbox.id =
        'portfolioLightbox';

    lightbox.className =
        'portfolio-lightbox';


    lightbox.setAttribute(
        'role',
        'dialog'
    );

    lightbox.setAttribute(
        'aria-modal',
        'true'
    );

    lightbox.setAttribute(
        'aria-hidden',
        'true'
    );

    lightbox.setAttribute(
        'aria-label',
        'Portfolio image viewer'
    );


    lightbox.innerHTML = `
        <div class="lightbox-backdrop"></div>

        <div class="lightbox-dialog">

            <div class="lightbox-toolbar">

                <div class="lightbox-info">
                    <span class="lightbox-title"></span>
                    <span class="lightbox-counter"></span>
                </div>

                <button
                    type="button"
                    class="lightbox-close"
                    aria-label="Close image viewer"
                    title="Close"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>

            </div>

            <div class="lightbox-stage">

                <button
                    type="button"
                    class="lightbox-navigation lightbox-previous"
                    aria-label="Previous image"
                    title="Previous image"
                >
                    <i class="fa-solid fa-chevron-left"></i>
                </button>

                <div class="lightbox-image-shell">
                    <img
                        class="lightbox-image"
                        alt=""
                    >
                </div>

                <button
                    type="button"
                    class="lightbox-navigation lightbox-next"
                    aria-label="Next image"
                    title="Next image"
                >
                    <i class="fa-solid fa-chevron-right"></i>
                </button>

            </div>

        </div>
    `;


    document.body.appendChild(
        lightbox
    );


    lightboxImage =
        $('.lightbox-image', lightbox);

    lightboxTitle =
        $('.lightbox-title', lightbox);

    lightboxCounter =
        $('.lightbox-counter', lightbox);

    lightboxPreviousButton =
        $('.lightbox-previous', lightbox);

    lightboxNextButton =
        $('.lightbox-next', lightbox);


    const closeButton =
        $('.lightbox-close', lightbox);

    const backdrop =
        $('.lightbox-backdrop', lightbox);


    closeButton?.addEventListener(
        'click',
        closeLightbox
    );


    backdrop?.addEventListener(
        'click',
        closeLightbox
    );


    lightboxPreviousButton?.addEventListener(
        'click',
        showPreviousLightboxImage
    );


    lightboxNextButton?.addEventListener(
        'click',
        showNextLightboxImage
    );


    const stage =
        $('.lightbox-stage', lightbox);


    stage?.addEventListener(
        'touchstart',
        event => {
            lightboxTouchStartX =
                event.changedTouches[0]
                    ?.screenX || 0;
        },

        {
            passive: true
        }
    );


    stage?.addEventListener(
        'touchend',
        event => {
            lightboxTouchEndX =
                event.changedTouches[0]
                    ?.screenX || 0;

            handleLightboxSwipe();
        },

        {
            passive: true
        }
    );
}


function getLightboxItem(anchor) {
    const img =
        $('img', anchor);


    return {
        src:
            anchor.href,

        alt:
            img?.alt ||
            'Yahia Shahin portfolio image',

        title:
            anchor.getAttribute(
                'title'
            ) ||
            img?.alt ||
            getFileNameFromUrl(
                anchor.href
            )
    };
}


function getAnalyticsGalleryItems(trigger) {
    const card =
        trigger.closest(
            '.project-card'
        );


    if (!card) {
        return [];
    }


    const galleryAnchors =
        $$(
            '.analytics-gallery a',
            card
        ).filter(
            anchor =>
                isImageUrl(
                    anchor.href
                )
        );


    if (
        galleryAnchors.length
    ) {
        return galleryAnchors.map(
            getLightboxItem
        );
    }


    const mainImage =
        $('a.project-image', card);


    if (
        mainImage &&
        isImageUrl(
            mainImage.href
        )
    ) {
        return [
            getLightboxItem(
                mainImage
            )
        ];
    }


    return [];
}


function getCredentialItems(trigger) {
    if (
        isImageUrl(
            trigger.href
        )
    ) {
        return [
            getLightboxItem(
                trigger
            )
        ];
    }


    return [];
}


function setLightboxImage(index) {
    if (
        !lightboxItems.length ||
        !lightboxImage
    ) {
        return;
    }


    lightboxIndex =
        (
            index +
            lightboxItems.length
        ) %
        lightboxItems.length;


    const item =
        lightboxItems[
            lightboxIndex
        ];


    lightboxImage.classList.remove(
        'is-ready'
    );


    lightboxImage.src =
        item.src;

    lightboxImage.alt =
        item.alt;


    lightboxTitle.textContent =
        item.title;


    lightboxCounter.textContent =
        lightboxItems.length > 1
            ? `${lightboxIndex + 1} / ${lightboxItems.length}`
            : '';


    const hasMultiple =
        lightboxItems.length > 1;


    lightboxPreviousButton?.classList.toggle(
        'is-hidden',
        !hasMultiple
    );

    lightboxNextButton?.classList.toggle(
        'is-hidden',
        !hasMultiple
    );


    lightboxImage.onload =
        () => {
            lightboxImage.classList.add(
                'is-ready'
            );
        };


    if (
        lightboxImage.complete
    ) {
        lightboxImage.classList.add(
            'is-ready'
        );
    }


    trackEvent(
        'Portfolio Gallery',
        'image_view',
        item.title
    );
}


function openLightbox(
    items,
    initialIndex = 0,
    trigger = null
) {
    if (!items.length) {
        return;
    }


    if (!lightbox) {
        createLightbox();
    }


    lightboxItems =
        items;

    lightboxTrigger =
        trigger;


    setLightboxImage(
        initialIndex
    );


    lightbox.classList.add(
        'is-open'
    );


    lightbox.setAttribute(
        'aria-hidden',
        'false'
    );


    body.classList.add(
        'lightbox-open'
    );


    closeMobileMenu();


    setTimeout(() => {
        $('.lightbox-close', lightbox)
            ?.focus();
    }, 50);
}


function closeLightbox() {
    if (
        !lightbox ||
        !lightbox.classList.contains(
            'is-open'
        )
    ) {
        return;
    }


    lightbox.classList.remove(
        'is-open'
    );


    lightbox.setAttribute(
        'aria-hidden',
        'true'
    );


    body.classList.remove(
        'lightbox-open'
    );


    const previousTrigger =
        lightboxTrigger;


    setTimeout(() => {
        if (
            lightboxImage
        ) {
            lightboxImage.src =
                '';
        }

        lightboxItems =
            [];

        lightboxIndex =
            0;

        previousTrigger?.focus?.();

    }, 250);
}


function showPreviousLightboxImage() {
    if (
        lightboxItems.length <= 1
    ) {
        return;
    }


    setLightboxImage(
        lightboxIndex - 1
    );
}


function showNextLightboxImage() {
    if (
        lightboxItems.length <= 1
    ) {
        return;
    }


    setLightboxImage(
        lightboxIndex + 1
    );
}


function handleLightboxSwipe() {
    const distance =
        lightboxTouchEndX -
        lightboxTouchStartX;


    if (
        Math.abs(distance) < 45
    ) {
        return;
    }


    if (distance < 0) {
        showNextLightboxImage();
    } else {
        showPreviousLightboxImage();
    }
}


function setupLightboxTriggers() {
    /*
     * Main Power BI images
     */
    $$(
        '.analytics-projects a.project-image'
    ).forEach(anchor => {

        if (
            !isImageUrl(
                anchor.href
            )
        ) {
            return;
        }


        anchor.addEventListener(
            'click',
            event => {
                event.preventDefault();


                const items =
                    getAnalyticsGalleryItems(
                        anchor
                    );


                const index =
                    items.findIndex(
                        item =>
                            item.src ===
                            anchor.href
                    );


                openLightbox(
                    items,
                    index >= 0
                        ? index
                        : 0,
                    anchor
                );
            }
        );
    });


    /*
     * Power BI gallery thumbnails
     */
    $$(
        '.analytics-gallery a'
    ).forEach(anchor => {

        if (
            !isImageUrl(
                anchor.href
            )
        ) {
            return;
        }


        anchor.addEventListener(
            'click',
            event => {
                event.preventDefault();


                const items =
                    getAnalyticsGalleryItems(
                        anchor
                    );


                const index =
                    items.findIndex(
                        item =>
                            item.src ===
                            anchor.href
                    );


                openLightbox(
                    items,
                    index >= 0
                        ? index
                        : 0,
                    anchor
                );
            }
        );
    });


    /*
     * Certificate image previews
     */
    $$(
        '#credentials a.project-image'
    ).forEach(anchor => {

        /*
         * Bachelor and ITI main image links
         * currently point to PDF.
         *
         * We want the visible image in the card
         * to open in the Lightbox instead.
         */

        const img =
            $('img', anchor);


        if (!img?.src) {
            return;
        }


        anchor.addEventListener(
            'click',
            event => {

                /*
                 * Clicking the image opens the image viewer.
                 * The PDF remains available from
                 * "View Degree" / "View Certificate".
                 */

                event.preventDefault();


                const item = {
                    src:
                        img.src,

                    alt:
                        img.alt,

                    title:
                        img.alt ||
                        'Certificate'
                };


                openLightbox(
                    [item],
                    0,
                    anchor
                );
            }
        );
    });


    /*
     * Standalone certificate image buttons
     */
    $$(
        '#credentials .project-links a'
    ).forEach(anchor => {

        if (
            !isImageUrl(
                anchor.href
            )
        ) {
            return;
        }


        anchor.addEventListener(
            'click',
            event => {
                event.preventDefault();


                openLightbox(
                    [
                        getLightboxItem(
                            anchor
                        )
                    ],
                    0,
                    anchor
                );
            }
        );
    });
}


createLightbox();
setupLightboxTriggers();


// ============================================
// CONTACT FORM
// ============================================

function setupContactForm() {
    const contactForm =
        $('#contact form');


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
        document.createElement(
            'div'
        );


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


    const removeNotification =
        () => {
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
            clearTimeout(
                timeout
            );

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


// External links

$$(
    'a[target="_blank"]'
).forEach(link => {
    link.addEventListener(
        'click',
        () => {

            /*
             * Do not count Lightbox image links
             * as an external link.
             */

            if (
                link.href.startsWith(
                    window.location.origin
                )
            ) {
                return;
            }


            trackEvent(
                'External Links',
                'click',
                link.href
            );
        }
    );
});


// Project actions

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


// Contact actions

$$(
    '.contact-method'
).forEach(link => {
    link.addEventListener(
        'click',
        () => {

            const name =
                link
                    .querySelector(
                        'h3'
                    )
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


// CV actions

$$(
    'a[href*="yahia-shahin-cv.pdf"]'
).forEach(link => {
    link.addEventListener(
        'click',
        () => {

            trackEvent(
                'CV',
                link.hasAttribute(
                    'download'
                )
                    ? 'download'
                    : 'view',

                'Yahia Shahin CV'
            );
        }
    );
});


// ============================================
// KEYBOARD CONTROLS
// ============================================

document.addEventListener(
    'keydown',
    event => {

        /*
         * Lightbox has highest priority.
         */

        if (
            lightbox?.classList.contains(
                'is-open'
            )
        ) {

            if (
                event.key ===
                'Escape'
            ) {
                event.preventDefault();

                closeLightbox();

                return;
            }


            if (
                event.key ===
                'ArrowLeft'
            ) {
                event.preventDefault();

                showPreviousLightboxImage();

                return;
            }


            if (
                event.key ===
                'ArrowRight'
            ) {
                event.preventDefault();

                showNextLightboxImage();

                return;
            }
        }


        /*
         * Mobile menu
         */

        if (
            event.key ===
                'Escape' &&
            navLinksContainer
                ?.classList.contains(
                    'mobile-open'
                )
        ) {
            closeMobileMenu();

            mobileMenuButton
                ?.focus();

            return;
        }


        /*
         * Don't trigger shortcuts while typing.
         */

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
            event.key
                .toLowerCase();


        const sectionMap = {
            h: 'home',
            a: 'analytics',
            p: 'projects',
            e: 'experience',
            s: 'skills',
            c: 'contact'
        };


        if (
            sectionMap[key]
        ) {
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


        if (
            key === 't'
        ) {
            event.preventDefault();

            toggleTheme();
        }
    }
);


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
        params.get(name) ||
        ''
    );
}


// ============================================
// RUNTIME SUPPORT STYLES
// ============================================

const portfolioRuntimeStyles =
    document.createElement(
        'style'
    );


portfolioRuntimeStyles.id =
    'portfolio-runtime-styles';


portfolioRuntimeStyles.textContent = `

/* ============================================
   ACTIVE NAV
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
   IMAGE LOADING
   ============================================ */

.project-image img,
.analytics-gallery img {
    opacity: 0;

    transition:
        opacity 0.35s ease,
        transform 0.5s cubic-bezier(.22, 1, .36, 1);
}

.project-image img.image-loaded,
.analytics-gallery img.image-loaded {
    opacity: 1;
}

.project-image.has-image-error {
    min-height: 180px;

    background:
        var(--accent-extra-soft);
}

.project-image.has-image-error::before {
    content: 'Image unavailable';

    position: absolute;

    inset: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    color:
        var(--text-secondary);

    font-size:
        0.8rem;
}


/* ============================================
   MOBILE MENU
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

    background:
        var(--card-bg);

    color:
        var(--text-primary);

    cursor: pointer;

    box-shadow:
        var(--shadow-sm);

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

    background:
        var(--text-primary);

    transition:
        transform 0.25s ease,
        opacity 0.25s ease;
}

.mobile-menu-toggle.is-open
span:nth-child(1) {
    transform:
        translateY(6.5px)
        rotate(45deg);
}

.mobile-menu-toggle.is-open
span:nth-child(2) {
    opacity: 0;
}

.mobile-menu-toggle.is-open
span:nth-child(3) {
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
        1px solid
        var(--border-color);

    background:
        var(--card-bg);

    color:
        var(--text-primary);

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
   LIGHTBOX
   ============================================ */

body.lightbox-open {
    overflow: hidden;
}

.portfolio-lightbox {
    position: fixed;

    inset: 0;

    z-index: 999999;

    display: flex;

    align-items: center;
    justify-content: center;

    padding:
        18px;

    opacity: 0;

    visibility: hidden;

    pointer-events: none;

    transition:
        opacity 0.25s ease,
        visibility 0.25s ease;
}

.portfolio-lightbox.is-open {
    opacity: 1;

    visibility: visible;

    pointer-events: auto;
}

.lightbox-backdrop {
    position: absolute;

    inset: 0;

    background:
        rgba(3, 3, 3, 0.92);

    backdrop-filter:
        blur(12px);

    -webkit-backdrop-filter:
        blur(12px);
}

.lightbox-dialog {
    position: relative;

    z-index: 2;

    width:
        min(1400px, 100%);

    height:
        min(900px, calc(100vh - 36px));

    display: flex;

    flex-direction: column;

    overflow: hidden;

    border:
        1px solid
        rgba(255, 255, 255, 0.13);

    border-radius: 22px;

    background:
        rgba(18, 18, 18, 0.96);

    box-shadow:
        0 35px 100px
        rgba(0, 0, 0, 0.55);

    transform:
        scale(0.975)
        translateY(8px);

    transition:
        transform 0.28s
        cubic-bezier(.22, 1, .36, 1);
}

.portfolio-lightbox.is-open
.lightbox-dialog {
    transform:
        scale(1)
        translateY(0);
}

.lightbox-toolbar {
    min-height: 64px;

    display: flex;

    align-items: center;
    justify-content: space-between;

    gap: 1rem;

    padding:
        0.8rem
        1rem
        0.8rem
        1.3rem;

    border-bottom:
        1px solid
        rgba(255, 255, 255, 0.1);
}

.lightbox-info {
    min-width: 0;

    display: flex;

    align-items: center;

    gap: 0.8rem;

    color: #ffffff;
}

.lightbox-title {
    overflow: hidden;

    max-width: 900px;

    text-overflow: ellipsis;

    white-space: nowrap;

    font-size: 0.82rem;

    font-weight: 600;
}

.lightbox-counter {
    flex-shrink: 0;

    color:
        rgba(255, 255, 255, 0.55);

    font-family:
        'Space Mono',
        monospace;

    font-size: 0.7rem;
}

.lightbox-close {
    width: 42px;
    height: 42px;

    flex-shrink: 0;

    display: inline-flex;

    align-items: center;
    justify-content: center;

    border:
        1px solid
        rgba(255, 255, 255, 0.15);

    border-radius: 50%;

    background:
        rgba(255, 255, 255, 0.07);

    color: #ffffff;

    cursor: pointer;

    transition:
        background-color 0.25s ease,
        transform 0.25s ease;
}

.lightbox-close:hover {
    transform:
        rotate(5deg)
        scale(1.05);

    background:
        rgba(255, 255, 255, 0.15);
}

.lightbox-stage {
    position: relative;

    flex: 1;

    min-height: 0;

    display: grid;

    grid-template-columns:
        64px
        minmax(0, 1fr)
        64px;

    align-items: center;

    gap: 0.75rem;

    padding: 1rem;
}

.lightbox-image-shell {
    position: relative;

    min-width: 0;
    min-height: 0;

    width: 100%;
    height: 100%;

    display: flex;

    align-items: center;
    justify-content: center;

    overflow: hidden;
}

.lightbox-image {
    max-width: 100%;
    max-height: 100%;

    width: auto;
    height: auto;

    object-fit: contain;

    border-radius: 10px;

    opacity: 0;

    transform:
        scale(0.985);

    transition:
        opacity 0.25s ease,
        transform 0.35s
        cubic-bezier(.22, 1, .36, 1);

    box-shadow:
        0 20px 60px
        rgba(0, 0, 0, 0.35);
}

.lightbox-image.is-ready {
    opacity: 1;

    transform:
        scale(1);
}

.lightbox-navigation {
    width: 48px;
    height: 48px;

    margin: auto;

    display: inline-flex;

    align-items: center;
    justify-content: center;

    border:
        1px solid
        rgba(255, 255, 255, 0.15);

    border-radius: 50%;

    background:
        rgba(255, 255, 255, 0.07);

    color: #ffffff;

    cursor: pointer;

    transition:
        background-color 0.25s ease,
        transform 0.25s ease;
}

.lightbox-navigation:hover {
    transform:
        scale(1.08);

    background:
        var(--accent);

    border-color:
        var(--accent);
}

.lightbox-navigation.is-hidden {
    opacity: 0;

    visibility: hidden;

    pointer-events: none;
}


/* ============================================
   LAZY IMAGES
   ============================================ */

img.lazy {
    opacity: 0;
}

img.lazy-loaded {
    opacity: 1;
}


/* ============================================
   MOBILE NAVIGATION
   ============================================ */

@media (max-width: 980px) {

    .mobile-menu-toggle {
        display:
            inline-flex;
    }

    .nav-container {
        position:
            relative;
    }

    .nav-links {
        position: fixed;

        top: 78px;
        left: 16px;
        right: 16px;

        display: flex;

        flex-direction:
            column;

        align-items:
            stretch;

        justify-content:
            flex-start;

        gap: 0.3rem;

        max-height:
            calc(100vh - 100px);

        padding:
            0.8rem;

        overflow-y:
            auto;

        border:
            1px solid
            var(--border-color);

        border-radius:
            18px;

        background:
            var(--card-bg);

        box-shadow:
            var(--shadow-lg);

        opacity: 0;

        visibility:
            hidden;

        pointer-events:
            none;

        transform:
            translateY(-14px)
            scale(0.98);

        transform-origin:
            top center;

        transition:
            opacity 0.25s ease,
            visibility 0.25s ease,
            transform 0.25s
            cubic-bezier(.22, 1, .36, 1);
    }

    .nav-links.mobile-open {
        opacity: 1;

        visibility:
            visible;

        pointer-events:
            auto;

        transform:
            translateY(0)
            scale(1);
    }

    .nav-links a {
        width: 100%;

        padding:
            0.85rem
            1rem;

        font-size:
            0.83rem;

        border-radius:
            11px;
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
   MOBILE LIGHTBOX
   ============================================ */

@media (max-width: 700px) {

    .notification {
        top: 82px;

        left: 16px;
        right: 16px;

        max-width: none;
    }

    .portfolio-lightbox {
        padding: 0;
    }

    .lightbox-dialog {
        width: 100%;
        height: 100%;

        max-height: none;

        border: none;

        border-radius: 0;
    }

    .lightbox-toolbar {
        min-height: 62px;

        padding:
            0.7rem
            0.8rem
            0.7rem
            1rem;
    }

    .lightbox-title {
        max-width:
            calc(100vw - 140px);

        font-size:
            0.72rem;
    }

    .lightbox-stage {
        grid-template-columns:
            42px
            minmax(0, 1fr)
            42px;

        gap: 0.25rem;

        padding:
            0.5rem;
    }

    .lightbox-navigation {
        width: 38px;
        height: 38px;

        font-size: 0.8rem;
    }

    .lightbox-image {
        border-radius: 6px;
    }

}


@media (max-width: 480px) {

    .lightbox-stage {
        grid-template-columns:
            1fr;

        padding:
            0.5rem;
    }

    .lightbox-previous,
    .lightbox-next {
        position: absolute;

        top: 50%;

        z-index: 10;

        transform:
            translateY(-50%);
    }

    .lightbox-previous {
        left: 8px;
    }

    .lightbox-next {
        right: 8px;
    }

    .lightbox-navigation:hover {
        transform:
            translateY(-50%)
            scale(1.05);
    }

}


/* ============================================
   REDUCED MOTION
   ============================================ */

@media (prefers-reduced-motion: reduce) {

    .reveal-item {
        opacity: 1;

        transform: none;

        transition: none;
    }

    .portfolio-lightbox,
    .lightbox-dialog,
    .lightbox-image {
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
if (
    'serviceWorker' in navigator &&
    location.protocol === 'https:'
) {

    window.addEventListener(
        'load',
        () => {

            navigator.serviceWorker
                .register('/sw.js')
                .catch(error => {

                    console.error(
                        'Service Worker registration failed:',
                        error
                    );

                });

        }
    );

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
        scrollToSection,
        openLightbox,
        closeLightbox
    };
}


// ============================================
// END
// ============================================
