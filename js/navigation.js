// js/navigation.js

/* =========================
   Restore config safely
   ========================= */
if (window.name && typeof gameConfig !== "undefined") {
  Object.assign(gameConfig, JSON.parse(window.name));
}

/* =========================
   Initialize Result Page
   ========================= */
function initResultPage() {
  const winnerText = document.getElementById("winnerText");
  if (!winnerText) return;

  const summary = JSON.parse(sessionStorage.getItem("matchSummary"));
  if (!summary) {
    winnerText.textContent = "Match Summary Unavailable";
    return;
  }

  const { roundsPlayed, scores } = summary;
  const { X: xWins, O: oWins, draws } = scores;

  let winnerMessage = "Match Drawn 🤝";
  if (xWins > oWins) {
    winnerMessage = `Winner: ${gameConfig.playerX} 🏆`;
  } else if (oWins > xWins) {
    winnerMessage = `Winner: ${gameConfig.playerO} 🏆`;
  }

  winnerText.textContent = winnerMessage;

  document.getElementById("roundsPlayed").textContent = roundsPlayed;
  document.getElementById("finalPlayerX").textContent =
    `${gameConfig.playerX} Wins`;
  document.getElementById("finalPlayerO").textContent =
    `${gameConfig.playerO} Wins`;

  document.getElementById("finalScoreX").textContent = xWins;
  document.getElementById("finalScoreO").textContent = oWins;
  document.getElementById("finalScoreDraw").textContent = draws;

  initResultActions();
}

/* =========================
   Result Page Actions
   ========================= */
function initResultActions() {
  const goHomeBtn = document.getElementById("goHomeBtn");

  if (goHomeBtn) {
    goHomeBtn.addEventListener("click", () => {
      sessionStorage.clear();   // clear match summary
      window.name = "";         // clear config
      window.location.href = "index.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", initResultPage);
