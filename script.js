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