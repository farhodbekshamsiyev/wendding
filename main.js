document.addEventListener("DOMContentLoaded", () => {

    // --- ВЕДЕО-ИНТРО (OVERLAY) ЛОГИКА ---
    const introScreen = document.getElementById('intro-screen');
    const introVideo = document.getElementById('envelope-video');

    if (introScreen && introVideo) {
        // Проигрывание видео и МУЗЫКИ по клику
        introScreen.addEventListener('click', () => {
            introVideo.play().catch(e => console.log("Intro video play failed:", e));

            // Запускаем музыку синхронно (из переменной audioPlayer ниже)
            const audioPlayer = document.getElementById('bg-music');
            if (audioPlayer) {
                audioPlayer.volume = 0.5;
                audioPlayer.play().catch(e => console.log("Audio prevented:", e));
            }
        }, { once: true });

        // Завершение видео и переход "Flash to White"
        introVideo.addEventListener('ended', () => {
            introScreen.classList.add('flash-to-white');

            // Запускаем вспышку
            setTimeout(() => {
                introScreen.classList.add('active');
            }, 10);

            // Прячем интро и показываем сайт после вспышки
            setTimeout(() => {
                introScreen.classList.add('hidden');

                // ПОКАЗЫВАЕМ ОСНОВНОЙ САЙТ
                const mainContent = document.getElementById('main-content');
                if (mainContent) mainContent.classList.remove('hidden');

                document.body.style.overflowY = 'auto'; // Разрешаем скролл
                const heroVideo = document.getElementById('hero-cake-video');
                if (heroVideo) heroVideo.play().catch(e => console.log("Hero video play failed:", e));
            }, 300);
        });
    }


    // 0. ФОНОВЫЕ ЛЕПЕСТКИ (ПРЕДЫДУЩИЙ ВАРИАНТ)
    const flowerContainer = document.getElementById('falling-flowers');
    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        const colors = ['gold', 'white', ''];
        const color = colors[Math.floor(Math.random() * colors.length)];
        if (color) petal.classList.add(color);
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = (Math.random() * 5 + 5) + 's';
        petal.style.animationDelay = Math.random() * 5 + 's';
        flowerContainer.appendChild(petal);
    }
    for (let i = 0; i < 30; i++) {
        createPetal();
    }


    const audioPlayer = document.getElementById('bg-music');
    const audioToggleBtn = document.getElementById('audio-toggle');
    const video = document.getElementById('hero-cake-video');

    if (window.location.hash) {
        window.history.replaceState(null, null, ' ');
    }

    // 2. УПРАВЛЕНИЕ АУДИО
    audioToggleBtn.addEventListener('click', () => {
        if (audioPlayer.paused || audioPlayer.muted) {
            audioPlayer.muted = false;
            audioPlayer.play();
            audioToggleBtn.classList.remove('muted');
        } else {
            audioPlayer.muted = true;
            audioPlayer.pause();
            audioToggleBtn.classList.add('muted');
        }
    });

    // 3. ТАЙМЕР ОБРАТНОГО ОТСЧЕТА
    const targetDate = new Date("April 11, 2026 18:00:00").getTime();
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById("countdown").innerHTML = "<h3>День настал!</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days < 10 ? '0' + days : days;
        document.getElementById("hours").innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById("minutes").innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById("seconds").innerText = seconds < 10 ? '0' + seconds : seconds;
    };
    setInterval(updateCountdown, 1000);
    updateCountdown();


    // 4. ПОДАРКИ (АККОРДИОН И КОНФЕТТИ)
    const accordion = document.getElementById('gifts-accordion');
    const showIbanBtn = document.getElementById('show-iban-btn');
    const ibanDetails = document.getElementById('iban-details');

    if (accordion) {
        accordion.querySelector('.accordion-header').addEventListener('click', () => {
            accordion.classList.toggle('opened');
        });
    }

    if (showIbanBtn) {
        showIbanBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showIbanBtn.style.display = 'none';
            ibanDetails.classList.remove('hidden');
            fireConfetti();
        });
    }

    function fireConfetti() {
        if (window.confetti) {
            const colors = ['#851212', '#cba153', '#e4002b', '#ffdae2'];
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: colors,
                startVelocity: 45,
                gravity: 1.2
            });
        }
    }

    // ЛОГИКА КОПИРОВАНИЯ КАРТЫ
    const copyBtn = document.getElementById('copy-card-btn');
    const cardNumber = document.getElementById('card-number');
    const copyStatus = document.getElementById('copy-status');

    if (copyBtn && cardNumber) {
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const text = cardNumber.innerText.replace(/\s/g, ''); // Убираем пробелы для копирования чистого номера
            navigator.clipboard.writeText(text).then(() => {
                if (copyStatus) {
                    copyStatus.classList.add('visible');
                    setTimeout(() => {
                        copyStatus.classList.remove('visible');
                    }, 2000);
                }
            }).catch(err => {
                console.error('Copy failed:', err);
                alert('Не удалось скопировать номер. Пожалуйста, сделайте это вручную.');
            });
        });
    }


    // ПРЕДЫДУЩАЯ ЛОГИКА ФОРМЫ БЫЛА УДАЛЕНА И ПЕРЕНЕСЕНА В КОНЕЦ ФАЙЛА (С УЧЕТОМ TELEGRAM BOT)

    // 6. СМУС СКРОЛЛ
    document.querySelectorAll('.scroll-down').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 7. СЛЕДЫ ПО БОКАМ (ПОСЛЕДОВАТЕЛЬНЫЕ)
    const sidePaths = ['left', 'right'];
    let lastY = window.scrollY;

    window.addEventListener('scroll', () => {
        const curY = window.scrollY;
        // Генерируем новый след каждые 180px прокрутки
        if (Math.abs(curY - lastY) > 180) {
            sidePaths.forEach(side => {
                createFootprintPair(side, curY);
            });
            lastY = curY;
        }
    });

    function createFootprintPair(side, currentScrollY) {
        const pairContainer = document.createElement('div');
        pairContainer.classList.add('dynamic-step');

        const baseX = side === 'left' ? 4 : 92; // vw
        pairContainer.style.left = `${baseX}vw`;
        pairContainer.style.top = `${currentScrollY + window.innerHeight * 0.4}px`;

        // SVG следа (Раздельные ботинки как при ходьбе, ближе друг к другу)
        pairContainer.innerHTML = `<svg viewBox="0 0 100 130" style="width:100%; height:100%; opacity:0.15; transform: rotate(180deg);">
           <g transform="translate(0, 0)"> 
             <!-- Левая нога (впереди) -->
             <path fill="#5c4033" d="M 28 45 C 10 30, 20 0, 35 15 C 50 30, 40 45, 28 45 Z"/>
             <path fill="#5c4033" d="M 23 60 C 10 70, 25 85, 30 75 C 35 65, 30 50, 23 60 Z"/>
           </g>
           <g transform="translate(0, 50)">
             <!-- Правая нога (сзади на шаг, зеркально, переведено ближе) -->
             <path fill="#5c4033" d="M 68 45 C 85 30, 75 0, 60 15 C 45 30, 55 45, 68 45 Z"/>
             <path fill="#5c4033" d="M 72 60 C 85 70, 70 85, 65 75 C 60 65, 65 50, 72 60 Z"/>
           </g>
        </svg>`;

        document.body.appendChild(pairContainer);

        // Плавное появление
        setTimeout(() => pairContainer.style.opacity = '1', 50);

        // Плавное исчезновение
        setTimeout(() => {
            pairContainer.style.opacity = '0';
            setTimeout(() => pairContainer.remove(), 800);
        }, 2000);
    }


    // 8. ЛОГИКА ФОРМЫ (Отправка в Telegram)

    const form = document.getElementById('rsvp-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Запрещаем стандартную отправку в первую очередь

            try {
                const btn = form.querySelector('button[type="submit"]') || form.querySelector('button');

                const nameEl = document.getElementById('name');
                const nameVal = nameEl ? nameEl.value : '';
                const phoneEl = document.getElementById('phone');
                const phoneVal = phoneEl ? phoneEl.value : '';
                const attendanceNode = document.querySelector('input[name="attendance"]:checked');
                const attendanceVal = attendanceNode ? attendanceNode.value : 'Не указано';
                const messageNode = document.getElementById('message');
                const messageText = messageNode ? messageNode.value : '';

                let message = `💌 *Новый ответ на приглашение!*\n\n`;
                message += `👤 *Имя:* ${nameVal}\n`;
                message += `📞 *Телефон:* ${phoneVal}\n`;
                message += `❓ *Присутствие:* ${attendanceVal}\n`;

                if (messageText.trim() !== '') {
                    message += `\n💬 *Пожелание:* ${messageText}\n`;
                }

                // ВСТАВЬ НОВУЮ ССЫЛКУ ОТ GOOGLE СЮДА:
                const GAS_URL = 'https://script.google.com/macros/s/AKfycbyam-vku2ybzoV6nlplJUqyQmn1K2T-iGsgkOVUmKsvCd6wTmQsr6dD0DYpuatmzxxL/exec';

                const originalBtnText = btn.innerHTML;
                btn.innerHTML = 'ОТПРАВКА...';
                btn.style.opacity = '0.7';

                // Надежный формат упаковки данных (БЕЗ JSON)
                const params = new URLSearchParams();
                params.append('message', message);

                fetch(GAS_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: params // Отправляем параметры
                })
                    .then(() => {
                        btn.innerHTML = 'ОТПРАВЛЕНО!';
                        btn.style.backgroundColor = 'var(--gold)';
                        form.reset();



                        setTimeout(() => {
                            btn.innerHTML = originalBtnText;
                            btn.style.backgroundColor = '';
                            btn.style.opacity = '1';
                        }, 5000);
                    })
                    .catch(err => {
                        console.error('Ошибка:', err);
                        btn.innerHTML = originalBtnText;
                        btn.style.opacity = '1';
                    });
            } catch (err) {
                console.error('Ошибка в логике формы:', err);
                alert('Произошла внутренняя ошибка.');
            }
        });
    }
});
