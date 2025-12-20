document.addEventListener('DOMContentLoaded', () => {
  // Mobile style fixes
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    const crossesElement = document.querySelector('.crosses');
    if (crossesElement) crossesElement.style.backgroundColor = 'white';
    document.body.style.backgroundAttachment = 'scroll';

    document.querySelectorAll('.cross-left, .cross-right').forEach(cross => {
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

  const game = (() => {
    const totalTargets = 118;
    const images = [];
    for (let i = 1; i <= totalTargets; i++) {
      images.push(`targets/${i}.jpeg`);
    }

    const gameArea = document.getElementById('gameArea');
    const scoreDisplay = document.getElementById('score');
    const toggleBtn = document.getElementById('toggleGameBtn');

    const targetSize = { width: 128, height: 128 }; // Square for round display
    const maxTargets = 3;

    let targets = [];
    let score = 0;
    let score3 = 0;
    let score2 = 0;
    let score1 = 0;
    let misses = 0;
    let lastSpeedUpScore = 0;
    let animationFrameId = null;
    let running = true;

    // Minimum speed to keep targets lively
    const minSpeed = 1.5;

    function randomPosition() {
      // Get actual available space, accounting for any offset
      const maxX = gameArea.clientWidth - targetSize.width;
      const maxY = gameArea.clientHeight - targetSize.height;
      
      return {
        x: Math.max(0, Math.floor(Math.random() * maxX)),
        y: Math.max(0, Math.floor(Math.random() * maxY))
      };
    }

    function createTarget() {
      const target = document.createElement('img');
      target.className = 'target';
      target.src = images[Math.floor(Math.random() * images.length)];
      
      // Set size explicitly
      target.style.width = targetSize.width + 'px';
      target.style.height = targetSize.height + 'px';

      const pos = randomPosition();
      target.style.left = pos.x + 'px';
      target.style.top = pos.y + 'px';

      target.posX = pos.x;
      target.posY = pos.y;

      // Random velocity: between [-3, -1.5) or (1.5, 3]
      const randVel = () => {
        const vel = Math.random() * 1.5 + minSpeed;
        return Math.random() < 0.5 ? -vel : vel;
      };
      target.velX = randVel();
      target.velY = randVel();

      // Timestamp for scoring
      target.spawnTime = Date.now();

      gameArea.appendChild(target);
      targets.push(target);
    }

    function spawnInitialTargets() {
      for (let i = 0; i < maxTargets; i++) {
        createTarget();
      }
    }

    // Ensure target velocity doesn't fall below min speed
    function maintainSpeed(target) {
      if (Math.abs(target.velX) < minSpeed) {
        target.velX = minSpeed * Math.sign(target.velX || 1);
      }
      if (Math.abs(target.velY) < minSpeed) {
        target.velY = minSpeed * Math.sign(target.velY || 1);
      }
    }

    function updateTargets() {
      if (!running) return;

      targets.forEach(target => {
        target.posX += target.velX;
        target.posY += target.velY;

        // Get current dimensions (important for responsive mobile)
        const areaWidth = gameArea.clientWidth;
        const areaHeight = gameArea.clientHeight;

        // Bounce and confinement with proper boundaries
        if (target.posX <= 0) {
          target.velX = Math.abs(target.velX);
          target.posX = 0;
        } else if (target.posX >= areaWidth - targetSize.width) {
          target.velX = -Math.abs(target.velX);
          target.posX = areaWidth - targetSize.width;
        }

        if (target.posY <= 0) {
          target.velY = Math.abs(target.velY);
          target.posY = 0;
        } else if (target.posY >= areaHeight - targetSize.height) {
          target.velY = -Math.abs(target.velY);
          target.posY = areaHeight - targetSize.height;
        }

        // Clamp position to ensure targets stay within bounds
        target.posX = Math.max(0, Math.min(target.posX, areaWidth - targetSize.width));
        target.posY = Math.max(0, Math.min(target.posY, areaHeight - targetSize.height));

        maintainSpeed(target);

        target.style.left = `${target.posX}px`;
        target.style.top = `${target.posY}px`;
      });

      animationFrameId = requestAnimationFrame(updateTargets);
    }

    // Calculate hitbox scale shrinking every 50 points
    function getHitboxScale() {
      const shrinkSteps = Math.floor(score / 50);
      return 1 / Math.pow(2, shrinkSteps);
    }

    function updateScoreDisplay() {
      scoreDisplay.textContent = 
        `Score: ${score} (3pt: ${score3} 2pt: ${score2} 1pt: ${score1}) | Misses: ${misses}`;
    }

    function handleShoot(event) {
      if (!running) return;
      
      // Prevent default touch behavior
      event.preventDefault();

      const rect = gameArea.getBoundingClientRect();
      const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
      const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;

      let hitTarget = false;

      for (let i = targets.length - 1; i >= 0; i--) {
        const t = targets[i];
        const tX = t.posX;
        const tY = t.posY;

        const scale = getHitboxScale();
        const hitWidth = targetSize.width * scale;
        const hitHeight = targetSize.height * scale;
        const hitX = tX + (targetSize.width - hitWidth) / 2;
        const hitY = tY + (targetSize.height - hitHeight) / 2;

        if (
          x >= hitX &&
          x <= hitX + hitWidth &&
          y >= hitY &&
          y <= hitY + hitHeight
        ) {
          hitTarget = true;

          // Determine points based on time
          const hitDuration = (Date.now() - t.spawnTime) / 1000;
          let pointsAwarded = 1;
          if (hitDuration <= 3) {
            pointsAwarded = 3;
            score3++;
          } else if (hitDuration <= 5) {
            pointsAwarded = 2;
            score2++;
          } else {
            score1++;
          }

          score += pointsAwarded;

          // Speed up every 5 points (only once per milestone)
          if (score % 5 === 0 && score !== lastSpeedUpScore) {
            lastSpeedUpScore = score;
            targets.forEach(target => {
              target.velX *= 1.3;
              target.velY *= 1.3;
            });
          }

          t.remove();
          targets.splice(i, 1);
          createTarget(); // spawn replacement
          updateScoreDisplay();
          break;
        }
      }

      if (!hitTarget) {
        misses++;
        score = Math.max(0, score - 1); // deduct 1 point per miss, no negative score
        updateScoreDisplay();
      }
    }

    function stopGame() {
      running = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      toggleBtn.textContent = 'Start';
    }

    function startGame() {
      if (!running) {
        running = true;
        toggleBtn.textContent = 'Stop';
        updateTargets();
      }
    }

    toggleBtn.addEventListener('click', () => {
      if (running) stopGame();
      else startGame();
    });

    // Handle window resize (especially important for mobile orientation changes)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Reposition targets that may be out of bounds after resize
        targets.forEach(target => {
          target.posX = Math.min(target.posX, gameArea.clientWidth - targetSize.width);
          target.posY = Math.min(target.posY, gameArea.clientHeight - targetSize.height);
          target.style.left = `${target.posX}px`;
          target.style.top = `${target.posY}px`;
        });
      }, 250);
    });

    function init() {
      spawnInitialTargets();
      updateTargets();
      updateScoreDisplay();
      gameArea.addEventListener('click', handleShoot);
      gameArea.addEventListener('touchstart', handleShoot, { passive: false });
    }

    return { init };
  })();

  game.init();
});
