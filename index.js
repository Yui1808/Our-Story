// ==========================================
// 0. FOOLPROOF AI FACE RECOGNITION LOCK LOGIC
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

// Toggle Manual Pass Box
toggleFallbackBtn.addEventListener('click', () => {
    manualAuth.classList.toggle('auth-hidden');
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

function unlockDashboard() {
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop()); // Camera clean closure
    }
    passwordScreen.style.opacity = '0';
    setTimeout(() => {
        passwordScreen.classList.add('auth-hidden');
        mainContent.classList.remove('auth-hidden');
        triggerAnimation(); // Start roses fallback
    }, 500);
}

function startWebcam() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => { video.srcObject = stream; })
        .catch(err => {
            console.warn("Camera blocked");
            scanStatus.innerText = "Camera restricted. Try password below! 👇";
        });
}

// Global variable references holder
let faceMatcher = null;

async function initFaceTracker() {
    try {
        scanStatus.innerText = "Syncing Recognition Models... 🧠";
        
        // Dynamic production models link
        const modelUrl = 'https://raw.githubusercontent.com/AnshulChakravarty/face-api.js-models/master/';
        
        // Concurrent parallel load to avoid setup execution timeouts
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
            faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
            faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl)
        ]);
        
        scanStatus.innerText = "Processing our images... 📝";
        
        // Fetch reference images loaded inside your main directory
        const imgYui = await faceapi.fetchImage('Yuii.png');
        const imgSiya = await faceapi.fetchImage('Siyaa.jpg');
        
        // Multi-descriptor detection passes
        const descYui = await faceapi.detectSingleFace(imgYui, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
        const descSiya = await faceapi.detectSingleFace(imgSiya, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
        
        if (!descYui || !descSiya) {
            scanStatus.innerText = "Face not clear in images. Use Phrase Bypass below!";
            return;
        }

        // Setup unified labeled matcher structures
        const labeledDescriptors = [
            new faceapi.LabeledFaceDescriptors('anshul', [descYui.descriptor]),
            new faceapi.LabeledFaceDescriptors('priyanshi', [descSiya.descriptor])
        ];
        
        // 0.55 threshold setting makes matching tight and authentic
        faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.55);
        
        scanStatus.innerText = "Scanner active. Stand together! 👥";
        startWebcam();

        video.addEventListener('playing', () => {
            const intervalLoop = setInterval(async () => {
                if (passwordScreen.classList.contains('auth-hidden')) {
                    clearInterval(intervalLoop);
                    return;
                }

                const liveDetections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                                                    .withFaceLandmarks()
                                                    .withFaceDescriptors();

                let anshulFound = false;
                let priyanshiFound = false;

                // Precision extraction loop matching array results
                for (const face of liveDetections) {
                    const bestMatch = faceMatcher.findBestMatch(face.descriptor);
                    if (bestMatch.label === 'anshul') anshulFound = true;
                    if (bestMatch.label === 'priyanshi') priyanshiFound = true;
                }

                if (anshulFound && priyanshiFound) {
                    scanStatus.innerText = "Match Found! Unlocking our world... ❤️";
                    scanStatus.style.color = "#2ecc71";
                    clearInterval(intervalLoop);
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
        scanStatus.innerText = "Camera loading... Or use phrase below! 👇";
    }
}

window.addEventListener('DOMContentLoaded', initFaceTracker);