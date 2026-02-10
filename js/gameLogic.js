// js/gameLogic.js

/**
 * All possible winning combinations
 */
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

/**
 * Attempts to make a move on the board
 * @param {number} index - Cell index (0–8)
 * @returns {object|null} result object or null if invalid
 */
function makeMove(index) {
  // Strict guards
  if (gameState.gameOver) return null;
  if (typeof index !== "number" || index < 0 || index > 8) return null;
  if (gameState.board[index] !== null) return null;

  // Apply move
  gameState.board[index] = gameState.currentPlayer;
  gameState.moveCount++;

  // Check winner
const result = checkWinner();

if (result) {
  gameState.gameOver = true;
  updateScore(result.winner);
  return {
    status: "WIN",
    winner: result.winner,
    combo: result.combo
  };
}


  // Check draw ONLY if no winner
  if (isDraw()) {
    gameState.gameOver = true;
    updateScore(null);
    return { status: "DRAW" };
  }

  // Continue game
  switchPlayer();
  return { status: "CONTINUE" };
}

/**
 * Checks if current board has a winner
 * @returns {string|null} "X", "O", or null
 */
function checkWinner() {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;

    if (
      gameState.board[a] &&
      gameState.board[a] === gameState.board[b] &&
      gameState.board[a] === gameState.board[c]
    ) {
      return {
        winner: gameState.board[a],
        combo
      };
    }
  }
  return null;
}
/**
 * Checks if the game is a draw
 * @returns {boolean}
 */
function isDraw() {
  // Draw only when board is full AND no winner
  return gameState.board.every(cell => cell !== null);
}
