let flags = [];
let remainingFlags;
let remainingUSStates = [];
let koreanItems = [];
let remainingKoreanItems = [];
let currentFlag;
let correctGuesses = 0;
let incorrectGuesses = 0;
let timerInterval;
let timer = 0;
let gameMode = "normal";
let items = [];

// Autocomplete Integration
const countryInput = document.getElementById("country-input");
const suggestions = document.getElementById("suggestions");

// Defining the items within the autocomplete's suggestions
function updateItems() {
  if (gameMode === "usstates") {
    items = usStates.map((item) => item.state);
  } else if (gameMode === "capital") {
    items = flags.flatMap((item) => {
      if (Array.isArray(item.capital)) {
        return item.capital;
      } else {
        return item.capital;
      }
    });
  } else if (gameMode === "korea") {
    items = koreanItems.map((item) => item.answer);
  } else {
    items = flags.map((item) => item.country);
  }
}

// Fetching the country flag data from flags.json
fetch("countries.json")
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

// Fetching Korea flag data from korea.json
fetch("korea.json")
  .then((response) => response.json())
  .then((data) => {
    koreanItems = data;
    updateItems();
  });

function startGame() {
  remainingFlags = [...flags];
  remainingUSStates = [...usStates];
  remainingKoreanItems = [...koreanItems];
  correctGuesses = 0;
  incorrectGuesses = 0;
  updateItems();
  updateCorrectGuesses();
  updateIncorrectGuesses();
  pickNewFlag();
  hidemenu();
  if (gameMode === "countdown") {
    timer = 60;
    document.getElementById("timer").innerText = timer;
  } else {
    timer = gameMode === "hard" ? 11 : 0;
  }
  startTimer();
  showcontrols();
  hardUI();
  inputUI();
}

function resetGame() {
  hidecontrols();
  showmenu();
  remainingFlags = [];
  currentFlag = undefined;
  correctGuesses = 0;
  incorrectGuesses = 0;
  timer = 0;
  updateCorrectGuesses();
  updateIncorrectGuesses();
  clearSuggestions();
  stopTimer();
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
  let remainingList;

  if (gameMode === "usstates") {
    remainingList = remainingUSStates;
  } else if (gameMode === "korea") {
    remainingList = remainingKoreanItems;
  } else {
    remainingList = remainingFlags;
  }

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
    } else if (gameMode === "korea") {
      document.getElementById("prevanswer").innerHTML =
        "The correct answer was " + currentFlag.answer;
    } else {
      document.getElementById("prevanswer").innerHTML =
        "The flag was: " + currentFlag.country;
    }

    document.getElementById("prevanswer").style.color = "#d95d55";
    updateIncorrectGuesses();
    pickNewFlag();
    document.getElementById("country-input").value = "";
  } else {
    incorrectGuesses++;
    updateCorrectGuesses();
    endGame();
  }
}

function pickNewFlag() {
  if (gameMode === "usstates") {
    const randomIndex = Math.floor(Math.random() * remainingUSStates.length);
    currentFlag = remainingUSStates[randomIndex];
    remainingUSStates.splice(randomIndex, 1);
  } else if (gameMode === "korea") {
    const randomIndex = Math.floor(Math.random() * remainingKoreanItems.length);
    currentFlag = remainingKoreanItems[randomIndex];
    remainingKoreanItems.splice(randomIndex, 1);
  } else {
    const randomIndex = Math.floor(Math.random() * remainingFlags.length);
    currentFlag = remainingFlags[randomIndex];
    remainingFlags.splice(randomIndex, 1);
  }
  document.querySelector(".flag-img").src = currentFlag.imageUrl;
  clearSuggestions();
  document.getElementById("country-input").focus();
}

function checkGuess() {
  const input = document.getElementById("country-input");
  let isCorrect = false;
  clearSuggestions();

  if (gameMode === "capital") {
    isCorrect = checkCapitalGuess(input.value);
  } else if (gameMode === "usstates") {
    isCorrect = checkUSStateGuess(input.value);
  } else if (gameMode === "korea") {
    isCorrect = checkKoreanGuess(input.value);
  } else {
    isCorrect = checkCountryGuess(input.value);
  }
  processGuessResult(isCorrect, input);
}

function checkKoreanGuess(value) {
  return (
    value.toLowerCase() === currentFlag.answer.toLowerCase() ||
    currentFlag.alternatives.includes(value)
  );
}

function checkCapitalGuess(value) {
  const capital = currentFlag.capital;
  if (Array.isArray(capital)) {
    return (
      capital.some((cap) => cap.toLowerCase() === value.toLowerCase()) ||
      currentFlag.altcapital.includes(value)
    );
  } else {
    return value.toLowerCase() === capital.toLowerCase();
  }
}

function checkUSStateGuess(value) {
  return (
    value.toLowerCase() === currentFlag.state.toLowerCase() ||
    currentFlag.alternatives.includes(value)
  );
}

function checkCountryGuess(value) {
  return (
    value.toLowerCase() === currentFlag.country.toLowerCase() ||
    currentFlag.alternatives.includes(value)
  );
}

function processGuessResult(isCorrect, input) {
  if (isCorrect) {
    handleCorrectGuess(input);
  } else {
    handleIncorrectGuess(input);
  }
}

function handleCorrectGuess(input) {
  correctGuesses++;
  updateCorrectGuesses();
  input.value = "";
  input.style.borderBottomColor = "#232323";
  if (gameMode === "capital") {
    document.getElementById("prevanswer").innerHTML =
      "Correct, the capital of " +
      currentFlag.country +
      " is " +
      currentFlag.capital;
  } else if (gameMode === "usstates") {
    document.getElementById("prevanswer").innerHTML =
      "Correct, the flag was: " + currentFlag.state;
  } else if (gameMode === "korea") {
    document.getElementById("prevanswer").innerHTML =
      "Correct, the answer was: " + currentFlag.answer;
  } else {
    document.getElementById("prevanswer").innerHTML =
      "Correct, the flag was: " + currentFlag.country;
  }

  document.getElementById("prevanswer").style.color = "#67e674";

  if (
    (gameMode === "usstates" && remainingUSStates.length > 0) ||
    (gameMode === "korea" && koreanItems.length > 0) ||
    (gameMode !== "usstates" &&
      gameMode !== "korea" &&
      remainingFlags.length > 0)
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
}

function handleIncorrectGuess(input) {
  input.style.borderBottomColor = "#cf2929";
  if (gameMode === "hard") {
    endGame();
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
