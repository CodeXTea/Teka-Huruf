const words = [
    { word: "AYAM", category: "Haiwan Berkaki Dua" },
    { word: "ANGSA", category: "Haiwan Berkaki Dua" },
    { word: "ARNAB", category: "Haiwan,Berkaki Empat" },
    { word: "BABI", category: "Haiwan,HARAM(IN ISLAM)" },
    { word: "KAKI", category: "Angota Badan" },
    { word: "LEMBU", category: "Haiwan Berkaki Empat" },
    { word: "KERBAU", category: "Haiwan Berkaki Empat" },
    { word: "KAMBING", category: "Haiwan Berkaki Empat" },
    { word: "LAMPU", category: "Benda(Terang)" },
    { word: "JAM", category: "Benda" },
    { word: "KUNCI", category: "Benda" },
    { word: "BADAK", category: "Haiwan Berkaki Empat" }
];

let currentWordObj = {};
let wordArray = [];
let displayWord = '';
let correctLetters = [];
let hintUsed = false;
let score = 0;

// Memulai permainan dengan data yang disimpan
// Memulai permainan dengan data yang disimpan
// Memulai permainan dengan data yang disimpan
function startGame() {
    // Hapus data permainan lama
    localStorage.removeItem('savedGame');

    const savedUser = localStorage.getItem('username');
    if (!savedUser) {
        document.getElementById('registration-container').style.display = 'block';
        document.getElementById('game-container').style.display = 'none';
        return;
    }

    // Mulai permainan baru jika tidak ada data permainan yang disimpan
    currentWordObj = getRandomWord();
    const currentWord = currentWordObj.word;
    wordArray = currentWord.split('');

    // Menentukan huruf yang akan ditampilkan
    const revealedIndex = Math.floor(Math.random() * wordArray.length);

    // Format kata yang akan ditampilkan dengan garis bawah untuk huruf yang belum diungkap
    displayWord = wordArray.map((letter, index) => 
        index === revealedIndex ? letter : '_'
    ).join(' ');

    // Inisialisasi array untuk melacak huruf yang benar
    correctLetters = new Array(wordArray.length).fill(false);
    correctLetters[revealedIndex] = true;
    hintUsed = false;

    // Tampilkan kata yang akan diteka
    document.getElementById('word-container').innerText = displayWord;
    document.getElementById('feedback').innerText = '';
    document.getElementById('user-input').value = '';
    document.getElementById('score').innerText = `Skor: ${score}`;
    
    document.getElementById('username-value').innerText = savedUser;
    document.getElementById('registration-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
}

// Mengambil kata acak dari daftar
function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

// Memeriksa huruf yang dimasukkan oleh pengguna
function checkLetter() {
    const input = document.getElementById('user-input').value.toUpperCase();
    if (input.length === 1 && /^[A-Z]$/.test(input)) {
        let newDisplayWord = '';
        let correctGuess = false;

        // Update displayWord berdasarkan huruf yang ditebak
        for (let i = 0; i < wordArray.length; i++) {
            if (wordArray[i] === input) {
                if (!correctLetters[i]) {
                    correctLetters[i] = true;
                    correctGuess = true;
                }
            }
            // Tampilkan huruf jika sudah benar atau jika sudah diungkap
            newDisplayWord += correctLetters[i] ? wordArray[i] : '_';
            newDisplayWord += ' '; // Tambahkan spasi
        }

        // Feedback kepada pengguna
        if (correctGuess) {
            document.getElementById('feedback').innerText = 'Benar!';
        } else {
            document.getElementById('feedback').innerText = 'Huruf tidak ada dalam kata.';
        }

        displayWord = newDisplayWord.trim(); // Hapus spasi ekstra di akhir
        document.getElementById('word-container').innerText = displayWord;
        
        // Simpan data permainan
        saveGame();
    } else {
        document.getElementById('feedback').innerText = 'Masukkan satu huruf saja.';
    }

    document.getElementById('user-input').value = '';
    document.getElementById('feedback').classList.add('fade-in');
    setTimeout(() => document.getElementById('feedback').classList.remove('fade-in'), 1000);
}

// Mengirimkan jawaban
// Mengirimkan jawaban
function submitAnswer() {
    // Hapus spasi untuk membandingkan jawaban
    if (displayWord.replace(/ /g, '') === currentWordObj.word) {
        score += 50; // Tambah poin jika kata lengkap benar
        document.getElementById('feedback').innerText = 'Selamat, jawaban Anda benar!';
        saveGame(); // Simpan data permainan
        setTimeout(() => {
            startGame(); // Mulai teka-teki baru setelah 2 detik
        }, 2000);
    } else {
        document.getElementById('feedback').innerText = 'Jawaban belum lengkap, coba lagi.';
    }

    document.getElementById('score').innerText = `Skor: ${score}`;
}

// Menampilkan petunjuk
function showHint() {
    if (!hintUsed) {
        document.getElementById('feedback').innerText = `Petunjuk: Ini adalah ${currentWordObj.category}`;
        hintUsed = true;
        saveGame(); // Simpan data permainan setelah petunjuk digunakan
    } else {
        document.getElementById('feedback').innerText = 'Petunjuk sudah digunakan!';
    }
}

// Mengatur ulang permainan
function resetGame() {
    score = 0;
    localStorage.removeItem('savedGame'); // Hapus data permainan yang tersimpan
    startGame();
}

// Simpan data permainan ke localStorage
function saveGame() {
    const gameData = {
        currentWordObj,
        wordArray,
        displayWord,
        correctLetters,
        hintUsed,
        score
    };
    localStorage.setItem('savedGame', JSON.stringify(gameData));
}

// Menangani pendaftaran pengguna
document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const usernameInput = document.getElementById('username').value.trim();
    if (usernameInput) {
        if (localStorage.getItem('username')) {
            document.getElementById('registration-feedback').innerText = 'Nama pengguna sudah ada!';
        } else {
            localStorage.setItem('username', usernameInput);
            document.getElementById('registration-feedback').innerText = 'Pendaftaran berhasil!';
            // Simpan nama pengguna yang mendaftar
            const savedUsernames = JSON.parse(localStorage.getItem('usernames')) || [];
            savedUsernames.push(usernameInput);
            localStorage.setItem('usernames', JSON.stringify(savedUsernames));
            setTimeout(startGame, 2000); // Mulai permainan setelah pendaftaran berhasil
        }
    } else {
        document.getElementById('registration-feedback').innerText = 'Nama pengguna tidak boleh kosong.';
    }
});

// Menangani klik pada tombol menu developer
document.getElementById('dev-menu-button').addEventListener('click', function() {
    document.getElementById('dev-menu-dialog').style.display = 'flex';
});

// Menangani submit password untuk menu developer
document.getElementById('dev-password-submit').addEventListener('click', function() {
    const password = document.getElementById('dev-password').value;
    if (password === 'AIMAN_DEV') { // Ganti dengan password yang sebenarnya
        // Tampilkan daftar nama pengguna
        const devUsernameList = document.getElementById('dev-username-list');
        devUsernameList.innerHTML = '';

        // Ambil nama pengguna dari localStorage
        const savedUsernames = JSON.parse(localStorage.getItem('usernames')) || [];
        if (savedUsernames.length > 0) {
            savedUsernames.forEach(username => {
                const item = document.createElement('div');
                item.innerText = username;
                devUsernameList.appendChild(item);
            });
        } else {
            devUsernameList.innerHTML = '<p>Belum ada pengguna terdaftar.</p>';
        }
        document.getElementById('dev-menu-dialog').style.display = 'none'; // Sembunyikan dialog setelah berhasil
    } else {
        document.getElementById('dev-feedback').innerText = 'Password salah!';
    }
});

// Menangani klik tombol tutup menu developer
document.getElementById('dev-password-cancel').addEventListener('click', function() {
    document.getElementById('dev-menu-dialog').style.display = 'none';
});

// Mulai permainan saat halaman dimuat
window.onload = startGame;

