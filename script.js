let flags = [];
let remainingFlags;
let currentFlag;
let correctGuesses = 0;
let incorrectGuesses = 0;
let timerInterval;
let timer = 0;
let gameMode = "normal";

// Event listeners for controls
document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("reset-button").addEventListener("click", resetGame);
document.getElementById("country-input").addEventListener("change", checkGuess);
document.getElementById("skip-button").addEventListener("click", skipFlag);
document.getElementById("start-button").focus();

// Event listeners to select game mode
document.getElementById("normalselect").addEventListener("change", () => {
  gameMode = "normal";
});
document.getElementById("countdownselect").addEventListener("change", () => {
  gameMode = "countdown";
});

// Fetch the flag data from flags.json
fetch("flags.json")
  .then((response) => response.json())
  .then((data) => {
    flags = data;
  });

function startGame() {
  remainingFlags = [...flags];
  correctGuesses = 0;
  incorrectGuesses = 0;
  updateCorrectGuesses();
  updateIncorrectGuesses();
  pickNewFlag();
  document.getElementById("start-button").style.display = "none";
  document.getElementById("flag-container").style.display = "flex";
  if (gameMode === "countdown") {
    timer = 60;
    document.getElementById("timer").innerText = timer;
  } else {
    timer = 0;
  }
  startTimer();
  document.getElementById("playbuttons").style.display = "flex";
  document.getElementById("infotext").style.display = "block";
  document.getElementById("country-input").focus();
  document.getElementById("prevanswer").innerHTML = "";
  document.getElementById("modeselect").style.display = "none";
}

function resetGame() {
  document.getElementById("playbuttons").style.display = "none";
  document.getElementById("infotext").style.display = "none";
  remainingFlags = [];
  currentFlag = undefined;
  correctGuesses = 0;
  incorrectGuesses = 0;
  timer = 0;
  updateCorrectGuesses();
  updateIncorrectGuesses();
  document.querySelector(".flag-img").src = "";
  document.getElementById("country-input").style.borderBottomColor = "#888";
  document.getElementById("country-input").value = "";
  document.getElementById("start-button").style.display = "flex";
  document.getElementById("flag-container").style.display = "none";
  stopTimer();
  document.getElementById("start-button").focus();
  document.getElementById("modeselect").style.display = "block";
}

function startTimer() {
  timerInterval = setInterval(function () {
    if (gameMode === "countdown") {
      timer--;
      if (timer <= 0) {
        endGame();
        return;
      }
    } else {
      timer++;
    }
    document.getElementById("timer").innerText = timer;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateIncorrectGuesses() {
  document.getElementById("incorrect-guesses").innerText = incorrectGuesses;
}

function skipFlag() {
  if (remainingFlags.length > 0) {
    incorrectGuesses++;
    document.getElementById("country-input").style.borderBottomColor = "#888";
    document.getElementById("prevanswer").innerHTML =
      "The previous flag was: " + currentFlag.country;
    document.getElementById("prevanswer").style.color = "#d95d55";
    updateIncorrectGuesses();
    pickNewFlag();
    document.getElementById("country-input").value = "";
    document.getElementById("country-input").focus();
  }
}

function pickNewFlag() {
  const randomIndex = Math.floor(Math.random() * remainingFlags.length);
  currentFlag = remainingFlags[randomIndex];
  remainingFlags.splice(randomIndex, 1);
  document.querySelector(".flag-img").src = currentFlag.imageUrl;
}

function checkGuess() {
  const input = document.getElementById("country-input");
  if (
    input.value.toLowerCase() === currentFlag.country.toLowerCase() ||
    currentFlag.alternatives.includes(input.value)
  ) {
    correctGuesses++;
    updateCorrectGuesses();
    input.value = "";
    input.style.borderBottomColor = "#888";
    document.getElementById("prevanswer").innerHTML =
      "Correct, the flag was: " + currentFlag.country;
    document.getElementById("prevanswer").style.color = "#67e674";
    if (remainingFlags.length > 0) {
      pickNewFlag();
    } else {
      document.querySelector(".flag-img").src = "";
      endGame();
      document.getElementById("playbuttons").style.display = "none";
      document.getElementById("infotext").style.display = "none";
      document.getElementById("start-button").style.display = "flex";
      document.getElementById("flag-container").style.display = "none";
    }
  } else {
    input.style.borderBottomColor = "#cf2929";
  }
}

function updateCorrectGuesses() {
  document.getElementById("correct-guesses").innerText = correctGuesses;
}

function endGame() {
  stopTimer();
  if (gameMode === "countdown") {
    alert(
      `Wow! In 60 seconds you got ${correctGuesses} correct flags and skipped ${incorrectGuesses} flags.`
    );
  } else {
    alert(
      `You've finished in ${timer} seconds with ${incorrectGuesses} skips and ${correctGuesses} correct guesses!`
    );
  }
  resetGame();
}
