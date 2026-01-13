let gameMode = null; // null | "menu" | "rps" | "ttt"
let tttBoard = Array(9).fill(null);
let tttScores = { user: 0, bot: 0 }; // Track wins for Tic Tac Toe

const form = document.getElementById("form");
const input = document.getElementById("input");
const chat = document.getElementById("chat");

form.addEventListener("submit", e => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  addMessage("You", text, "right");
  input.value = "";

  setTimeout(() => {
    botReply(text);
  }, 700);
});

function openSettings() {
    document.getElementById("settings").style.display = "flex";
  }
  
  function closeSettings() {
    document.getElementById("settings").style.display = "none";
  }

function addMessage(name, text, side) {
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img">
        <img src="${side === "right" ? "img 1.PNG" : "img 2.PNG"}">
      </div>
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${new Date().toLocaleTimeString()}</div>
        </div>
        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  chat.insertAdjacentHTML("beforeend", msgHTML);
  chat.scrollTop = chat.scrollHeight;
}

function showGameMenu() {
    gameMode = "menu";
    const menu = `
      🎮 <b>Choose a game:</b><br><br>
      <button onclick="startRPS()">✊ Rock Paper Scissors</button><br><br>
      <button onclick="startTTT()">❌⭕ Tic Tac Toe</button>
    `;
    addCustomMessage("Bot", menu);
  }

function showTicTacToe() {
    let gridHTML = `
      <div class="ttt-grid">
        ${tttBoard.map((cell, i) => `
          <button class="ttt-cell" onclick="playerMove(${i})">
            ${cell ? cell : ""}
          </button>
        `).join("")}
      </div>
      <p class="ttt-text">You are ❌. Click a cell.</p>
    `;
  
    addCustomMessage("Bot", gridHTML);
  }

  function playerMove(index) {
    if (gameMode !== "ttt" || tttBoard[index]) return;
  
    tttBoard[index] = "❌";
    updateTicTacToe();
  
    if (checkWinner("❌")) {
      endTicTacToe("You win 🎉");
      return;
    }
  
    if (!tttBoard.includes(null)) {
      endTicTacToe("It's a draw 😐");
      return;
    }
  
    setTimeout(botMove, 500);
  }

  function botMove() {
    let emptyCells = tttBoard
      .map((v, i) => v === null ? i : null)
      .filter(v => v !== null);
  
    let move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    tttBoard[move] = "⭕";
  
    updateTicTacToe();
  
    if (checkWinner("⭕")) {
      endTicTacToe("Bot wins 😄");
    }
  }

  function updateTicTacToe() {
    showTicTacToe();
  }
  
  function checkWinner(player) {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return wins.some(combo =>
      combo.every(i => tttBoard[i] === player)
    );
  }
  
  function endTicTacToe(message) {
    // Update scores
    if (message.includes("You win")) tttScores.user++;
    else if (message.includes("Bot wins")) tttScores.bot++;
  
    gameMode = null;
    addMessage(
      "Bot",
      `${message} <br>Score: You ${tttScores.user} - Bot ${tttScores.bot}`,
      "left"
    );
  
    // Show reset button
    const resetBtnHTML = `
      <button class="game-btn" onclick="resetTTT()">🔄 Restart Tic Tac Toe</button>
    `;
    addCustomMessage("Bot", resetBtnHTML);
  }

  function resetTTT() {
    tttBoard = Array(9).fill(null);
    gameMode = "ttt";
    showTicTacToe(); // Show empty board
    addMessage(
      "Bot",
      `Tic Tac Toe restarted! <br>Score: You ${tttScores.user} - Bot ${tttScores.bot}`,
      "left"
    );
  }

  function addCustomMessage(name, html) {
    const msgHTML = `
      <div class="msg left-msg">
        <div class="msg-bubble">
          <div class="msg-info">
            <div class="msg-info-name">${name}</div>
          </div>
          <div class="msg-text">${html}</div>
        </div>
      </div>
    `;
    chat.insertAdjacentHTML("beforeend", msgHTML);
    chat.scrollTop = chat.scrollHeight;
  }

  // Show a menu with clickable game buttons
function showGameButtons() {
    gameMode = "menu";
    const menuHTML = `
      🎮 <b>Choose a game:</b><br><br>
      <button class="game-btn" onclick="startTTT()">❌⭕ Tic Tac Toe</button>
      <button class="game-btn" onclick="startRPS()">✊📄✂️ Rock Paper Scissors</button>
    `;
    addCustomMessage("Bot", menuHTML);
  }

  function startTTT() {
    gameMode = "ttt";
    tttBoard = Array(9).fill(null);
    showTicTacToe();
  }
  
  function startRPS() {
    startRPSButtons();
  }

  function playRPS(userChoice) {
    const choices = ["rock", "paper", "scissors"];
    const botChoice = choices[Math.floor(Math.random() * 3)];
    let result = "";
  
    if (userChoice === botChoice) result = "It's a tie 😐";
    else if (
      (userChoice === "rock" && botChoice === "scissors") ||
      (userChoice === "paper" && botChoice === "rock") ||
      (userChoice === "scissors" && botChoice === "paper")
    ) {
      result = "You win 🎉";
      rpsScores.user++;
    } else {
      result = "I win 😄";
      rpsScores.bot++;
    }
  
    addMessage(
      "Bot",
      `You chose <b>${userChoice}</b><br>I chose <b>${botChoice}</b><br>${result}`,
      "left"
    );
  
    // Show buttons again for next round
    startRPSButtons();
  }

function botReply(userText) {
    const text = userText
      .toLowerCase()
      .replace(/[^\w\s]/gi, "");
  
    let reply = "";

// Play a game
if (text.includes("play a game") || text.includes("game")) {
    showGameButtons();
    return;
}
  
  // Short commands
  if (text === "ttt") {
    startTTT();
    return;
  }
  
  if (text === "rps") {
    startRPS();
    return;
  }

    // Exit any game
if (text === "exit game") {
    gameMode = null;
    tttBoard = Array(9).fill(null);
    addMessage("Bot", "Game exited 👍 Back to chat mode.", "left");
    return;
  }
  
  // Start Tic Tac Toe
  if (text.includes("tic tac toe")) {
    gameMode = "ttt";
    tttBoard = Array(9).fill(null);
    showTicTacToe();
    return;
  }

  // RPS game logic
if (gameMode === "rps") {
    const choices = ["rock", "paper", "scissors"];
    if (!choices.includes(text)) {
      addMessage("Bot", "Choose rock, paper, or scissors ✊📄✂️", "left");
      return;
    }
  
    const botChoice = choices[Math.floor(Math.random() * 3)];
    let result = "";
  
    if (text === botChoice) result = "It's a tie 😐";
    else if (
      (text === "rock" && botChoice === "scissors") ||
      (text === "paper" && botChoice === "rock") ||
      (text === "scissors" && botChoice === "paper")
    ) result = "You win 🎉";
    else result = "I win 😄";
  
    addMessage(
      "Bot",
      `You chose <b>${text}</b><br>I chose <b>${botChoice}</b><br>${result}`,
      "left"
    );
  
    addMessage(
      "Bot",
      "Type <b>rps</b> to play again or <b>exit game</b> to quit.",
      "left"
    );
  
    return;
  }
  
    /* ---------- GREETINGS ---------- */
    if (/(hi|hello|hey|good morning|good evening)/.test(text)) {
      reply = "Hello 😊 How can I help you today?";
    }
  
    /* ---------- HOW ARE YOU ---------- */
    else if (/how (are|r) (you|u)/.test(text)) {
      reply = "I'm doing great! Ready to talk about animation 🎬";
    }
  
    /* ---------- JOKES ---------- */
    else if (/joke|funny|make me laugh/.test(text)) {

        const animationJokes = [
          "Why did the animator go broke? Because they worked frame by frame 😄",
          "Why don’t animators argue? They just let things slide.",
          "Animation is fun… until the render crashes 😭",
          "Why was the keyframe sad? It had no easing."
        ];
      
        const randomJokes = [
          "Why don’t scientists trust atoms? Because they make up everything 😂",
          "I told my computer I needed a break… now it won’t stop sending me KitKats.",
          "Why was six afraid of seven? Because seven ate nine 😆",
          "Why did the math book look sad? Too many problems.",
          "I tried to catch fog yesterday… Mist."
        ];
      
        // Mix both joke types
        const allJokes = [...animationJokes, ...randomJokes];
      
        reply = allJokes[Math.floor(Math.random() * allJokes.length)];
      }
  
    /* ---------- ANIMATION ---------- */
    else if (/animation|animator|animate/.test(text)) {
      reply =
        "Animation is the art of creating motion by displaying images in sequence. It can be 2D, 3D, stop-motion, or motion graphics.";
    }
  
    else if (/12 principles/.test(text)) {
      reply =
        "The 12 principles of animation include squash & stretch, anticipation, staging, timing, easing, and follow-through.";
    }
  
    else if (/fps|frame rate/.test(text)) {
      reply =
        "FPS means frames per second. Common animation frame rates are 12, 24, and 30 FPS.";
    }
  
    else if (/keyframe/.test(text)) {
      reply =
        "A keyframe defines an important position or value in an animation timeline.";
    }
  
    else if (/easing|ease in|ease out/.test(text)) {
      reply =
        "Easing makes motion feel natural by controlling acceleration and deceleration.";
    }
  
    /* ---------- GENERAL KNOWLEDGE ---------- */
    else if (/what is gravity/.test(text)) {
      reply =
        "Gravity is the force that pulls objects toward each other, especially toward the Earth.";
    }
  
    else if (/what is ai|artificial intelligence/.test(text)) {
      reply =
        "Artificial Intelligence is when machines are designed to simulate human intelligence.";
    }
  
    else if (/what is computer/.test(text)) {
      reply =
        "A computer is an electronic device that processes data and performs tasks using software.";
    }
  
    /* ---------- GOODBYE ---------- */
    else if (/bye|goodbye|see you/.test(text)) {
      reply = "Goodbye 👋 Keep animating!";
    }
  
    /* ---------- SMART FALLBACK ---------- */
    else {
      const fallback = [
        "That sounds interesting! Can you ask it another way?",
        "I’m still learning 🤖 Try asking about animation or jokes!",
        "I may not know everything yet, but I know animation 🎬",
        "Try asking me something like: 'Tell me a joke' or 'What is FPS?'"
      ];
      reply = fallback[Math.floor(Math.random() * fallback.length)];
    }
  
    addMessage("Bot", reply, "left");
  }

  let rpsScores = { user: 0, bot: 0 }; // Keep track of scores

  function startRPSButtons() {
    gameMode = "rps";
    const rpsHTML = `
      🎮 <b>Rock Paper Scissors!</b><br>
      <button class="game-btn" onclick="playRPS('rock')">✊ Rock</button>
      <button class="game-btn" onclick="playRPS('paper')">📄 Paper</button>
      <button class="game-btn" onclick="playRPS('scissors')">✂️ Scissors</button>
      <br><br>
      <button class="game-btn" onclick="resetRPSScores()">🔄 Reset Scores</button>
      <p>Score: You ${rpsScores.user} - Bot ${rpsScores.bot}</p>
    `;
    addCustomMessage("Bot", rpsHTML);
  }
  
  function playRPS(userChoice) {
    const choices = ["rock", "paper", "scissors"];
    const botChoice = choices[Math.floor(Math.random() * 3)];
    let result = "";
  
    if (userChoice === botChoice) result = "It's a tie 😐";
    else if (
      (userChoice === "rock" && botChoice === "scissors") ||
      (userChoice === "paper" && botChoice === "rock") ||
      (userChoice === "scissors" && botChoice === "paper")
    ) {
      result = "You win 🎉";
      rpsScores.user++;
    } else {
      result = "I win 😄";
      rpsScores.bot++;
    }
  
    addMessage(
      "Bot",
      `You chose <b>${userChoice}</b><br>I chose <b>${botChoice}</b><br>${result}`,
      "left"
    );
  
    // Show buttons again for next round, with updated scores
    startRPSButtons();
  }
  
  function resetRPSScores() {
    rpsScores.user = 0;
    rpsScores.bot = 0;
    addMessage("Bot", "RPS scores have been reset! 🔄", "left");
    startRPSButtons(); // Show buttons again with reset scores
  }
