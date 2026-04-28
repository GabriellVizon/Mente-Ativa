/**
 * Mente Ativa - Accessibility Component
 * Centraliza: TTS, Contraste, FontSize, DarkMode
 */

(function() {
    'use strict';

    const Accessibility = {
        // ======================
        // CONFIGURAÇÕES
        // ======================
        STORAGE_KEYS: {
            darkMode: 'mente-ativa-modo-escuro',
            contrast: 'mente-ativa-contraste',
            fontSize: 'mente-ativa-fonte'
        },

        // ======================
        // TEXT-TO-SPEECH
        // ======================
        TTS: {
            ativa: false,
            sintetizador: null,

            init() {
                if ('speechSynthesis' in window) {
                    this.sintetizador = window.speechSynthesis;
                    this.ativa = true;
                }
            },

            falar(texto, velocidade = 0.8) {
                if (!this.ativa) return;
                this.parar();

                const utterance = new SpeechSynthesisUtterance(texto);
                utterance.lang = 'pt-BR';
                utterance.rate = velocidade;
                this.sintetizador.speak(utterance);
            },

            parar() {
                if (this.ativa) {
                    this.sintetizador.cancel();
                }
            }
        },

        // ======================
        // MODO ESCURO
        // ======================
        DarkMode: {
            isEscuro: false,

            init() {
                this.isEscuro = localStorage.getItem(Accessibility.STORAGE_KEYS.darkMode) === 'true';
                this.aplicar();
            },

            toggle() {
                this.isEscuro = !this.isEscuro;
                localStorage.setItem(Accessibility.STORAGE_KEYS.darkMode, this.isEscuro);
                this.aplicar();
            },

            aplicar() {
                document.documentElement.classList.toggle('modo-escuro', this.isEscuro);
            }
        },

        // ======================
        // CONTRASTE
        // ======================
        Contraste: {
            opcoes: ['normal', 'dark', 'high', 'yellow', 'blue'],
            atual: 'normal',

            init() {
                const salvo = localStorage.getItem(Accessibility.STORAGE_KEYS.contrast);
                if (salvo && this.opcoes.includes(salvo)) {
                    this.aplicar(salvo);
                }
            },

            aplicar(tipo) {
                this.atual = tipo;
                document.body.setAttribute('data-contrast', tipo);

                this.opcoes.forEach(op => {
                    document.body.classList.remove('contrast-' + op);
                });

                if (tipo !== 'normal') {
                    document.body.classList.add('contrast-' + tipo);
                }

                localStorage.setItem(Accessibility.STORAGE_KEYS.contrast, tipo);
            }
        },

        // ======================
        // TAMANHO DA FONTE
        // ======================
        FontSize: {
            opcoes: [14, 16, 20, 24],
            atual: 16,

            init() {
                const salvo = localStorage.getItem(Accessibility.STORAGE_KEYS.fontSize);
                if (salvo) {
                    this.aplicar(parseInt(salvo));
                }
            },

            aplicar(tamanho) {
                this.atual = tamanho;
                document.body.style.fontSize = tamanho + 'px';
                localStorage.setItem(Accessibility.STORAGE_KEYS.fontSize, tamanho);
            }
        },

        // ======================
        // INICIALIZAÇÃO
        // ======================
        init() {
            this.TTS.init();
            this.DarkMode.init();
            this.Contraste.init();
            this.FontSize.init();
        }
    };

    // Inicializa automaticamente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Accessibility.init());
    } else {
        Accessibility.init();
    }

    // Expõe globalmente
    window.Accessibility = Accessibility;

})();