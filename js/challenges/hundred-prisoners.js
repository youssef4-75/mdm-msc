// ========================================
// HUNDRED PRISONERS - GAME LOGIC
// ========================================

const gameState = {
    permutation: [],
    prisonerNumber: null,
    openedBoxes: new Set(),
    steps: 0,
    maxSteps: 9,
    gameActive: false
};

// Generate permutation with max cycle ≤ 9
function generatePermutation(n = 100, maxCycle = 9) {
    const permutation = new Array(n).fill(0);
    let available = Array.from({length: n}, (_, i) => i + 1);
    
    while (available.length > 0) {
        const cycleLen = Math.min(maxCycle, Math.floor(Math.random() * maxCycle) + 1, available.length);
        const cycle = [];
        for (let i = 0; i < cycleLen; i++) {
            const idx = Math.floor(Math.random() * available.length);
            cycle.push(available.splice(idx, 1)[0]);
        }
        for (let i = 0; i < cycleLen; i++) {
            permutation[cycle[i] - 1] = cycle[(i + 1) % cycleLen];
        }
    }
    return permutation;
}

// Render 10×10 grid
function renderGrid() {
    const grid = document.getElementById('grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    for (let i = 1; i <= 100; i++) {
        const box = document.createElement('button');
        box.className = 'box';
        box.dataset.boxNumber = i;
        box.textContent = i;
        box.type = 'button';
        box.addEventListener('click', () => handleBoxClick(i));
        grid.appendChild(box);
    }
}

// Assign prisoner number
function assignPrisonerNumber() {
    gameState.prisonerNumber = Math.floor(Math.random() * 100) + 1;
    gameState.permutation = generatePermutation();
    gameState.gameActive = true;
    gameState.openedBoxes.clear();
    gameState.steps = 0;
    
    document.getElementById('prisoner-number').textContent = gameState.prisonerNumber;
    document.getElementById('player-prisoner').textContent = gameState.prisonerNumber;
    document.getElementById('prisoner-display').classList.remove('hidden');
    document.getElementById('steps-count').textContent = '0';
    document.getElementById('result-message').textContent = '';
    document.getElementById('stage-complete').classList.add('hidden');
    document.getElementById('assign-btn').style.display = 'none';
    document.getElementById('reset-btn').style.display = 'block';
    
    renderGrid();
    highlightBox(gameState.prisonerNumber, 'target');
}

// Handle box click
function handleBoxClick(boxNumber) {
    if (!gameState.gameActive || !gameState.prisonerNumber) return;
    if (gameState.openedBoxes.has(boxNumber)) return;
    if (gameState.steps >= gameState.maxSteps) return;
    
    gameState.openedBoxes.add(boxNumber);
    gameState.steps++;
    
    const boxEl = document.querySelector(`.box[data-box-number="${boxNumber}"]`);
    if (!boxEl) return;
    
    boxEl.classList.add('open');
    boxEl.textContent = gameState.permutation[boxNumber - 1];
    document.getElementById('steps-count').textContent = gameState.steps;
    
    const containedNumber = gameState.permutation[boxNumber - 1];
    
    if (containedNumber === gameState.prisonerNumber) {
        boxEl.classList.add('found');
        document.getElementById('result-message').textContent = `🎉 Found in ${gameState.steps} step${gameState.steps > 1 ? 's' : ''}!`;
        document.getElementById('result-message').className = 'result-message success';
        document.getElementById('final-steps').textContent = gameState.steps;
        document.getElementById('stage-complete').classList.remove('hidden');
        gameState.gameActive = false;
    } else if (gameState.steps >= gameState.maxSteps) {
        document.getElementById('result-message').textContent = `⚠️ Max steps! Start at box ${gameState.prisonerNumber}!`;
        document.getElementById('result-message').className = 'result-message error';
        gameState.gameActive = false;
    } else {
        highlightBox(containedNumber, 'target', 1500);
    }
}

// Highlight box temporarily
function highlightBox(boxNumber, className, duration = null) {
    const boxEl = document.querySelector(`.box[data-box-number="${boxNumber}"]`);
    if (!boxEl || gameState.openedBoxes.has(boxNumber)) return;
    
    boxEl.classList.add(className);
    if (duration) {
        setTimeout(() => boxEl.classList.remove(className), duration);
    }
}

// Reset game
function resetGame() {
    gameState.prisonerNumber = null;
    gameState.openedBoxes.clear();
    gameState.steps = 0;
    gameState.gameActive = false;
    
    document.getElementById('prisoner-display').classList.add('hidden');
    document.getElementById('assign-btn').style.display = 'block';
    document.getElementById('reset-btn').style.display = 'none';
    document.getElementById('stage-complete').classList.add('hidden');
    document.getElementById('result-message').textContent = '';
    document.getElementById('steps-count').textContent = '0';
    document.getElementById('player-prisoner').textContent = '?';
    
    renderGrid();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderGrid();
});

// ===== Initialize on DOM Load =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all stages
    for (let i = 1; i <= 5; i++) {
        gameState.stageData[i] = {
            divisor: parseInt(document.getElementById(`stage-${i}`)?.dataset.divisor) || 2,
            correctCount: 0,
            answered: new Set()
        };
    }
    
    initStage(1);
    updateProgressBar();
});

// ===== Progress Bar =====
function updateProgressBar() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const num = index + 1;
        step.classList.remove('active', 'completed');
        if (gameState.currentStage > num) {
            step.classList.add('completed');
            step.innerHTML = '✓';
        } else if (gameState.currentStage === num) {
            step.classList.add('active');
            step.textContent = num;
        } else {
            step.textContent = num;
        }
    });
}

// ===== Stage Navigation =====
function nextStage(stageNum) {
    if (stageNum > gameState.totalStages) {
        showCompletion();
        return;
    }
    
    // Hide current
    const current = document.getElementById(`stage-${gameState.currentStage}`);
    if (current) current.classList.remove('active');
    
    // Update state
    gameState.currentStage = stageNum;
    
    // Show next
    const next = document.getElementById(`stage-${stageNum}`);
    if (next) {
        next.classList.add('active');
        next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    updateProgressBar();
    initStage(stageNum);
}

function showCompletion() {
    const el = document.getElementById('stage-complete');
    if (el) {
        el.classList.add('show');
        createConfetti();
    }
    const last = document.getElementById(`stage-${gameState.totalStages}`);
    if (last) last.classList.remove('active');
    updateProgressBar();
}

// ===== Initialize Any Stage =====
function initStage(stageNum) {
    const stage = gameState.stageData[stageNum];
    if (!stage) return;
    
    // Reset counters
    stage.correctCount = 0;
    stage.answered.clear();
    updateCorrectCounter(stageNum, 0);
    updateNextButton(stageNum, false);
    
    // Generate 5 random numbers (range increases with difficulty)
    const divisor = stage.divisor;
    const max = stageNum <= 2 ? 100 : stageNum <= 4 ? 500 : 1000;
    const numbers = generateQuizNumbers(5, divisor, max);
    
    // Render numbers
    const container = document.getElementById(`quiz-numbers-${stageNum}`);
    if (!container) return;
    
    container.innerHTML = '';
    numbers.forEach((num, index) => {
        const item = createQuizItem(num, divisor, stageNum, index);
        container.appendChild(item);
    });
}

function generateQuizNumbers(count, divisor, max) {
    const nums = [];
    while (nums.length < count) {
        const num = Math.floor(Math.random() * max) + 1;
        if (!nums.includes(num)) nums.push(num);
    }
    return nums;
}

function createQuizItem(number, divisor, stageNum, index) {
    const isDivisible = number % divisor === 0;
    const uniqueId = `q${stageNum}-${index}`;
    
    const div = document.createElement('div');
    div.className = 'quiz-item';
    div.dataset.number = number;
    div.dataset.answer = isDivisible;
    div.id = uniqueId;
    
    div.innerHTML = `
        <span class="quiz-number">${number.toLocaleString()}</span>
        <div class="quiz-buttons">
            <button class="btn-quiz btn-yes" type="button" onclick="checkAnswer(${stageNum}, ${index}, true, '${uniqueId}')">
                ✓ Divisible
            </button>
            <button class="btn-quiz btn-no" type="button" onclick="checkAnswer(${stageNum}, ${index}, false, '${uniqueId}')">
                ✗ Not
            </button>
        </div>
        <span class="quiz-result" id="result-${uniqueId}"></span>
    `;
    
    return div;
}

// ===== Check Answer =====
function checkAnswer(stageNum, index, userSaysDivisible, uniqueId) {
    const stage = gameState.stageData[stageNum];
    const item = document.getElementById(uniqueId);
    
    if (!item || stage.answered.has(index)) return;
    
    const isDivisible = item.dataset.answer === 'true';
    const isCorrect = (userSaysDivisible && isDivisible) || (!userSaysDivisible && !isDivisible);
    
    // Mark as answered
    stage.answered.add(index);
    
    // Disable buttons
    item.querySelectorAll('.btn-quiz').forEach(btn => btn.disabled = true);
    
    // Show result
    const resultEl = document.getElementById(`result-${uniqueId}`);
    if (isCorrect) {
        item.classList.add('correct');
        resultEl.textContent = '✓ Correct!';
        resultEl.style.color = '#065F46';
        stage.correctCount++;
        updateCorrectCounter(stageNum, stage.correctCount);
        
        // Check stage complete
        if (stage.correctCount >= gameState.targetCorrect) {
            updateNextButton(stageNum, true);
            showFeedback(stageNum, true, getStageCompleteMessage(stageNum));
        }
    } else {
        item.classList.add('incorrect');
        resultEl.textContent = `✗ ${getExplanation(item.dataset.number, stage.divisor)}`;
        resultEl.style.color = '#991B1B';
    }
}

function getExplanation(number, divisor) {
    const num = parseInt(number);
    if (divisor === 2) return num % 2 === 0 ? 'even' : 'odd';
    if (divisor === 5) return `ends in ${num % 10}`;
    if (divisor === 4) return `last two: ${num % 100}`;
    if (divisor === 3) {
        const sum = String(num).split('').reduce((a, b) => a + parseInt(b), 0);
        return `digit sum: ${sum}`;
    }
    if (divisor === 7) return `${num} ÷ 7 = ${(num/7).toFixed(2)}`;
    return '';
}

function getStageCompleteMessage(stageNum) {
    const messages = {
        1: 'Great! You\'ve mastered divisibility by 2! 🎉',
        2: 'Perfect! Divisibility by 5 is easy now! 🎯',
        3: 'Excellent! You\'ve got divisibility by 4! ✨',
        4: 'Amazing! Divisibility by 3 makes sense! 🚀',
        5: 'Incredible! You\'ve mastered divisibility by 7! 🏆'
    };
    return messages[stageNum] || 'Well done!';
}

// ===== Utility Functions =====
function updateCorrectCounter(stageNum, value) {
    const el = document.getElementById(`correct-${stageNum}`);
    if (el) el.textContent = value;
}

function updateNextButton(stageNum, enable) {
    const btn = document.getElementById(`next-${stageNum}`);
    if (btn) btn.disabled = !enable;
}

function showFeedback(stageNum, isCorrect, message) {
    const fb = document.getElementById(`feedback-${stageNum}`);
    if (!fb) return;
    fb.textContent = message;
    fb.className = `feedback show ${isCorrect ? 'correct' : 'incorrect'}`;
    setTimeout(() => fb.classList.remove('show'), 4000);
}

function toggleHint(hintId) {
    const hint = document.getElementById(hintId);
    if (hint) hint.classList.toggle('show');
}

function resetStage(stageNum) {
    // Reset state
    const stage = gameState.stageData[stageNum];
    if (stage) {
        stage.correctCount = 0;
        stage.answered.clear();
    }
    
    // Reset UI
    updateCorrectCounter(stageNum, 0);
    updateNextButton(stageNum, false);
    
    const container = document.getElementById(`quiz-numbers-${stageNum}`);
    if (container) container.innerHTML = '';
    
    const fb = document.getElementById(`feedback-${stageNum}`);
    if (fb) fb.classList.remove('show');
    
    const hint = document.getElementById(`hint-${stageNum}`);
    if (hint) hint.classList.remove('show');
    
    // Re-init
    initStage(stageNum);
}

function createConfetti() {
    const colors = ['#F97316', '#2563EB', '#14B8A6', '#10B981', '#F59E0B'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const c = document.createElement('div');
            c.style.cssText = `
                position:fixed;width:10px;height:10px;
                background:${colors[Math.floor(Math.random()*colors.length)]};
                left:${Math.random()*100}vw;top:-10px;
                border-radius:50%;z-index:9999;pointer-events:none;
            `;
            document.body.appendChild(c);
            c.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(100vh) rotate(${Math.random()*720}deg)`, opacity: 0 }
            ], { duration: Math.random()*2000+1500, easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' })
            .onfinish = () => c.remove();
        }, i * 50);
    }
}


// ===== Expose Functions Globally =====
window.nextStage = nextStage;
window.checkAnswer = checkAnswer;
window.toggleHint = toggleHint;
window.resetStage = resetStage;

// Fields toggle - FIXED
window.toggleField = function(id) {
    console.log('Toggling field:', id); // Debug
    const item = document.getElementById(id);
    if (!item) {
        console.error('Field not found:', id);
        return;
    }
    
    const explanation = item.querySelector('.field-explanation');
    const icon = item.querySelector('.field-toggle');
    
    if (explanation) {
        explanation.classList.toggle('show');
    }
    if (icon) {
        icon.classList.toggle('open');
        icon.textContent = icon.classList.contains('open') ? '−' : '+';
    }
};

window.closeAllFields = function(selector) {
    const container = document.querySelector(selector);
    if (!container) return;
    
    container.querySelectorAll('.field-explanation.show').forEach(el => {
        el.classList.remove('show');
    });
    container.querySelectorAll('.field-toggle.open').forEach(el => {
        el.classList.remove('open');
        el.textContent = '+';
    });
};

// Also add direct event listeners as backup (in case onclick fails)
document.addEventListener('DOMContentLoaded', () => {
    // Add click listeners to all field headers
    document.querySelectorAll('.field-header').forEach(header => {
        header.addEventListener('click', function() {
            const item = this.closest('.field-item');
            if (!item) return;
            
            const explanation = item.querySelector('.field-explanation');
            const icon = item.querySelector('.field-toggle');
            
            if (explanation) explanation.classList.toggle('show');
            if (icon) {
                icon.classList.toggle('open');
                icon.textContent = icon.classList.contains('open') ? '−' : '+';
            }
        });
    });
});