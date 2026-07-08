/**
 * July 9th Interactive Journey - Main Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // State management
    const appState = {
        currentPhase: 1, // 1: Gatekeeper, 2: Journey, 3: Finale
        targetDate: getNextJuly9th(),
        countdownInterval: null,
        currentQuestionIndex: 0,
        correctAnswersCount: 0
    };

    // DOM Elements
    const elements = {
        // Phase containers
        phase1: document.getElementById('phase1'),
        phase2: document.getElementById('phase2'),
        phase3: document.getElementById('phase3'),

        // Countdown
        countdownCard: document.getElementById('countdown-card'),
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
        bypassTitleTrigger: document.getElementById('bypass-title-trigger'),
        devBypassBtn: document.getElementById('dev-bypass-btn'),
        unlockJourneyBtn: document.getElementById('unlock-journey-btn'),

        // Quiz
        quizCard: document.getElementById('quiz-card'),
        quizProgress: document.getElementById('quiz-progress'),
        questionText: document.getElementById('question-text'),
        optionsGrid: document.getElementById('options-grid'),
        questionNumber: document.getElementById('question-number'),

        // Timeline & Finale elements
        timelineContainer: document.getElementById('timeline-container'),
        scratchCanvas: document.getElementById('scratch-canvas'),
        scratchCardContainer: document.getElementById('scratch-card-container'),
        secretMessage: document.getElementById('secret-message'),
        generateComplimentBtn: document.getElementById('generate-compliment-btn'),
        complimentText: document.getElementById('compliment-text')
    };

    // Placeholder Quiz data (to be updated at Pause Point 1)
    let quizQuestions = [
        {
            question: "What is our favorite spot?",
            options: ["Auto", "Temple", "Heart of each other", "Bed😗"],
            answer: 3
        },
        {
            question: "How many Children we will have?",
            options: ["1", "2", "Teri marji chlegi", "Jitni baar towel mangungi"],
            answer: 3
        },
        {
            question: "How did love happen between us?",
            options: ["Meri harkato ki wjh se", "Teri harkaton ki wjh se", "Meri Aankhon ki wjh se", "Meri beauty ki wjh se"],
            answer: 2
        }
    ];

    /* ==========================================================================
       INITIALIZATION
       ========================================================================== */
    initCountdown();
    setupEventListeners();
    initComplimentEngine();
    initBackgroundMusic();

    /* ==========================================================================
       COUNTDOWN LOGIC
       ========================================================================== */
    function getNextJuly9th() {
        const now = new Date();
        const currentYear = now.getFullYear();
        let targetYear = currentYear;

        // July is index 6 (0-indexed)
        // Roll over to next year only if we are past July 9th completely (i.e. July 10th or later)
        const july10thThisYear = new Date(currentYear, 6, 10, 0, 0, 0);

        if (now >= july10thThisYear) {
            targetYear = currentYear + 1;
        }

        return new Date(targetYear, 6, 9, 0, 0, 0).getTime();
    }

    function initCountdown() {
        updateTimer(); // Initial call
        appState.countdownInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        const now = new Date().getTime();
        const distance = appState.targetDate - now;

        if (distance < 0) {
            // Countdown finished! Show unlock button.
            clearInterval(appState.countdownInterval);
            showUnlockButton();
            return;
        }

        // Time calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update DOM
        elements.days.textContent = String(days).padStart(2, '0');
        elements.hours.textContent = String(hours).padStart(2, '0');
        elements.minutes.textContent = String(minutes).padStart(2, '0');
        elements.seconds.textContent = String(seconds).padStart(2, '0');
    }

    function showUnlockButton() {
        // Freeze timer display to zero
        elements.days.textContent = "00";
        elements.hours.textContent = "00";
        elements.minutes.textContent = "00";
        elements.seconds.textContent = "00";

        // Hide timer display and footer/subtitle to clear up space
        const timerDisplay = elements.countdownCard.querySelector('.timer-display');
        const subtitle = elements.countdownCard.querySelector('.subtitle');
        const footer = elements.countdownCard.querySelector('.timer-footer');
        
        if (timerDisplay) timerDisplay.style.display = 'none';
        if (subtitle) subtitle.style.display = 'none';
        if (footer) footer.style.display = 'none';

        // Show the unlock button
        if (elements.unlockJourneyBtn) {
            elements.unlockJourneyBtn.classList.remove('hidden');
            elements.unlockJourneyBtn.classList.add('fade-in');
        }
    }

    /* ==========================================================================
       TRANSITIONS & BYPASS LOGIC
       ========================================================================== */
    function revealQuiz() {
        if (appState.countdownInterval) {
            clearInterval(appState.countdownInterval);
        }

        // Hide the developer bypass button once the countdown is bypassed or ends
        if (elements.devBypassBtn) {
            elements.devBypassBtn.classList.add('hidden');
        }

        // Remove fade-in animation to allow inline style opacity change to work
        elements.countdownCard.classList.remove('fade-in');

        // Fade out countdown card
        elements.countdownCard.style.opacity = '0';
        elements.countdownCard.style.transform = 'translateY(-20px)';
        elements.countdownCard.style.transition = 'all 0.5s ease';

        setTimeout(() => {
            elements.countdownCard.classList.add('hidden');
            elements.quizCard.classList.remove('hidden');
            elements.quizCard.classList.add('fade-in');
            loadQuestion();
        }, 500);
    }

    function setupEventListeners() {
        // Dev bypass via key button click
        if (elements.devBypassBtn) {
            elements.devBypassBtn.addEventListener('click', () => {
                revealQuiz();
            });
        }

        // Dev bypass via double click on main title
        if (elements.bypassTitleTrigger) {
            elements.bypassTitleTrigger.addEventListener('dblclick', () => {
                revealQuiz();
            });
        }

        // Unlock button click
        if (elements.unlockJourneyBtn) {
            elements.unlockJourneyBtn.addEventListener('click', () => {
                revealQuiz();
            });
        }
    }

    /* ==========================================================================
       QUIZ CONTROLLER (Placeholder Logic)
       ========================================================================== */
    function loadQuestion() {
        const question = quizQuestions[appState.currentQuestionIndex];

        // Update progress bar
        const progressPercent = ((appState.currentQuestionIndex + 1) / quizQuestions.length) * 100;
        elements.quizProgress.style.width = `${progressPercent}%`;

        // Update question number text
        elements.questionNumber.textContent = `Question ${appState.currentQuestionIndex + 1} of ${quizQuestions.length}`;

        // Set question text
        elements.questionText.textContent = question.question;

        // Clear options grid
        elements.optionsGrid.innerHTML = '';

        // Load option buttons
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.innerHTML = `
                <span>${option}</span>
                <i class="fa-regular fa-circle"></i>
            `;
            button.addEventListener('click', () => handleOptionClick(index, button));
            elements.optionsGrid.appendChild(button);
        });
    }

    function handleOptionClick(selectedIndex, buttonElement) {
        const question = quizQuestions[appState.currentQuestionIndex];
        const buttons = elements.optionsGrid.querySelectorAll('.option-btn');

        // Disable all buttons to prevent multiple clicks
        buttons.forEach(btn => btn.disabled = true);

        if (selectedIndex === question.answer) {
            // Correct Answer
            buttonElement.classList.add('correct');
            buttonElement.querySelector('i').className = 'fa-solid fa-circle-check';

            setTimeout(() => {
                if (appState.currentQuestionIndex < quizQuestions.length - 1) {
                    appState.currentQuestionIndex++;
                    loadQuestion();
                } else {
                    unlockJourney();
                }
            }, 1000);
        } else {
            // Wrong Answer
            buttonElement.classList.add('wrong');
            buttonElement.querySelector('i').className = 'fa-solid fa-circle-xmark';

            // Re-enable and reset after brief delay to let user try again
            setTimeout(() => {
                buttons.forEach(btn => {
                    btn.disabled = false;
                    btn.classList.remove('wrong');
                    btn.querySelector('i').className = 'fa-regular fa-circle';
                });
            }, 1200);
        }
    }

    function unlockJourney() {
        // Transition to Phase 2
        elements.phase1.classList.remove('active');
        elements.phase1.style.opacity = '0';
        elements.phase1.style.transform = 'translateY(-20px)';
        elements.phase1.style.transition = 'all 0.8s ease';

        setTimeout(() => {
            elements.phase1.classList.add('hidden');
            elements.phase2.classList.remove('hidden');
            elements.phase2.classList.add('active');
            elements.phase2.classList.add('fade-in');

            // Scroll to timeline header smoothly
            elements.phase2.scrollIntoView({ behavior: 'smooth' });

            // Trigger timeline building (Phase 2 initialization)
            initTimeline();
        }, 800);
    }

    /* ==========================================================================
       PHASE 2 & 3 IMPLEMENTATIONS
       ========================================================================== */
    const timelineData = [
        {
            date: "",
            caption: "Your Eyes are the first attention seeker, they talks, steal hearts and even make me feel alive.",
            image: "assets/1.png"
        },
        {
            date: "",
            caption: "Your dedication to achieve something is my second love, like you will just find me if you love me.",
            image: "assets/2.jpg"
        },
        {
            date: "",
            caption: "My all goals depend on me only, but my mental health and I depend on you.",
            image: "assets/3.jpg"
        },
        {
            date: "",
            caption: "Thanks to your parents for giving birth to you, I love them alot.",
            image: "assets/4.jpg"
        },
        {
            date: "",
            caption: "The day is precious and you too, Once again Happy Birthday Laado, I love you.",
            image: "assets/5.png"
        }
    ];

    function initTimeline() {
        // Clear timeline container first
        elements.timelineContainer.innerHTML = '';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, {
            threshold: 0.15
        });

        // Inject timeline items dynamically
        timelineData.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'timeline-item';

            itemElement.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="polaroid-card">
                    <div class="polaroid-img-wrapper">
                        <img class="polaroid-img" src="${item.image}" alt="${item.caption}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="polaroid-fallback" style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%); color: white; font-size: 2.5rem; text-shadow: 0 0 10px rgba(255,255,255,0.5);">
                            <i class="fa-solid fa-heart"></i>
                        </div>
                    </div>
                    <div class="polaroid-caption">
                        ${item.caption}
                        <span class="polaroid-date">${item.date}</span>
                    </div>
                </div>
            `;
            elements.timelineContainer.appendChild(itemElement);
            observer.observe(itemElement);
        });

        // Add a button to unlock Phase 3 at the bottom
        const transitionContainer = document.createElement('div');
        transitionContainer.className = 'timeline-footer fade-in';
        transitionContainer.style.textAlign = 'center';
        transitionContainer.style.marginTop = '40px';
        transitionContainer.style.width = '100%';
        transitionContainer.style.display = 'flex';
        transitionContainer.style.justifyContent = 'center';

        transitionContainer.innerHTML = `
            <button id="unlock-finale-btn" class="primary-btn">
                <span class="btn-text">Unlock the Surprise</span>
                <i class="fa-solid fa-gift"></i>
            </button>
        `;

        elements.timelineContainer.appendChild(transitionContainer);

        const unlockBtn = transitionContainer.querySelector('#unlock-finale-btn');
        unlockBtn.addEventListener('click', () => {
            unlockFinale();
        });
    }

    function unlockFinale() {
        // Transition to Phase 3
        elements.phase2.classList.remove('active');
        elements.phase2.style.opacity = '0';
        elements.phase2.style.transform = 'translateY(-20px)';
        elements.phase2.style.transition = 'all 0.8s ease';

        setTimeout(() => {
            elements.phase2.classList.add('hidden');
            elements.phase3.classList.remove('hidden');
            elements.phase3.classList.add('active');
            elements.phase3.classList.add('fade-in');

            // Scroll to phase 3 smoothly
            elements.phase3.scrollIntoView({ behavior: 'smooth' });

            // Initialize scratch card
            initScratchCard();
        }, 800);
    }

    function initScratchCard() {
        const canvas = elements.scratchCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Reset canvas size to match visual bounding rect
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Fill canvas with a beautiful gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#532e73'); // Deep dark purple
        gradient.addColorStop(0.5, '#9d4edd'); // Primary purple
        gradient.addColorStop(1, '#ff7096'); // Accent pink
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add text on the scratch card
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 16px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Scratch with love ✨', canvas.width / 2, canvas.height / 2);

        // Set up the secret message text dynamically
        const secretMessageText = `To a very special person: May your day be filled with endless smiles, warmth, and the love you deserve. Thank you for being such an amazing part of my journey. Here's to making many more wonderful memories together! ✨`;
        elements.secretMessage.innerHTML = `
            <h3>Happy Birthday! 🎉</h3>
            <p>${secretMessageText}</p>
        `;

        // Track scratch events
        let isDrawing = false;

        function getMousePos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        function scratch(e) {
            if (!isDrawing) return;
            e.preventDefault();
            const pos = getMousePos(e);

            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
            ctx.fill();

            checkScratchPercentage();
        }

        function startScratch(e) {
            isDrawing = true;
            scratch(e);
        }

        // Desktop mouse events
        canvas.addEventListener('mousedown', startScratch);
        canvas.addEventListener('mousemove', scratch);
        window.addEventListener('mouseup', () => isDrawing = false);

        // Mobile touch events
        canvas.addEventListener('touchstart', startScratch, { passive: false });
        canvas.addEventListener('touchmove', scratch, { passive: false });
        window.addEventListener('touchend', () => isDrawing = false);

        // Calculate percentage cleared
        let wasCleared = false;
        function checkScratchPercentage() {
            if (wasCleared) return;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let clearedCount = 0;

            // Check alpha channel (every 4th value)
            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] === 0) {
                    clearedCount++;
                }
            }

            const totalPixels = pixels.length / 4;
            const percentage = (clearedCount / totalPixels) * 100;

            if (percentage > 45) { // If more than 45% is cleared, reveal completely
                wasCleared = true;
                canvas.classList.add('fade-out');
                // Remove canvas pointer events
                canvas.style.pointerEvents = 'none';
            }
        }
    }

    const compliments = [
        "You make the world a brighter, happier place just by being in it. 🌟",
        "Your laugh is infectious and has the power to light up the darkest room. 😄",
        "The kindness you show to others is a beautiful reflection of your soul. 💖",
        "You are capable of achieving anything you set your mind to. Keep shining! 🚀",
        "Your presence brings a unique warmth and comfort that is hard to find. 🌸",
        "You have an amazing heart and a mind full of brilliant ideas. 🧠✨",
        "Your strength and resilience are deeply inspiring. 💪",
        "Thank you for being uniquely, wonderfully, and perfectly you. 🎁",
        "You deserve all the love, happiness, and success in the world today. 🥳"
    ];

    let isTyping = false;

    function initComplimentEngine() {
        if (!elements.generateComplimentBtn) return;

        elements.generateComplimentBtn.addEventListener('click', () => {
            if (isTyping) return;

            // Choose a random compliment (different from current if possible)
            let randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
            while (randomCompliment === elements.complimentText.textContent) {
                randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
            }

            typeWriter(randomCompliment);
        });
    }

    function typeWriter(text) {
        isTyping = true;
        elements.complimentText.textContent = '';
        elements.generateComplimentBtn.disabled = true;

        let i = 0;
        const speed = 40; // ms per character

        function type() {
            if (i < text.length) {
                elements.complimentText.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                isTyping = false;
                elements.generateComplimentBtn.disabled = false;
            }
        }

        type();
    }

    /* ==========================================================================
       BACKGROUND MUSIC CONTROLLER
       ========================================================================== */
    let bgMusic = null;
    let isMuted = false;

    function initBackgroundMusic() {
        bgMusic = new Audio('assets/song.mp3');
        bgMusic.loop = true;
        bgMusic.volume = 0.4; // 40% volume

        const musicToggle = document.getElementById('music-toggle');
        const musicIcon = musicToggle ? musicToggle.querySelector('i') : null;

        function playMusic() {
            if (isMuted) return;
            bgMusic.play().then(() => {
                if (musicIcon) {
                    musicIcon.className = 'fa-solid fa-volume-high';
                }
                // Once music successfully starts, clean up document level interaction listeners
                document.removeEventListener('click', playMusic);
                document.removeEventListener('touchstart', playMusic);
            }).catch(err => {
                console.log("Autoplay blocked, waiting for user interaction.", err);
            });
        }

        // Try to play immediately
        playMusic();

        // Autoplay fallback: start playing on first mouse click or touch gesture
        document.addEventListener('click', playMusic);
        document.addEventListener('touchstart', playMusic);

        // Music toggle button handler
        if (musicToggle) {
            musicToggle.addEventListener('click', (e) => {
                e.stopPropagation(); // Avoid triggering document level click listener
                if (bgMusic.paused) {
                    bgMusic.play();
                    isMuted = false;
                    if (musicIcon) musicIcon.className = 'fa-solid fa-volume-high';
                } else {
                    bgMusic.pause();
                    isMuted = true;
                    if (musicIcon) musicIcon.className = 'fa-solid fa-volume-xmark';
                }
            });
        }
    }
});
