// Global variables for game state
let memoryCards = [];
let flippedCards = [];
let matchedCards = [];
let canFlip = true;
let startTime; // Variable to track the game start time
let timerInterval; // Variable to hold the timer interval

// Initialize Memory Game
async function initMemoryGame() {
    try {
        // Fetch words from the backend
        const response = await fetch('http://localhost:7777/api/memorify/cards');
        if (!response.ok) throw new Error('Failed to fetch cards');
        const words = await response.json();

        // Randomly select 6 pairs from the fetched data
        let selectedWords = [];
        while (selectedWords.length < 6) {
            const randomIndex = Math.floor(Math.random() * words.length);
            const randomPair = words[randomIndex];
            if (!selectedWords.includes(randomPair)) {
                selectedWords.push(randomPair);
            }
        }

        // Create memory cards from selected words
        memoryCards = [];
        selectedWords.forEach(pair => {
            memoryCards.push({ text: pair.word, type: 'word', pair: pair.definition });
            memoryCards.push({ text: pair.definition, type: 'definition', pair: pair.word });
        });

        // Shuffle cards
        memoryCards.sort(() => Math.random() - 0.5);

        // Render cards on the game board
        const memoryGameContainer = document.getElementById('memory-game');
        memoryGameContainer.innerHTML = '';

        memoryCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.text = card.text;
            cardElement.dataset.index = index;
            cardElement.dataset.type = card.type;
            cardElement.dataset.pair = card.pair;
            cardElement.innerText = ''; // Initially, the card is blank
            cardElement.addEventListener('click', () => flipCard(cardElement));
            memoryGameContainer.appendChild(cardElement);
        });

        // Reset game state
        flippedCards = [];
        matchedCards = [];
        canFlip = true;
        document.getElementById('memory-feedback').textContent = ''; // Reset feedback

        // Start the timer
        startTimer();
    } catch (error) {
        console.error('Error initializing game:', error);
        document.getElementById('memory-feedback').textContent = 'Failed to load cards';
    }
}

// Function to start the timer
function startTimer() {
    startTime = Date.now();
    const timerDisplay = document.getElementById('timer-display');
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `Time: ${elapsedTime} seconds`;
    }, 1000);
}

// Function to stop the timer and get the total time
function stopTimer() {
    clearInterval(timerInterval);
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    return totalTime;
}

// Flip a card
function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || matchedCards.includes(card.dataset.index)) return;

    // Flip the card and display its text
    card.innerText = card.dataset.text;
    card.classList.add('flipped');
    flippedCards.push(card);

    // Check for a match when two cards are flipped
    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

// Check if the flipped cards match
function checkForMatch() {
    canFlip = false;
    const [card1, card2] = flippedCards;

    if (card1.dataset.pair === card2.dataset.text && card2.dataset.pair === card1.dataset.text) {
        matchedCards.push(card1.dataset.index, card2.dataset.index);
        document.getElementById('memory-feedback').textContent = 'Match found!';
        document.getElementById('memory-feedback').style.visibility = 'visible';

        setTimeout(() => {
            document.getElementById('memory-feedback').style.visibility = 'hidden';
        }, 2000);

        flippedCards = [];
        canFlip = true;

        if (matchedCards.length === memoryCards.length) {
            setTimeout(() => {
                document.getElementById('memory-feedback').textContent = 'You matched all the cards!';
                document.getElementById('memory-feedback').style.visibility = 'visible';
            }, 3100);

            // Stop the timer and save the score
            const totalTime = stopTimer();
            saveGameTime(totalTime);
        }
    } else {
        setTimeout(() => {
            card1.innerText = '';
            card2.innerText = '';
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

async function saveMemorifyProgress(completedCards) {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('You are not logged in. Please log in first.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:7777/api/memorify/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, completedCards })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        console.log('Memorify progress saved successfully');
    } catch (error) {
        console.error('Error saving Memorify progress:', error);
    }
}

let completedCards = 0; // Hitung jumlah kartu yang sudah diselesaikan

function completeCard() {
    completedCards += 1; // Tambah jumlah kartu yang diselesaikan
    saveMemorifyProgress(completedCards); // Simpan progress setelah menyelesaikan kartu
    loadNextCard(); // Fungsi untuk memuat kartu berikutnya
}


// Reset the game
function resetMemoryGame() {
    initMemoryGame();
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initMemoryGame);