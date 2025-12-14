// Quiz kodu (önceki hali)
const questions = [
    { q: "Göz sağlığı için düzenli göz muayenesi önemlidir.", a: true },
    { q: "Katarakt sadece yaşlılarda görülür.", a: false },
    { q: "Ekran karşısında uzun süre kalmak göz yorgunluğuna neden olabilir.", a: true },
    { q: "Göz damlaları göz hastalıklarını tamamen iyileştirir.", a: false },
    { q: "Gözlerinizi düzenli olarak dinlendirmek önemlidir.", a: true }
];

let current = 0;

function showQuestion() {
    if (current < questions.length) {
        document.getElementById("question").textContent = questions[current].q;
        document.getElementById("feedback").textContent = "";
    } else {
        document.getElementById("question").textContent = "Quiz tamamlandı! Tebrikler 🎉";
        document.getElementById("feedback").textContent = "";
        document.querySelectorAll("button").forEach(btn => btn.disabled = true);
    }
}

function answer(userAnswer) {
    const correct = questions[current].a;
    const feedback = document.getElementById("feedback");
    if (userAnswer === correct) {
        feedback.textContent = "Doğru!";
        feedback.style.color = "green";
    } else {
        feedback.textContent = "Yanlış!";
        feedback.style.color = "red";
    }
    current++;
    setTimeout(showQuestion, 1500);
}

window.onload = showQuestion;

// --- Yeni Oyun 1: Renkli Nokta Takip Oyunu ---

const dotGame = {
    container: document.getElementById('dot-game'),
    scoreElem: document.getElementById('dot-score'),
    startBtn: document.getElementById('dot-start'),
    score: 0,
    dot: null,
    gameInterval: null,
    gameDuration: 30000, // 30 saniye
    dotSize: 40,

    createDot() {
        if (this.dot) {
            this.container.removeChild(this.dot);
        }
        const dot = document.createElement('div');
        dot.style.width = this.dotSize + 'px';
        dot.style.height = this.dotSize + 'px';
        dot.style.borderRadius = '50%';
        dot.style.position = 'absolute';
        dot.style.backgroundColor = this.randomColor();
        dot.style.cursor = 'pointer';

        const maxX = this.container.clientWidth - this.dotSize;
        const maxY = this.container.clientHeight - this.dotSize;
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);

        dot.style.left = x + 'px';
        dot.style.top = y + 'px';

        dot.addEventListener('click', () => {
            this.score++;
            this.scoreElem.textContent = this.score;
            this.createDot();
        });

        this.container.appendChild(dot);
        this.dot = dot;
    },

    randomColor() {
        const colors = ['#e91e63', '#3f51b5', '#4caf50', '#ff9800', '#9c27b0'];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    startGame() {
        this.score = 0;
        this.scoreElem.textContent = this.score;
        this.createDot();

        if (this.gameInterval) clearTimeout(this.gameInterval);

        this.gameInterval = setTimeout(() => {
            alert('Oyun bitti! Skorunuz: ' + this.score);
            if (this.dot) this.container.removeChild(this.dot);
            this.dot = null;
        }, this.gameDuration);
    }
};

dotGame.startBtn.addEventListener('click', () => dotGame.startGame());

// --- Yeni Oyun 2: Görsel Kontrast Algılama Oyunu ---

const contrastGame = {
    container: document.getElementById('contrast-game'),
    scoreElem: document.getElementById('contrast-score'),
    startBtn: document.getElementById('contrast-start'),
    score: 0,
    level: 1,
    boxesCount: 6,

    generateBoxes() {
        this.container.innerHTML = '';
        const baseColor = this.randomGray(150);
        const diff = Math.max(5, 50 - this.level * 3); // Zorluk artar

        // En açık kutucuğun rengi
        const targetColor = baseColor + diff;

        // Kutucukları oluştur
        for (let i = 0; i < this.boxesCount; i++) {
            const box = document.createElement('div');
            box.style.width = '80px';
            box.style.height = '80px';
            box.style.borderRadius = '12px';
            box.style.cursor = 'pointer';
            box.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
            box.style.transition = 'transform 0.2s ease';

            // Hepsi baseColor, bir tanesi targetColor
            if (i === Math.floor(Math.random() * this.boxesCount)) {
                box.style.backgroundColor = `rgb(${targetColor},${targetColor},${targetColor})`;
                box.dataset.target = 'true';
            } else {
                box.style.backgroundColor = `rgb(${baseColor},${baseColor},${baseColor})`;
                box.dataset.target = 'false';
            }

            box.addEventListener('click', () => {
                if (box.dataset.target === 'true') {
                    this.score++;
                    this.level++;
                    this.scoreElem.textContent = this.score;
                    this.generateBoxes();
                } else {
                    alert('Yanlış kutucuğu seçtiniz! Skorunuz: ' + this.score);
                    this.resetGame();
                }
            });

            box.addEventListener('mouseenter', () => {
                box.style.transform = 'scale(1.1)';
            });
            box.addEventListener('mouseleave', () => {
                box.style.transform = 'scale(1)';
            });

            this.container.appendChild(box);
        }
    },

    randomGray(min) {
        return Math.floor(Math.random() * (255 - min) + min);
    },

    startGame() {
        this.score = 0;
        this.level = 1;
        this.scoreElem.textContent = this.score;
        this.generateBoxes();
    },

    resetGame() {
        this.score = 0;
        this.level = 1;
        this.scoreElem.textContent = this.score;
        this.container.innerHTML = '';
    }
};

contrastGame.startBtn.addEventListener('click', () => contrastGame.startGame());