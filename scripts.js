function toggleStyle() {
    document.getElementById("myHeading").classList.toggle("alternate");
}
        
function startAnimation() {
    const h2 = document.getElementById("myHeading");
    h2.classList.remove("alternate");
    h2.classList.add("auto-animate");
}
        
function stopAnimation() {
    document.getElementById("myHeading").classList.remove("auto-animate");
}

function toggleBackground() {
    document.body.classList.toggle("active-bg");
}

// Add these new functions below your existing ones

function toggleSpin() {
    const cross1 = document.querySelector('.cross1');
    const cross2 = document.querySelector('.cross2');
    
    cross1.classList.toggle('paused');
    cross2.classList.toggle('paused');
}

function randomMovement() {
    const crosses = document.querySelectorAll('.cross1, .cross2');
    
    crosses.forEach(cross => {
        // Random speed between 5-15 seconds
        const speed = `${5 + Math.random() * 10}s`;
        
        // Random direction (clockwise or counter-clockwise)
        const direction = Math.random() > 0.5 ? 'normal' : 'reverse';
        
        // Apply random animation
        cross.style.animation = `spin-${cross.classList.contains('cross1') ? 'left' : 'right'} ${speed} linear ${direction} infinite`;
    });
}

// Update your existing controls div to add new buttons
const controlsDiv = document.querySelector('.controls');
controlsDiv.innerHTML += `
    <button onclick="toggleSpin()">Toggle Spin</button>
    <button onclick="randomMovement()">Randomize</button>
`;   
