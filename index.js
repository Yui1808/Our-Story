// ==========================================
// 0. Password Protection Lock Logic
// ==========================================
const CORRECT_PASSWORD = "1405"; // Apni anniversary date ya jo chaho change kar sakte ho

const passwordScreen = document.getElementById('password-screen');
const mainContent = document.getElementById('main-content');
const passwordInput = document.getElementById('password-input');
const passwordBtn = document.getElementById('password-btn');
const errorMsg = document.getElementById('error-msg');

function checkPassword() {
    const enteredPassword = passwordInput.value.trim();
    
    if (enteredPassword === CORRECT_PASSWORD) {
        passwordScreen.style.opacity = '0';
        setTimeout(() => {
            passwordScreen.classList.add('auth-hidden');
            mainContent.classList.remove('auth-hidden');
            
            // Layout load hote hi scroll animation ko initialize karo
            triggerAnimation();
        }, 500);
    } else {
        errorMsg.className = "error-visible";
        passwordInput.value = "";
        passwordInput.focus();
    }
}

passwordBtn.addEventListener('click', checkPassword);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkPassword();
    }
});


// ==========================================
// 1. Falling Roses & Sunflowers Effect
// ==========================================
const flowerContainer = document.getElementById('flower-container');
const flowers = ['🌹', '🌻']; 

function createFlower() {
    // Content load na hone tak animation trigger nahi karenge
    if (mainContent.classList.contains('auth-hidden')) return;

    const flower = document.createElement('div');
    flower.classList.add('floating-flower');
    
    flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];
    
    flower.style.left = Math.random() * 100 + 'vw';
    flower.style.animationDuration = Math.random() * 3 + 4 + 's'; 
    flower.style.fontSize = Math.random() * 15 + 15 + 'px'; 
    
    flowerContainer.appendChild(flower);
    
    setTimeout(() => {
        flower.remove();
    }, 7000);
}

setInterval(createFlower, 300);


// ==========================================
// 2. Scroll Animation for Timeline Items
// ==========================================
const timelineItems = document.querySelectorAll('.timeline-item');

const triggerAnimation = () => {
    if (mainContent.classList.contains('auth-hidden')) return;
    
    const triggerBottom = window.innerHeight * 0.85;
    
    timelineItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        
        if(itemTop < triggerBottom) {
            item.classList.add('active');
        }
    });
};

window.addEventListener('scroll', triggerAnimation);


// ==========================================
// 3. Reveal Video Button Logic & Audio Controls
// ==========================================
const startJourneyBtn = document.getElementById('start-journey-btn');
const timelineContainer = document.querySelector('.timeline-container');
const revealBtn = document.getElementById('reveal-btn');
const videoWrapper = document.getElementById('video-wrapper');
const myVideo = document.getElementById('my-video');
const bgMusic = document.getElementById('bg-music');

if (bgMusic) {
    bgMusic.load(); 
}

startJourneyBtn.addEventListener('click', () => {
    bgMusic.volume = 0.25;
    
    if (bgMusic.currentTime === 0 || bgMusic.paused) {
        bgMusic.play().catch(err => console.log("Audio playback managed safely"));
    }
    
    timelineContainer.scrollIntoView({ behavior: 'smooth' });
});

revealBtn.addEventListener('click', () => {
    bgMusic.pause();
    
    videoWrapper.classList.remove('hidden');
    videoWrapper.style.opacity = '1';
    
    setTimeout(() => {
        videoWrapper.scrollIntoView({ behavior: 'smooth' });
        myVideo.volume = 1.0; 
        myVideo.play();
    }, 200);
    
    revealBtn.style.display = 'none';
});