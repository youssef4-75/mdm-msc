// ========================================
// BINARY COUNTING - COUNTER LOGIC WITH EDIT MODAL
// File: ../../js/challenges/binary-counting.js
// Uses counterString array only (no separate counter)
// ========================================

// ===== Game State =====
const state = {
    counterString: ["0"],
    steps: 1,
    availableDigits: ['0','1','2','3','4','5','6','7','8','9'],
    sequence: [],
    editMode: false,
    tempDigits: [] // For modal editing
};

// ===== DOM Elements =====
let elements = {};

// Cache DOM Elements
function cacheElements() {
    elements = {
        counterValue: document.getElementById('counter-value'),
        stepsInput: document.getElementById('steps-input'),
        incrementBtn: document.getElementById('increment-btn'),
        resetBtn: document.getElementById('reset-btn'),
        clearSequenceBtn: document.getElementById('clear-sequence-btn'),
        editDigitsBtn: document.getElementById('edit-digits-btn'),
        digitsPool: document.getElementById('digits-pool'),
        baseName: document.getElementById('base-name'),
        baseCount: document.getElementById('base-count'),
        sequenceOutput: document.getElementById('sequence-output'),
        // Modal elements
        editModal: document.getElementById('edit-modal'),
        modalCloseBtn: document.getElementById('modal-close-btn'),
        currentDigits: document.getElementById('current-digits'),
        newDigitInput: document.getElementById('new-digit-input'),
        appendBtn: document.getElementById('append-btn'),
        swapDigit1: document.getElementById('swap-digit-1'),
        swapDigit2: document.getElementById('swap-digit-2'),
        swapIconBtn: document.getElementById('swap-icon-btn'),
        switchBtn: document.getElementById('switch-btn'),
        cancelBtn: document.getElementById('cancel-btn'),
        saveBtn: document.getElementById('save-btn')
    };
}

// ===== Initialize =====
function init() {
    cacheElements();
    renderDigitsPool();
    setupEventListeners();
    updateBaseInfo();
    updateCounterDisplay();
}

// ===== Setup Event Listeners =====
function setupEventListeners() {
    if (elements.incrementBtn) elements.incrementBtn.addEventListener('click', incrementCounter);
    if (elements.resetBtn) elements.resetBtn.addEventListener('click', resetCounter);
    if (elements.clearSequenceBtn) elements.clearSequenceBtn.addEventListener('click', clearSequence);
    if (elements.editDigitsBtn) elements.editDigitsBtn.addEventListener('click', openEditModal);
    
    if (elements.stepsInput) {
        elements.stepsInput.addEventListener('change', (e) => {
            state.steps = parseInt(e.target.value) || 1;
        });
    }
    
    // Modal event listeners
    if (elements.modalCloseBtn) elements.modalCloseBtn.addEventListener('click', closeEditModal);
    if (elements.cancelBtn) elements.cancelBtn.addEventListener('click', closeEditModal);
    if (elements.saveBtn) elements.saveBtn.addEventListener('click', saveDigitChanges);
    if (elements.appendBtn) elements.appendBtn.addEventListener('click', appendDigit);
    if (elements.switchBtn) elements.switchBtn.addEventListener('click', switchDigits);
    if (elements.swapIconBtn) elements.swapIconBtn.addEventListener('click', swapDigitsInputs);
    
    // Close modal on overlay click
    if (elements.editModal) {
        elements.editModal.addEventListener('click', (e) => {
            if (e.target === elements.editModal) closeEditModal();
        });
    }
    
    // Enter key for inputs
    if (elements.newDigitInput) {
        elements.newDigitInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') appendDigit();
        });
    }
}

// ===== Render Digits Pool (Main View) =====
function renderDigitsPool() {
    if (!elements.digitsPool) return;
    
    elements.digitsPool.innerHTML = '';
    
    state.availableDigits.forEach(digit => {
        const chip = document.createElement('div');
        chip.className = 'digit-chip';
        chip.textContent = digit;
        elements.digitsPool.appendChild(chip);
    });
}

// ===== Update Counter Display =====
function updateCounterDisplay() {
    if (elements.counterValue) {
        elements.counterValue.textContent = state.counterString.join('');
    }
}

// ===== Open Edit Modal =====
function openEditModal() {
    // Copy current digits to temp array
    state.tempDigits = [...state.availableDigits];
    renderModalDigits();
    
    // Show modal
    if (elements.editModal) elements.editModal.classList.add('active');
    
    // Focus on first input
    if (elements.newDigitInput) elements.newDigitInput.focus();
}

// ===== Close Edit Modal =====
function closeEditModal() {
    if (elements.editModal) elements.editModal.classList.remove('active');
    
    // Clear inputs
    if (elements.newDigitInput) elements.newDigitInput.value = '';
    if (elements.swapDigit1) elements.swapDigit1.value = '';
    if (elements.swapDigit2) elements.swapDigit2.value = '';
}

// ===== Render Modal Digits =====
function renderModalDigits() {
    if (!elements.currentDigits) return;
    
    elements.currentDigits.innerHTML = '';
    
    state.tempDigits.forEach((digit, index) => {
        const chip = document.createElement('div');
        chip.className = 'modal-digit-chip';
        chip.innerHTML = `
            <span>${digit}</span>
            <button class="remove-digit" onclick="removeDigit(${index})" aria-label="Remove ${digit}">&times;</button>
        `;
        elements.currentDigits.appendChild(chip);
    });
}

// ===== Remove Digit from Modal =====
function removeDigit(index) {
    state.tempDigits.splice(index, 1);
    renderModalDigits();
}

// ===== Append Digit =====
function appendDigit() {
    if (!elements.newDigitInput) return;
    
    const value = elements.newDigitInput.value.trim();
    if (!value) return;
    
    // Check if already exists
    if (state.tempDigits.includes(value)) {
        alert('This digit already exists!');
        return;
    }
    
    state.tempDigits.push(value);
    // Sort: try numeric sort first, fallback to string sort
    state.tempDigits.sort((a, b) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
        }
        return a.localeCompare(b);
    });
    
    elements.newDigitInput.value = '';
    renderModalDigits();
}

// ===== Switch/Swap Two Digits =====
function switchDigits() {
    if (!elements.swapDigit1 || !elements.swapDigit2) return;
    
    const val1 = elements.swapDigit1.value.trim();
    const val2 = elements.swapDigit2.value.trim();
    
    if (!val1 || !val2) {
        alert('Please enter two digits to switch!');
        return;
    }
    
    const idx1 = state.tempDigits.indexOf(val1);
    const idx2 = state.tempDigits.indexOf(val2);
    
    if (idx1 === -1 || idx2 === -1) {
        alert('One or both digits not found in the list!');
        return;
    }
    
    // Swap
    [state.tempDigits[idx1], state.tempDigits[idx2]] = [state.tempDigits[idx2], state.tempDigits[idx1]];
    
    // Clear inputs
    elements.swapDigit1.value = '';
    elements.swapDigit2.value = '';
    
    renderModalDigits();
}

// ===== Swap Inputs (for convenience) =====
function swapDigitsInputs() {
    if (!elements.swapDigit1 || !elements.swapDigit2) return;
    
    const val1 = elements.swapDigit1.value;
    const val2 = elements.swapDigit2.value;
    
    elements.swapDigit1.value = val2;
    elements.swapDigit2.value = val1;
}

// ===== Save Digit Changes =====
function saveDigitChanges() {
    if (state.tempDigits.length === 0) {
        alert('You must have at least one digit!');
        return;
    }
    
    // Validate: ensure current counterString only uses new available digits
    const currentValue = state.counterString.join('');
    const allCharsValid = currentValue.split('').every(c => state.tempDigits.includes(c));
    
    if (!allCharsValid) {
        if (!confirm('Your current counter contains digits that will be removed. Reset counter to first digit?')) {
            return;
        }
        // Reset counter to first available digit
        state.counterString = [state.tempDigits[0]];
    }
    
    state.availableDigits = [...state.tempDigits];
    renderDigitsPool();
    updateBaseInfo();
    updateCounterDisplay();
    closeEditModal();
    
    announce(`Updated to ${getBaseName()}.`);
}

// ===== Get Base Name =====
function getBaseName() {
    const count = state.availableDigits.length;
    const digits = state.availableDigits.join(',');
    
    if (digits === '0,1') return 'Base 2 (Binary)';
    if (count === 8) return 'Base 8 (Octal)';
    if (count === 10 && digits === '0,1,2,3,4,5,6,7,8,9') return 'Base 10 (Decimal)';
    if (count === 16) return 'Base 16 (Hexadecimal)';
    return `Base ${count} (Custom)`;
}

// ===== Update Base Info =====
function updateBaseInfo() {
    const count = state.availableDigits.length;
    if (elements.baseName) elements.baseName.textContent = getBaseName();
    if (elements.baseCount) elements.baseCount.textContent = `(${count} digit${count !== 1 ? 's' : ''})`;
}

// ===== Increment Counter (String-based) =====
function incrementCounter() {
    const digits = state.availableDigits;
    const steps = state.steps;
    
    for (let s = 0; s < steps; s++) {
        // Increment counterString by 1 (like adding 1 in custom base)
        let carry = 1;
        let i = state.counterString.length - 1;
        
        while (carry > 0) {
            if (i < 0) {
                // Need to add a new digit at the beginning
                state.counterString.unshift(digits[0]);
                i = 0;
            }
            
            const currentDigit = state.counterString[i];
            const currentIndex = digits.indexOf(currentDigit);
            
            if (currentIndex === -1) {
                // Current digit not in available digits, reset to first digit
                state.counterString[i] = digits[0];
                carry = 1;
                i--;
            } else {
                const newIndex = currentIndex + carry;
                if (newIndex >= digits.length) {
                    // Overflow, set to first digit and carry over
                    state.counterString[i] = digits[0];
                    carry = 1;
                    i--;
                } else {
                    // No overflow, set new digit and stop carrying
                    state.counterString[i] = digits[newIndex];
                    carry = 0;
                }
            }
        }
    }
    
    // Get display value
    const displayValue = state.counterString.join('');
    
    // Update state
    state.sequence.push(displayValue);
    
    // Update display
    updateCounterDisplay();
    
    // Add to sequence output
    addToSequence(displayValue);
}

// ===== Add to Sequence Output =====
function addToSequence(value) {
    if (!elements.sequenceOutput) return;
    
    // Remove placeholder if exists
    const placeholder = elements.sequenceOutput.querySelector('.sequence-placeholder');
    if (placeholder) placeholder.remove();
    
    const item = document.createElement('div');
    item.className = 'sequence-item';
    item.textContent = value;
    elements.sequenceOutput.appendChild(item);
    
    // Scroll to bottom
    elements.sequenceOutput.scrollTop = elements.sequenceOutput.scrollHeight;
}

// ===== Clear Sequence =====
function clearSequence() {
    state.sequence = [];
    if (elements.sequenceOutput) {
        elements.sequenceOutput.innerHTML = '<p class="sequence-placeholder">No increments yet.</p>';
    }
}

// ===== Reset Counter =====
function resetCounter() {
    state.counterString = ["0"];
    state.sequence = [];
    updateCounterDisplay();
    clearSequence();
    announce('Counter reset to zero.');
}

// ===== Announce to Screen Readers =====
function announce(message) {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'visually-hidden';
    liveRegion.textContent = message;
    document.body.appendChild(liveRegion);
    setTimeout(() => liveRegion.remove(), 1000);
}

// ===== Fields Toggle (Required for fields.js compatibility) =====
function setupFieldsToggle() {
    document.querySelectorAll('.field-header').forEach(header => {
        header.addEventListener('click', toggleField);
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleField.call(header);
            }
        });
    });
}

function toggleField(event) {
    const header = event.currentTarget || event;
    const item = header.closest('.field-item');
    if (!item) return;
    
    const explanation = item.querySelector('.field-explanation');
    const icon = item.querySelector('.field-toggle');
    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    
    header.setAttribute('aria-expanded', !isExpanded);
    if (explanation) explanation.hidden = isExpanded;
    
    if (icon) {
        icon.classList.toggle('open');
        icon.textContent = icon.classList.contains('open') ? '−' : '+';
    }
}

function closeAllFields() {
    document.querySelectorAll('.field-item').forEach(item => {
        const header = item.querySelector('.field-header');
        const explanation = item.querySelector('.field-explanation');
        const icon = item.querySelector('.field-toggle');
        
        if (header) header.setAttribute('aria-expanded', 'false');
        if (explanation) explanation.hidden = true;
        if (icon) {
            icon.classList.remove('open');
            icon.textContent = '+';
        }
    });
}

// Expose globally for fields.js compatibility
window.toggleField = toggleField;
window.closeAllFields = closeAllFields;
window.removeDigit = removeDigit;

// ===== Initialize when DOM is ready =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}