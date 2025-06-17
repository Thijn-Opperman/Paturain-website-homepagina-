// Simpele functie om de popup te verbergen
function startGame() {
    document.getElementById('welcomeModal').style.display = 'none';
    initializeMemoryGame(); // Start het spel na het sluiten van de popup
}

// Game state variables
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let canFlip = true;
let gameStarted = false;

// DOM Elements
const gameModal = document.getElementById('gameModal');
const memoryGrid = document.getElementById('memoryGrid');
const attemptsDisplay = document.getElementById('attempts');
const finalAttemptsDisplay = document.getElementById('finalAttempts');
const winModal = document.getElementById('winModal');

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the memory game page
    const isMemoryPage = document.querySelector('.memory-page') !== null;

    if (isMemoryPage) {
        initializeMemoryGame();
    }

    // Add navigation underline animation
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const underline = document.createElement('span');
        underline.classList.add('nav-underline');
        link.appendChild(underline);

        link.addEventListener('mouseenter', () => {
            underline.style.transform = 'scaleX(1)';
            underline.style.opacity = '1';
        });

        link.addEventListener('mouseleave', () => {
            if (!link.classList.contains('active')) {
                underline.style.transform = 'scaleX(0)';
                underline.style.opacity = '0';
            }
        });
    });
});

// Memory game initialization
function initializeMemoryGame() {
    const memoryGrid = document.getElementById('memoryGrid');
    if (!memoryGrid) return;

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
                    if (winModal) {
                        winModal.style.display = 'flex';
                    }
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

// Function to start the game (called from welcome modal)
function startGame() {
    const welcomeModal = document.getElementById('welcomeModal');
    if (welcomeModal) {
        welcomeModal.style.display = 'none';
    }
    initializeMemoryGame();
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

const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    // Maak een underline element voor elke link
    const underline = document.createElement('span');
    underline.classList.add('nav-underline');
    link.appendChild(underline);

    // Voeg mouseover event toe
    link.addEventListener('mouseenter', (e) => {
        const underline = e.target.querySelector('.nav-underline');
        underline.style.transform = 'scaleX(1)';
        underline.style.opacity = '1';
    });

    // Voeg mouseout event toe
    link.addEventListener('mouseleave', (e) => {
        const underline = e.target.querySelector('.nav-underline');
        underline.style.transform = 'scaleX(0)';
        underline.style.opacity = '0';
    });
});

// Combination cards animation
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.combination-card');

    // Intersection Observer voor het detecteren wanneer cards in beeld komen
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Voeg een vertraging toe voor elke volgende kaart
                const delay = Array.from(cards).indexOf(entry.target) * 200;
                entry.target.style.transitionDelay = `${delay}ms`;
            }
        });
    }, {
        threshold: 0.2 // Wanneer 20% van de card zichtbaar is
    });

    // Observeer elke card
    cards.forEach(card => {
        observer.observe(card);

        // Hover effect met tilt
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        // Reset transform bij mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease';
        });
    });
});

// Start game function
function startGame() {
    const gameCode = document.getElementById('gameCode').value.trim();

    if (!gameCode) {
        alert('Vul eerst een code in om te beginnen.');
        return;
    }

    // Here you would typically validate the code
    // For now, we'll just proceed with the game
    gameModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open

    if (!gameStarted) {
        initializeGame();
        gameStarted = true;
    }
}

// Initialize the game
function initializeGame() {
    attempts = 0;
    flippedCards = [];
    matchedPairs = 0;
    attemptsDisplay.textContent = attempts;

    // Clear the grid
    memoryGrid.innerHTML = '';

    // Create and shuffle cards
    const cards = createCards();

    // Verify we have 16 cards before shuffling
    if (cards.length !== 16) {
        console.error('Expected 16 cards, but got', cards.length);
        return;
    }

    shuffleCards(cards);

    // Add cards to the grid
    cards.forEach(card => {
        memoryGrid.appendChild(card);
    });
}

// Create memory cards
function createCards() {
    const cardValues = [
        'Paturain naturel memory card', 'Paturain naturel memory card',
        'Paturain naturel light memory card', 'Paturain naturel light memory card',
        'Melk memory card', 'Melk memory card',
        'room memory card', 'room memory card',
        'Zout memory card', 'Zout memory card',
        'Provence memory card', 'Provence memory card',
        'Frankrijk memory card', 'Frankrijk memory card',
        'Paturain logo memory card', 'Paturain logo memory card'
    ];

    // Create the cards
    const cards = cardValues.map(value => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.value = value;

        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';

        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.style.backgroundImage = `url('img/${value}.png')`;
        cardBack.style.backgroundSize = 'cover';
        cardBack.style.backgroundPosition = 'center';

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        card.addEventListener('click', () => flipCard(card));

        return card;
    });

    // Verify we have 16 cards
    console.log('Number of cards created:', cards.length);

    return cards;
}

// Shuffle cards using Fisher-Yates algorithm
function shuffleCards(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

// Flip card function
function flipCard(card) {
    if (flippedCards.length === 2) return;
    if (card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        attempts++;
        attemptsDisplay.textContent = attempts;
        checkMatch();
    }
}

// Check if flipped cards match
function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.value === card2.dataset.value;

    if (match) {
        matchedPairs++;
        flippedCards = [];

        if (matchedPairs === 8) {
            setTimeout(showWinModal, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// Show win modal
function showWinModal() {
    finalAttemptsDisplay.textContent = attempts;
    // Store attempts in localStorage
    localStorage.setItem('memoryAttempts', attempts);

    // Automatically redirect to winner form after a short delay
    setTimeout(() => {
        window.location.href = 'winner.html';
    }, 2000); // 2 second delay to show the win message

    winModal.style.display = 'flex';
}

// Close win modal
function closeWinModal() {
    winModal.style.display = 'none';
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // The game will be initialized when the user enters a code and clicks "Speel nu"
}); 