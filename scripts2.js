document.addEventListener('DOMContentLoaded', () => {
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
