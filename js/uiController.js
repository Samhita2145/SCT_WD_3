// js/uiController.js

/* =========================
   Restore config FIRST
   ========================= */
if (window.name) {
  Object.assign(gameConfig, JSON.parse(window.name));
}

let cells;
let roundEnding = false; //

/* =========================
   Initialize Game UI
   ========================= */
function initGameUI() {
  const boardElement = document.getElementById("gameBoard");
  if (!boardElement) return;

  cells = Array.from(document.querySelectorAll(".cell"));

  document.getElementById("playerXName").textContent = gameConfig.playerX;
  document.getElementById("playerOName").textContent = gameConfig.playerO;

  document.getElementById("modeText").textContent =
    gameConfig.mode === "HUMAN_AI"
      ? `Human vs AI (${gameConfig.difficulty})`
      : "Human vs Human";

  attachCellListeners();
  renderBoard();
  updateSidebar();
}

/* =========================
   Cell Click Handling
   ========================= */
function attachCellListeners() {
  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      handlePlayerMove(Number(cell.dataset.index));
    });
  });
}

function handlePlayerMove(index) {
  if (gameState.gameOver || roundEnding) return;

  const result = makeMove(index);
  if (!result) return;

  renderBoard();
  updateSidebar();

  if (result.status === "WIN" || result.status === "DRAW") {
    handleRoundEnd(result);
    return;
  }

  if (gameConfig.mode === "HUMAN_AI" && gameState.currentPlayer === "O") {
    triggerAIMove();
  }
}

/* =========================
   AI Turn
   ========================= */
function triggerAIMove() {
  const insightText = document.getElementById("aiInsightText");
  insightText.textContent = "AI is thinking...";

  setTimeout(() => {
    if (roundEnding) return;

    const aiMove = getAIMove();
    const result = makeMove(aiMove);
    if (!result) return;

    renderBoard();
    updateSidebar();
    updateAIInsight();

    if (result.status === "WIN" || result.status === "DRAW") {
      handleRoundEnd(result);
    }
  }, 600);
}

function updateAIInsight() {
  const insightText = document.getElementById("aiInsightText");

  if (gameConfig.difficulty === "EASY") {
    insightText.textContent = "AI chose a random valid move.";
  } else if (gameConfig.difficulty === "MEDIUM") {
    insightText.textContent = "AI attempted to win or block the opponent.";
  } else {
    insightText.textContent = "AI evaluated future board states.";
  }
}

/* =========================
   Round End Logic
   ========================= */
function handleRoundEnd(result) {
  if (roundEnding || gameState.moveCount === 0) return;
  roundEnding = true;

  if (result.status === "WIN" && result.combo) {
    highlightWinningCells(result.combo);
  }

  setTimeout(() => {
    const modal = document.getElementById("roundModal");
    const resultText = document.getElementById("roundResultText");
    const summaryText = document.getElementById("scoreSummaryText");

    resultText.textContent =
      result.status === "WIN"
        ? `${result.winner === "X" ? gameConfig.playerX : gameConfig.playerO} wins this round`
        : "Round Drawn";

    summaryText.textContent = `
      ${gameConfig.playerX}: ${gameState.scores.X} |
      ${gameConfig.playerO}: ${gameState.scores.O} |
      Draws: ${gameState.scores.draws}
    `;

    modal.classList.remove("hidden");

    document.getElementById("continueBtn").onclick = handleContinueRound;
    document.getElementById("endGameBtn").onclick = handleEndGame;
  }, 3000);
}

/* =========================
   Helpers
   ========================= */
function highlightWinningCells(combo) {
  combo.forEach(index => {
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    if (cell) cell.classList.add("win");
  });
}

function clearWinHighlights() {
  document.querySelectorAll(".cell.win").forEach(cell => {
    cell.classList.remove("win");
  });
}

/* =========================
   Actions
   ========================= */
function handleContinueRound() {
  clearWinHighlights();
  document.getElementById("roundModal").classList.add("hidden");

  roundEnding = false;
  nextRound();
  resetBoard();
  renderBoard();
  updateSidebar();
}

function handleEndGame() {
  sessionStorage.setItem(
    "matchSummary",
    JSON.stringify({
      roundsPlayed:
        gameState.scores.X +
        gameState.scores.O +
        gameState.scores.draws,
      scores: gameState.scores
    })
  );

  window.location.href = "result.html";
}

/* =========================
   Rendering
   ========================= */
function renderBoard() {
  cells.forEach((cell, index) => {
    cell.textContent = gameState.board[index] || "";
    cell.classList.toggle("disabled", gameState.board[index] !== null);
  });
}

function updateSidebar() {
  document.getElementById("roundText").textContent = `Round ${gameState.round}`;

  document.getElementById("turnText").textContent =
    gameState.currentPlayer === "X"
      ? `${gameConfig.playerX} (X)`
      : `${gameConfig.playerO} (O)`;

  document.getElementById("scoreX").textContent = gameState.scores.X;
  document.getElementById("scoreO").textContent = gameState.scores.O;
  document.getElementById("scoreDraw").textContent = gameState.scores.draws;
}

/* =========================
   Sidebar Controls
   ========================= */
function initSidebarControls() {
  document.getElementById("restartRoundBtn")?.addEventListener("click", () => {
    clearWinHighlights();
    roundEnding = false;
    resetBoard();
    renderBoard();
    updateSidebar();
  });

  document.getElementById("endMatchBtn")?.addEventListener("click", handleEndGame);
}

/* =========================
   Init
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  initGameUI();
  initSidebarControls();
});
