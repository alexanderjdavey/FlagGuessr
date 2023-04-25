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
document.getElementById("korea-card").addEventListener("click", () => {
  (gameMode = "korea"), startGame();
});

// Event listener for the credit link

const creditsCard = document.querySelector("#creditscard");

creditsCard.addEventListener("click", function () {
  window.open("https://github.com/alexanderjdavey/", "_blank");
});

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
