// Fields of Application Toggle System
document.addEventListener('DOMContentLoaded', () => {
    initFieldsToggle();
});

function initFieldsToggle() {
    const fieldHeaders = document.querySelectorAll('.field-header');
    
    fieldHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const fieldItem = header.parentElement;
            const explanation = fieldItem.querySelector('.field-explanation');
            const toggleIcon = header.querySelector('.field-toggle');
            
            // Toggle current
            explanation.classList.toggle('show');
            toggleIcon.classList.toggle('open');
        });
    });
}

function closeAllFields(containerSelector = '.fields-container') {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    container.querySelectorAll('.field-explanation.show').forEach(el => {
        el.classList.remove('show');
    });
    container.querySelectorAll('.field-toggle.open').forEach(el => {
        el.classList.remove('open');
    });
}

// Expose for inline onclick
window.toggleField = function(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const explanation = field.querySelector('.field-explanation');
    const toggleIcon = field.querySelector('.field-toggle');
    
    explanation.classList.toggle('show');
    toggleIcon.classList.toggle('open');
}

window.closeAllFields = function(containerSelector) {
    closeAllFields(containerSelector);
}