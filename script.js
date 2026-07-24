// 1. Supabase initialisieren
const SUPABASE_URL = 'https://nkyfgiovrdklakzappgv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-LCrZ_Xi_KIiM8RWVEIbBQ_w8_mUBBt';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    
    // --- STEP 1: Längen-Slider ---
    const laengeSlider = document.getElementById('laenge_cm');
    const laengeOutput = document.getElementById('laenge_output');
    if (laengeSlider && laengeOutput) {
        laengeSlider.addEventListener('input', (e) => {
            laengeOutput.textContent = e.target.value;
        });
    }

    // --- STEP 2: Ausdauer-Slider mit dynamischem Text ---
    const dauerSlider = document.getElementById('dauer_slider');
    const dauerFeedback = document.getElementById('dauer_feedback');
    const dauerHidden = document.getElementById('dauer_rating');
    
    if (dauerSlider && dauerFeedback) {
        const feedbackTexte = [
            "1 - Vorbei bevor es anfing", "2 - Kurz & Knackig", "3 - Ausbaufähig", 
            "4 - Guter Standard", "5 - Solide Mitte", "6 - Ordentlich", 
            "7 - Sehr ausdauernd", "8 - Sportlich!", "9 - Marathon", "10 - Maschine"
        ];
        dauerSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            dauerFeedback.textContent = feedbackTexte[val - 1];
            dauerHidden.value = val;
        });
    }

    // --- STEP 3: Akustik (Große Buttons) ---
    const akustikBtns = document.querySelectorAll('#akustik_group .choice-btn');
    const akustikHidden = document.getElementById('akustik_id');
    
    akustikBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            akustikBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            akustikHidden.value = btn.getAttribute('data-value');
        });
    });

    // --- Hilfsfunktion für Sterne & Flammen ---
    function setupRating(selector, hiddenInputId) {
        const elements = document.querySelectorAll(selector);
        const hiddenInput = document.getElementById(hiddenInputId);
        
        elements.forEach(el => {
            el.addEventListener('click', () => {
                const value = parseInt(el.getAttribute('data-value'));
                hiddenInput.value = value;
                
                elements.forEach(e => {
                    if (parseInt(e.getAttribute('data-value')) <= value) {
                        e.classList.add('active');
                    } else {
                        e.classList.remove('active');
                    }
                });
            });
        });
    }

    // --- STEP 4 & 5: Sterne und Flammen anbinden ---
    setupRating('#performance_stars .star', 'performance_sterne');
    setupRating('#vorspiel_flames .flame', 'vorspiel_rating');

    // --- STEP 6: Aftercare (Pills) ---
    const aftercarePills = document.querySelectorAll('#aftercare_group .pill');
    const aftercareHidden = document.getElementById('nachgang_id');
    
    aftercarePills.forEach(pill => {
        pill.addEventListener('click', () => {
            aftercarePills.forEach(p => p.classList.remove('selected'));
            pill.classList.add('selected');
            aftercareHidden.value = pill.getAttribute('data-value');
        });
    });

    // --- NAVIGATION ---
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

    // --- SUPABASE SUBMIT ---
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            
            // Greift jetzt die Werte aus den versteckten Input-Feldern ab!
            const daten = {
                laenge_cm: parseInt(document.getElementById('laenge_cm').value) || 15,
                dauer_rating: parseInt(document.getElementById('dauer_rating').value) || 5,
                akustik_id: parseInt(document.getElementById('akustik_id').value) || 3,
                performance_sterne: parseInt(document.getElementById('performance_sterne').value) || 3,
                vorspiel_rating: parseInt(document.getElementById('vorspiel_rating').value) || 3,
                nachgang_id: parseInt(document.getElementById('nachgang_id').value) || 3,
                empfehlung: parseInt(document.getElementById('empfehlung').value) || 3,
                kommentar: document.getElementById('kommentar').value || ""
            };

            submitBtn.disabled = true;
            submitBtn.textContent = 'Speichere...';

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
