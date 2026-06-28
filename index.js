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


// 3. Reveal Video Button Logic & Background Music Controls
const startJourneyBtn = document.getElementById('start-journey-btn');
const timelineContainer = document.querySelector('.timeline-container');
const revealBtn = document.getElementById('reveal-btn');
const videoWrapper = document.getElementById('video-wrapper');
const myVideo = document.getElementById('my-video');
const bgMusic = document.getElementById('bg-music');

// Audio optimization: Fast-load music in memory as soon as script runs
if (bgMusic) {
    bgMusic.load(); 
}

// Hero page waale button par click karte hi instantly audio chalega aur scroll hoga
startJourneyBtn.addEventListener('click', () => {
    // Instant Audio Play (Soft 25% volume)
    bgMusic.volume = 0.25;
    
    // Explicitly resetting playhead for zero latency trigger
    if (bgMusic.currentTime === 0 || bgMusic.paused) {
        bgMusic.play().catch(err => console.log("Audio playback managed safely"));
    }
    
    // Smooth scroll to timeline section
    timelineContainer.scrollIntoView({ behavior: 'smooth' });
});

// Final Video Reveal Logic
revealBtn.addEventListener('click', () => {
    // Background music ko pause karo
    bgMusic.pause();
    
    // Video section show karo
    videoWrapper.classList.remove('hidden');
    videoWrapper.style.opacity = '1';
    
    // Video scroll and play logic
    setTimeout(() => {
        videoWrapper.scrollIntoView({ behavior: 'smooth' });
        myVideo.volume = 1.0; // Video audio full volume
        myVideo.play();
    }, 200);
    
    // Button hide
    revealBtn.style.display = 'none';
});