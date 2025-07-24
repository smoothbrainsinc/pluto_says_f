document.addEventListener('DOMContentLoaded', () => {
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    const crossesElement = document.querySelector('.crosses');
    if (crossesElement) {
      crossesElement.style.backgroundColor = 'white';
    }
    document.body.style.backgroundAttachment = 'scroll';

    const crosses = document.querySelectorAll('.cross-left, .cross-right');
    crosses.forEach(cross => {
      cross.style.textShadow = `
        -1px 0px 2px black,
        0px -1px 2px black,
        1px -1px 2px black,
        -1px 1px 2px black,
        0 0 10px rgba(255, 200, 0, 0.9),
        0 0 15px rgba(255, 100, 0, 0.8),
        0 0 25px rgba(255, 69, 0, 0.7)`;
    });
  }

// Load your image filenames (example for 118 images)
const images = [];
for (let i = 1; i <= 118; i++) {
  images.push(`targets/${i}.jpeg`);
}

const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
let score = 0;
let targetImg = null;

// Helper: Random position within game area
function randomPosition() {
  const maxX = gameArea.clientWidth - 120;
  const maxY = gameArea.clientHeight - 120;
  return {
    x: Math.floor(Math.random() * maxX),
    y: Math.floor(Math.random() * maxY)
  };
}

// Place a new random target
function spawnTarget() {
  if (targetImg) targetImg.remove();
  
  targetImg = document.createElement('img');
  targetImg.src = images[Math.floor(Math.random() * images.length)];
  targetImg.className = 'target';

  const pos = randomPosition();
  targetImg.style.left = pos.x + 'px';
  targetImg.style.top = pos.y + 'px';

  gameArea.appendChild(targetImg);
}

// Handle shooting (click events)
gameArea.addEventListener('click', function(event) {
  if (!targetImg) return;

  const rect = gameArea.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const targetX = parseFloat(targetImg.style.left);
  const targetY = parseFloat(targetImg.style.top);

  // Basic bounding box hit detection
  if (
    x >= targetX &&
    x <= targetX + targetImg.width &&
    y >= targetY &&
    y <= targetY + targetImg.height
  ) {
    score++;
    scoreDisplay.textContent = score;
    spawnTarget();
  }
});

// Start the game!
spawnTarget();



});

