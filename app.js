/**
 * Multiples-Of-Three Game Logic
 * Fully complies with CUD (Color Universal Design) and requested specs.
 */

// --- Game Configuration Constants ---
const GRID_SIZE = 4; // 4x4 Grid (easily modifiable to other sizes)
const GAME_LIMIT = 59; // 59 seconds limit
const REFRESH_INTERVAL = 3000; // Refresh numbers/colors every 3s
const START_DELAY = 3000; // 3 seconds countdown delay
const MAX_MISSES = 6;
const MIN_NUM = 1;
const MAX_NUM = 300;
const IMAGE_COUNT = 12; // 12 monthly flower images

// CUD-compliant CSS classes for cell backgrounds
const CUD_COLOR_CLASSES = ['cell-color-1', 'cell-color-2', 'cell-color-3', 'cell-color-4'];

// --- Game States ---
const STATES = {
    IDLE: 'idle',
    COUNTDOWN: 'countdown',
    PLAYING: 'playing',
    GAME_OVER: 'game_over'
};

// --- Game Variables ---
let currentState = STATES.IDLE;
let score = 0;
let misses = 0;
let timeLeft = GAME_LIMIT;
let cells = []; // Array of cell objects: { id, number, colorClass, isLocked, isInactive }
let cellElements = []; // Cached persistent DOM elements for the cells
let lastPointerTime = 0; // Timestamp to prevent duplicate synthetic clicks

// Timers
let gameTimerId = null;
let refreshTimerId = null;
let countdownTimerId = null;

// --- DOM Elements ---
const restTimeEl = document.getElementById('rest-time');
const scoreEl = document.getElementById('score');
const missEl = document.getElementById('miss');
const gameGridEl = document.getElementById('game-grid');
const messageOverlayEl = document.getElementById('message-overlay');
const overlayTextEl = document.getElementById('overlay-text');
const actionBtnEl = document.getElementById('action-btn');
const gridWrapperEl = document.getElementById('grid-wrapper');
const gridBgEl = document.getElementById('grid-background');

// --- Helper Functions ---

/**
 * Returns a random integer between min and max (inclusive)
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random CUD color class
 */
function getRandomColorClass() {
    const idx = getRandomInt(0, CUD_COLOR_CLASSES.length - 1);
    return CUD_COLOR_CLASSES[idx];
}

/**
 * Formats score value: e.g. "-0050" or "0120"
 */
function formatScore(val) {
    const isNegative = val < 0;
    const absVal = Math.abs(val);
    const padded = String(absVal).padStart(4, '0');
    return (isNegative ? '-' : '') + padded;
}

/**
 * Formats time: pads with leading zero (2 digits)
 */
function formatTime(val) {
    return String(Math.max(0, val)).padStart(2, '0');
}

/**
 * Displays score with flash animation
 */
function updateScoreUI(animateClass = '') {
    scoreEl.textContent = formatScore(score);
    if (animateClass) {
        scoreEl.classList.remove('value-highlight', 'value-penalty');
        void scoreEl.offsetWidth; // Trigger reflow to restart animation
        scoreEl.classList.add(animateClass);
        setTimeout(() => scoreEl.classList.remove(animateClass), 500);
    }
}

// --- Core Game Functions ---

/**
 * Initialize the game board to IDLE state
 */
function init() {
    currentState = STATES.IDLE;
    score = 0;
    misses = 0;
    timeLeft = GAME_LIMIT;

    // Reset UI displays
    restTimeEl.textContent = formatTime(timeLeft);
    scoreEl.textContent = formatScore(score);
    missEl.textContent = String(misses);

    // Apply grid template dimensions
    gameGridEl.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
    gameGridEl.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;

    // Configure Action Button
    actionBtnEl.textContent = 'Start';
    actionBtnEl.className = 'btn btn-start';
    actionBtnEl.disabled = false;

    // Grid Wrapper styling
    gridWrapperEl.className = '';
    gridBgEl.style.backgroundImage = 'none';

    // Hide message overlay
    messageOverlayEl.className = 'overlay-hide';

    // Create initial cells (1 to GRID_SIZE^2) with predefined diagonal shift color pattern
    cells = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const index = r * GRID_SIZE + c;
            const number = index + 1;
            const colorIdx = (r + c) % 4;
            cells.push({
                id: number,
                number: number,
                colorClass: CUD_COLOR_CLASSES[colorIdx],
                isLocked: false,
                isInactive: false
            });
        }
    }

    // Create persistent cell elements in DOM if not already created
    const totalCells = GRID_SIZE * GRID_SIZE;
    if (cellElements.length !== totalCells) {
        gameGridEl.innerHTML = '';
        cellElements = [];
        for (let i = 0; i < totalCells; i++) {
            const cellEl = document.createElement('div');
            cellEl.className = 'grid-cell';
            cellEl.dataset.index = i;
            gameGridEl.appendChild(cellEl);
            cellElements.push(cellEl);
        }
    }

    renderGrid();
}

/**
 * Renders the cells onto the game board grid without recreating DOM nodes
 */
function renderGrid() {
    cells.forEach((cell, index) => {
        const cellEl = cellElements[index];
        if (!cellEl) return;

        cellEl.textContent = cell.number;

        // Reset class to base class
        cellEl.className = 'grid-cell';
        cellEl.style.backgroundColor = '';

        // Apply classes based on game state and cell state
        if (currentState === STATES.IDLE) {
            // Predefined pattern color styling during idle
            if (cell.colorClass) {
                cellEl.classList.add(cell.colorClass);
            } else {
                cellEl.style.backgroundColor = '#ffffff';
            }
        } else {
            if (cell.isInactive) {
                cellEl.classList.add('inactive');
            } else if (cell.isLocked) {
                cellEl.classList.add('locked');
                cellEl.classList.add(cell.colorClass);
            } else {
                // Active cell
                cellEl.classList.add(cell.colorClass);
            }
        }
    });
}

/**
 * Handles Start Button click & starts the 3s countdown delay
 */
function startGame() {
    if (currentState !== STATES.IDLE && currentState !== STATES.GAME_OVER) return;

    currentState = STATES.COUNTDOWN;
    actionBtnEl.disabled = true; // Disable action button during countdown

    // Select a random background flower image (1 to 12)
    const randomMonth = getRandomInt(1, IMAGE_COUNT);
    const bgUrl = `images/flower_${String(randomMonth).padStart(2, '0')}.jpg`;
    gridBgEl.style.backgroundImage = `url('${bgUrl}')`;

    // Show countdown overlay
    messageOverlayEl.className = '';
    overlayTextEl.textContent = '3';

    let countdownCount = 3;

    // Animate countdown numbers (3 -> 2 -> 1 -> START!)
    countdownTimerId = setInterval(() => {
        countdownCount--;
        if (countdownCount === 2) {
            overlayTextEl.textContent = '2';
        } else if (countdownCount === 1) {
            overlayTextEl.textContent = '1';
        } else if (countdownCount === 0) {
            overlayTextEl.textContent = 'START!';
            clearInterval(countdownTimerId);
            
            // Wait slightly at "START!" then start gameplay
            setTimeout(() => {
                beginActiveGameplay();
            }, 800);
        }
    }, 1000);
}

/**
 * Begins active gameplay after the delay
 */
function beginActiveGameplay() {
    currentState = STATES.PLAYING;
    gridWrapperEl.classList.add('game-playing');

    // Hide message overlay
    messageOverlayEl.classList.add('overlay-hide');

    // Action button becomes "Clear"
    actionBtnEl.textContent = 'Clear';
    actionBtnEl.className = 'btn btn-clear';
    actionBtnEl.disabled = false;

    // Initialize gameplay cell values and colors (allowing duplicates)
    cells = cells.map(cell => ({
        ...cell,
        number: getRandomInt(MIN_NUM, MAX_NUM),
        colorClass: getRandomColorClass(),
        isLocked: false,
        isInactive: false
    }));

    renderGrid();

    // Start decrement timer and cell refresh timer (synchronized)
    gameTimerId = setInterval(() => {
        timeLeft--;
        restTimeEl.textContent = formatTime(timeLeft);

        if (timeLeft <= 0) {
            endGame(false); // Time up!
        } else {
            // Refresh cells every 3 seconds of elapsed time
            const elapsedTime = GAME_LIMIT - timeLeft;
            if (elapsedTime % 3 === 0) {
                refreshActiveCells();
            }
        }
    }, 1000);
}

/**
 * Refreshes values and colors for non-locked, non-inactive cells
 */
function refreshActiveCells() {
    if (currentState !== STATES.PLAYING) return;

    cells = cells.map(cell => {
        if (!cell.isLocked && !cell.isInactive) {
            return {
                ...cell,
                number: getRandomInt(MIN_NUM, MAX_NUM),
                colorClass: getRandomColorClass()
            };
        }
        return cell;
    });

    renderGrid();
}

/**
 * Handles clicking a cell in the grid
 */
function handleCellClick(index) {
    if (currentState !== STATES.PLAYING) return;

    const cell = cells[index];

    // Inactive cells ignore clicks completely
    if (cell.isInactive) return;

    // Locked cells penalize the user if clicked again
    if (cell.isLocked) {
        score -= cell.number;
        misses += 1;
        updateScoreUI('value-penalty');
        missEl.textContent = String(misses);
        
        if (misses >= MAX_MISSES) {
            endGame(true);
        }
        return;
    }

    // Check if multiple of 3
    if (cell.number % 3 === 0) {
        // Correct! Lock the cell.
        cell.isLocked = true;
        
        // Visual feedack (pop animation)
        const cellEl = cellElements[index] || gameGridEl.children[index];
        if (cellEl) {
            cellEl.classList.add('locked');
            cellEl.classList.add('pop-animation');
            cellEl.classList.add(cell.colorClass);

            // Remove animation class after it finishes
            setTimeout(() => {
                cellEl.classList.remove('pop-animation');
            }, 300);
        }
    } else {
        // Mistake! Penalty score subtraction and miss increase
        score -= cell.number;
        misses += 1;

        updateScoreUI('value-penalty');
        missEl.textContent = String(misses);

        // Check if Miss limit reached (6)
        if (misses >= MAX_MISSES) {
            endGame(true); // Game ends with miss limit, remaining time is added to score
        }
    }
}

/**
 * Handles clicking the Clear/Action button
 */
function handleClearClick() {
    if (currentState !== STATES.PLAYING) return;

    // Find locked cells
    const lockedCells = cells.filter(cell => cell.isLocked);

    if (lockedCells.length === 0) return; // Do nothing if no locked cells

    // Calculate score addition
    const sum = lockedCells.reduce((acc, cell) => acc + cell.number, 0);
    
    // Multi-clear bonus: applied when lockedCells.length >= 3
    // 3 cells: 1.01^1 (= 1.01), 4 cells: 1.01^2 (= 1.0201), 5 cells: 1.01^3...
    // 1 or 2 cells: 1.0 (no bonus)
    let multiplier = 1.0;
    if (lockedCells.length >= 3) {
        multiplier = Math.pow(1.01, lockedCells.length - 2);
    }
    const addedScore = Math.round(sum * multiplier);

    score += addedScore;
    updateScoreUI('value-highlight');

    // Make locked cells inactive
    cells = cells.map(cell => {
        if (cell.isLocked) {
            return {
                ...cell,
                isLocked: false,
                isInactive: true
            };
        }
        return cell;
    });

    renderGrid();

    // Check if game cleared (all cells inactive)
    const allInactive = cells.every(cell => cell.isInactive);
    if (allInactive) {
        endGame(true); // Victory! All cells cleared
    }
}

/**
 * Ends the game
 * @param {boolean} isClearOrMissLimit - If true, remaining time * 30 is added to Score.
 */
function endGame(isClearOrMissLimit) {
    currentState = STATES.GAME_OVER;

    // Clear all timers
    clearInterval(gameTimerId);
    clearInterval(refreshTimerId);
    clearInterval(countdownTimerId);

    // Calculate Time Bonus if cleared or miss limit reached
    let finalMessage = 'GAME OVER';
    
    const allInactive = cells.every(cell => cell.isInactive);

    if (isClearOrMissLimit) {
        const timeBonus = timeLeft * 51;
        score += timeBonus;
        updateScoreUI('value-highlight');

        if (allInactive) {
            finalMessage = 'GAME CLEAR!';
        } else if (misses >= MAX_MISSES) {
            finalMessage = 'MISS LIMIT!';
        }
    } else {
        finalMessage = 'TIME UP!';
    }

    // Display final status in message overlay
    messageOverlayEl.classList.remove('overlay-hide');
    overlayTextEl.innerHTML = `${finalMessage}<br><span style="font-size: 1.8rem; font-weight: 600;">Score: ${formatScore(score)}</span>`;

    // Disable action button for 3 seconds post game end (user cannot operate)
    actionBtnEl.disabled = true;
    actionBtnEl.textContent = 'Wait...';
    
    setTimeout(() => {
        // Configure Action button for Restart after 3 seconds
        actionBtnEl.textContent = 'Restart';
        actionBtnEl.className = 'btn btn-restart';
        actionBtnEl.disabled = false;
        
        // Hide overlay so the user can see the full background image
        messageOverlayEl.classList.add('overlay-hide');
    }, 3000);
}

// --- Action Button Dispatcher ---
actionBtnEl.addEventListener('click', () => {
    if (currentState === STATES.IDLE) {
        startGame();
    } else if (currentState === STATES.PLAYING) {
        handleClearClick();
    } else if (currentState === STATES.GAME_OVER) {
        init();
        startGame();
    }
});

// --- Grid Interaction (Pointer & Click Delegation) ---
// Using pointerdown captures touch/click instantly on initial contact with 0ms delay,
// avoiding dropped events during transitions, and preventing browser tap-delay.
function handleGridInteraction(e) {
    if (currentState !== STATES.PLAYING) return;
    const cellEl = e.target.closest('.grid-cell');
    if (!cellEl) return;

    const index = parseInt(cellEl.dataset.index, 10);
    if (!isNaN(index)) {
        handleCellClick(index);
    }
}

gameGridEl.addEventListener('pointerdown', (e) => {
    lastPointerTime = Date.now();
    handleGridInteraction(e);
});

gameGridEl.addEventListener('click', (e) => {
    // Suppress synthetic duplicate click generated following pointerdown
    if (Date.now() - lastPointerTime < 400) {
        e.preventDefault();
        e.stopPropagation();
        return;
    }
    handleGridInteraction(e);
});

// --- Initialize Game on Load ---
window.addEventListener('DOMContentLoaded', () => {
    init();
});
