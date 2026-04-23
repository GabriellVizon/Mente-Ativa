// Mente Ativa - Modo Escuro
// Gerencia a troca entre backgrounds claro e escuro

// Mapeamento de backgrounds: claro -> escuro
const BACKGROUND_MAP = {
    'neutralbkg.png': 'darkneutralbkg.png',
    'bluebkg.png': 'darkbluebkg.png',
    'greenbkg.png': 'darkgreenbkg.png',
};

// Configuração do localStorage
const STORAGE_KEY = 'mente-ativa-modo-escuro';

// Classe para gerenciar o modo escuro
class DarkModeManager {
    constructor() {
        this.isEscuro = false;
        this.backgroundAtual = '';
        this.botao = null;
    }

    possuiFundoMapeavel(backgroundImage) {
        if (!backgroundImage || backgroundImage === 'none') return false;
        return Object.keys(BACKGROUND_MAP).some((nome) => backgroundImage.includes(nome));
    }

    substituirParaEscuro(backgroundImage) {
        let s = backgroundImage;
        Object.keys(BACKGROUND_MAP).forEach((light) => {
            const dark = BACKGROUND_MAP[light];
            s = s.split(light).join(dark);
        });
        return s;
    }

    sincronizarClasseDocumento() {
        document.documentElement.classList.toggle('modo-escuro', Boolean(this.isEscuro));
    }

    // Inicializar o modo escuro
    init() {
        this.isEscuro = localStorage.getItem(STORAGE_KEY) === 'true';

        if (this.isEscuro) {
            this.aplicarModoEscuro();
        } else {
            this.sincronizarClasseDocumento();
        }

        this.criarBotao();

        document.addEventListener('mente-ativa-intro-fechada', () => {
            this.reposicionarBotaoAposIntro();
        });
    }

    // Obter o background atual
    obterBackgroundAtual() {
        const bodyStyle = window.getComputedStyle(document.body);
        const backgroundImage = bodyStyle.backgroundImage;

        const match = backgroundImage.match(/url\(['"]?(?:.*\/)?([^/'")]+)['"]?\)/);
        return match ? match[1] : '';
    }

    resolverAlvoBotao() {
        const intro = document.getElementById('intro-overlay');
        if (intro) {
            const cs = window.getComputedStyle(intro);
            if (cs.display !== 'none' && cs.visibility !== 'hidden') {
                const ic = intro.querySelector('.intro-content');
                if (ic) {
                    return { el: ic, modo: 'intro' };
                }
            }
        }

        const tituloComTts =
            document.querySelector('header .titulo-com-tts') ||
            document.querySelector('.titulo-com-tts');

        if (tituloComTts) {
            return { el: tituloComTts, modo: 'header' };
        }

        const header = document.querySelector('header') || document.querySelector('.header');

        if (header) {
            return { el: header, modo: 'header' };
        }

        return { el: document.body, modo: 'fixed' };
    }

    aplicarClassePosicaoBotao(modo) {
        if (!this.botao) return;
        this.botao.classList.remove('dark-mode-btn--intro', 'dark-mode-btn--fixed');
        if (modo === 'intro') {
            this.botao.classList.add('dark-mode-btn--intro');
        } else if (modo === 'fixed') {
            this.botao.classList.add('dark-mode-btn--fixed');
        }
    }

    reposicionarBotaoAposIntro() {
        if (!this.botao) return;
        const { el, modo } = this.resolverAlvoBotao();
        if (this.botao.parentElement !== el) {
            el.appendChild(this.botao);
        }
        this.aplicarClassePosicaoBotao(modo);
    }

    // Alternar modo escuro
    toggleModoEscuro() {
        if (this.isEscuro) {
            this.aplicarModoClaro();
        } else {
            this.aplicarModoEscuro();
        }
    }

    // Aplicar modo escuro
    aplicarModoEscuro() {
        this.isEscuro = true;

        const bg = window.getComputedStyle(document.body).backgroundImage;
        if (this.possuiFundoMapeavel(bg)) {
            const proximo = this.substituirParaEscuro(bg);
            if (proximo && proximo !== bg) {
                document.body.style.backgroundImage = proximo;
            }
        }

        localStorage.setItem(STORAGE_KEY, 'true');

        if (this.botao) {
            this.botao.setAttribute('data-escuro', 'true');
            this.botao.setAttribute('aria-label', 'Modo claro');
            this.botao.title = 'Clique para ativar modo claro';
        }

        this.sincronizarClasseDocumento();

        const header = document.querySelector('.header');
        if (header) {
            header.style.backgroundColor = '#1f1f1f';
        } if (header) {
            header.style.backgroundColor = '';
        }
    }

    // Aplicar modo claro
    aplicarModoClaro() {
        this.isEscuro = false;

        document.body.style.backgroundImage = '';

        localStorage.setItem(STORAGE_KEY, 'false');

        if (this.botao) {
            this.botao.setAttribute('data-escuro', 'false');
            this.botao.setAttribute('aria-label', 'Modo escuro');
            this.botao.title = 'Clique para ativar modo escuro';
        }

        this.sincronizarClasseDocumento();
    }

    // Criar o botão de modo escuro
    criarBotao() {
        const { el, modo } = this.resolverAlvoBotao();

        this.botao = document.createElement('button');
        this.botao.id = 'btn-dark-mode';
        this.botao.className = 'dark-mode-btn';
        this.botao.setAttribute('aria-label', 'Modo escuro');
        this.botao.title = 'Clique para ativar modo escuro';
        this.botao.setAttribute('data-escuro', this.isEscuro ? 'true' : 'false');

        this.botao.innerHTML = `
    
            <svg class="sun-icon" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg class="moon-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        `;

        this.botao.addEventListener('click', () => this.toggleModoEscuro());

        el.appendChild(this.botao);
        this.aplicarClassePosicaoBotao(modo);

        if (this.isEscuro) {
            this.botao.setAttribute('data-escuro', 'true');
            this.botao.setAttribute('aria-label', 'Modo claro');
            this.botao.title = 'Clique para ativar modo claro';
        }
    }
}

function iniciarDarkMode() {
    const darkMode = new DarkModeManager();
    darkMode.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarDarkMode);
} else {
    iniciarDarkMode();
}
