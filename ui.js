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

// Show Menu UI
function showmenu() {
  document.getElementById("tagline").style.display = "";
  document.getElementById("title").style.display = "";
  document.getElementById("modeselect").style.display = "flex";
}

// Hide Menu UI
function hidemenu() {
  document.getElementById("tagline").style.display = "none";
  document.getElementById("title").style.display = "none";
  document.getElementById("modeselect").style.display = "none";
}

// Show Controls UI
function showcontrols() {
  document.getElementById("flag-container").style.display = "flex";
  document.getElementById("playbuttons").style.display = "flex";
  document.getElementById("infotext").style.display = "block";
  document.getElementById("country-input").focus();
  document.getElementById("prevanswer").innerHTML = "";
}

// Hide Controls UI
function hidecontrols() {
  document.getElementById("playbuttons").style.display = "none";
  document.getElementById("infotext").style.display = "none";
  document.getElementById("flag-container").style.display = "none";
  document.querySelector(".flag-img").src = "";
  document.getElementById("country-input").style.borderBottomColor = "#232323";
  document.getElementById("country-input").value = "";
}

// Hard mode UI
function hardUI() {
  if (gameMode === "hard") {
    document.getElementById("skip-button").style.display = "none";
    document.getElementById("guesslabels").style.display = "none";
  } else {
    document.getElementById("skip-button").style.display = "inline";
    document.getElementById("guesslabels").style.display = "inline";
  }
}

// Input box UI
function inputUI() {
  // Sets the input box text differently if its capital mode
  if (gameMode === "capital") {
    document.getElementById("country-input").placeholder =
      "Guess the capital city";
  } else if (gameMode === "usstates") {
    document.getElementById("country-input").placeholder = "Guess the US State";
  } else if (gameMode === "korea") {
    document.getElementById("country-input").placeholder = "Guess the Korean flag";
  } else {
    document.getElementById("country-input").placeholder =
      "Guess the country name";
  }
}
