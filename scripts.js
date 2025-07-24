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


// List all image filenames in the images directory
const images = [
"A_lone_man_supposedly_the_last.jpeg", 
"A_stunning_tropical_paradise_w.jpeg", 
"A_vast_opulent_paradise_white_.jpeg", 
"breathtaking_alla_prima_oil_pa(2).jpeg",
"breathtaking_oil_painting_A_lo(4).jpeg", 
"Vaporwave_aesthetic_style_synt(3).jpeg"
];

// Pick a random image
const randomIndex = Math.floor(Math.random() * images.length);
const randomImage = images[randomIndex];

// Set the src of the image element
const imgElement = document.getElementById('randomImage');
if (imgElement) {
  imgElement.src = "images/" + randomImage;
}

document.body.style.backgroundImage = `url('images/${randomImage}')`;
document.body.style.backgroundSize = 'cover';
document.body.style.backgroundPosition = 'center';
document.body.style.backgroundRepeat = 'no-repeat';
document.body.style.backgroundAttachment = 'fixed';


});

