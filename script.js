let skittles = Array(60).fill(null); // Skittles start as null, meaning they haven't been flipped yet.
const skittlesContainer = document.getElementById('skittles-container');
const headsCountElem = document.getElementById('heads-count');
const tailsCountElem = document.getElementById('tails-count');

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
    skittles = Array(60).fill(null); // Reset the skittles to their initial state.
    createSkittles(); // Recreate the skittles display.
    updateCounts(); // Reset the counters to zero.
}

function updateCounts() {
    const headsCount = skittles.filter(state => state === true).length;
    const tailsCount = skittles.filter(state => state === false).length;
    headsCountElem.textContent = headsCount;
    tailsCountElem.textContent = tailsCount;
}

createSkittles(); // Initialize Skittles on page load but keep counts at zero.
