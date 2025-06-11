// Simpele functie om de popup te verbergen
function startGame() {
    document.getElementById('welcomeModal').style.display = 'none';
    initializeMemoryGame(); // Start het spel na het sluiten van de popup
}

// Memory game initialization
function initializeMemoryGame() {
    const memoryGrid = document.getElementById('memoryGrid');
    if (!memoryGrid) return;

    // Leeg eerst het grid
    memoryGrid.innerHTML = '';

    // Reset game state
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    canFlip = true;
    document.querySelector('.attempts-counter p').textContent = 'Aantal pogingen: 0';

    // Array van kaartafbeeldingen (8 paren = 16 kaarten)
    const cardImages = [
        'img/Paturain logo memory card.png',
        'img/Frankrijk memory card.png',
        'img/Provence memory card.png',
        'img/Zout memory card.png',
        'img/room memory card.png',
        'img/Melk memory card.png',
        'img/Paturain naturel light memory card.png',
        'img/Paturain naturel memory card.png'
    ];

    // Dubbele array maken voor paren en shufflen
    let cards = [...cardImages, ...cardImages]
        .sort(() => Math.random() - 0.5);

    // Kaarten toevoegen aan het grid
    cards.forEach((img, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.cardIndex = index;
        card.dataset.cardImage = img;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back" style="background-image: url('${img}')"></div>
            </div>
        `;

        card.addEventListener('click', flipCard);
        memoryGrid.appendChild(card);
    });
}

// Game state variables
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let canFlip = true;

// Card flip functionality
function flipCard() {
    if (!canFlip || this.classList.contains('flipped') || flippedCards.length >= 2) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        attempts++;
        document.querySelector('.attempts-counter p').textContent = `Aantal pogingen: ${attempts}`;
        canFlip = false;

        const [card1, card2] = flippedCards;
        if (card1.dataset.cardImage === card2.dataset.cardImage) {
            matchedPairs++;
            flippedCards = [];
            canFlip = true;

            if (matchedPairs === 8) {
                setTimeout(() => {
                    // Update het aantal pogingen in de win-modal
                    document.getElementById('finalAttempts').textContent = attempts;
                    // Sla het aantal pogingen op in localStorage
                    localStorage.setItem('memoryAttempts', attempts);
                    // Toon de win-modal
                    const winModal = document.getElementById('winModal');
                    winModal.style.display = 'flex';
                }, 500);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the memory game page
    const isMemoryPage = document.querySelector('.memory-page') !== null;

    if (isMemoryPage) {
        // Memory Game Logic
        const memoryGrid = document.getElementById('memoryGrid');
        const scoreElement = document.getElementById('score');
        const movesElement = document.getElementById('moves');
        const restartButton = document.getElementById('restartGame');

        let cards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let moves = 0;
        let score = 0;
        let canFlip = true;

        // Card images array
        const cardImages = [
            'Paturain logo memory card.png',
            'Frankrijk memory card.png',
            'Provence memory card.png',
            'Zout memory card.png',
            'room memory card.png',
            'Melk memory card.png',
            'Paturain naturel light memory card.png',
            'Paturain naturel memory card.png'
        ];

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function createCard(imagePath) {
            const card = document.createElement('div');
            card.className = 'memory-card';

            const front = document.createElement('div');
            front.className = 'front';

            const back = document.createElement('div');
            back.className = 'back';

            const img = document.createElement('img');
            img.src = `img/${imagePath}`;
            img.alt = 'Memory Card';

            back.appendChild(img);
            card.appendChild(front);
            card.appendChild(back);

            return card;
        }

        function initializeGame() {
            memoryGrid.innerHTML = '';
            cards = [];
            flippedCards = [];
            matchedPairs = 0;
            moves = 0;
            score = 0;
            canFlip = true;

            // Create pairs of cards
            const cardPairs = [...cardImages, ...cardImages];
            shuffleArray(cardPairs);

            cardPairs.forEach(imagePath => {
                const card = createCard(imagePath);
                memoryGrid.appendChild(card);
                cards.push(card);

                card.addEventListener('click', () => flipCard(card, imagePath));
            });
        }

        function flipCard(card, imagePath) {
            if (!canFlip || flippedCards.includes(card) || card.classList.contains('matched')) {
                return;
            }

            card.classList.add('flipped');
            flippedCards.push({ card, imagePath });

            if (flippedCards.length === 2) {
                moves++;
                document.querySelector('.attempts-counter p').textContent = `Aantal pogingen: ${moves}`;
                canFlip = false;

                checkMatch();
            }
        }

        function checkMatch() {
            const [first, second] = flippedCards;
            const match = first.imagePath === second.imagePath;

            if (match) {
                first.card.classList.add('matched');
                second.card.classList.add('matched');
                matchedPairs++;
                score += 10;

                if (matchedPairs === cardImages.length) {
                    setTimeout(() => {
                        document.querySelector('.modal').style.display = 'flex';
                    }, 500);
                }
            } else {
                setTimeout(() => {
                    first.card.classList.remove('flipped');
                    second.card.classList.remove('flipped');
                }, 1000);
            }

            setTimeout(() => {
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }

        // Initialize the game immediately
        initializeGame();

        // Add event listener for restart button if it exists
        if (restartButton) {
            restartButton.addEventListener('click', initializeGame);
        }

        // Add event listener for the modal form submission
        const modalButton = document.querySelector('.modal-button');
        const nameInput = document.getElementById('nameInput');

        if (modalButton && nameInput) {
            modalButton.addEventListener('click', () => {
                const playerName = nameInput.value.trim();
                if (playerName) {
                    // Here you can handle the form submission, e.g., send to a server
                    alert(`Bedankt ${playerName}! Je score is opgeslagen.`);
                    document.querySelector('.modal').style.display = 'none';
                    initializeGame(); // Start a new game
                } else {
                    alert('Vul alsjeblieft je naam in.');
                }
            });
        }
    }

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline, .btn-login, .btn-signin');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in animation to sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transition = 'opacity 0.5s ease-in-out';
        observer.observe(section);
    });

    // Handle navigation menu for mobile
    const createMobileMenu = () => {
        const nav = document.querySelector('.main-nav');
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        nav.insertBefore(mobileMenuBtn, nav.firstChild);

        mobileMenuBtn.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('show');
            mobileMenuBtn.classList.toggle('active');
        });
    };

    // Only create mobile menu if screen width is below 768px
    if (window.innerWidth < 768) {
        createMobileMenu();
    }

    // Handle window resize
    let timeout = false;
    window.addEventListener('resize', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const mobileMenu = document.querySelector('.mobile-menu-btn');
            if (window.innerWidth < 768 && !mobileMenu) {
                createMobileMenu();
            } else if (window.innerWidth >= 768 && mobileMenu) {
                mobileMenu.remove();
                document.querySelector('.nav-links').classList.remove('show');
            }
        }, 250);
    });

    // Add CSS for mobile menu button and navigation
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu-btn {
            display: none;
            flex-direction: column;
            justify-content: space-between;
            width: 30px;
            height: 20px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
        }

        .mobile-menu-btn span {
            width: 100%;
            height: 2px;
            background-color: var(--text-color);
            transition: var(--transition);
        }

        .mobile-menu-btn.active span:nth-child(1) {
            transform: translateY(9px) rotate(45deg);
        }

        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }

        .mobile-menu-btn.active span:nth-child(3) {
            transform: translateY(-9px) rotate(-45deg);
        }

        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: flex;
            }

            .nav-links {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--white);
                padding: 1rem;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
                display: none;
                box-shadow: var(--shadow);
            }

            .nav-links.show {
                display: flex;
            }
        }

        .fade-in {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);

    // Welcome Modal functionality
    function startGame() {
        const nameInput = document.getElementById('playerName');
        const welcomeModal = document.getElementById('welcomeModal');

        if (nameInput.value.trim() === '') {
            nameInput.focus();
            return;
        }

        // Direct de modal verbergen
        welcomeModal.style.display = 'none';
    }

    // Add animations and styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        .shake {
            animation: shake 0.3s ease-in-out;
        }
    `;
    document.head.appendChild(modalStyles);

    function startGame() {
        const nameInput = document.getElementById('playerName');
        const welcomeModal = document.getElementById('welcomeModal');

        if (nameInput.value.trim() === '') {
            nameInput.classList.add('shake');
            setTimeout(() => nameInput.classList.remove('shake'), 500);
            nameInput.focus();
            return;
        }

        playerName = nameInput.value.trim();

        // Voeg een fade-out effect toe
        welcomeModal.style.opacity = '0';
        welcomeModal.style.transition = 'opacity 0.3s ease-out';

        // Verwijder de modal na de fade-out animatie
        setTimeout(() => {
            welcomeModal.style.display = 'none';
            // Zorg dat het spel geïnitialiseerd wordt als de popup weg is
            if (typeof initializeGame === 'function') {
                initializeGame(); // Start het spel
            } else {
                console.error('initializeGame function not found');
                // Start het spel op een alternatieve manier als de functie niet bestaat
                const memoryGrid = document.getElementById('memoryGrid');
                if (memoryGrid) {
                    memoryGrid.style.display = 'grid';
                    createCards(); // Roep de functie aan die de kaarten maakt
                }
            }
        }, 300);
    }

    // Prevent closing modal by clicking outside
    document.querySelector('.welcome-modal').addEventListener('click', function (e) {
        if (e.target === this) {
            e.preventDefault();
            const nameInput = document.getElementById('playerName');
            if (nameInput.value.trim() === '') {
                nameInput.focus();
            }
        }
    });

    // Functie om het formulier voor te vullen
    document.addEventListener('DOMContentLoaded', function () {
        // Check of we op de winner pagina zijn
        const attemptsInput = document.getElementById('attempts');
        if (attemptsInput) {
            // Haal het aantal pogingen op uit localStorage
            const attempts = localStorage.getItem('memoryAttempts');
            if (attempts) {
                attemptsInput.value = attempts;
            }
        }
    });
}); 