document.addEventListener('DOMContentLoaded', () => {
  // Mobile style fixes (same as your existing code)
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
    const timerDisplay = document.getElementById('timer');
    const toggleBtn = document.getElementById('toggleGameBtn');
    const leaderboardContainer = document.getElementById('leaderboardContainer');
    const leaderboardTableBody = document.querySelector('#leaderboardTable tbody');
    const restartBtn = document.getElementById('restartBtn');

    const hitSound = document.getElementById('hitSound');
    const missSound = document.getElementById('missSound');

    const targetSize = { width: 128, height: 192 };
    const maxTargets = 3;
    const minSpeed = 1.5;

    let targets = [];
    let score = 0;
    let score3 = 0;
    let score2 = 0;
    let score1 = 0;
    let misses = 0;
    let lastSpeedUpScore = 0;
    let animationFrameId = null;
    let running = false;

    let timer = 60; // seconds per round
    let roundActive = false;
    let timerInterval = null;

    // Leaderboard data
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');

    function randomPosition() {
      const maxX = gameArea.clientWidth - targetSize.width;
      const maxY = gameArea.clientHeight - targetSize.height;
      return {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY)
      };
    }

    function createTarget() {
      const target = document.createElement('img');
      target.className = 'target';
      target.src = images[Math.floor(Math.random() * images.length)];

      const pos = randomPosition();
      target.style.left = pos.x + 'px';
      target.style.top = pos.y + 'px';

      target.posX = pos.x;
      target.posY = pos.y;

      // Velocity: random direction & speed [1.5 - 3]
      function randVel() {
        const v = Math.random() * 1.5 + minSpeed;
        return Math.random() < 0.5 ? -v : v;
      }
      target.velX = randVel();
      target.velY = randVel();

      target.spawnTime = Date.now();

      gameArea.appendChild(target);
      targets.push(target);
    }

    function spawnInitialTargets() {
      for (let i = 0; i < maxTargets; i++) {
        createTarget();
      }
    }

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

        if (target.posX <= 0 || target.posX >= gameArea.clientWidth - targetSize.width) {
          target.velX *= -1;
          target.posX = Math.max(0, Math.min(target.posX, gameArea.clientWidth - targetSize.width));
        }
        if (target.posY <= 0 || target.posY >= gameArea.clientHeight - targetSize.height) {
          target.velY *= -1;
          target.posY = Math.max(0, Math.min(target.posY, gameArea.clientHeight - targetSize.height));
        }

        maintainSpeed(target);

        target.style.left = `${target.posX}px`;
        target.style.top = `${target.posY}px`;
      });

      animationFrameId = requestAnimationFrame(updateTargets);
    }

    function showEffect(x, y, type) {
      const effect = document.createElement('div');
      effect.className = type === 'hit' ? 'hit-effect' : 'miss-effect';
      effect.style.left = (x - 40) + 'px';
      effect.style.top = (y - 40) + 'px';
      gameArea.appendChild(effect);
      setTimeout(() => effect.remove(), 400);
    }

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

          // Score based on elapsed time
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
          updateScoreDisplay();

          // Play hit sound and effect
          hitSound.currentTime = 0;
          hitSound.play();
          showEffect(x, y, 'hit');

          // Speed up every 5 points (once per milestone)
          if (score % 5 === 0 && score !== lastSpeedUpScore) {
            lastSpeedUpScore = score;
            targets.forEach(target => {
              target.velX *= 1.3;
              target.velY *= 1.3;
            });
          }

          t.remove();
          targets.splice(i, 1);
          createTarget();

          break;
        }
      }

      if (!hitTarget) {
        misses++;
        score = Math.max(0, score - 1);
        updateScoreDisplay();

        missSound.currentTime = 0;
        missSound.play();
        showEffect(x, y, 'miss');
      }
    }

    function stopGame() {
      running = false;
      roundActive = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      toggleBtn.textContent = 'Start';
    }

    function startGame() {
      if (!running) {
        running = true;
        roundActive = true;
        toggleBtn.textContent = 'Stop';
        updateTargets();
        startTimer();
      }
    }

    toggleBtn.addEventListener('click', () => {
      if (running) stopGame();
      else startGame();
    });

    function resetGame() {
      stopGame();
      targets.forEach(t => t.remove());
      targets = [];
      score = 0;
      score3 = 0;
      score2 = 0;
      score1 = 0;
      misses = 0;
      lastSpeedUpScore = 0;
      timer = 60;
      timerDisplay.textContent = timer;
      updateScoreDisplay();
      leaderboardContainer.classList.add('hidden');
      gameArea.classList.remove('hidden');
      scoreDisplay.parentElement.classList.remove('hidden');
      timerDisplay.parentElement.classList.remove('hidden');
    }

    restartBtn.addEventListener('click', () => {
      resetGame();
      spawnInitialTargets();
      startGame();
    });

    function startTimer() {
      timer = 60;
      timerDisplay.textContent = timer;
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        if (!roundActive) return;
        timer--;
        timerDisplay.textContent = timer;
        if (timer <= 0) {
          endRound();
        }
      }, 1000);
    }

    function endRound() {
      roundActive = false;
      stopGame();
      saveHighScore();
      showLeaderboard();
    }

    function saveHighScore() {
      // Check if score makes top 10 or leaderboard empty
      if (
        leaderboard.length < 10 ||
        score > (leaderboard[leaderboard.length - 1]?.score || 0)
      ) {
        let initials = '';
        while (!initials || initials.length !== 3) {
          initials = prompt('High score! Enter your 3-letter initials:').toUpperCase()?.slice(0, 3) || '';
        }
        leaderboard.push({
          score,
          initials,
          score3,
          score2,
          score1,
          misses,
          date: new Date().toLocaleString()
        });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
      }
    }

    function showLeaderboard() {
      gameArea.classList.add('hidden');
      scoreDisplay.parentElement.classList.add('hidden');
      timerDisplay.parentElement.classList.add('hidden');
      leaderboardContainer.classList.remove('hidden');

      leaderboardTableBody.innerHTML = leaderboard.length ? 
      leaderboard.map((entry, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${entry.initials}</td>
          <td>${entry.score}</td>
          <td>${entry.score3}</td>
          <td>${entry.score2}</td>
          <td>${entry.score1}</td>
          <td>${entry.misses}</td>
          <td>${entry.date}</td>
        </tr>
      `).join('') : '<tr><td colspan="8">No scores yet.</td></tr>';
    }

    function init() {
      resetGame();
      spawnInitialTargets();
      startGame();
      gameArea.addEventListener('click', handleShoot);
      gameArea.addEventListener('touchstart', handleShoot);
    }

    return { init };
  })();

  game.init();
});
