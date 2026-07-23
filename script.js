// --- SUPABASE SETUP ---
const SUPABASE_URL = 'DEINE_URL';
const SUPABASE_ANON_KEY = 'DEIN_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DYNAMISCHER SCHIEBEREGLER 1: Dauer ---
const dauerSlider = document.getElementById('dauer');
const dauerText = document.getElementById('dauer-text');

dauerSlider.addEventListener('input', function() {
    const val = this.value;
    if (val < 20) { dauerText.innerText = "Viel zu kurz!"; dauerText.style.color = "#ef4444"; }
    else if (val < 40) { dauerText.innerText = "Könnte länger sein"; dauerText.style.color = "#f59e0b"; }
    else if (val < 65) { dauerText.innerText = "Genau richtig 👌"; dauerText.style.color = "#10b981"; }
    else if (val < 85) { dauerText.innerText = "Etwas zu lang"; dauerText.style.color = "#f59e0b"; }
    else { dauerText.innerText = "Ich bin eingeschlafen 😴"; dauerText.style.color = "#ef4444"; }
});

// --- DYNAMISCHER SCHIEBEREGLER 2: Vorspiel/Kneten ---
const vorspielSlider = document.getElementById('vorspiel');
const vorspielText = document.getElementById('vorspiel-text');

vorspielSlider.addEventListener('input', function() {
    const val = this.value;
    if (val < 20) { vorspielText.innerText = "Wie ein Metzger auf Akkord 🥩"; vorspielText.style.color = "#ef4444"; }
    else if (val < 40) { vorspielText.innerText = "Etwas grob"; vorspielText.style.color = "#f59e0b"; }
    else if (val < 65) { vorspielText.innerText = "Perfekte Sauerteig-Faltung 🥖"; vorspielText.style.color = "#10b981"; }
    else if (val < 85) { vorspielText.innerText = "Sehr sanft"; vorspielText.style.color = "#f59e0b"; }
    else { vorspielText.innerText = "Ist das noch Kneten oder schon Streicheln?"; vorspielText.style.color = "#8b5cf6"; }
});

// --- DYNAMISCHE STERNE ---
const starInputs = document.querySelectorAll('input[name="performance"]');
const starText = document.getElementById('star-text');

starInputs.forEach(star => {
    star.addEventListener('change', function() {
        const val = this.value;
        if(val == 1) { starText.innerText = "Motorschaden direkt beim Start"; starText.style.color = "#ef4444"; }
        if(val == 2) { starText.innerText = "Ruckelt ordentlich im 1. Gang"; starText.style.color = "#f59e0b"; }
        if(val == 3) { starText.innerText = "Solider TÜV, bringt dich ans Ziel"; starText.style.color = "#64748b"; }
        if(val == 4) { starText.innerText = "Gute Beschleunigung!"; starText.style.color = "#10b981"; }
        if(val == 5) { starText.innerText = "S-Klasse aus Sindelfingen, absoluter Luxus 🏎️"; starText.style.color = "#8b5cf6"; }
    });
});

// --- JA/NEIN BUTTONS LOGIK ---
const btnYes = document.querySelector('.btn-yes');
const btnNo = document.querySelector('.btn-no');
const empfehlungInput = document.getElementById('empfehlung');

btnYes.addEventListener('click', function() {
    btnYes.classList.add('active');
    btnNo.classList.remove('active');
    empfehlungInput.value = "1"; // Als Zahl speichern
});

btnNo.addEventListener('click', function() {
    btnNo.classList.add('active');
    btnYes.classList.remove('active');
    empfehlungInput.value = "0"; // Als Zahl speichern
});


// --- FORMULAR ABSCHICKEN ---
document.getElementById('survey-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Check, ob die Buttons/Sterne geklickt wurden
    const performanceChecked = document.querySelector('input[name="performance"]:checked');
    const nachgangChecked = document.querySelector('input[name="nachgang"]:checked');
    
    if (!performanceChecked || !nachgangChecked || empfehlungInput.value === "") {
        alert("Hey, keine halben Sachen! Bitte beantworte alle Fragen.");
        return;
    }

    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    document.getElementById('btn-text').classList.add('hidden');
    document.getElementById('btn-spinner').classList.remove('hidden');

    // Alle Werte auslesen und explizit als Integer (Zahlen) parsen
    const dataObj = {
        laenge_cm: parseInt(document.getElementById('laenge').value),
        dauer_rating: parseInt(document.getElementById('dauer').value),
        akustik_id: parseInt(document.getElementById('akustik').value),
        performance_sterne: parseInt(performanceChecked.value),
        vorspiel_rating: parseInt(document.getElementById('vorspiel').value),
        nachgang_id: parseInt(nachgangChecked.value),
        empfehlung: parseInt(empfehlungInput.value),
        kommentar: document.getElementById('kommentar').value // Bleibt Text
    };

    // In Supabase speichern
    const { data, error } = await supabase
        .from('markus_umfrage')
        .insert([dataObj]);

    if (error) {
        alert('Fehler beim Speichern: ' + error.message);
        btn.disabled = false;
        document.getElementById('btn-text').classList.remove('hidden');
        document.getElementById('btn-spinner').classList.add('hidden');
    } else {
        document.getElementById('survey-form').classList.add('hidden');
        document.getElementById('success-msg').classList.remove('hidden');
    }
});
