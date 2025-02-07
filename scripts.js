function startAuth() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      source.connect(analyser);
      isListening = true;
      detectNotes();
    })
    .catch(err => {
      console.error('Error accessing the microphone', err);
      document.getElementById('auth-status').textContent = 'Microphone access denied. Please allow and try again.';
    });
}

let detectedSequence = [];

function detectNotes() {
  if (!isListening) return;

  analyser.fftSize = 4096;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Float32Array(bufferLength);
  analyser.getFloatTimeDomainData(dataArray);

  const rms = calculateRMS(dataArray);
  if (rms < 0.01) {
    document.getElementById('detected-notes').textContent = 'Silence detected. Waiting for input...';
    requestAnimationFrame(detectNotes);
    return;
  }

  const detectedNotes = getPitches(dataArray, audioContext.sampleRate);
  document.getElementById('detected-notes').textContent = `Detected notes: ${detectedNotes.join(', ')}`;

  if (detectedNotes.length > 0) {
    const lastDetectedNote = detectedNotes[detectedNotes.length - 1];
    document.getElementById('auth-status').textContent = `Last detected note: ${lastDetectedNote}`;

    if (lastDetectedNote === noteSequence[currentNoteIndex]) {
      currentNoteIndex++;
      document.getElementById('auth-status').textContent = `Correct! ${currentNoteIndex}/${noteSequence.length}`;

      if (currentNoteIndex === noteSequence.length) {
        simulateAuthentication();
        return;
      }
    } else if (currentNoteIndex > 0 && lastDetectedNote !== noteSequence[currentNoteIndex - 1]) {
      currentNoteIndex = 0;
      document.getElementById('auth-status').textContent = 'Sequence reset. Try again.';
    }
  } else {
    document.getElementById('auth-status').textContent = 'No notes detected. Waiting for input...';
  }

  requestAnimationFrame(detectNotes);
}


let recentPitches = [];
const RECENT_PITCHES_MAX = 5;

function getPitches(buffer, sampleRate) {
  const correlations = autocorrelate(buffer);
  const maxCorrelation = Math.max(...correlations);
  const threshold = maxCorrelation * 0.8; // Dynamic threshold

  const pitches = [];
  for (let i = 0; i < correlations.length; i++) {
    if (correlations[i] > threshold) {
      const frequency = sampleRate / i;
      const note = getClosestNote(frequency);
      if (note && !pitches.includes(note)) {
        pitches.push(note);
      }
    }
  }

  return pitches;
}

function calculateNoiseFloor(correlations) {
  const sorted = [...correlations].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length * 0.9)]; // 90th percentile
}

function calculateRMS(buffer) {
  const sum = buffer.reduce((acc, val) => acc + val * val, 0);
  return Math.sqrt(sum / buffer.length);
}

function getStablePitches(recentPitches) {
  const flatPitches = recentPitches.flat();
  const pitchCounts = {};
  flatPitches.forEach(pitch => {
    pitchCounts[pitch] = (pitchCounts[pitch] || 0) + 1;
  });
  
  return Object.entries(pitchCounts)
    .filter(([_, count]) => count > recentPitches.length / 2)
    .map(([pitch, _]) => pitch);
}


function autocorrelate(buffer) {
  const correlations = new Float32Array(buffer.length);
  
  for (let lag = 0; lag < buffer.length; lag++) {
    let sum = 0;
    for (let i = 0; i < buffer.length - lag; i++) {
      sum += buffer[i] * buffer[i + lag];
    }
    correlations[lag] = sum;
  }
  
  return correlations;
}

function getClosestNote(frequency) {
  const notes = {
    'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83,
    'A2': 110.00, 'A#2': 116.54, 'B2': 123.47, 'C3': 130.81, 'C#3': 138.59,
    'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00,
    'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63
  };

  let closestNote = null;
  let closestDiff = Infinity;
  const tolerance = 10; // Allow ±5 Hz difference

  for (const [note, freq] of Object.entries(notes)) {
    const diff = Math.abs(frequency - freq);
    if (diff < closestDiff && diff <= tolerance) {
      closestDiff = diff;
      closestNote = note;
    }
  }

  return closestNote;
}

function simulateAuthentication() {
  isListening = false;
  document.getElementById('auth-status').textContent = 'Authentication successful! Redirecting...';
  console.log('Authentication would happen here in the live version');

  // Simulate a redirect or show new content
  setTimeout(() => {
    document.getElementById('guitar-auth').style.display = 'none';
    document.getElementById('card-container').style.display = 'grid';
  }, 2000); // Redirect after 2 seconds
}
