// ===== Navigation System =====
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
});

function initNavigation() {
    const currentPage = getCurrentPage();
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && 
           (href.includes(currentPage) || 
            (currentPage === 'index.html' && href === 'index.html') ||
            (currentPage === '' && href.includes('index.html')))) {
            link.classList.add('active');
        }
    });
}

function getCurrentPage() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s);
    return segments[segments.length - 1] || 'index.html';
}

function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !expanded);
            menu.classList.toggle('active');
        });
    }
}

// ===== Utility Functions =====
function navigateTo(page) {
    window.location.href = page.includes('.html') ? page : `${page}.html`;
}

function toggleClass(el, className) {
    el.classList.toggle(className);
}

// Expose for inline use
window.navigateTo = navigateTo;
window.toggleClass = toggleClass;
