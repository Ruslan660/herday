(() => {
    const TOTAL_PAGES = 7;
    let currentPage = 0;
    let isAnimating = false;
    let touchStartY = 0;
    let touchStartX = 0;

    const slider = document.getElementById('slider');
    const pages = slider.querySelectorAll('.page');
    const indicatorContainer = document.getElementById('pageIndicator');
    const heartsContainer = document.getElementById('hearts');

    // ==================== PAGE INDICATOR ====================
    function buildIndicator() {
        for (let i = 0; i < TOTAL_PAGES; i++) {
            const dot = document.createElement('div');
            dot.className = 'page-indicator__dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToPage(i));
            indicatorContainer.appendChild(dot);
        }
    }

    function updateIndicator() {
        const dots = indicatorContainer.querySelectorAll('.page-indicator__dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentPage);
        });
    }

    // ==================== PAGE NAVIGATION ====================
    window.goToPage = function (index) {
        if (isAnimating || index === currentPage || index < 0 || index >= TOTAL_PAGES) return;

        isAnimating = true;

        const oldPage = pages[currentPage];
        const newPage = pages[index];

        const goingForward = index > currentPage;

        oldPage.classList.remove('active');
        oldPage.classList.add(goingForward ? 'exit-up' : '');

        newPage.style.transform = goingForward ? 'translateY(40px)' : 'translateY(-40px)';
        newPage.style.opacity = '0';

        requestAnimationFrame(() => {
            newPage.classList.add('active');
            newPage.style.transform = '';
            newPage.style.opacity = '';
            restartAnimations(newPage);
        });

        setTimeout(() => {
            oldPage.classList.remove('exit-up');
            oldPage.style.transform = '';
            oldPage.style.opacity = '';
            isAnimating = false;
        }, 700);

        currentPage = index;
        updateIndicator();
    };

    function restartAnimations(page) {
        const animated = page.querySelectorAll(
            '.page__emoji, .page__title, .page__photo, .page__text, .btn, ' +
            '.cover-decoration, .page__label, .page__subtitle, .cover-photo, ' +
            '.coupon, .page__footer-text, .page__title--cover'
        );
        animated.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // force reflow
            el.style.animation = '';
        });
    }

    // ==================== SWIPE SUPPORT ====================
    slider.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        const deltaY = touchStartY - e.changedTouches[0].clientY;
        const deltaX = touchStartX - e.changedTouches[0].clientX;

        if (Math.abs(deltaY) < 50 || Math.abs(deltaX) > Math.abs(deltaY)) return;

        if (deltaY > 0 && currentPage < TOTAL_PAGES - 1) {
            goToPage(currentPage + 1);
        } else if (deltaY < 0 && currentPage > 0) {
            goToPage(currentPage - 1);
        }
    }, { passive: true });

    // ==================== FLOATING HEARTS ====================
    const heartSymbols = ['♥', '❤', '💕', '♡', '✿', '❀', '🌸'];

    function spawnHeart() {
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (12 + Math.random() * 16) + 'px';
        heart.style.animationDuration = (6 + Math.random() * 8) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heartsContainer.appendChild(heart);

        setTimeout(() => heart.remove(), 16000);
    }

    setInterval(spawnHeart, 1800);
    for (let i = 0; i < 5; i++) setTimeout(spawnHeart, i * 400);

    // ==================== KEYBOARD NAVIGATION ====================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            goToPage(currentPage + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            goToPage(currentPage - 1);
        }
    });

    // ==================== INIT ====================
    buildIndicator();
})();
