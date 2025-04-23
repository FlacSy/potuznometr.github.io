document.addEventListener('DOMContentLoaded', () => {
    const powerButton = document.querySelector('.power-button');
    const progressBar = document.querySelector('.progress-bar');
    const progressContainer = document.querySelector('.progress-container');
    const resultText = document.querySelector('.result-text');
    const holdSound = document.getElementById('holdSound');
    const completeSound = document.getElementById('completeSound');

    let progress = 0;
    let isHolding = false;
    let progressInterval;
    let decreaseInterval;
    let shakeTimeout;

    const updateProgressBar = (progress) => {
        const clipRight = 100 - progress;
        progressBar.style.clipPath = `inset(0 ${clipRight}% 0 0)`;
    };

    const startShakeEffect = () => {
        progressContainer.classList.add('shake-y');
        resultText.classList.add('visible');
        shakeTimeout = setTimeout(() => {
            stopShakeEffect();
        }, 6000);
    };

    const stopShakeEffect = () => {
        progressContainer.classList.remove('shake-y');
        resultText.classList.remove('visible');
        if (shakeTimeout) {
            clearTimeout(shakeTimeout);
            shakeTimeout = null;
        }
    };

    const increaseProgress = () => {
        if (progress < 100) {
            progress += 1;
            updateProgressBar(progress);

            if (progress === 100) {
                holdSound.pause();
                completeSound.play();
                startShakeEffect();
            }
        }
    };

    const decreaseProgress = () => {
        if (progress > 0) {
            progress -= 0.5;
            updateProgressBar(progress);
            if (progress < 100) stopShakeEffect();
        }
    };

    const startHold = () => {
        isHolding = true;
        holdSound.currentTime = 0;
        holdSound.play();
        progressInterval = setInterval(increaseProgress, 10);
        clearInterval(decreaseInterval);
    };

    const stopHold = () => {
        isHolding = false;
        holdSound.pause();
        clearInterval(progressInterval);
        decreaseInterval = setInterval(decreaseProgress, 10);
    };

    powerButton.addEventListener('mousedown', startHold);
    powerButton.addEventListener('mouseup', stopHold);
    powerButton.addEventListener('mouseleave', () => isHolding && stopHold());

    powerButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startHold();
    });

    powerButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopHold();
    });

    powerButton.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        if (isHolding) stopHold();
    });
});
