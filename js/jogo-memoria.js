document.addEventListener('DOMContentLoaded', function() {
        // Arrays de imagens por categoria - escolher aleatoriamente
        const imageSets = {
            frutas: [
                'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1594308147232-878815737889?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1601493700631-2b16ec4b6d1e?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1606787366850-dd62e0e6a4f3?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1561136594-7f68413bb03f?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1595436065982-95f4c4e0e939?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=200&h=200&fit=crop'
            ],
            animais: [
                'https://images.unsplash.com/photo-1583337130417-3346a1be1dee?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&h=200&fit=crop'
            ],
            natureza: [
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1507003211169-0a1dd3628f8d?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1518173946687-a4c036bc1d9c?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1470071459604-3b5ec3a551c4?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=200&h=200&fit=crop'
            ],
            objetos: [
                'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1573939338218-4f26bf5186e8?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4ee?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop'
            ]
        };

        // Escolher uma categoria aleatória
        const categories = Object.keys(imageSets);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        let images = imageSets[randomCategory];

        // Embaralhar as imagens para maior aleatoriedade
        function shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        images = shuffleArray(images).slice(0, 8);

        let cards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let attempts = 0;
        let isLocked = false;

        function initGame() {
            const board = document.getElementById('gameBoard');
            board.innerHTML = '';

            // Escolher categoria aleatória a cada novo jogo
            const newCategory = categories[Math.floor(Math.random() * categories.length)];
            images = shuffleArray(imageSets[newCategory]).slice(0, 8);

            // Criar pares de imagens
            const cardImages = [...images, ...images];
            cards = shuffleArray(cardImages);

            flippedCards = [];
            matchedPairs = 0;
            attempts = 0;
            isLocked = false;

            document.getElementById('pairs').textContent = '0';
            document.getElementById('attempts').textContent = '0';

            cards.forEach((imgUrl, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.index = index;
                card.dataset.image = imgUrl;
                card.innerHTML = `<div class="card-image"><img src="${imgUrl}" alt="Carta" loading="lazy"></div>`;
                card.addEventListener('click', () => flipCard(card));
                board.appendChild(card);
            });
        }

        function flipCard(card) {
            if (isLocked) return;
            if (card.classList.contains('flipped')) return;
            if (card.classList.contains('matched')) return;
            if (flippedCards.length >= 2) return;

            card.classList.add('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                attempts++;
                document.getElementById('attempts').textContent = attempts;
                checkMatch();
            }
        }

        function checkMatch() {
            isLocked = true;

            const [card1, card2] = flippedCards;
            const img1 = card1.dataset.image;
            const img2 = card2.dataset.image;

            if (img1 === img2) {
                setTimeout(() => {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    matchedPairs++;
                    document.getElementById('pairs').textContent = matchedPairs;

                    flippedCards = [];
                    isLocked = false;

                    if (matchedPairs === 8) {
                        setTimeout(() => {
                            showWinMessage();
                        }, 500);
                    }
                }, 400);
            } else {
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                    isLocked = false;
                }, 1000);
            }
        }

        function showWinMessage() {
            const overlay = document.getElementById('overlay');
            const feedback = document.getElementById('feedback');
            const feedbackIcon = document.getElementById('feedbackIcon');
            const feedbackTitle = document.getElementById('feedbackTitle');
            const feedbackText = document.getElementById('feedbackText');
            const feedbackBtn = document.getElementById('feedbackBtn');

            feedbackIcon.className = 'feedback-icon success';
            feedbackIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';

            feedbackTitle.textContent = 'Parabéns!';
            feedbackText.textContent = `Você encontrou todos os pares em ${attempts} tentativas!`;
            feedbackBtn.textContent = 'Jogar Novamente';
            feedbackBtn.onclick = () => {
                hideFeedback();
                initGame();
            };

            overlay.classList.add('show');
            feedback.classList.add('show');
        }

        function hideFeedback() {
            document.getElementById('overlay').classList.remove('show');
            document.getElementById('feedback').classList.remove('show');
        }

        // Event listeners
        document.getElementById('btn-restart').addEventListener('click', initGame);
        document.getElementById('btn-como-jogar').addEventListener('click', function() {
            document.getElementById('comoJogarModal').style.display = 'block';
            document.getElementById('overlay').classList.add('show');
        });
        document.getElementById('btn-back').addEventListener('click', function() { window.location.href = 'grupo-moderado.html'; });
        document.getElementById('feedbackBtn').addEventListener('click', hideFeedback);
        document.getElementById('overlay').addEventListener('click', hideFeedback);
        document.getElementById('btn-fechar-modal').addEventListener('click', function() {
            document.getElementById('comoJogarModal').style.display = 'none';
            document.getElementById('overlay').classList.remove('show');
        });

        initGame();
    });