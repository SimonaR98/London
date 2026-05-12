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

//Freccia per andare giù
const goToBottom = document.getElementById("goToBottom");

goToBottom.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
    });
});

window.addEventListener("scroll", () => {
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100) {
        goToBottom.classList.add("hide");
    } else {
        goToBottom.classList.remove("hide");
    }
});

// Canzone Contea
const audio = document.getElementById('shire-theme');
const section = document.querySelector('.leaf-container');
let hasPlayed = false;
let audioUnlocked = false;
let fadeInterval;

// Funzione che sblocca effettivamente l'audio
function forceUnlock() {
    if (audioUnlocked) return;
    audio.play().then(() => {
        audio.pause();
        audioUnlocked = true;
        console.log("Audio sbloccato!");
    }).catch(e => console.log("Permesso negato, serve un tocco."));
}

// Ascoltiamo TUTTI gli eventi possibili per sbloccare
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

// Logica dello Scroll per il Fade
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

//Sezione anniversario mappa
function revealMap() {
    const container = document.getElementById('map-container');
    const trigger = document.getElementById('map-trigger');

    container.classList.add('map-open');

    trigger.style.transition = "opacity 0.5s ease";
    trigger.style.opacity = "0";

    //Tolgo il bottone
    setTimeout(() => {
        trigger.style.display = 'none';
    }, 500);
}

//Sezione carosello attrazioni
/**
 * Funzione principale per muovere lo slider
 * @param {Element} btn - Il bottone cliccato (prev o next)
 * @param {Number} direction - 1 per avanti, -1 per indietro, 0 per centrare l'attuale
 */
function moveSlider(btn, direction) {
    // Risaliamo al contenitore padre per trovare gli elementi di questo specifico slider
    const container = btn.closest('.slider-container');
    const track = container.querySelector('.slider-track');
    const cards = Array.from(track.querySelectorAll('.slider-card'));

    // 1. Trova l'indice della card che ha attualmente la classe 'active'
    let currentIndex = cards.findIndex(card => card.classList.contains('active'));

    // 2. Se stiamo effettivamente cambiando foto (direzione diversa da 0)
    if (direction !== 0) {
        cards[currentIndex].classList.remove('active');

        // Calcolo dell'indice infinito
        currentIndex += direction;
        if (currentIndex < 0) {
            currentIndex = cards.length - 1;
        } else if (currentIndex >= cards.length) {
            currentIndex = 0;
        }

        cards[currentIndex].classList.add('active');
    }

    // 3. CALCOLO POSIZIONE PER IL CENTRAMENTO (Come in foto corretta.jpg)
    const containerWidth = container.offsetWidth;
    const cardWidth = cards[0].offsetWidth;
    const gap = 15; // Deve essere uguale al gap nel CSS

    // Formula magica: calcola lo spazio per portare la card attiva al centro esatto
    const offset = -currentIndex * (cardWidth + gap) + (containerWidth / 2 - cardWidth / 2);

    // Muove la traccia
    track.style.transform = `translateX(${offset}px)`;
}

/**
 * Funzione di inizializzazione al caricamento della pagina
 */
function initSliders() {
    const allContainers = document.querySelectorAll('.slider-container');

    allContainers.forEach(container => {
        // Cerchiamo il bottone "next" per usarlo come riferimento nella funzione
        const refBtn = container.querySelector('.next-btn');
        // Chiamiamo moveSlider con direzione 0 per centrare la card 'active' di partenza
        moveSlider(refBtn, 0);
    });
}

// Eseguiamo l'inizializzazione quando la pagina (e il CSS) è pronta
window.addEventListener('load', () => {
    // Un piccolo delay assicura che il browser abbia calcolato correttamente le larghezze
    setTimeout(initSliders, 150);
});

// Ri-centra tutto se l'utente ruota il telefono o cambia dimensione finestra
window.addEventListener('resize', initSliders);