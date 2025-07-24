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
  const targets = [];
  const maxTargets = 3; // number of simultaneous targets
  const targetSize = { width: 128, height: 192 }; // match CSS

  // Helper: generate a random position within game area boundaries
  function randomPosition() {
    const maxX = gameArea.clientWidth - targetSize.width;
    const maxY = gameArea.clientHeight - targetSize.height;
    return {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY),
    };
  }

  // Create a target DOM element at a random position with random image
  function createTarget() {
    const target = document.createElement('img');
    target.className = 'target';
    target.src = images[Math.floor(Math.random() * images.length)];

    const pos = randomPosition();
    target.style.left = pos.x + 'px';
    target.style.top = pos.y + 'px';

    // Store position and velocity for movement
    target.posX = pos.x;
    target.posY = pos.y;
    target.velX = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1); // speed between 1-3 px/frame
    target.velY = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1);

    gameArea.appendChild(target);
    targets.push(target);
  }

  // Initialize targets
  for (let i = 0; i < maxTargets; i++) {
    createTarget();
  }

  // Update positions of targets and move them around
  function updateTargets() {
    targets.forEach(target => {
      target.posX += target.velX;
      target.posY += target.velY;

      // Bounce off edges
      if (target.posX <= 0 || target.posX >= gameArea.clientWidth - targetSize.width) {
        target.velX *= -1;
      }
      if (target.posY <= 0 || target.posY >= gameArea.clientHeight - targetSize.height) {
        target.velY *= -1;
      }

      // Apply new position
      target.style.left = `${target.posX}px`;
      target.style.top = `${target.posY}px`;
    });

    requestAnimationFrame(updateTargets);
  }

  // Start moving targets
  requestAnimationFrame(updateTargets);

  // Handle shooting (click or touch)
  function handleShoot(event) {
    // Get click/tap position relative to gameArea
    const rect = gameArea.getBoundingClientRect();
    const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
    const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;

    // Check if any target is hit (loop in reverse to safely remove)
    for (let i = targets.length - 1; i >= 0; i--) {
      const t = targets[i];
      const tX = t.posX;
      const tY = t.posY;

      if (
        x >= tX &&
        x <= tX + targetSize.width &&
        y >= tY &&
        y <= tY + targetSize.height
      ) {
        // Hit!
        score++;
        scoreDisplay.textContent = score;

        // Remove hit target from DOM and array
        t.remove();
        targets.splice(i, 1);

        // Spawn a new target
        createTarget();
        break; // Only one hit per click/tap
      }
    }
  }

  // Attach mouse click and touch event
  gameArea.addEventListener('click', handleShoot);
  gameArea.addEventListener('touchstart', handleShoot);

});

