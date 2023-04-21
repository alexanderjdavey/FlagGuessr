let flags = [];
let remainingFlags;
let remainingUSStates = [];
let currentFlag;
let correctGuesses = 0;
let incorrectGuesses = 0;
let timerInterval;
let timer = 0;
let gameMode = "normal";
let items = [];

// Home animations
document.getElementById("modeselect").onmousemove = (e) => {
  for (const card of document.getElementsByClassName("card")) {
    const rect = card.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }
};

// Event listeners for controls
document.getElementById("reset-button").addEventListener("click", resetGame);
document.getElementById("skip-button").addEventListener("click", skipFlag);
// country input must be defined like this so it is not called twice on clicking autocorrect suggestions
document.getElementById("country-input").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    checkGuess();
  }
});

// Event listeners to select game mode
document.getElementById("normal-card").addEventListener("click", () => {
  (gameMode = "normal"), startGame();
});
document.getElementById("countdown-card").addEventListener("click", () => {
  (gameMode = "countdown"), startGame();
});
document.getElementById("hard-card").addEventListener("click", () => {
  (gameMode = "hard"), startGame();
});
document.getElementById("capital-card").addEventListener("click", () => {
  (gameMode = "capital"), startGame();
});
document.getElementById("usstates-card").addEventListener("click", () => {
  (gameMode = "usstates"), startGame();
});

// Event listener for the credit link

const creditsCard = document.querySelector("#creditscard");

creditsCard.addEventListener("click", function () {
  window.open("https://github.com/alexanderjdavey/", "_blank");
});

// Autocomplete Integration

const countryInput = document.getElementById("country-input");
const suggestions = document.getElementById("suggestions");

// Defining the items within the autocomplete's suggestions

function updateItems() {
  if (gameMode === "usstates") {
    items = usStates.map((item) => item.state);
  } else {
    items = flags.map((item) => item.country);
  }
}

// Autocomplete's Event Listener

countryInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  suggestions.innerHTML = "";

  if (!searchTerm) {
    suggestions.style.display = "none";
    return;
  }
  // Filtered items includes both item name and alternatives as define in the json
  const filteredItems = items.filter((item) => {
    const itemLowerCase = item.toLowerCase();
    const searchTermLowerCase = searchTerm.toLowerCase();

    if (itemLowerCase.includes(searchTermLowerCase)) {
      return true;
    }

    const currentItem = flags.find(
      (flag) => flag.country.toLowerCase() === itemLowerCase
    );
    if (currentItem) {
      return currentItem.alternatives.some((alternative) => {
        return alternative.toLowerCase().includes(searchTermLowerCase);
      });
    }

    return false;
  });
  if (filteredItems.length > 0) {
    filteredItems.forEach((item) => {
      const suggestion = document.createElement("div");
      suggestion.textContent = item;
      suggestion.addEventListener("click", () => {
        countryInput.value = item;
        suggestions.style.display = "none";
        checkGuess();
      });

      suggestions.appendChild(suggestion);
    });
    suggestions.style.display = "block";
  } else {
    suggestions.style.display = "none";
  }
});

// Clearing the suggestions

function clearSuggestions() {
  suggestions.innerHTML = "";
  suggestions.style.display = "none";
}

// Fetching the flag data from flags.json
fetch("flags.json")
  .then((response) => response.json())
  .then((data) => {
    flags = data;
    updateItems();
  });

// Fetching the US State flag data from us_states.json
fetch("us_states.json")
  .then((response) => response.json())
  .then((data) => {
    usStates = data;
    updateItems();
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
  updateItems();
  updateCorrectGuesses();
  updateIncorrectGuesses();
  pickNewFlag();
  document.getElementById("flag-container").style.display = "flex";
  document.getElementById("tagline").style.display = "none";
  document.getElementById("title").style.display = "none";
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
  document.getElementById("tagline").style.display = "";
  document.getElementById("title").style.display = "";
  remainingFlags = [];
  currentFlag = undefined;
  correctGuesses = 0;
  incorrectGuesses = 0;
  timer = 0;
  updateCorrectGuesses();
  updateIncorrectGuesses();
  clearSuggestions();
  document.querySelector(".flag-img").src = "";
  document.getElementById("country-input").style.borderBottomColor = "#232323";
  document.getElementById("country-input").value = "";
  document.getElementById("flag-container").style.display = "none";
  stopTimer();
  document.getElementById("modeselect").style.display = "flex";
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
    document.getElementById("country-input").style.borderBottomColor =
      "#232323";
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
    clearSuggestions();
    document.getElementById("country-input").focus();
  } else {
    const randomIndex = Math.floor(Math.random() * remainingFlags.length);
    currentFlag = remainingFlags[randomIndex];
    remainingFlags.splice(randomIndex, 1);
    document.querySelector(".flag-img").src = currentFlag.imageUrl;
    clearSuggestions();
    document.getElementById("country-input").focus();
  }
}

function checkGuess() {
  const input = document.getElementById("country-input");
  let isCorrect = false;
  clearSuggestions();

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
    input.style.borderBottomColor = "#232323";
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
    message = `You managed to get ${correctGuesses} flags correct and skipped ${incorrectGuesses} flags.`;
  } else {
    message = `You've finished in ${timer} seconds with ${incorrectGuesses} skips and ${correctGuesses} correct guesses!`;
  }
  alert(message);
  resetGame();
}
