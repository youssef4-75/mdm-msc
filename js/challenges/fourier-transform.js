// ========================================
// FOURIER TRANSFORM - CANVAS ANIMATION
// File: ../../js/challenges/fourier-transform.js
// Single-stage: add circles, run animation
// ========================================

// State
const state = {
    circles: [],           // Array of {radius, speed}
    animationId: null,
    isRunning: false,
    time: 0,
    path: []               // Traced path points
};

let elements = {};
let canvas, ctx;

// Cache DOM Elements
function cacheElements() {
    elements = {
        radiusInput: document.getElementById('circle-radius'),
        speedInput: document.getElementById('circle-speed'),
        jsonInput: document.getElementById('json-input'),
        circleCount: document.getElementById('circle-count'),
        circleList: document.getElementById('circle-list'),
        runBtn: document.getElementById('run-btn'),
        stopBtn: document.getElementById('stop-btn'),
        resetBtn: document.getElementById('reset-btn'),
        timeDisplay: document.getElementById('time-display'),
        activeCircles: document.getElementById('active-circles'),
        feedback: document.getElementById('feedback-fourier')
    };
    
    canvas = document.getElementById('fourier-canvas');
    ctx = canvas?.getContext('2d');
}

// Initialize
function init() {
    cacheElements();
    resetCanvas();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    // Enter key on inputs adds circle
    if (elements.radiusInput) {
        elements.radiusInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addCircleManual();
        });
    }
    if (elements.speedInput) {
        elements.speedInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addCircleManual();
        });
    }
}

// Add Circle Manually
function addCircleManual() {
    const radius = parseFloat(elements.radiusInput?.value) || 50;
    const speed = parseFloat(elements.speedInput?.value) || 1;
    
    state.circles.push({ radius, speed });
    renderCircleList();
    updateCircleCount();
    showFeedback(`Added circle: radius=${radius}, speed=${speed}`, 'success');
}

// Load JSON
function loadJSON() {
    try {
        const json = elements.jsonInput?.value.trim();
        if (!json) {
            showFeedback('Please enter JSON data', 'error');
            return;
        }
        
        const data = JSON.parse(json);
        if (!Array.isArray(data)) {
            showFeedback('JSON must be an array', 'error');
            return;
        }
        
        // Validate each circle
        const validCircles = data.filter(c => 
            c.radius && typeof c.radius === 'number' && 
            c.speed && typeof c.speed === 'number'
        );
        
        if (validCircles.length === 0) {
            showFeedback('No valid circles found in JSON', 'error');
            return;
        }
        
        state.circles = validCircles;
        renderCircleList();
        updateCircleCount();
        showFeedback(`Loaded ${validCircles.length} circles from JSON`, 'success');
        
    } catch (e) {
        showFeedback('Invalid JSON format: ' + e.message, 'error');
    }
}

// Clear All Circles
function clearCircles() {
    state.circles = [];
    renderCircleList();
    updateCircleCount();
    showFeedback('All circles cleared', 'success');
}

// Remove Single Circle (exposed for onclick)
function removeCircle(index) {
    state.circles.splice(index, 1);
    renderCircleList();
    updateCircleCount();
}

// Render Circle List
function renderCircleList() {
    if (!elements.circleList) return;
    
    elements.circleList.innerHTML = '';
    
    state.circles.forEach((circle, index) => {
        const chip = document.createElement('div');
        chip.className = 'circle-chip';
        chip.innerHTML = `
            <span>R:${circle.radius} S:${circle.speed}</span>
            <button class="remove-btn" onclick="removeCircle(${index})" type="button">×</button>
        `;
        elements.circleList.appendChild(chip);
    });
}

// Update Circle Count
function updateCircleCount() {
    if (elements.circleCount) {
        elements.circleCount.textContent = state.circles.length;
    }
    if (elements.activeCircles) {
        elements.activeCircles.textContent = state.circles.length;
    }
}

// Run Animation
function runAnimation() {
    if (state.circles.length === 0) {
        showFeedback('Add at least one circle first!', 'error');
        return;
    }
    
    if (state.isRunning) return;
    
    state.isRunning = true;
    state.time = 0;
    state.path = [];
    
    if (elements.runBtn) elements.runBtn.style.display = 'none';
    if (elements.stopBtn) elements.stopBtn.style.display = 'inline-block';
    
    animate();
}

// Animation Loop
function animate() {
    if (!state.isRunning || !ctx || !canvas) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    let x = centerX;
    let y = centerY;
    
    // Draw each circle
    for (let i = 0; i < state.circles.length; i++) {
        const circle = state.circles[i];
        const prevX = x;
        const prevY = y;
        
        // Calculate new position
        const angle = circle.speed * state.time;
        x += circle.radius * Math.cos(angle);
        y += circle.radius * Math.sin(angle);
        
        // Draw circle
        ctx.beginPath();
        ctx.arc(prevX, prevY, circle.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(37, 99, 235, ${0.3 - i * 0.02})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw line from previous to current
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = getCSSVariable('--text-dark', '#111827');
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // Add point to path
    state.path.push({ x, y });
    if (state.path.length > 1000) state.path.shift(); // Limit path length
    
    // Draw path
    if (state.path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(state.path[0].x, state.path[0].y);
        for (let i = 1; i < state.path.length; i++) {
            ctx.lineTo(state.path[i].x, state.path[i].y);
        }
        ctx.strokeStyle = getCSSVariable('--accent', '#F97316');
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    // Update time display
    if (elements.timeDisplay) {
        elements.timeDisplay.textContent = state.time.toFixed(2);
    }
    
    // Increment time
    state.time += 0.05;
    
    // Continue animation
    state.animationId = requestAnimationFrame(animate);
}

// Helper: Get CSS variable value
function getCSSVariable(name, fallback) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

// Stop Animation
function stopAnimation() {
    state.isRunning = false;
    if (state.animationId) {
        cancelAnimationFrame(state.animationId);
        state.animationId = null;
    }
    
    if (elements.runBtn) elements.runBtn.style.display = 'inline-block';
    if (elements.stopBtn) elements.stopBtn.style.display = 'none';
    
    showFeedback('Animation stopped', 'success');
}

// Reset Canvas
function resetCanvas() {
    stopAnimation();
    state.time = 0;
    state.path = [];
    
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    if (elements.timeDisplay) {
        elements.timeDisplay.textContent = '0.00';
    }
    
    showFeedback('Canvas reset', 'success');
}

// Show Feedback
function showFeedback(message, type = 'success') {
    if (!elements.feedback) return;
    
    elements.feedback.textContent = message;
    elements.feedback.className = `feedback ${type}`;
    elements.feedback.style.display = 'block';
    
    setTimeout(() => {
        elements.feedback.style.display = 'none';
    }, 3000);
}

// Expose Functions Globally (for HTML onclick)
window.addCircleManual = addCircleManual;
window.loadJSON = loadJSON;
window.clearCircles = clearCircles;
window.removeCircle = removeCircle;
window.runAnimation = runAnimation;
window.stopAnimation = stopAnimation;
window.resetCanvas = resetCanvas;

// Fields Toggle (required for fields.js compatibility)
// Use global if exists, otherwise define fallback
window.toggleField = window.toggleField || function(id) {
    const item = document.getElementById(id);
    if (!item) return;
    const header = item.querySelector('.field-header');
    const explanation = item.querySelector('.field-explanation');
    const icon = item.querySelector('.field-toggle');
    const isExpanded = header?.getAttribute('aria-expanded') === 'true';
    if (header) header.setAttribute('aria-expanded', !isExpanded);
    if (explanation) explanation.style.display = isExpanded ? 'none' : 'block';
    if (icon) {
        icon.classList.toggle('open');
        icon.textContent = icon.classList.contains('open') ? '−' : '+';
    }
};

window.closeAllFields = window.closeAllFields || function(selector) {
    const container = document.querySelector(selector);
    if (!container) return;
    container.querySelectorAll('.field-explanation').forEach(el => el.style.display = 'none');
    container.querySelectorAll('.field-toggle').forEach(el => {
        el.classList.remove('open');
        el.textContent = '+';
    });
    container.querySelectorAll('.field-header').forEach(h => h.setAttribute('aria-expanded', 'false'));
};

// Initialize on Load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}