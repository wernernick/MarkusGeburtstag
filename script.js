// --- SUPABASE SETUP ---
const SUPABASE_URL = 'DEINE_URL';
const SUPABASE_ANON_KEY = 'DEIN_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- STEP-LOGIK (Formular Sliden) ---
let currentStep = 1;
const totalSteps = 7;
const progressBar = document.getElementById('progress-bar');

function updateProgress() {
    const percentage = (currentStep / totalSteps) * 100;
    progressBar.style.width = percentage + '%';
}

document.querySelectorAll('.next-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Validation check (einfach gehalten)
        if (currentStep === 3 && !document.querySelector('input[name="akustik"]:checked')) return alert("Wähle eine Akustik aus!");
        if (currentStep === 4 && !document.querySelector('input[name="performance"]:checked')) return alert("Vergib Sterne!");
        if (currentStep === 6 && !document.querySelector('input[name="nachgang"]:checked')) return alert("Was passierte danach?");

        document.getElementById(`step-${currentStep}`).classList.remove('active');
        currentStep++;
        document.getElementById(`step-${currentStep}`).classList.add('active');
        updateProgress();
    });
});


// --- STEP 1: DER ZENSURBALKEN-GAG ---
const laengeSlider = document.getElementById('laenge');
const laengeText = document.getElementById('laenge-text');
const censorBar = document.getElementById('censor-bar');

laengeSlider.addEventListener('input', function() {
    const val = this.value;
    laengeText.innerText = val;
    
    // Pixel-Berechnung: Wir machen den Balken pro cm einfach 4 Pixel breiter (Basis 20px)
    // Du kannst diese Formel anpassen, bis es auf deinem Bild perfekt aussieht!
    const newWidth = 20 + (val * 4); 
    censorBar.style.width = newWidth + 'px';
});

// --- DYNAMISCHE TEXTE (Dauer, Vorspiel, Sterne) ---
const dauerSlider = document.getElementById('dauer');
const dauerText = document.getElementById('dauer-text');
dauerSlider.addEventListener('input', function() {
    const val = this.value;
    if (val < 20) { dauerText.innerText = "Viel zu kurz!"; dauerText.style.color = "#ff3b30"; }
    else if (val < 40) { dauerText.innerText = "Könnte länger sein"; dauerText.style.color = "#ff9500"; }
    else if (val < 65) { dauerText.innerText = "Genau richtig 👌"; dauerText.style.color = "#34c759"; }
    else if (val < 85) { dauerText.innerText = "Etwas zu lang"; dauerText.style.color = "#ff9500"; }
    else { dauerText.innerText = "Ich bin eingeschlafen 😴"; dauerText.style.color = "#ff3b30"; }
});

const vorspielSlider = document.getElementById('vorspiel');
const vorspielText = document.getElementById('vorspiel-text');
vorspielSlider.addEventListener('input', function() {
    const val = this.value;
    if (val < 20) { vorspielText.innerText = "Wie ein Metzger auf Akkord 🥩"; vorspielText.style.color = "#ff3b30"; }
    else if (val < 40) { vorspielText.innerText = "Etwas grob"; vorspielText.style.color = "#ff9500"; }
    else if (val < 65) { vorspielText.innerText = "Perfekte Technik 🥖"; vorspielText.style.color = "#34c759"; }
    else if (val < 85) { vorspielText.innerText = "Sehr sanft"; vorspielText.style.color = "#ff9500"; }
    else { vorspielText.innerText = "Ist das noch Kneten oder schon Streicheln?"; vorspielText.style.color = "#af52de"; }
});

const starInputs = document.querySelectorAll('input[name="performance"]');
const starText = document.getElementById('star-text');
starInputs.forEach(star => {
    star.addEventListener('change', function() {
        const val = this.value;
        if(val == 1) { starText.innerText = "Motorschaden direkt beim Start"; starText.style.color = "#ff3b30"; }
        if(val == 2) { starText.innerText = "Ruckelt ordentlich im 1. Gang"; starText.style.color = "#ff9500"; }
        if(val == 3) { starText.innerText = "Solider TÜV, bringt dich ans Ziel"; starText.style.color = "#8e8e93"; }
        if(val == 4) { starText.innerText = "Gute Beschleunigung!"; starText.style.color = "#34c759"; }
        if(val == 5) { starText.innerText = "Absoluter Luxus 🏎️"; starText.style.color = "#af52de"; }
    });
});

// --- JA/NEIN BUTTONS LOGIK ---
const btnYes = document.querySelector('.btn-yes');
const btnNo = document.querySelector('.btn-no');
const empfehlungInput = document.getElementById('empfehlung');

btnYes.addEventListener('click', function() {
    btnYes.classList.add('active'); btnNo.classList.remove('active');
    empfehlungInput.value = "1";
});
btnNo.addEventListener('click', function() {
    btnNo.classList.add('active'); btnYes.classList.remove('active');
    empfehlungInput.value = "0";
});

// --- SUBMIT AN SUPABASE ---
document.getElementById('survey-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (empfehlungInput.value === "") return alert("Empfiehlst du ihn weiter?");

    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    document.getElementById('btn-text').classList.add('hidden');
    document.getElementById('btn-spinner').classList.remove('hidden');

    const dataObj = {
        laenge_cm: parseInt(document.getElementById('laenge').value),
        dauer_rating: parseInt(document.getElementById('dauer').value),
        akustik_id: parseInt(document.querySelector('input[name="akustik"]:checked').value),
        performance_sterne: parseInt(document.querySelector('input[name="performance"]:checked').value),
        vorspiel_rating: parseInt(document.getElementById('vorspiel').value),
        nachgang_id: parseInt(document.querySelector('input[name="nachgang"]:checked').value),
        empfehlung: parseInt(empfehlungInput.value),
        kommentar: document.getElementById('kommentar').value
    };

    const { data, error } = await supabase.from('markus_umfrage').insert([dataObj]);

    if (error) {
        alert('Fehler: ' + error.message);
        btn.disabled = false;
        document.getElementById('btn-text').classList.remove('hidden');
        document.getElementById('btn-spinner').classList.add('hidden');
    } else {
        document.getElementById(`step-7`).classList.remove('active');
        document.getElementById('success-msg').classList.add('active');
        document.getElementById('progress-bar').style.width = '100%';
    }
});

// Init Progress
updateProgress();
