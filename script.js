// --- SUPABASE SETUP ---
// Hier deine echten Daten aus dem Supabase Dashboard eintragen!
const SUPABASE_URL = 'DEINE_SUPABASE_URL_HIER';
const SUPABASE_ANON_KEY = 'DEIN_ANON_KEY_HIER';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DYNAMISCHER SCHIEBEREGLER ---
const slider = document.getElementById('dauer');
const sliderText = document.getElementById('slider-value-text');

slider.addEventListener('input', function() {
    const val = this.value;
    
    if (val < 20) {
        sliderText.innerText = "Viel zu kurz!";
        sliderText.style.color = "#ef4444"; // Rot
    } else if (val < 40) {
        sliderText.innerText = "Könnte länger sein";
        sliderText.style.color = "#f59e0b"; // Orange
    } else if (val < 65) {
        sliderText.innerText = "Genau richtig 👌";
        sliderText.style.color = "#10b981"; // Grün
    } else if (val < 85) {
        sliderText.innerText = "Etwas zu lang";
        sliderText.style.color = "#f59e0b"; // Orange
    } else {
        sliderText.innerText = "Ich bin eingeschlafen 😴";
        sliderText.style.color = "#ef4444"; // Rot
    }
});

// --- FORMULAR ABSCHICKEN ---
document.getElementById('survey-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Verhindert das Neuladen der Seite

    // UI-Updates (Button deaktivieren, Lade-Text zeigen)
    const btn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    
    btn.disabled = true;
    btnText.classList.add('hidden');
    btnSpinner.classList.remove('hidden');

    // Werte auslesen
    const laenge = document.getElementById('laenge').value;
    const dauer = document.getElementById('dauer').value;
    const kommentar = document.getElementById('kommentar').value;

    // In Supabase speichern
    const { data, error } = await supabase
        .from('markus_umfrage')
        .insert([
            { laenge_cm: laenge, dauer_rating: dauer, kommentar: kommentar }
        ]);

    if (error) {
        alert('Fehler beim Speichern! Hast du die Supabase Keys eingetragen?\nDetails: ' + error.message);
        // Button wieder aktivieren
        btn.disabled = false;
        btnText.classList.remove('hidden');
        btnSpinner.classList.add('hidden');
    } else {
        // Bei Erfolg: Formular ausblenden, Erfolgsmeldung einblenden
        document.getElementById('survey-form').classList.add('hidden');
        document.getElementById('success-msg').classList.remove('hidden');
    }
});
