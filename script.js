let flags = [];
let remainingFlags;
let remainingUSStates = [];
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
document.getElementById("hardselect").addEventListener("change", () => {
  gameMode = "hard";
});
document.getElementById("capitalselect").addEventListener("change", () => {
  gameMode = "capital";
});
document.getElementById("usstatesselect").addEventListener("change", () => {
  gameMode = "usstates";
});

// Fetch the flag data from flags.json
fetch("flags.json")
  .then((response) => response.json())
  .then((data) => {
    flags = data;
  });

// Fetch the US State flag data from us_states.json
fetch("us_states.json")
  .then((response) => response.json())
  .then((data) => {
    usStates = data;
  });

// Define random element function for the states mode
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function startGame() {
  remainingFlags = [...flags];
  remainingUSStates = [...usStates];
  correctGuesses = 0;
  incorrectGuesses = 0;
  updateCorrectGuesses();
  updateIncorrectGuesses();
  pickNewFlag();
  document.getElementById("start-button").style.display = "none";
  document.getElementById("flag-container").style.display = "flex";
  // Set the input box text differently if its capital mode
  if (gameMode === "capital") {
    document.getElementById("country-input").placeholder =
      "Type the capital city";
  } else if (gameMode === "usstates") {
    document.getElementById("country-input").placeholder = "Type the US State";
  } else {
    document.getElementById("country-input").placeholder =
      "Type the country name";
  }
  if (gameMode === "countdown") {
    timer = 60;
    document.getElementById("timer").innerText = timer;
  } else {
    timer = gameMode === "hard" ? 11 : 0;
  }
  startTimer();
  document.getElementById("playbuttons").style.display = "flex";
  document.getElementById("infotext").style.display = "block";
  document.getElementById("country-input").focus();
  document.getElementById("prevanswer").innerHTML = "";
  document.getElementById("modeselect").style.display = "none";

  // Hides these items if hard mode and shows if not
  if (gameMode === "hard") {
    document.getElementById("skip-button").style.display = "none";
    document.getElementById("guesslabels").style.display = "none";
  } else {
    document.getElementById("skip-button").style.display = "inline";
    document.getElementById("guesslabels").style.display = "inline";
  }
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
    } else if (gameMode === "hard") {
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
  let remainingList =
    gameMode === "usstates" ? remainingUSStates : remainingFlags;

  if (remainingList.length > 0) {
    incorrectGuesses++;
    document.getElementById("country-input").style.borderBottomColor = "#888";
    if (gameMode === "capital") {
      document.getElementById("prevanswer").innerHTML =
        "The capital of " + currentFlag.country + " is " + currentFlag.capital;
    } else if (gameMode === "usstates") {
      document.getElementById("prevanswer").innerHTML =
        "The correct answer was " + currentFlag.state;
    } else {
      document.getElementById("prevanswer").innerHTML =
        "The flag was: " + currentFlag.country;
    }
    document.getElementById("prevanswer").style.color = "#d95d55";
    updateIncorrectGuesses();
    pickNewFlag();
    document.getElementById("country-input").value = "";
    document.getElementById("country-input").focus();
  }
}

function pickNewFlag() {
  if (gameMode === "usstates") {
    const randomIndex = Math.floor(Math.random() * remainingUSStates.length);
    currentFlag = remainingUSStates[randomIndex];
    remainingUSStates.splice(randomIndex, 1);
    document.querySelector(".flag-img").src = currentFlag.imageUrl;
  } else {
    const randomIndex = Math.floor(Math.random() * remainingFlags.length);
    currentFlag = remainingFlags[randomIndex];
    remainingFlags.splice(randomIndex, 1);
    document.querySelector(".flag-img").src = currentFlag.imageUrl;
  }
}

function checkGuess() {
  const input = document.getElementById("country-input");
  let isCorrect = false;

  if (gameMode === "capital") {
    let capital = currentFlag.capital;
    if (Array.isArray(capital)) {
      isCorrect =
        capital.some(
          (cap) => cap.toLowerCase() === input.value.toLowerCase()
        ) || currentFlag.altcapital.includes(input.value);
    } else {
      isCorrect = input.value.toLowerCase() === capital.toLowerCase();
    }
  } else if (gameMode === "usstates") {
    isCorrect =
      input.value.toLowerCase() === currentFlag.state.toLowerCase() ||
      currentFlag.alternatives.includes(input.value);
  } else {
    isCorrect =
      input.value.toLowerCase() === currentFlag.country.toLowerCase() ||
      currentFlag.alternatives.includes(input.value);
  }

  if (isCorrect) {
    correctGuesses++;
    updateCorrectGuesses();
    input.value = "";
    input.style.borderBottomColor = "#888";
    //Correct message (for capital and for normal game modes)
    if (gameMode === "capital") {
      document.getElementById("prevanswer").innerHTML =
        "Correct, the capital of " +
        currentFlag.country +
        " is " +
        currentFlag.capital;
    } else if (gameMode === "usstates") {
      document.getElementById("prevanswer").innerHTML =
        "Correct, the flag was: " + currentFlag.state;
    } else {
      document.getElementById("prevanswer").innerHTML =
        "Correct, the flag was: " + currentFlag.country;
    }
    //
    document.getElementById("prevanswer").style.color = "#67e674";
    if (
      (gameMode === "usstates" && remainingUSStates.length > 0) ||
      (gameMode !== "usstates" && remainingFlags.length > 0)
    ) {
      pickNewFlag();
    } else {
      document.querySelector(".flag-img").src = "";
      endGame();
      document.getElementById("playbuttons").style.display = "none";
      document.getElementById("infotext").style.display = "none";
      document.getElementById("start-button").style.display = "flex";
      document.getElementById("flag-container").style.display = "none";
    }
    if (gameMode === "hard") {
      timer = 11;
    }
  } else {
    input.style.borderBottomColor = "#cf2929";
    if (gameMode === "hard") {
      endGame();
    }
  }
}

function updateCorrectGuesses() {
  document.getElementById("correct-guesses").innerText = correctGuesses;
}

function endGame() {
  stopTimer();
  let message;
  if (gameMode === "countdown") {
    message = `Wow! In 60 seconds you got ${correctGuesses} correct flags and skipped ${incorrectGuesses} flags.`;
  } else if (gameMode === "hard") {
    message = `You managed to get ${correctGuesses} correct flags. The last flag was: ${currentFlag.country}`;
  } else if (gameMode === "usstates") {
    message = `You managed to get ${correctGuesses} and skipped ${incorrectGuesses} flags.`;
  } else {
    message = `You've finished in ${timer} seconds with ${incorrectGuesses} skips and ${correctGuesses} correct guesses!`;
  }
  alert(message);
  resetGame();
}
