let audioContext;
let analyser;
let isListening = false;
const noteSequence = ['B2', 'C3'];
let currentNoteIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('guitar-auth').style.display = 'block';
  document.getElementById('card-container').style.display = 'none';
  
  // Add event listener to the button
  const startAuthButton = document.getElementById('start-auth');
  if (startAuthButton) {
    startAuthButton.addEventListener('click', startAuth);
  } else {
    console.error('Start Auth button not found!');
  }
});
