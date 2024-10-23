let skittles = Array(60).fill(null); // Skittles start as null, meaning they haven't been flipped yet.
const skittlesContainer = document.getElementById('skittles-container');
const headsCountElem = document.getElementById('heads-count');
const tailsCountElem = document.getElementById('tails-count');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const startOverButton = document.getElementById('start-over');

// List of hex codes for different Skittle colors
const skittleColors = ["#e60000", "#ff9900", "#ffff00", "#00ff00", "#660066"];

function createSkittles() {
    skittlesContainer.innerHTML = '';
    skittles.forEach((state) => {
        const skittle = document.createElement('div');
        skittle.classList.add('skittle');

        if (state === true) {
            // For heads (showing "s"), pick a random color
            const randomColor = skittleColors[Math.floor(Math.random() * skittleColors.length)];
            skittle.style.backgroundColor = randomColor;
            skittle.textContent = 's';
        } else if (state === false) {
            // For tails, pick a random color but without showing "s"
            const randomColor = skittleColors[Math.floor(Math.random() * skittleColors.length)];
            skittle.style.backgroundColor = randomColor;
            skittle.textContent = '';
        } else {
            // Initial state is gray
            skittle.classList.add('initial'); // Add class for initial gray state
            skittle.textContent = '';
        }

        skittlesContainer.appendChild(skittle);
    });
    updateCounts();
}

function shakeSkittles() {
    // Add shake animation class to the container
    skittlesContainer.classList.add('shake');

    // Enable the "Start Over" button again because Skittles have now been changed
    startOverButton.disabled = false;
    startOverButton.classList.remove('disabled');

    // Remove the shake class after the animation completes
    setTimeout(() => {
        skittlesContainer.classList.remove('shake');
        performShake();
    }, 500); // Match the duration of the shake animation (0.5s)
}

function performShake() {
    let allTails = true;
    skittles = skittles.map(state => {
        if (state === null || state === true) {
            const newSide = Math.random() < 0.5; // 50% chance for heads (true) or tails (false)
            if (newSide) allTails = false;
            return newSide;
        }
        return state;
    });
    createSkittles();
    
    if (allTails) {
        alert("All Skittles are now tails!");
    }
}

function startOver() {
    // Check if all skittles are already in their initial state
    const isAllGray = skittles.every(state => state === null);
    if (isAllGray) {
        return; // Do nothing if they are already reset
    }

    // Reset the skittles to their initial state.
    skittles = Array(60).fill(null);
    createSkittles();
    updateCounts();

    // Disable the 'Start Over' button after resetting
    startOverButton.disabled = true;
    startOverButton.classList.add('disabled');
}

function updateCounts() {
    const headsCount = skittles.filter(state => state === true).length;
    const tailsCount = skittles.filter(state => state === false).length;
    headsCountElem.textContent = headsCount;
    tailsCountElem.textContent = tailsCount;
}

// Disable the 'Start Over' button initially since Skittles start in their initial state
startOverButton.disabled = true;
startOverButton.classList.add('disabled');

createSkittles(); // Initialize Skittles on page load but keep counts at zero.

// Load user's previous theme preference if it exists
if (localStorage.getItem('dark-mode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('dark-mode', 'disabled');
    }
});
