// 1. Falling Roses & Sunflowers Effect
const flowerContainer = document.getElementById('flower-container');
const flowers = ['🌹', '🌻']; // Rose and Sunflower

function createFlower() {
    const flower = document.createElement('div');
    flower.classList.add('floating-flower');
    
    // Randomly pick Rose or Sunflower
    flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];
    
    // Random styling for unique falling patterns
    flower.style.left = Math.random() * 100 + 'vw';
    flower.style.animationDuration = Math.random() * 3 + 4 + 's'; // Between 4s and 7s
    flower.style.fontSize = Math.random() * 15 + 15 + 'px'; // Between 15px and 30px
    
    flowerContainer.appendChild(flower);
    
    // Remove from DOM after animation completes
    setTimeout(() => {
        flower.remove();
    }, 7000);
}

// Generate flowers continuously
setInterval(createFlower, 300);


// 2. Scroll Animation for Timeline Items
const timelineItems = document.querySelectorAll('.timeline-item');

const triggerAnimation = () => {
    const triggerBottom = window.innerHeight * 0.85;
    
    timelineItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        
        if(itemTop < triggerBottom) {
            item.classList.add('active');
        }
    });
};

window.addEventListener('scroll', triggerAnimation);
triggerAnimation(); // Initial check


// 3. Reveal Video Button Logic
const revealBtn = document.getElementById('reveal-btn');
const videoWrapper = document.getElementById('video-wrapper');
const myVideo = document.getElementById('my-video');

revealBtn.addEventListener('click', () => {
    // Show video wrapper
    videoWrapper.classList.remove('hidden');
    videoWrapper.style.opacity = '1';
    
    // Smooth scroll to video
    setTimeout(() => {
        videoWrapper.scrollIntoView({ behavior: 'smooth' });
        // Auto play the video
        myVideo.play();
    }, 200);
    
    // Hide the button gracefully
    revealBtn.style.display = 'none';
});