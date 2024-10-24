let skittles = Array(64).fill(null); // Skittles start as null, meaning they haven't been flipped yet.
let shakeCount = 0;
const skittlesContainer = document.getElementById("skittles-container");
const headsCountElem = document.getElementById("heads-count");
const tailsCountElem = document.getElementById("tails-count");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const startOverButton = document.getElementById("start-over");
const skittleColors = ["#e60000", "#ff9900", "#ffff00", "#00ff00", "#660066"]; // List of hex codes for different Skittle colors

function createSkittles() {
  skittlesContainer.innerHTML = "";
  skittles.forEach((state) => {
    const skittle = document.createElement("div");
    skittle.classList.add("skittle");

    if (state === true) {
      // For heads (showing "s"), pick a random color
      const randomColor =
        skittleColors[Math.floor(Math.random() * skittleColors.length)];
      skittle.style.backgroundColor = randomColor;
      skittle.textContent = "s";
    } else if (state === false) {
      // For tails, pick a random color but without showing "s"
      const randomColor =
        skittleColors[Math.floor(Math.random() * skittleColors.length)];
      skittle.style.backgroundColor = randomColor;
      skittle.textContent = "";
    } else {
      // Initial state is gray
      skittle.classList.add("initial"); // Add class for initial gray state
      skittle.textContent = "";
    }

    skittlesContainer.appendChild(skittle);
  });
  updateCounts();
}

function shakeSkittles() {
  // Shake sound
  document.getElementById("shake-sound").play();

  // Increment the shake counter
  shakeCount++;
  document.getElementById("shake-count").textContent = shakeCount;

  // Generate a random shake intensity between 5 and 15 pixels
  const randomShake = Math.floor(Math.random() * 10) + 5;
  skittlesContainer.style.setProperty("--shake-x", `${randomShake}px`);

  // Add shake animation class to the container
  skittlesContainer.classList.add("shake");

  // Enable the "Start Over" button again because Skittles have now been changed
  startOverButton.disabled = false;
  startOverButton.classList.remove("disabled");

  // Remove the shake class after the animation completes
  setTimeout(() => {
    skittlesContainer.classList.remove("shake");
    performShake();
  }, 500); // Match the duration of the shake animation (0.5s)
}

function performShake() {
  let allTails = true;

  // Iterate over the Skittles and update their state
  skittles = skittles.map((state, index) => {
    if (state === null || state === true) {
      const newSide = Math.random() < 0.5; // 50% chance for heads (true) or tails (false)
      if (newSide) allTails = false;

      // Apply the flip animation for this Skittle
      applyFlipAnimation(index);

      // Return the new state
      return newSide;
    }
    return state; // Keep the existing state if it's already tails
  });

  createSkittles();

  if (allTails) {
    // Launch confetti when all Skittles turn to tails
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    alert("All Skittles are now tails!");
  }
}

function applyFlipAnimation(index) {
  // Get the corresponding skittle element
  const skittleElement = skittlesContainer.children[index];

  // Add the flip animation class
  skittleElement.classList.add("flip");

  // Remove the flip class after the animation completes (600ms matches the CSS)
  setTimeout(() => {
    skittleElement.classList.remove("flip");
  }, 600);
}

function startOver() {
  // Check if all skittles are already in their initial state
  const isAllGray = skittles.every((state) => state === null);
  if (isAllGray) {
    return; // Do nothing if they are already reset
  }

  // Reset the skittles to their initial state.
  skittles = Array(64).fill(null);
  createSkittles();
  updateCounts();

  // Reset the shake counter
  shakeCount = 0;
  document.getElementById("shake-count").textContent = shakeCount;

  // Disable the "Start Over" button after resetting
  startOverButton.disabled = true;
  startOverButton.classList.add("disabled");
}

function updateCounts() {
  const headsCount = skittles.filter((state) => state === true).length;
  const tailsCount = skittles.filter((state) => state === false).length;

  headsCountElem.textContent = headsCount;
  tailsCountElem.textContent = tailsCount;

  const progressPercentage = (tailsCount / skittles.length) * 100;

  document.getElementById("progress").style.width = `${progressPercentage}%`;
}

// Disable the 'Start Over' button initially since Skittles start in their initial state
startOverButton.disabled = true;
startOverButton.classList.add("disabled");

createSkittles(); // Initialize Skittles on page load but keep counts at zero.

// Load user's previous theme preference if it exists
if (localStorage.getItem("dark-mode") === "enabled") {
  document.body.classList.add("dark-mode");
  darkModeToggle.checked = true;
}

darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("dark-mode", "enabled");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("dark-mode", "disabled");
  }
});
