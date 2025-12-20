// Navigation system
document.addEventListener('DOMContentLoaded', () => {
  const mainWrapper = document.querySelector('.main-wrapper');
  const gameContainer = document.querySelector('.game-container');
  const navMenu = document.querySelector('.nav-menu');
  const toggleBtn = document.getElementById('toggleGameBtn');
  const menuItems = document.querySelectorAll('.menu-item');

  let menuOpen = false;

  // Override the toggle button to show menu when stopping
  function showMenu() {
    menuOpen = true;
    mainWrapper.classList.add('menu-active');
    navMenu.classList.remove('hidden');
    toggleBtn.textContent = 'Resume';
  }

  function hideMenu() {
    menuOpen = false;
    mainWrapper.classList.remove('menu-active');
    setTimeout(() => {
      navMenu.classList.add('hidden');
    }, 500); // Wait for animation
    toggleBtn.textContent = 'Stop';
  }

  // Listen for game stop/start
  toggleBtn.addEventListener('click', (e) => {
    // Small delay to let the game code update first
    setTimeout(() => {
      const buttonText = toggleBtn.textContent;
      if (buttonText === 'Stop' || buttonText === 'Resume') {
        if (!menuOpen) {
          showMenu();
        } else {
          hideMenu();
        }
      }
    }, 50);
  });

  // Menu item clicks
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;

      switch(page) {
        case 'game':
          hideMenu();
          // Restart the game if needed
          if (toggleBtn.textContent === 'Resume' || toggleBtn.textContent === 'Start') {
            toggleBtn.click();
          }
          break;
        
        case 'about':
          alert('Pluto Says F-You All\n\nA fast-paced shooting game where you blast targets before time runs out!\n\n• 3 points for hits within 3 seconds\n• 2 points for hits within 5 seconds\n• 1 point for later hits\n• Lose 1 point per miss\n\nGood luck!');
          break;
        
        case 'leaderboard':
          alert('Leaderboard feature coming soon!\n\nCheck back later to see high scores.');
          break;
        
        case 'settings':
          alert('Settings:\n\n• Sound effects: ON\n• Difficulty: Normal\n\nMore options coming soon!');
          break;
        
        case 'contact':
          window.location.href = 'mailto:contact@plutosaysf.uk';
          break;
      }
    });
  });
});
