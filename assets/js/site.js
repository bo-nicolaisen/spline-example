
// Henter Application-klassen fra Splines bibliotek. Den bruges til at vise en
// 3D-scene i browseren. Import map'et i index.html fortæller browseren, hvor
// '@splinetool/runtime' skal hentes fra.
import { Application } from '@splinetool/runtime';

// Finder de tre HTML-elementer, som koden skal bruge, ud fra deres id:
const canvas = document.getElementById('canvas3d'); // lærredet, som 3D-scenen tegnes på
const slider = document.getElementById('temperature'); // slideren under scenen
const output = document.getElementById('temperature-value'); // teksten ved siden af slideren

// Opretter en Spline-app, der tegner på vores canvas.
// htmlContentMode 'inline' kører scenens eventuelle HTML-indhold direkte på
// denne side, så window.spline svarer uden forsinkelse. Brug i stedet
// standardindstillingen 'sandbox', hvis siden viser scener, du ikke selv har lavet.
const app = new Application(canvas, { htmlContentMode: 'inline' });

// Funktionen flytter termometeret til en bestemt temperatur.
// Scenen har to variabler, og begge skal sættes:
//   temperature - tallet, der står øverst på termometeret
//   level       - hvor højt væsken står, fra 0 (ved stregen for -20) til 1 (ved stregen for 40)
function setTemperature(temperature) {
    // Sliderens min og max er tekst i HTML'en (-20 og 40), så de laves om til tal.
    const min = Number(slider.min);
    const max = Number(slider.max);

    // Sender temperaturen direkte videre til scenen.
    app.setVariable('temperature', temperature);

    // Omregner temperaturen til et tal mellem 0 og 1:
    //   -20 °C giver (-20 + 20) / 60 = 0   (tomt)
    //    10 °C giver ( 10 + 20) / 60 = 0.5 (halvt fyldt)
    //    40 °C giver ( 40 + 20) / 60 = 1   (helt fyldt)
    app.setVariable('level', (temperature - min) / (max - min));

    // Viser også temperaturen i teksten ved siden af slideren.
    output.textContent = `${temperature} °C`;
}

// 'input' sker hele tiden, mens slideren trækkes, så termometeret følger med
// med det samme. slider.value er tekst, så det laves om til et tal med Number().
slider.addEventListener('input', () => setTemperature(Number(slider.value)));

// Henter 3D-scenen fra Splines server. Det tager lidt tid, så koden i .then()
// først kører, når scenen er færdig med at loade.
app.load('https://prod.spline.design/3xdvCGYXBRVcUG3l/scene.splinecode').then(() => {
    // Sætter termometeret til sliderens startværdi (12 °C).
    setTemperature(Number(slider.value));

    // Slideren er slået fra i HTML'en, fordi variablerne først findes, når scenen
    // er loadet. Nu er det sikkert at bruge den, så den slås til.
    slider.disabled = false;
});
