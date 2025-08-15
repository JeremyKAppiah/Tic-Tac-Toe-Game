import './styling.css';

let BOARD_SIZE = 3;
let gameState = [];
let currentPlayer = 'X';
let WINNING_COMBINATIONS = [];
let vsAI = false;
let gameActive = true;

document.addEventListener('DOMContentLoaded', () => {
  const boardEl = document.getElementById('board');
  const statusText = document.getElementById('statusText');
  const startButton = document.getElementById('startButton');
  const restartButton = document.getElementById('restartButton');
  const landingOverlay = document.getElementById('landingOverlay');
  const landingStartButton = document.getElementById('landingStartButton');
  const messagePopup = document.getElementById('messagePopup');
  const popupMessage = document.getElementById('popupMessage');
  const popupCloseBtn = document.getElementById('popupCloseBtn');

  // Check for required elements and warn if missing
  if (!boardEl || !statusText || !startButton || !restartButton || !landingOverlay || !landingStartButton || !messagePopup || !popupMessage || !popupCloseBtn) {
    console.error('One or more required DOM elements are missing. Check your HTML IDs.');
    return;
  }

  landingStartButton.addEventListener('click', () => {
    // Hide overlay and start game
    landingOverlay.style.opacity = '0';
    setTimeout(() => {
      landingOverlay.style.display = 'none';
    }, 500);

    // Enable controls and start
    startButton.disabled = false;
    document.body.classList.add('show-restart'); // Show restart button
    restartButton.disabled = false;
    startGame();
  });

  startButton.addEventListener('click', () => {
    BOARD_SIZE = parseInt(document.getElementById('boardSize').value) || 3;
    vsAI = document.getElementById('aiToggle').checked;
    document.body.classList.add('show-restart'); // Show restart button
    startGame();
  });
  restartButton.addEventListener('click', startGame);

  popupCloseBtn.addEventListener('click', () => {
    messagePopup.classList.add('hidden');
    restartGameAfterPopup();
  });

  function restartGameAfterPopup() {
    startGame();
  }

  function showMessage(message) {
    popupMessage.textContent = message;
    messagePopup.classList.remove('hidden');
  }

  function createFloatingMarks() {
    const container = document.getElementById('floatingMarks');
    const count = 15; // number of floating marks

    for (let i = 0; i < count; i++) {
      const mark = document.createElement('div');
      mark.classList.add('floating-mark');
      mark.textContent = Math.random() < 0.5 ? 'X' : 'O';

      // Random position inside overlay (percent)
      mark.style.top = `${Math.random() * 100}%`;
      mark.style.left = `${Math.random() * 100}%`;

      // Random animation duration and delay for natural feel
      mark.style.animationDuration = `${5 + Math.random() * 5}s`;
      mark.style.animationDelay = `${Math.random() * 5}s`;

      container.appendChild(mark);
    }
  }
  createFloatingMarks();

  function startGame() {
    gameState = Array(BOARD_SIZE ** 2).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
    boardEl.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 1fr)`;
    boardEl.style.setProperty('--board-size', BOARD_SIZE);

    WINNING_COMBINATIONS = generateWinningCombinations(BOARD_SIZE);

    for (let i = 0; i < BOARD_SIZE ** 2; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.index = i;
      cell.addEventListener('click', () => handleMove(i));
      boardEl.appendChild(cell);
    }
    updateStatus();
  }

  function generateWinningCombinations(size) {
    const combos = [];

    // Rows
    for (let r = 0; r < size; r++) {
      combos.push([...Array(size)].map((_, i) => r * size + i));
    }
    // Columns
    for (let c = 0; c < size; c++) {
      combos.push([...Array(size)].map((_, i) => i * size + c));
    }
    // Diagonals
    combos.push([...Array(size)].map((_, i) => i * size + i));
    combos.push([...Array(size)].map((_, i) => i * size + (size - 1 - i)));

    return combos;
  }

  function handleMove(index) {
    if (!gameActive || gameState[index]) return;

    gameState[index] = currentPlayer;
    renderBoard();

    if (checkWin(currentPlayer)) {
      endGame(`${currentPlayer} Wins!`);
      return;
    } else if (gameState.every(cell => cell)) {
      endGame('Draw!');
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();

    if (vsAI && currentPlayer === 'O' && gameActive) {
      setTimeout(aiMove, 300);
    }
  }

  function aiMove() {
    const emptyIndices = gameState
      .map((val, i) => (val === null ? i : null))
      .filter(i => i !== null);

    const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    handleMove(move);
  }

  function renderBoard() {
    document.querySelectorAll('.cell').forEach((cell, i) => {
      cell.textContent = gameState[i] || '';
      cell.classList.remove('highlight');
    });
  }

  function checkWin(player) {
    for (let combo of WINNING_COMBINATIONS) {
      if (combo.every(i => gameState[i] === player)) {
        highlightCells(combo);
        return true;
      }
    }
    return false;
  }

  function highlightCells(combo) {
    combo.forEach(i => {
      document.querySelector(`.cell[data-index="${i}"]`).classList.add('highlight');
    });
  }

  function endGame(message) {
    gameActive = false;
    showMessage(message);
    updateStatus();
  }

  function updateStatus() {
    if (!gameActive) {
      statusText.textContent = '';
      statusText.className = '';
    } else {
      statusText.textContent = `${currentPlayer}'s Turn`;
      if (currentPlayer === 'X') {
        statusText.className = 'status-text-x';
      } else {
        statusText.className = 'status-text-o';
      }
    }
  }
});
// All logic is already inside DOMContentLoaded and floating marks are generated via createFloatingMarks()
// No changes needed here.