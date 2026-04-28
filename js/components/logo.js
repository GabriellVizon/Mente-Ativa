/**
 * Mente Ativa - Logo Component
 *用法:
 *   <div class="logo" data-logo-tipo="simples">
 *       <div class="logo-icon">
 *           <img src="img/LogoVerde.png" alt="Logo Mente Ativa" />
 *       </div>
 *   </div>
 * 
 * Automatic detection based on page:
 *   - grupo-simples, com-ajuda → Verde
 *   - grupo-moderado, menu → Azul
 *   - Others → Principal
 */

(function() {
    'use strict';

    const LogoConfig = {
        tipos: {
            simples: {
                src: 'img/LogoVerde.png',
                alt: 'Logo Mente Ativa - Nível Simples'
            },
            moderado: {
                src: 'img/LogoAzul.png',
                alt: 'Logo Mente Ativa - Nível Moderado'
            },
            principal: {
                src: 'img/Logo.png',
                alt: 'Logo Mente Ativa'
            }
        },
        autoDetectPaths: {
            simples: ['simples', 'com-ajuda'],
            moderado: ['moderado', 'menu', 'seguranca']
        }
    };

    function detectarTipo() {
        const path = window.location.pathname.toLowerCase();

        for (const [tipo, keywords] of Object.entries(LogoConfig.autoDetectPaths)) {
            for (const keyword of keywords) {
                if (path.includes(keyword)) {
                    return tipo;
                }
            }
        }
        return 'principal';
    }

    function aplicarLogo() {
        const logos = document.querySelectorAll('[data-logo-tipo], .logo .logo-icon img');

        if (logos.length === 0) return;

        // Se há data-logo-tipo explícito, usa esse
        logos.forEach(logoContainer => {
            let tipo = logoContainer.dataset.logoTipo;

            if (!tipo) {
                // Detecta automaticamente baseado na página
                tipo = detectarTipo();
            }

            const config = LogoConfig.tipos[tipo] || LogoConfig.tipos.principal;
            const img = logoContainer.querySelector('img') || logoContainer;

            if (img.tagName === 'IMG') {
                img.src = config.src;
                img.alt = config.alt;
            }
        });
    }

    // Aplica ao carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', aplicarLogo);
    } else {
        aplicarLogo();
    }

    // Expõe globalmente
    window.LogoComponent = {
        setTipo: function(container, tipo) {
            const config = LogoConfig.tipos[tipo];
            if (!config) return;

            const img = container.querySelector('img') || container;
            if (img.tagName === 'IMG') {
                img.src = config.src;
                img.alt = config.alt;
            }
        },
        getTipo: detectarTipo,
        config: LogoConfig.tipos
    };

})();