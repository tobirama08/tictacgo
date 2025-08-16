const board = document.getElementById("board");
const statusText = document.getElementById("status");
let currentPlayer = "X";
let gameActive = true;
let mode = "pvp";
let gameState = ["", "", "", "", "", "", "", "", ""];
const clickSound = new Audio("https://www.soundjay.com/buttons/sounds/button-29.mp3");
const winSound = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
const drawSound = new Audio("https://www.soundjay.com/buttons/sounds/button-10.mp3");
function createBoard() {
  board.innerHTML = "";
  gameState = ["", "", "", "", "", "", "", "", ""];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
  }
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (gameState[index] !== "" || !gameActive) return;

  gameState[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  clickSound.play();
  checkResult();

  if (mode === "cpu" && gameActive && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function checkResult() {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  let roundWon = false;
  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    winSound.play();
    gameActive = false;
    return;
  }

  if (!gameState.includes("")) {
    statusText.textContent = "It's a draw!";
    drawSound.play();
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function computerMove() {
  let available = gameState.map((val, i) => val === "" ? i : null).filter(v => v !== null);
  let randomIndex = available[Math.floor(Math.random() * available.length)];
  const cell = document.querySelector(`[data-index='${randomIndex}']`);
  gameState[randomIndex] = currentPlayer;
  cell.textContent = currentPlayer;
  clickSound.play();
  checkResult();
}

function setMode(selectedMode) {
  mode = selectedMode;
  resetGame();
}

function resetGame() {
  currentPlayer = "X";
  gameActive = true;
  createBoard();
}

createBoard();
