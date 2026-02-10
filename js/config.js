// js/config.js

/**
 * Holds the configuration selected on the intro page
 * Acts as a shared config across pages
 */
const gameConfig = {
  mode: "HUMAN_HUMAN",     // HUMAN_HUMAN | HUMAN_AI
  difficulty: "EASY",      // EASY | MEDIUM | HARD
  playerX: "Player X",
  playerO: "Player O"
};

/* =========================
   Read values from UI
   ========================= */
function loadConfigFromUI() {
  const selectedMode =
    document.querySelector('input[name="mode"]:checked')?.value || "HUMAN_HUMAN";

  const selectedDifficulty =
    document.querySelector('input[name="difficulty"]:checked')?.value || "EASY";

  const playerXInput = document.getElementById("playerX").value.trim();
  const playerOInput = document.getElementById("playerO").value.trim();

  gameConfig.mode = selectedMode;
  gameConfig.difficulty = selectedDifficulty;

  gameConfig.playerX = playerXInput !== "" ? playerXInput : "Player X";

  if (gameConfig.mode === "HUMAN_AI") {
    gameConfig.playerO = "MindBot";
  } else {
    gameConfig.playerO = playerOInput !== "" ? playerOInput : "Player O";
  }

  // 🔐 Store config for navigation
  window.name = JSON.stringify(gameConfig);
}

/* =========================
   Handle mode switching UI
   ========================= */
function handleModeChange() {
  const modeInputs = document.querySelectorAll('input[name="mode"]');
  const aiSection = document.getElementById("aiDifficultySection");
  const playerOInput = document.getElementById("playerO");

  // Initial state (page load)
  aiSection.style.display = "none";

  modeInputs.forEach(input => {
    input.addEventListener("change", () => {
      if (input.value === "HUMAN_AI") {
        aiSection.style.display = "block";
        playerOInput.value = "MindBot";
        playerOInput.disabled = true;
      } else {
        aiSection.style.display = "none";
        playerOInput.value = "";
        playerOInput.disabled = false;
      }
    });
  });
}

/* =========================
   Init config page
   ========================= */
function initConfigPage() {
  const startBtn = document.getElementById("startGameBtn");
  if (!startBtn) return;

  handleModeChange();

  startBtn.addEventListener("click", () => {
    loadConfigFromUI();
    window.location.href = "game.html";
  });
}

document.addEventListener("DOMContentLoaded", initConfigPage);
