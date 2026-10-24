
/* =========================================
   ELEMENTOS PRINCIPAIS
========================================= */

const themeButton = document.getElementById("theme-toggle");
const languageButton = document.getElementById("language-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const logo = document.querySelector(".site-logo");
const nav = document.querySelector(".site-nav");

/* =========================================
   PREFERÊNCIAS
========================================= */

function readPreference(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Continua funcionando sem armazenamento local.
  }
}

/* =========================================
   TEMA E IDIOMA
========================================= */

function currentLanguage() {
  return document.documentElement.lang === "en" ? "en" : "pt";
}

function updateControls() {
  const isDark =
    document.documentElement.dataset.theme === "dark";

  const isEnglish = currentLanguage() === "en";

  themeButton.textContent = isDark ? "☀" : "☾";

  const themeLabel = isEnglish
    ? (isDark ? "Activate light theme" : "Activate dark theme")
    : (isDark ? "Ativar tema claro" : "Ativar tema escuro");

  themeButton.setAttribute("aria-label", themeLabel);
  themeButton.setAttribute("title", themeLabel);

  languageButton.textContent = isEnglish ? "PT" : "EN";

  languageButton.setAttribute(
    "aria-label",
    isEnglish ? "Mudar para português" : "Switch to English"
  );

  logo.setAttribute(
    "aria-label",
    isEnglish ? "Back to top" : "Voltar ao início"
  );

  nav.setAttribute(
    "aria-label",
    isEnglish ? "Main navigation" : "Navegação principal"
  );
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  savePreference("theme", theme);

  updateControls();
  drawSnake();
}

function setLanguage(language) {
  const isEnglish = language === "en";

  document.documentElement.lang =
    isEnglish ? "en" : "pt-BR";

  document.querySelectorAll("[data-pt][data-en]").forEach((element) => {
    element.textContent = isEnglish
      ? element.dataset.en
      : element.dataset.pt;
  });

  savePreference("language", language);

  updateControls();
  refreshSudokuStatus();
  refreshSnakeStatus();
  updateSudokuAccessibility();
  updateSnakeButton();
  drawSnake();
}

/* =========================================
   NAVEGAÇÃO
========================================= */

function setActiveSection(sectionId) {
  navLinks.forEach((link) => {
    const isActive =
      link.getAttribute("href") === `#${sectionId}`;

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function updateActiveSection() {
  if (window.scrollY < 60) {
    setActiveSection(null);
    return;
  }

  const reachedBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 5;

  if (reachedBottom) {
    setActiveSection("contato");
    return;
  }

  const referencePosition =
    window.scrollY + window.innerHeight * 0.35;

  let activeSection = null;

  ["sobre", "projetos", "contato"].forEach((id) => {
    const section = document.getElementById(id);

    if (section && section.offsetTop <= referencePosition) {
      activeSection = id;
    }
  });

  setActiveSection(activeSection);
}

/* =========================================
   CARTA DE SMITH
========================================= */

function drawSmithChart() {
  const grid = document.getElementById("smith-grid");
  if (!grid) return;

  const NS = "http://www.w3.org/2000/svg";
  const cx = 150;
  const cy = 150;
  const radius = 125;

  grid.replaceChildren();

  function addCircle(x, y, r, className) {
    const circle = document.createElementNS(NS, "circle");

    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", r);
    circle.setAttribute("class", className);

    grid.appendChild(circle);
  }

  [0.2, 0.5, 1, 2, 5].forEach((r) => {
    addCircle(
      cx + (r / (r + 1)) * radius,
      cy,
      radius / (r + 1),
      "smith-resistance"
    );
  });

  [0.2, 0.5, 1, 2, 5].forEach((x) => {
    const arcRadius = radius / x;

    addCircle(
      cx + radius,
      cy - arcRadius,
      arcRadius,
      "smith-reactance"
    );

    addCircle(
      cx + radius,
      cy + arcRadius,
      arcRadius,
      "smith-reactance"
    );
  });
}

/* =========================================
   ILUSTRAÇÃO DE SINAL
========================================= */

function drawProjectSignal() {
  const wave = document.getElementById("project-signal-wave");
  if (!wave) return;

  const points = [];
  const steps = 240;

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 180;
    const amplitude = 29 * (0.85 - 0.35 * x / 180);
    const y =
      60 - amplitude * Math.sin(2 * Math.PI * 5.2 * x / 180);

    points.push(
      `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`
    );
  }

  wave.setAttribute("d", points.join(" "));
}

/* =========================================
   ONDA AM
========================================= */

function drawFooterAMWave() {
  const wave = document.getElementById("footer-am-wave");
  if (!wave) return;

  const points = [];
  const width = 120;
  const steps = 360;

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const envelope =
      3 + 13 * Math.pow(Math.sin(Math.PI * x / width), 2);
    const carrier =
      Math.sin(2 * Math.PI * 8 * x / width);
    const y = 20 - envelope * carrier;

    points.push(
      `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`
    );
  }

  wave.setAttribute("d", points.join(" "));
}

/* =========================================
   SELETOR DE JOGOS
========================================= */

const sudokuView = document.getElementById("sudoku-game");
const snakeView = document.getElementById("snake-game");

const selectSudokuButton = document.getElementById("select-sudoku");
const selectSnakeButton = document.getElementById("select-snake");

const gameTitle = document.getElementById("game-title");

let activeGame = "sudoku";

function selectGame(game) {
  if (game !== "sudoku" && game !== "snake") return;

  if (game !== "snake") {
    pauseSnake();
  }

  activeGame = game;

  sudokuView.hidden = game !== "sudoku";
  snakeView.hidden = game !== "snake";

  selectSudokuButton.classList.toggle(
    "is-selected",
    game === "sudoku"
  );

  selectSnakeButton.classList.toggle(
    "is-selected",
    game === "snake"
  );

  selectSudokuButton.setAttribute(
    "aria-pressed",
    String(game === "sudoku")
  );

  selectSnakeButton.setAttribute(
    "aria-pressed",
    String(game === "snake")
  );

  gameTitle.innerHTML =
    `${game === "sudoku" ? "Sudoku" : "Snake"}<span class="game-title-dot">.</span>`;

  if (game === "snake") {
    drawSnake();
  }
}

/* =========================================
   SUDOKU 4×4
========================================= */

const sudokuBoard = document.getElementById("sudoku-board");
const sudokuStatus = document.getElementById("sudoku-status");

const sudokuCheckButton = document.getElementById("sudoku-check");
const sudokuResetButton = document.getElementById("sudoku-reset");
const sudokuNewButton = document.getElementById("sudoku-new");

let sudokuPuzzle = [];
let sudokuSolution = [];
let sudokuStatusKey = "ready";

const sudokuMessages = {
  ready: {
    pt: "Digite de 1 a 4.",
    en: "Enter 1 to 4."
  },
  incomplete: {
    pt: "Faltam células.",
    en: "Cells missing."
  },
  error: {
    pt: "Há erros.",
    en: "Some errors."
  },
  success: {
    pt: "Sudoku resolvido!",
    en: "Sudoku solved!"
  },
  new: {
    pt: "Novo desafio.",
    en: "New challenge."
  },
  reset: {
    pt: "Reiniciado.",
    en: "Reset."
  }
};

function refreshSudokuStatus() {
  const message =
    sudokuMessages[sudokuStatusKey] || sudokuMessages.ready;

  sudokuStatus.textContent = message[currentLanguage()];

  sudokuStatus.dataset.state =
    sudokuStatusKey === "error" ? "error" :
    sudokuStatusKey === "success" ? "success" : "normal";
}

function setSudokuStatus(key) {
  sudokuStatusKey = key;
  refreshSudokuStatus();
}

function shuffleArray(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function generateSudokuSolution() {
  const base = [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1]
  ];

  const digits = shuffleArray([1, 2, 3, 4]);
  const rowBands = shuffleArray([0, 1]);
  const colBands = shuffleArray([0, 1]);

  const rowOrder = rowBands.flatMap((band) =>
    shuffleArray([band * 2, band * 2 + 1])
  );

  const colOrder = colBands.flatMap((band) =>
    shuffleArray([band * 2, band * 2 + 1])
  );

  return rowOrder.map((row) =>
    colOrder.map((col) => digits[base[row][col] - 1])
  );
}

function canPlaceNumber(board, row, col, number) {
  for (let i = 0; i < 4; i++) {
    if (board[row][i] === number) return false;
    if (board[i][col] === number) return false;
  }

  const startRow = Math.floor(row / 2) * 2;
  const startCol = Math.floor(col / 2) * 2;

  for (let r = startRow; r < startRow + 2; r++) {
    for (let c = startCol; c < startCol + 2; c++) {
      if (board[r][c] === number) return false;
    }
  }

  return true;
}

function countSudokuSolutions(board, limit = 2) {
  let bestRow = -1;
  let bestCol = -1;
  let bestCandidates = null;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] !== 0) continue;

      const candidates = [];

      for (let number = 1; number <= 4; number++) {
        if (canPlaceNumber(board, row, col, number)) {
          candidates.push(number);
        }
      }

      if (candidates.length === 0) return 0;

      if (
        bestCandidates === null ||
        candidates.length < bestCandidates.length
      ) {
        bestRow = row;
        bestCol = col;
        bestCandidates = candidates;
      }

      if (bestCandidates.length === 1) break;
    }

    if (bestCandidates && bestCandidates.length === 1) break;
  }

  if (bestRow === -1) return 1;

  let solutions = 0;

  for (const number of bestCandidates) {
    board[bestRow][bestCol] = number;

    solutions += countSudokuSolutions(
      board,
      limit - solutions
    );

    board[bestRow][bestCol] = 0;

    if (solutions >= limit) return solutions;
  }

  return solutions;
}

function generateSudokuPuzzle(solution) {
  const puzzle = solution.map((row) => [...row]);

  const positions = shuffleArray(
    Array.from({ length: 16 }, (_, index) => index)
  );

  let clues = 16;
  const targetClues = 7;

  for (const position of positions) {
    if (clues <= targetClues) break;

    const row = Math.floor(position / 4);
    const col = position % 4;
    const previous = puzzle[row][col];

    puzzle[row][col] = 0;

    const copy = puzzle.map((line) => [...line]);

    if (countSudokuSolutions(copy, 2) === 1) {
      clues--;
    } else {
      puzzle[row][col] = previous;
    }
  }

  return puzzle;
}

function updateSudokuAccessibility() {
  const english = currentLanguage() === "en";

  sudokuBoard.setAttribute(
    "aria-label",
    english ? "4 by 4 Sudoku" : "Sudoku 4 por 4"
  );

  sudokuBoard.querySelectorAll(".sudoku-cell").forEach((cell) => {
    const row = Number(cell.dataset.row) + 1;
    const col = Number(cell.dataset.col) + 1;

    cell.setAttribute(
      "aria-label",
      english
        ? `Row ${row}, column ${col}`
        : `Linha ${row}, coluna ${col}`
    );
  });
}

function renderSudoku() {
  sudokuBoard.replaceChildren();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = sudokuPuzzle[row][col];
      const cell = document.createElement("input");

      cell.type = "text";
      cell.inputMode = "numeric";
      cell.maxLength = 1;
      cell.autocomplete = "off";
      cell.className = "sudoku-cell";
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (value !== 0) {
        cell.value = String(value);
        cell.readOnly = true;
        cell.classList.add("is-fixed");
      } else {
        cell.addEventListener("input", () => {
          cell.value = cell.value
            .replace(/[^1-4]/g, "")
            .slice(0, 1);

          sudokuBoard
            .querySelectorAll(".sudoku-cell")
            .forEach((item) => {
              item.classList.remove("is-error", "is-correct");
            });

          setSudokuStatus("ready");
        });

        cell.addEventListener("keydown", (event) => {
          const moves = {
            ArrowRight: [row, Math.min(col + 1, 3)],
            ArrowLeft: [row, Math.max(col - 1, 0)],
            ArrowDown: [Math.min(row + 1, 3), col],
            ArrowUp: [Math.max(row - 1, 0), col]
          };

          if (moves[event.key]) {
            event.preventDefault();
            focusSudokuCell(...moves[event.key]);
          }
        });
      }

      sudokuBoard.appendChild(cell);
    }
  }

  updateSudokuAccessibility();
}

function focusSudokuCell(row, col) {
  const cell = sudokuBoard.querySelector(
    `.sudoku-cell[data-row="${row}"][data-col="${col}"]`
  );

  if (cell) cell.focus();
}

function readSudokuBoard() {
  const board = Array.from(
    { length: 4 },
    () => Array(4).fill(0)
  );

  sudokuBoard.querySelectorAll(".sudoku-cell").forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    board[row][col] = Number(cell.value) || 0;
  });

  return board;
}

function checkSudoku() {
  const board = readSudokuBoard();

  let hasEmpty = false;
  let hasError = false;

  sudokuBoard.querySelectorAll(".sudoku-cell").forEach((cell) => {
    cell.classList.remove("is-error", "is-correct");

    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const value = board[row][col];

    if (value === 0) {
      hasEmpty = true;
      return;
    }

    if (value !== sudokuSolution[row][col]) {
      cell.classList.add("is-error");
      hasError = true;
    } else if (!cell.classList.contains("is-fixed")) {
      cell.classList.add("is-correct");
    }
  });

  if (hasError) {
    setSudokuStatus("error");
  } else if (hasEmpty) {
    setSudokuStatus("incomplete");
  } else {
    setSudokuStatus("success");
  }
}

function newSudokuGame() {
  sudokuSolution = generateSudokuSolution();
  sudokuPuzzle = generateSudokuPuzzle(sudokuSolution);

  renderSudoku();
  setSudokuStatus("new");
}

function resetSudokuGame() {
  if (!sudokuPuzzle.length) return;

  renderSudoku();
  setSudokuStatus("reset");
}

/* =========================================
   SNAKE
========================================= */

const snakeCanvas = document.getElementById("snake-canvas");
const snakeContext = snakeCanvas.getContext("2d");

const snakeStartButton = document.getElementById("snake-start");
const snakeResetButton = document.getElementById("snake-reset");
const snakePauseButton = document.getElementById("snake-pause");

const snakeScoreElement = document.getElementById("snake-score");
const snakeStatusElement = document.getElementById("snake-status");

const SNAKE_GRID = 11;
const SNAKE_CELL = 16;
const SNAKE_SPEED = 170;

let snake = [];
let snakeFood = null;
let snakeDirection = { x: 1, y: 0 };
let snakeNextDirection = { x: 1, y: 0 };
let snakeScore = 0;
let snakeTimer = null;
let snakeRunning = false;
let snakeGameOver = false;
let snakeStatusKey = "ready";
let snakeTurnQueued = false;

const snakeMessages = {
  ready: {
    pt: "Clique em Iniciar.",
    en: "Press Start."
  },
  playing: {
    pt: "Pegue os pontos.",
    en: "Collect food."
  },
  paused: {
    pt: "Jogo pausado.",
    en: "Game paused."
  },
  over: {
    pt: "Fim de jogo!",
    en: "Game over!"
  },
  won: {
    pt: "Você venceu!",
    en: "You win!"
  },
  reset: {
    pt: "Jogo reiniciado.",
    en: "Game reset."
  }
};

function refreshSnakeStatus() {
  const message =
    snakeMessages[snakeStatusKey] || snakeMessages.ready;

  snakeStatusElement.textContent =
    message[currentLanguage()];

  snakeStatusElement.dataset.state =
    snakeStatusKey === "over" ? "error" :
    snakeStatusKey === "won" ? "success" : "normal";
}

function setSnakeStatus(key) {
  snakeStatusKey = key;
  refreshSnakeStatus();
}

function updateSnakeButton() {
  const english = currentLanguage() === "en";

  snakeStartButton.textContent = snakeRunning
    ? (english ? "Playing" : "Jogando")
    : (english ? "Start" : "Iniciar");

  snakeStartButton.disabled = snakeRunning;

  snakePauseButton.textContent = snakeRunning
    ? (english ? "Pause" : "Pausar")
    : (english ? "Resume" : "Continuar");

  snakePauseButton.disabled =
    snakeGameOver ||
    (!snakeRunning && snakeStatusKey !== "paused");
}

function randomSnakeFood() {
  const empty = [];

  for (let y = 0; y < SNAKE_GRID; y++) {
    for (let x = 0; x < SNAKE_GRID; x++) {
      const occupied = snake.some(
        (part) => part.x === x && part.y === y
      );

      if (!occupied) empty.push({ x, y });
    }
  }

  if (empty.length === 0) return null;

  return empty[Math.floor(Math.random() * empty.length)];
}

function stopSnakeTimer() {
  if (snakeTimer !== null) {
    clearInterval(snakeTimer);
    snakeTimer = null;
  }
}

function resetSnake() {
  stopSnakeTimer();

  snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
  ];

  snakeDirection = { x: 1, y: 0 };
  snakeNextDirection = { x: 1, y: 0 };

  snakeScore = 0;
  snakeRunning = false;
  snakeGameOver = false;
  snakeTurnQueued = false;

  snakeFood = randomSnakeFood();

  snakeScoreElement.textContent = "00";

  setSnakeStatus("reset");
  updateSnakeButton();
  drawSnake();
}

function startSnake() {
  if (activeGame !== "snake") return;

  if (snakeGameOver) {
    resetSnake();
  }

  if (snakeRunning) return;

  snakeRunning = true;

  setSnakeStatus("playing");
  updateSnakeButton();

  stopSnakeTimer();
  snakeTimer = setInterval(stepSnake, SNAKE_SPEED);

  snakeCanvas.focus();
}

function pauseSnake() {
  if (!snakeRunning) return;

  snakeRunning = false;
  stopSnakeTimer();

  setSnakeStatus("paused");
  updateSnakeButton();
  drawSnake();
}

function toggleSnakePause() {
  if (snakeRunning) {
    pauseSnake();
  } else if (
    !snakeGameOver &&
    snakeStatusKey === "paused"
  ) {
    startSnake();
  }
}

function setSnakeDirection(direction) {
  if (!snakeRunning || snakeTurnQueued) return;

  const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  const next = directions[direction];
  if (!next) return;

  const reverse =
    next.x === -snakeDirection.x &&
    next.y === -snakeDirection.y;

  if (reverse) return;

  snakeNextDirection = next;
  snakeTurnQueued = true;
}

function stepSnake() {
  snakeDirection = { ...snakeNextDirection };
  snakeTurnQueued = false;

  const head = {
    x: snake[0].x + snakeDirection.x,
    y: snake[0].y + snakeDirection.y
  };

  const eating =
    snakeFood &&
    head.x === snakeFood.x &&
    head.y === snakeFood.y;

  const bodyToCheck = eating
    ? snake
    : snake.slice(0, -1);

  const hitWall =
    head.x < 0 ||
    head.y < 0 ||
    head.x >= SNAKE_GRID ||
    head.y >= SNAKE_GRID;

  const hitBody = bodyToCheck.some(
    (part) => part.x === head.x && part.y === head.y
  );

  if (hitWall || hitBody) {
    snakeGameOver = true;
    snakeRunning = false;
    stopSnakeTimer();

    setSnakeStatus("over");
    updateSnakeButton();
    drawSnake();
    return;
  }

  snake.unshift(head);

  if (eating) {
    snakeScore++;

    snakeScoreElement.textContent =
      String(snakeScore).padStart(2, "0");

    snakeFood = randomSnakeFood();

    if (!snakeFood) {
      snakeGameOver = true;
      snakeRunning = false;
      stopSnakeTimer();

      setSnakeStatus("won");
      updateSnakeButton();
      drawSnake();
      return;
    }
  } else {
    snake.pop();
  }

  drawSnake();
}

function drawSnake() {
  if (!snakeContext || snake.length === 0) return;

  const styles = getComputedStyle(document.documentElement);

  const background = styles
    .getPropertyValue("--background").trim();

  const accent = styles
    .getPropertyValue("--accent").trim();

  const border = styles
    .getPropertyValue("--border").trim();

  const error = styles
    .getPropertyValue("--error").trim();

  const text = styles
    .getPropertyValue("--text").trim();

  snakeContext.fillStyle = background;
  snakeContext.fillRect(0, 0, 176, 176);

  snakeContext.strokeStyle = border;
  snakeContext.globalAlpha = 0.28;
  snakeContext.lineWidth = 0.5;

  for (let i = 1; i < SNAKE_GRID; i++) {
    const position = i * SNAKE_CELL;

    snakeContext.beginPath();
    snakeContext.moveTo(position, 0);
    snakeContext.lineTo(position, 176);
    snakeContext.stroke();

    snakeContext.beginPath();
    snakeContext.moveTo(0, position);
    snakeContext.lineTo(176, position);
    snakeContext.stroke();
  }

  snakeContext.globalAlpha = 1;

  if (snakeFood) {
    snakeContext.fillStyle = error;
    snakeContext.beginPath();

    snakeContext.arc(
      snakeFood.x * SNAKE_CELL + 8,
      snakeFood.y * SNAKE_CELL + 8,
      5.5,
      0,
      Math.PI * 2
    );

    snakeContext.fill();
  }

  snake.forEach((part, index) => {
    snakeContext.fillStyle =
      index === 0 ? text : accent;

    snakeContext.fillRect(
      part.x * SNAKE_CELL + 1,
      part.y * SNAKE_CELL + 1,
      SNAKE_CELL - 2,
      SNAKE_CELL - 2
    );
  });

  if (snakeGameOver) {
    snakeContext.fillStyle = background;
    snakeContext.globalAlpha = 0.72;
    snakeContext.fillRect(0, 65, 176, 46);
    snakeContext.globalAlpha = 1;

    snakeContext.fillStyle = text;
    snakeContext.textAlign = "center";
    snakeContext.font = "bold 14px Arial";

    const message = snakeStatusKey === "won"
      ? (currentLanguage() === "en" ? "YOU WIN" : "VITÓRIA")
      : "GAME OVER";

    snakeContext.fillText(message, 88, 92);
  }
}

/* =========================================
   EVENTOS
========================================= */

themeButton.addEventListener("click", () => {
  const currentTheme =
    document.documentElement.dataset.theme;

  setTheme(
    currentTheme === "dark" ? "light" : "dark"
  );
});

languageButton.addEventListener("click", () => {
  setLanguage(
    currentLanguage() === "en" ? "pt" : "en"
  );
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActiveSection(
      link.getAttribute("href").slice(1)
    );
  });
});

logo.addEventListener("click", () => {
  setActiveSection(null);
});

window.addEventListener(
  "scroll",
  updateActiveSection,
  { passive: true }
);

window.addEventListener(
  "resize",
  updateActiveSection
);

selectSudokuButton.addEventListener("click", () => {
  selectGame("sudoku");
});

selectSnakeButton.addEventListener("click", () => {
  selectGame("snake");
});

sudokuCheckButton.addEventListener("click", checkSudoku);
sudokuResetButton.addEventListener("click", resetSudokuGame);
sudokuNewButton.addEventListener("click", newSudokuGame);

snakeStartButton.addEventListener("click", startSnake);
snakeResetButton.addEventListener("click", resetSnake);
snakePauseButton.addEventListener("click", toggleSnakePause);

document.addEventListener("keydown", (event) => {
  if (activeGame !== "snake") return;

  const target = event.target;

  if (
    target instanceof HTMLElement &&
    (
      target.matches("input, textarea, select") ||
      target.isContentEditable
    )
  ) {
    return;
  }

  const keys = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    s: "down",
    a: "left",
    d: "right"
  };

  const direction =
    keys[event.key] || keys[event.key.toLowerCase()];

  if (!direction || !snakeRunning) return;

  event.preventDefault();
  setSnakeDirection(direction);
});

document
  .querySelectorAll(".snake-touch-controls button")
  .forEach((button) => {
    button.addEventListener("click", () => {
      setSnakeDirection(button.dataset.direction);
    });
  });

document.addEventListener("visibilitychange", () => {
  if (document.hidden && snakeRunning) {
    pauseSnake();
  }
});

/* =========================================
   INICIALIZAÇÃO
========================================= */

const savedTheme =
  readPreference("theme", "dark") === "light"
    ? "light"
    : "dark";

const savedLanguage =
  readPreference("language", "pt") === "en"
    ? "en"
    : "pt";

setTheme(savedTheme);
setLanguage(savedLanguage);

drawSmithChart();
drawProjectSignal();
drawFooterAMWave();

newSudokuGame();
resetSnake();
selectGame("sudoku");

updateActiveSection();
