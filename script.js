function updateCountdown() {
    const now = new Date();
    const target = new Date("August 18, 2026 07:30:00");
    const gap = target - now;

    if (gap <= 0) return;

    // Calcolo "da calendario"
    let diffMesi = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());

    // Data temporanea per calcolare i giorni rimanenti dopo i mesi
    let tempData = new Date(now);
    tempData.setMonth(now.getMonth() + diffMesi);

    // Se aggiungendo i mesi abbiamo superato il target, scaliamo di uno
    if (tempData > target) {
        diffMesi--;
        tempData = new Date(now);
        tempData.setMonth(now.getMonth() + diffMesi);
    }

    // Differenza residua in millisecondi dopo aver tolto i mesi esatti
    const restoMilli = target - tempData;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const timeValues = {
        months: diffMesi,
        days: Math.floor(restoMilli / day),
        hours: Math.floor((restoMilli % day) / hour),
        minutes: Math.floor((restoMilli % hour) / minute),
        seconds: Math.floor((restoMilli % minute) / second)
    };

    // Animazione card 
    for (const unit in timeValues) {
        const card = document.getElementById(unit);
        if (!card) continue;

        const front = card.querySelector(".card-front");
        const back = card.querySelector(".card-back");
        const newValue = timeValues[unit].toString().padStart(2, '0');

        // Se il valore è diverso da quello attualmente visibile sul fronte
        if (front.innerText !== newValue) {
            back.innerText = newValue;

            card.classList.add("rotating");

            setTimeout(() => {
                front.innerText = newValue;
                // Rimuovendo la classe ora, grazie al CSS "transition: none", 
                // la card torna a 0° istantaneamente senza girare all'indietro.
                card.classList.remove("rotating");
            }, 550); // 550ms invece di 600 per sicurezza visiva
        }
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

//Freccia per tornare su
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    // Appare dopo 400px di scroll
    if (window.scrollY > 400) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Canzone Contea
const audio = document.getElementById('shire-theme');
const section = document.querySelector('.leaf-container');
let hasPlayed = false;
let audioUnlocked = false;
let fadeInterval;

// 1. Funzione che sblocca effettivamente l'audio
function forceUnlock() {
    if (audioUnlocked) return;
    audio.play().then(() => {
        audio.pause();
        audioUnlocked = true;
        console.log("Audio sbloccato!");
    }).catch(e => console.log("Permesso negato, serve un tocco."));
}

// 2. Ascoltiamo TUTTI gli eventi possibili per sbloccare
document.addEventListener('click', forceUnlock);
document.addEventListener('touchstart', forceUnlock);
document.addEventListener('mousedown', forceUnlock);
window.addEventListener('scroll', forceUnlock, { once: true });

// 3. Gestione del ritorno alla pagina (Tasto Indietro)
window.onpageshow = function (event) {
    // Se la pagina viene ricaricata o presa dalla cache, resettiamo
    audioUnlocked = false;
    hasPlayed = false;
    audio.pause();
    audio.currentTime = 0;
};

// 4. Logica dello Scroll per il Fade
window.addEventListener('scroll', () => {
    if (!section || !audio) return;

    const rect = section.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

    if (isVisible && !hasPlayed && audioUnlocked) {
        clearInterval(fadeInterval);
        hasPlayed = true;
        audio.volume = 0;
        audio.play();

        fadeInterval = setInterval(() => {
            if (audio.volume < 0.45) {
                audio.volume = Math.min(audio.volume + 0.05, 0.45);
            } else {
                clearInterval(fadeInterval);
            }
        }, 200);

    } else if (!isVisible && hasPlayed) {
        clearInterval(fadeInterval);
        hasPlayed = false;

        fadeInterval = setInterval(() => {
            if (audio.volume > 0.05) {
                audio.volume = Math.max(audio.volume - 0.05, 0);
            } else {
                audio.pause();
                clearInterval(fadeInterval);
            }
        }, 150);
    }
});