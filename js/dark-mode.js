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
        // Não criar o botão durante a intro
        const intro = document.getElementById('intro-overlay');
        if (intro) {
            const cs = window.getComputedStyle(intro);
            if (cs.display !== 'none' && cs.visibility !== 'hidden') {
                return;
            }
        }

        const { el, modo } = this.resolverAlvoBotao();

        this.botao = document.createElement('button');
        this.botao.id = 'btn-dark-mode';
        this.botao.className = 'dark-mode-btn';
        this.botao.setAttribute('aria-label', 'Modo escuro');
        this.botao.title = 'Clique para ativar modo escuro';
        this.botao.setAttribute('data-escuro', this.isEscuro ? 'true' : 'false');

        this.botao.innerHTML = `
            
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="moon-icon" viewBox="0 0 16 16">
      <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
    </svg>
                <svg class="sun-icon" viewBox="0 0 24 24" fill="currentColor">
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
