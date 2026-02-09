const targetDate = new Date("August 18, 2026 07:30:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const gap = targetDate - now;

    if (gap <= 0) return;

    // Costanti di tempo
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30.4375; // Media giorni in un mese

    const timeValues = {
        months: Math.floor(gap / month),
        days: Math.floor((gap % month) / day),
        hours: Math.floor((gap % day) / hour),
        minutes: Math.floor((gap % hour) / minute),
        seconds: Math.floor((gap % minute) / second)
    };

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