let currentLevel = '';
let scrambledLetters = [];
let feedback = '';
let currentWord = {};
let draggedLetter = null;
let questionCount = 0;

async function startScrambify(level) {
    currentLevel = level;
    questionCount = 0;
    document.getElementById('scrambify-section').style.display = 'none'; // Sembunyikan pemilihan level
    document.getElementById('scrambify-game-section').style.display = 'block'; // Tampilkan bagian permainan
    await loadScrambledWord(level);
}

async function loadScrambledWord(level) {
    try {
        // Fetch kata dari server berdasarkan level
        const response = await fetch(`http://localhost:7777/api/scrambify/words?level=${level}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Pastikan token dikirim jika auth diperlukan
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const words = await response.json();
        currentWord = words[Math.floor(Math.random() * words.length)];
        scrambledLetters = shuffleArray(currentWord.word.split('')); // Acak huruf-huruf kata
        renderScrambledLetters(); // Tampilkan huruf-huruf yang diacak di layar
        document.getElementById('game-feedback').innerText = ''; // Kosongkan feedback
    } catch (error) {
        console.error('Error fetching words:', error);
        document.getElementById('game-feedback').innerText = 'Failed to load words. Please try again.';
    }
}

// Fungsi untuk mengacak array
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Fungsi untuk menampilkan huruf yang diacak ke dalam HTML
function renderScrambledLetters() {
    const scrambledContainer = document.getElementById('scrambled-letters');
    scrambledContainer.innerHTML = '';
    scrambledLetters.forEach((letter, index) => {
        const letterElement = document.createElement('div');
        letterElement.className = 'letter';
        letterElement.draggable = true;
        letterElement.innerText = letter;
        letterElement.addEventListener('dragstart', (event) => dragStart(event, index));
        letterElement.addEventListener('dragover', dragOver);
        letterElement.addEventListener('drop', (event) => drop(event, index));
        letterElement.addEventListener('dragend', dragEnd);
        scrambledContainer.appendChild(letterElement);
    });
}

// Fungsi untuk mengecek jawaban pengguna
function checkAnswer() {
    const userWord = scrambledLetters.join('');
    if (userWord === currentWord.word) {
        feedback = 'Correct! Well done!';
    } else {
        feedback = 'Incorrect answer';
    }
    questionCount += 1;
    document.getElementById('game-feedback').innerText = feedback;

    // Simpan progress setelah setiap jawaban
    saveProgress();

    // Lanjutkan ke soal berikutnya setelah jeda 1 detik
    setTimeout(() => loadScrambledWord(currentLevel), 1000);
}

// Fungsi untuk menampilkan hint
function giveHint() {
    feedback = `Hint: ${currentWord.hint}`;
    document.getElementById('game-feedback').innerText = feedback;
}

async function saveProgress() {
    try {
        const username = localStorage.getItem('username'); // Ambil username dari localStorage

        if (!username) {
            console.error('Username is not available.');
            return;
        }

        const response = await fetch('http://localhost:7777/api/scrambify/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username, // Kirim username
                level: currentLevel, // Kirim level
                questionCount: questionCount // Kirim jumlah pertanyaan yang dijawab
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        console.log('Progress saved successfully');
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

// Fungsi untuk memulai drag huruf
function dragStart(event, index) {
    draggedLetter = index;
    event.target.style.opacity = '0.5';
}

// Fungsi untuk menangani event drag-over
function dragOver(event) {
    event.preventDefault();
}

// Fungsi untuk menangani drop (menyusun ulang huruf)
function drop(event, targetIndex) {
    event.preventDefault();
    let newLetters = [...scrambledLetters];
    const draggedItem = newLetters.splice(draggedLetter, 1)[0];
    newLetters.splice(targetIndex, 0, draggedItem);
    scrambledLetters = newLetters;
    renderScrambledLetters();
}

// Fungsi untuk mengakhiri drag
function dragEnd(event) {
    event.target.style.opacity = '1';
}