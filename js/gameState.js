// js/gameState.js

/**
 * Represents the current game session state.
 * Single source of truth for the match.
 */

const gameState = {
  board: Array(9).fill(null),   // 3x3 board
  currentPlayer: "X",           // X always starts
  round: 1,
  gameOver: false,
  moveCount: 0,                 // Moves in current round

  scores: {
    X: 0,
    O: 0,
    draws: 0
  }
};

/**
 * Resets the board for a new round
 * Scores and round number are preserved
 */
function resetBoard() {
  gameState.board = Array(9).fill(null);
  gameState.currentPlayer = "X";
  gameState.gameOver = false;
  gameState.moveCount = 0;
}

/**
 * Advances the round counter
 */
function nextRound() {
  gameState.round += 1;
}

/**
 * Updates score based on result
 * @param {string|null} winner - "X", "O", or null for draw
 */
function updateScore(winner) {
  if (winner === "X") {
    gameState.scores.X += 1;
  } else if (winner === "O") {
    gameState.scores.O += 1;
  } else {
    gameState.scores.draws += 1;
  }
}

/**
 * Switches current player
 */
function switchPlayer() {
  gameState.currentPlayer =
    gameState.currentPlayer === "X" ? "O" : "X";
}

/**
 * Fully resets the session
 * Used when going Home or Play Again
 */
function resetSession() {
  resetBoard();
  gameState.round = 1;
  gameState.scores = { X: 0, O: 0, draws: 0 };
}
