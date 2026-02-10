// js/aiLogic.js

/**
 * Returns AI move based on selected difficulty
 */
function getAIMove() {
  switch (gameConfig.difficulty) {
    case "EASY":
      return getRandomMove();
    case "MEDIUM":
      return getMediumMove();
    case "HARD":
      return getBestMove(); // Minimax
    default:
      return getRandomMove();
  }
}

/* =========================
   EASY AI – Random Move
   ========================= */
function getRandomMove() {
  const availableMoves = getAvailableMoves();
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

/* =========================
   MEDIUM AI – Win or Block
   ========================= */
function getMediumMove() {
  // 1. Try to win
  for (let move of getAvailableMoves()) {
    gameState.board[move] = "O";
    if (checkWinner() === "O") {
      gameState.board[move] = null;
      return move;
    }
    gameState.board[move] = null;
  }

  // 2. Block opponent
  for (let move of getAvailableMoves()) {
    gameState.board[move] = "X";
    if (checkWinner() === "X") {
      gameState.board[move] = null;
      return move;
    }
    gameState.board[move] = null;
  }

  // 3. Otherwise random
  return getRandomMove();
}

/* =========================
   HARD AI – Minimax
   ========================= */
function getBestMove(board) {
for (let move of getAvailableMoves(board)) {
  board[move] = "O";
  if (checkWinnerForBoard(board) === "O") {
    board[move] = null;
    return move;
  }
  board[move] = null;
}

  let bestScore = -Infinity;
  let bestMove = null;

  for (let move of getPreferredMoves(board)) {
    board[move] = "O";
    const score = minimax(board, 0, false);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function minimax(board, depth, isMaximizing) {
  const winner = checkWinnerForBoard(board);

  // Aggressive scoring
  if (winner === "O") return 100 - depth;   // AI wins fast
  if (winner === "X") return depth - 100;   // Human loss punished
  if (getAvailableMoves(board).length === 0) return 0; // draw

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let move of getAvailableMoves(board)) {
      board[move] = "O";
      const score = minimax(board, depth + 1, false);
      board[move] = null;
      bestScore = Math.max(score, bestScore);
    }

    return bestScore;
  } else {
    let bestScore = Infinity;

    for (let move of getAvailableMoves(board)) {
      board[move] = "X";
      const score = minimax(board, depth + 1, true);
      board[move] = null;
      bestScore = Math.min(score, bestScore);
    }

    return bestScore;
  }
}


/* =========================
   Helpers
   ========================= */
   function getPreferredMoves(board) {
  const center = [4];
  const corners = [0, 2, 6, 8];
  const edges = [1, 3, 5, 7];

  const available = getAvailableMoves(board);

  return [
    ...center.filter(i => available.includes(i)),
    ...corners.filter(i => available.includes(i)),
    ...edges.filter(i => available.includes(i))
  ];
}

function getAvailableMoves() {
  return gameState.board
    .map((cell, index) => (cell === null ? index : null))
    .filter(index => index !== null);
}
