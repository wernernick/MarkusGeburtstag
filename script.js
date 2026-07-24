
// 1. Supabase initialisieren
const SUPABASE_URL = 'https://nkyfgiovrdklakzappgv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-LCrZ_Xi_KIiM8RWVEIbBQ_w8_mUBBt';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Warten, bis das HTML komplett geladen ist!
document.addEventListener('DOMContentLoaded', () => {
// ... ab hier geht es normal weiter ...
    

    const laengeSlider = document.getElementById('laenge_cm');
    const laengeOutput = document.getElementById('laenge_output');
    
    if (laengeSlider && laengeOutput) {
        laengeSlider.addEventListener('input', (e) => {
            laengeOutput.textContent = e.target.value;
        });
    }

    const perfSlider = document.getElementById('performance_sterne');
    const perfOutput = document.getElementById('perf_output');
    
    if (perfSlider && perfOutput) {
        perfSlider.addEventListener('input', (e) => {
            perfOutput.textContent = e.target.value;
        });
    }


    const nextButtons = document.querySelectorAll('.next-btn');
    
    nextButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentStep = e.target.closest('.step');
            const nextStepId = e.target.getAttribute('data-next');
            const nextStep = document.getElementById(nextStepId);
            
            if (currentStep && nextStep) {
                currentStep.classList.add('hidden');
                nextStep.classList.remove('hidden');
            }
        });
    });


    const submitBtn = document.getElementById('submit-btn');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            
            const daten = {
                laenge_cm: parseInt(document.getElementById('laenge_cm').value) || 15,
                dauer_rating: parseInt(document.getElementById('dauer_rating').value) || 5,
                akustik_id: parseInt(document.getElementById('akustik_id').value) || 3,
                performance_sterne: parseInt(document.getElementById('performance_sterne').value) || 3,
                vorspiel_rating: parseInt(document.getElementById('vorspiel_rating').value) || 5,
                nachgang_id: parseInt(document.getElementById('nachgang_id').value) || 3,
                empfehlung: parseInt(document.getElementById('empfehlung').value) || 3,
                kommentar: document.getElementById('kommentar').value || ""
            };

            submitBtn.disabled = true;
            submitBtn.textContent = 'Speichere...';

            // HIER GEÄNDERT: Wir nutzen jetzt den supabaseClient zum Senden
            const { data, error } = await supabaseClient
                .from('markus_umfrage')
                .insert([daten]);

            if (error) {
                console.error('Fehler beim Speichern:', error);
                alert('Es gab ein Problem beim Speichern. Schau in die Konsole (F12).');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Nochmal versuchen';
            } else {
                document.getElementById('step7').classList.add('hidden');
                document.getElementById('success-msg').classList.remove('hidden');
            }
        });
    }
});
