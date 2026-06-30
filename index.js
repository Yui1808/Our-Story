// ==========================================
// FOOLPROOF AI FACE RECOGNITION LOCK LOGIC
// ==========================================
const CORRECT_PASSWORD = "Will u be my Wifeee";

const passwordScreen = document.getElementById('password-screen');
const mainContent = document.getElementById('main-content');
const passwordInput = document.getElementById('password-input');
const passwordBtn = document.getElementById('password-btn');
const errorMsg = document.getElementById('error-msg');

const video = document.getElementById('webcam');
const scanStatus = document.getElementById('scan-status');
const toggleFallbackBtn = document.getElementById('toggle-fallback-btn');
const manualAuth = document.getElementById('manual-auth');
const bgMusic = document.getElementById('bg-music');

let faceMatcher = null;
let scanInterval = null;

// Toggle Manual Pass Box
toggleFallbackBtn.addEventListener('click', () => {
    manualAuth.classList.toggle('auth-hidden');
    if(!manualAuth.classList.contains('auth-hidden')) {
        passwordInput.focus();
    }
});

function checkPassword() {
    if (passwordInput.value.trim() === CORRECT_PASSWORD) {
        unlockDashboard();
    } else {
        errorMsg.className = "error-visible";
        passwordInput.value = "";
        passwordInput.focus();
    }
}

passwordBtn.addEventListener('click', checkPassword);
passwordInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkPassword(); });

// Master Unlock Sequence
function unlockDashboard() {
    if (scanInterval) clearInterval(scanInterval);
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop()); 
    }
    passwordScreen.style.opacity = '0';
    
    // Play Background audio seamlessly upon verification interaction
    bgMusic.play().catch(err => console.log("Audio autoplay protected by browser: ", err));

    setTimeout(() => {
        passwordScreen.classList.add('auth-hidden');
        mainContent.classList.remove('auth-hidden');
        triggerAnimation(); // Initialize active flower falls
        initScrollAnimations(); // Trigger Scroll Reveal
    }, 500);
}

function startWebcam() {
    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
        .then(stream => { video.srcObject = stream; })
        .catch(err => {
            console.warn("Camera blocked or unavailable:", err);
            scanStatus.innerText = "Camera restricted. Try password below! 👇";
        });
}

async function initFaceTracker() {
    try {
        scanStatus.innerText = "Syncing Recognition Models... 🧠";
        
        // Foolproof Local Directory serving via GitHub Pages
        const modelUrl = './models';
        
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
            faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
            faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl)
        ]);
        
        scanStatus.innerText = "Processing our reference images... 📝";
        
        // Target matching reference assets inside root
        const imgYui = await faceapi.fetchImage('Yui.png');
        const imgSiya = await faceapi.fetchImage('Siya.png');
        
        const descYui = await faceapi.detectSingleFace(imgYui, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
        const descSiya = await faceapi.detectSingleFace(imgSiya, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
        
        if (!descYui || !descSiya) {
            scanStatus.innerText = "Reference face not clear. Use Phrase Bypass! 👇";
            return;
        }

        const labeledDescriptors = [
            new faceapi.LabeledFaceDescriptors('anshul', [descYui.descriptor]),
            new faceapi.LabeledFaceDescriptors('priyanshi', [descSiya.descriptor])
        ];
        
        faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.55);
        scanStatus.innerText = "Scanner active. Stand together! 👥";
        startWebcam();

        video.addEventListener('playing', () => {
            scanInterval = setInterval(async () => {
                if (passwordScreen.classList.contains('auth-hidden')) {
                    clearInterval(scanInterval);
                    return;
                }

                const liveDetections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                                                    .withFaceLandmarks()
                                                    .withFaceDescriptors();

                let anshulFound = false;
                let priyanshiFound = false;

                for (const face of liveDetections) {
                    const bestMatch = faceMatcher.findBestMatch(face.descriptor);
                    if (bestMatch.label === 'anshul') anshulFound = true;
                    if (bestMatch.label === 'priyanshi') priyanshiFound = true;
                }

                if (anshulFound && priyanshiFound) {
                    scanStatus.innerText = "Match Found! Unlocking our world... ❤️";
                    scanStatus.style.color = "#2ecc71";
                    clearInterval(scanInterval);
                    setTimeout(unlockDashboard, 1000);
                } else if (anshulFound && !priyanshiFound) {
                    scanStatus.innerText = "Hey Anshul! Where is Priyanshi? 🤔";
                    scanStatus.style.color = "#ff7b93";
                } else if (!anshulFound && priyanshiFound) {
                    scanStatus.innerText = "Hey Priyanshi! Bring Anshul in frame. 🥰";
                    scanStatus.style.color = "#ff7b93";
                } else {
                    scanStatus.innerText = "Waiting for both of us... 👥";
                    scanStatus.style.color = "#ffffff";
                }
            }, 600);
        });
    } catch (e) {
        console.error("Initialization Engine Failed:", e);
        scanStatus.innerText = "Bypass verification with phrase below! 👇";
    }
}

// 1. Dynamic Flower/Rose Falling Engine
function triggerAnimation() {
    const container = document.getElementById('flower-container');
    const flowers = ['🌹', '🌸', '💐', '❤️', '✨'];
    
    setInterval(() => {
        if (document.hidden) return; 
        const flower = document.createElement('div');
        flower.className = 'floating-flower';
        flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];
        flower.style.left = Math.random() * 100 + 'vw';
        flower.style.animationDuration = Math.random() * 3 + 4 + 's'; 
        flower.style.fontSize = Math.random() * 15 + 15 + 'px';
        
        container.appendChild(flower);
        
        setTimeout(() => { flower.remove(); }, 7000);
    }, 300);
}

// 2. High-Performance Intersection Observer for Timeline Reveal
function initScrollAnimations() {
    const items = document.querySelectorAll('.timeline-item');
    const observerOptions = {
        root: null,
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    items.forEach(item => observer.observe(item));
}

// 3. UI Smooth Scroll Interactions
document.getElementById('start-journey-btn').addEventListener('click', () => {
    document.getElementById('timeline-section').scrollIntoView({
        behavior: 'smooth'
    });
});

// 4. Video Reveal & Audio Automanagement
const revealBtn = document.getElementById('reveal-btn');
const videoWrapper = document.getElementById('video-wrapper');
const myVideo = document.getElementById('my-video');

revealBtn.addEventListener('click', () => {
    videoWrapper.classList.remove('hidden');
    videoWrapper.scrollIntoView({ behavior: 'smooth' });
    
    bgMusic.volume = 0.15;
    myVideo.play();
    
    revealBtn.innerText = "Enjoy our moment... 🦋";
    revealBtn.style.opacity = '0.7';
    revealBtn.style.pointerEvents = 'none';
});

window.addEventListener('DOMContentLoaded', initFaceTracker);