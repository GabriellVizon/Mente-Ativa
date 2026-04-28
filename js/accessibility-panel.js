/* Painel de Acessibilidade */
(function() {
    // Create panel HTML
    function createPanel() {
        const panel = document.createElement('div');
        panel.className = 'accessibility-panel';
        panel.id = 'accessibility-panel';
        panel.innerHTML = `
            <button class="accessibility-close" id="accessibility-close">&times;</button>
            <h2>Acessibilidade</h2>
            
            <div class="accessibility-option">
                <h3>Modo Escuro</h3>
                <button class="dark-mode-toggle-btn" id="panel-dark-mode-btn" aria-label="Alternar modo escuro">
                    <span class="toggle-indicator">
                        <span class="toggle-on">ON</span>
                        <span class="toggle-off">OFF</span>
                    </span>
                </button>
            </div>
            
            <div class="accessibility-option">
                <h3>Tamanho da Fonte</h3>
                <div class="font-buttons">
                    <button class="font-btn" data-size="14" aria-label="Fonte pequeno">A-</button>
                    <button class="font-btn active" data-size="16" aria-label="Fonte normal">A</button>
                    <button class="font-btn" data-size="20" aria-label="Fonte grande">A+</button>
                    <button class="font-btn" data-size="24" aria-label="Fonte extra grande">A++</button>
                </div>
            </div>
            
            <div class="accessibility-option">
                <h3>Contraste</h3>
                <div class="contrast-buttons">
                    <button class="contrast-btn contrast-normal active" data-contrast="normal" style="background: #F8FAFC;" aria-label="Contraste normal" title="Normal"></button>
                    <button class="contrast-btn contrast-dark" data-contrast="dark" style="background: #1a1a2e;" aria-label="Contraste escuro" title="Escuro"></button>
                    <button class="contrast-btn contrast-high" data-contrast="high" style="background: #000;" aria-label="Contraste alto" title="Alto"></button>
                    <button class="contrast-btn contrast-yellow" data-contrast="yellow" style="background: #FFFF00;" aria-label="Contraste amarelo" title="Amarelo"></button>
                    <button class="contrast-btn contrast-blue" data-contrast="blue" style="background: #0000FF;" aria-label="Contraste azul" title="Azul"></button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'accessibility-toggle';
        toggleBtn.id = 'accessibility-toggle';
        toggleBtn.setAttribute('aria-label', 'Abrir painel de acessibilidade');
        toggleBtn.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 .69 16l4 4 4-4V20h4.69l4 4 4-4v-4.69l4-4-4-4.31zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
            </svg>
        `;
        document.body.appendChild(toggleBtn);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'accessibility-overlay';
        overlay.id = 'accessibility-overlay';
        document.body.appendChild(overlay);
    }

    // Initialize panel
    function init() {
        createPanel();
        
        const panel = document.getElementById('accessibility-panel');
        const toggle = document.getElementById('accessibility-toggle');
        const close = document.getElementById('accessibility-close');
        const overlay = document.getElementById('accessibility-overlay');
        const darkModeBtn = document.getElementById('panel-dark-mode-btn');
        
        // Toggle panel
        toggle.addEventListener('click', () => {
            panel.classList.add('open');
            overlay.classList.add('show');
        });

        // Close panel
        close.addEventListener('click', closePanel);
        overlay.addEventListener('click', closePanel);

        function closePanel() {
            panel.classList.remove('open');
            overlay.classList.remove('show');
        }

        // Dark mode toggle using existing dark-mode.css system
        darkModeBtn.addEventListener('click', toggleDarkMode);

        // Update dark mode button UI
        function updateDarkModeUI() {
            const isEscuro = document.documentElement.classList.contains('modo-escuro');
            darkModeBtn.classList.toggle('active', isEscuro);
        }

        // Font size buttons
        const fontBtns = document.querySelectorAll('.font-btn');
        fontBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                fontBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const size = btn.dataset.size;
                document.body.style.fontSize = size + 'px';
                savePreference('fontSize', size);
            });
        });

        // Contrast buttons
        const contrastBtns = document.querySelectorAll('.contrast-btn');
        contrastBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                contrastBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const contrast = btn.dataset.contrast;
                setContrast(contrast);
                savePreference('contrast', contrast);
            });
        });

        // Initial UI update
        updateDarkModeUI();
        
        // Load saved preferences
        loadPreferences();
    }

    // Toggle dark mode using existing system
    function toggleDarkMode() {
        const isEscuro = document.documentElement.classList.contains('modo-escuro');
        
        if (isEscuro) {
            document.documentElement.classList.remove('modo-escuro');
            localStorage.setItem('mente-ativa-modo-escuro', 'false');
        } else {
            document.documentElement.classList.add('modo-escuro');
            localStorage.setItem('mente-ativa-modo-escuro', 'true');
        }
        
        // Update button state
        const darkModeBtn = document.getElementById('panel-dark-mode-btn');
        darkModeBtn.classList.toggle('active', !isEscuro);
    }

    // Set contrast theme
    function setContrast(contrast) {
        document.body.setAttribute('data-contrast', contrast);
        
        // Remove all contrast classes
        document.body.classList.remove('contrast-normal', 'contrast-dark', 'contrast-high', 'contrast-yellow', 'contrast-blue');
        
        // Add the selected contrast class
        if (contrast !== 'normal') {
            document.body.classList.add('contrast-' + contrast);
        }
    }

    // Save preference to localStorage
    function savePreference(key, value) {
        localStorage.setItem('accessibility_' + key, JSON.stringify(value));
    }

    // Load preferences from localStorage
    function loadPreferences() {
        // Check dark mode from localStorage
        const isDarkMode = localStorage.getItem('mente-ativa-modo-escuro') === 'true';
        if (isDarkMode) {
            document.documentElement.classList.add('modo-escuro');
            const darkModeBtn = document.getElementById('panel-dark-mode-btn');
            darkModeBtn.classList.add('active');
        }

        // Font size
        const fontSize = localStorage.getItem('accessibility_fontSize');
        if (fontSize) {
            document.body.style.fontSize = fontSize + 'px';
            document.querySelectorAll('.font-btn').forEach(btn => {
                if (btn.dataset.size === fontSize) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        // Contrast
        const contrast = localStorage.getItem('accessibility_contrast');
        if (contrast) {
            setContrast(contrast);
            document.querySelectorAll('.contrast-btn').forEach(btn => {
                if (btn.dataset.contrast === contrast) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();