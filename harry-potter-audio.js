//Canzone Harry Potter
const audioHP = document.getElementById('harry-potter-theme');
const sectionHP = document.querySelector('.hogwarts-studios');
const sectionEndHP = document.querySelector('.anniversary-section');

let hasPlayedHP = false;
let audioUnlockedHP = false;
let fadeIntervalHP;

// Funzione di sblocco
function forceUnlockHP() {
    if (audioUnlockedHP || !audioHP) return;
    audioHP.play().then(() => {
        audioHP.pause();
        audioUnlockedHP = true;
        console.log("Audio HP sbloccato!");
    }).catch(e => console.log("HP: serve un tocco per sbloccare."));
}

// Eventi di sblocco
document.addEventListener('click', forceUnlockHP);
document.addEventListener('touchstart', forceUnlockHP);
document.addEventListener('mousedown', forceUnlockHP);
window.addEventListener('scroll', forceUnlockHP, { once: true });

// Gestione ritorno alla pagina
window.onpageshow = function (event) {
    audioUnlockedHP = false;
    hasPlayedHP = false;
    if (audioHP) {
        audioHP.pause();
        audioHP.currentTime = 0;
    }
};

// Logica dello Scroll
window.addEventListener('scroll', () => {
    if (!sectionHP || !sectionEndHP || !audioHP) return;

    const rectStart = sectionHP.getBoundingClientRect();
    const rectEnd = sectionEndHP.getBoundingClientRect();

    // La zona magica va dall'inizio degli Studios alla fine dell'Anniversario
    const isVisible = rectStart.top < window.innerHeight && rectEnd.bottom >= 0;

    if (isVisible && !hasPlayedHP && audioUnlockedHP) {
        clearInterval(fadeIntervalHP);
        hasPlayedHP = true;
        audioHP.volume = 0;
        audioHP.play();

        fadeIntervalHP = setInterval(() => {
            if (audioHP.volume < 0.40) {
                audioHP.volume = Math.min(audioHP.volume + 0.05, 0.40);
            } else {
                clearInterval(fadeIntervalHP);
            }
        }, 200);

    } else if (!isVisible && hasPlayedHP) {
        clearInterval(fadeIntervalHP);
        hasPlayedHP = false;

        fadeIntervalHP = setInterval(() => {
            if (audioHP.volume > 0.05) {
                audioHP.volume = Math.max(audioHP.volume - 0.05, 0);
            } else {
                audioHP.pause();
                clearInterval(fadeIntervalHP);
            }
        }, 150);
    }
});