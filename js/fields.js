// ===== Fields of Application Toggle =====
document.addEventListener('DOMContentLoaded', () => {
    initFieldsToggle();
});

function initFieldsToggle() {
    document.querySelectorAll('.field-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const explanation = item.querySelector('.field-explanation');
            const icon = header.querySelector('.field-toggle');
            
            explanation?.classList.toggle('show');
            icon?.classList.toggle('open');
        });
    });
}

function closeAllFields(selector = '.fields-container') {
    const container = document.querySelector(selector);
    if (!container) return;
    
    container.querySelectorAll('.field-explanation.show').forEach(el => 
        el.classList.remove('show'));
    container.querySelectorAll('.field-toggle.open').forEach(el => 
        el.classList.remove('open'));
}

// Expose globally
window.toggleField = function(id) {
    const item = document.getElementById(id);
    if (!item) return;
    const explanation = item.querySelector('.field-explanation');
    const icon = item.querySelector('.field-toggle');
    explanation?.classList.toggle('show');
    icon?.classList.toggle('open');
};

window.closeAllFields = closeAllFields;