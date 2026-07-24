// 1. Supabase initialisieren (TRAGE HIER DEINE ECHTEN KEYS EIN!)
const SUPABASE_URL = 'https://nkyfgiovrdklakzappgv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-LCrZ_Xi_KIiM8RWVEIbBQ_w8_mUBBt';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    
    // --- STEP 1: Längen-Slider mit EXPONENTIELLEM Balken ---
    const laengeSlider = document.getElementById('laenge_cm');
    const laengeOutput = document.getElementById('laenge_output');
    const dynamicBar = document.getElementById('dynamic_bar');
    
    if (laengeSlider && laengeOutput) {
        const updateBarWidth = (value) => {
            if (dynamicBar) {
                const maxCm = 30; 
                // Exponentielles Wachstum (Wert / Maximum) hoch 3
                const exponent = Math.pow(value / maxCm, 3);
                
                // Berechne Platz bis zum Bildschirmrand
                const balkenStart = dynamicBar.getBoundingClientRect().left;
                const platzBisZumRand = window.innerWidth - balkenStart;
                
                const neueBreite = exponent * platzBisZumRand;
                dynamicBar.style.width = `${neueBreite}px`;
            }
        };

        // Kurzer Delay, damit das Layout fertig geladen ist
        setTimeout(() => {
            updateBarWidth(laengeSlider.value);
        }, 100);

        laengeSlider.addEventListener('input', (e) => {
            const currentVal = e.target.value;
            laengeOutput.textContent = currentVal;
            updateBarWidth(currentVal);
        });
        
        window.addEventListener('resize', () => {
            updateBarWidth(laengeSlider.value);
        });
    }

    // --- STEP 2: Ausdauer-Slider (Fehler behoben) ---
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
            const val = parseInt(e.target.value);
            // Array fängt bei 0 an, deshalb val - 1
            dauerFeedback.textContent = feedbackTexte[val - 1] + ` (${val})`;
            dauerHidden.value = val;
        });
    }

    // --- HILFSFUNKTION FÜR BUTTON-GROUPS (Akustik & Fazit) ---
    function setupButtonGroup(groupSelector, hiddenInputId) {
        const btns = document.querySelectorAll(`${groupSelector} .choice-btn`);
        const hiddenInput = document.getElementById(hiddenInputId);
        
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                hiddenInput.value = btn.getAttribute('data-value');
            });
        });
    }

    // --- STEP 3 & STEP 7: Klickbare Buttons anbinden ---
    setupButtonGroup('#akustik_group', 'akustik_id');
    setupButtonGroup('#empfehlung_group', 'empfehlung_id');

    // --- HILFSFUNKTION FÜR STERNE & FLAMMEN ---
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

    // --- NAVIGATION ZWISCHEN DEN SEITEN ---
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
            
            // Greift alle Werte ab (inkl. dem neuen empfehlung_id aus Step 7)
            const daten = {
                laenge_cm: parseInt(document.getElementById('laenge_cm').value) || 15,
                dauer_rating: parseInt(document.getElementById('dauer_rating').value) || 5,
                akustik_id: parseInt(document.getElementById('akustik_id').value) || 3,
                performance_sterne: parseInt(document.getElementById('performance_sterne').value) || 3,
                vorspiel_rating: parseInt(document.getElementById('vorspiel_rating').value) || 3,
                nachgang_id: parseInt(document.getElementById('nachgang_id').value) || 3,
                empfehlung: parseInt(document.getElementById('empfehlung_id').value) || 3,
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
