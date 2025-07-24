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


});

