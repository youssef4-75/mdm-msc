// Navigation & Routing System
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initBreadcrumbs();
    initMobileMenu();
});

function initNavigation() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.includes(currentPage) || 
            (currentPage === 'index.html' && href.includes('index.html')) ||
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

function initBreadcrumbs() {
    const breadcrumbEl = document.querySelector('.breadcrumb ol');
    if (!breadcrumbEl) return;
    
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s);
    
    let html = '<li><a href="../index.html">Home</a></li>';
    
    if (segments.includes('challenges')) {
        html += '<li><a href="../challenges.html">Challenges</a></li>';
        
        const categoryIndex = segments.indexOf('challenges') + 1;
        if (segments[categoryIndex] && segments[categoryIndex] !== 'interactive') {
            const category = segments[categoryIndex].replace('-', ' ');
            html += `<li><span>${capitalize(category)}</span></li>`;
        }
        
        const challengeFile = segments[segments.length - 1];
        if (challengeFile && challengeFile !== 'challenges.html') {
            const challengeName = challengeFile.replace('.html', '').replace(/-/g, ' ');
            html += `<li><span>${capitalize(challengeName)}</span></li>`;
        }
    }
    
    breadcrumbEl.innerHTML = html;
}

function capitalize(str) {
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.setAttribute('aria-expanded', 
                menu.classList.contains('active'));
        });
    }
}

// Navigate helper (for inline onclick compatibility)
function navigateTo(page) {
    window.location.href = page.includes('.html') ? page : `${page}.html`;
}