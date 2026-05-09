let board = [...Array(9).fill("")];
let currentPlayer = "X";
let gameActive = true;
let mode = "multi";
let scores = JSON.parse(localStorage.getItem("scores")) || {
  X: 0,
  O: 0,
  D: 0
};
const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];
const sounds = {
  click: new Audio("sounds/dog-clicker_IygBqAk.mp3"),
  win: new Audio("sounds/winner-price-is-right.mp3"),
  loss: new Audio("sounds/points-loss.mp3")
};
function playSound(type) {
  if (sounds[type]) {
    sounds[type].currentTime = 0;
    sounds[type].play().catch(() => {}); 
  }
}
function minimax(tempBoard, isMax) {
  const winner = getWinner(tempBoard);
  if (winner === "O") return 10;
  if (winner === "X") return -10;
  if (!tempBoard.includes("")) return 0;

  let bestScore = isMax ? -Infinity : Infinity;
  tempBoard.forEach((_, i) => {
    if (tempBoard[i] === "") {
      tempBoard[i] = isMax ? "O" : "X";
      const score = minimax(tempBoard, !isMax);
      tempBoard[i] = "";
      bestScore = isMax 
        ? Math.max(bestScore, score) 
        : Math.min(bestScore, score);
    }
  });
  return bestScore;
}
function bestMove() {
  let bestScore = -Infinity;
  let moveIndex = 0;
  board.forEach((_, i) => {
    if (board[i] === "") {
      board[i] = "O";
      const score = minimax(board, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        moveIndex = i;
      }
    }
  });
  return moveIndex;
}
function getWinner(currentBoard) {
  for (const [a, b, c] of winConditions) {
    if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
      return currentBoard[a];
    }
  }
  return null;
}
function render() {
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";
  board.forEach((value, index) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    if (value) cell.classList.add(value.toLowerCase());
    cell.textContent = value;
    cell.onclick = () => handleMove(index);
    boardElement.appendChild(cell);
  });
  highlightWinner();
}
function highlightWinner() {
  const boardElement = document.getElementById("board");
  winConditions.forEach(([a, b, c]) => {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      [a, b, c].forEach(i => {
        boardElement.children[i].classList.add("win");
      });
    }
  });
}
function handleMove(index) {
  if (!gameActive || board[index]) return;
  playSound("click");
  board[index] = currentPlayer;
  render();
  if (checkGameOver()) return;
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();

  if (mode === "ai" && currentPlayer === "O") {
    setTimeout(aiTurn, 400);
  }
}
function aiTurn() {
  if (!gameActive) return;
  const move = bestMove();
  board[move] = "O";
  playSound("click");
  render();
  if (checkGameOver()) return;
  currentPlayer = "X";
  updateStatus();
}
function checkGameOver() {
  const winner = getWinner(board);
  if (winner) {
    gameActive = false;
    scores[winner]++;
    saveScores();
    updateScoresUI();
    document.getElementById("status").textContent = `Player ${winner} Wins!`;
    playSound("win");
    return true;
  }

  if (!board.includes("")) {
    gameActive = false;
    scores.D++;
    saveScores();
    updateScoresUI();
    document.getElementById("status").textContent = "It's a Draw!";
    playSound("loss");
    return true;
  }
  return false;
}
function updateStatus() {
  document.getElementById("status").textContent = `Player ${currentPlayer}'s Turn`;
}
function updateScoresUI() {
  document.getElementById("sx").textContent = scores.X;
  document.getElementById("so").textContent = scores.O;
  document.getElementById("sd").textContent = scores.D;
}
function saveScores() {
  localStorage.setItem("scores", JSON.stringify(scores));
}
function restart() {
  board = [...Array(9).fill("")];
  currentPlayer = "X";
  gameActive = true;
  updateStatus();
  render();
}
function resetScores() {
  scores = { X: 0, O: 0, D: 0 };
  saveScores();
  updateScoresUI();
}
function setMode(newMode) {
  mode = newMode;
  document.getElementById("m2").classList.toggle("active", newMode === "multi");
  document.getElementById("mai").classList.toggle("active", newMode === "ai");
  restart();
}
updateScoresUI();
restart();
