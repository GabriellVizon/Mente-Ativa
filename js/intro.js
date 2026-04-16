/* ============================================
   JavaScript da Intro Cinematográfica
   Integração com o site Mente Ativa
   ============================================ */

(function() {
    // ========================================
    // Configurações
    // ========================================
    const CONFIG = {
        // Tempo total da animação da intro (ms)
        animationTime: 6000,
        
        // Tempo adicional antes de fechar automaticamente
        extraTime: 2000,
        
        // Áudio (configure se tiver)
        audio: {
            enabled: false,
            sources: ['audio/intro.mp3', 'audio/intro.ogg'],
            volume: 0.15,
            fadeInDuration: 1500,
            fadeOutDuration: 800
        }
    };

    // ========================================
    // Elementos do DOM
    // ========================================
    const introOverlay = document.getElementById('intro-overlay');
    const audioElement = document.getElementById('intro-audio');

    // ========================================
    // Estado da intro
    // ========================================
    let state = {
        isActive: false,
        isFinished: false,
        audioStarted: false,
        audioPlaying: false
    };

    // ========================================
    // Funções de Áudio
    // ========================================
    function playAudioWithFadeIn() {
        if (!CONFIG.audio.enabled || !audioElement || state.audioStarted) return;
        
        try {
            audioElement.volume = 0;
            const playPromise = audioElement.play();
            
            if (playPromise !== undefined) {
                playPromise.then(function() {
                    state.audioStarted = true;
                    state.audioPlaying = true;
                    
                    // Fade-in
                    let startTime = Date.now();
                    function fadeIn() {
                        let elapsed = Date.now() - startTime;
                        let progress = Math.min(elapsed / CONFIG.audio.fadeInDuration, 1);
                        audioElement.volume = progress * CONFIG.audio.volume;
                        if (progress < 1) requestAnimationFrame(fadeIn);
                    }
                    fadeIn();
                }).catch(function(e) {
                    console.log('Áudio bloqueado, será ativado no clique');
                });
            }
        } catch(e) {
            console.log('Erro ao reproduzir áudio:', e);
        }
    }

    function stopAudioWithFadeOut() {
        if (!state.audioPlaying || !audioElement) return;
        
        let startVolume = audioElement.volume;
        let startTime = Date.now();
        
        function fadeOut() {
            let elapsed = Date.now() - startTime;
            let progress = Math.min(elapsed / CONFIG.audio.fadeOutDuration, 1);
            audioElement.volume = startVolume * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(fadeOut);
            } else {
                audioElement.pause();
                state.audioPlaying = false;
            }
        }
        fadeOut();
    }

    // ========================================
    // Função de Fechamento da Intro
    // ========================================
    function closeIntro() {
        // Evitar múltiplos cliques
        if (state.isFinished) return;
        state.isFinished = true;

        // Fade-out visual
        introOverlay.classList.add('fade-out');
        
        // Fade-out do áudio
        stopAudioWithFadeOut();

        // Remover do DOM após animação
        setTimeout(function() {
            introOverlay.style.display = 'none';
            
            // Liberar scroll do body (se necessário)
            document.body.style.overflow = '';
        }, 800);
    }

    // ========================================
    // Ativar áudio no primeiro clique
    // ========================================
    function activateAudioOnFirstClick() {
        if (!state.audioStarted && CONFIG.audio.enabled) {
            playAudioWithFadeIn();
        }
    }

    // ========================================
    // Inicialização
    // ========================================
    function init() {
        // Não executar se já foi fechada (usando sessionStorage)
        if (sessionStorage.getItem('introCompleted')) {
            introOverlay.style.display = 'none';
            return;
        }

        state.isActive = true;
        
        // Bloquear scroll durante a intro
        document.body.style.overflow = 'hidden';

        // Iniciar áudio automaticamente (com fallback)
        if (CONFIG.audio.enabled) {
            setTimeout(playAudioWithFadeIn, 500);
            
            // Fallback: ativar no primeiro clique
            introOverlay.addEventListener('click', activateAudioOnFirstClick, { once: true });
        }

        // Evento de clique para fechar intro
        introOverlay.addEventListener('click', function(e) {
            e.stopPropagation();
            closeIntro();
            sessionStorage.setItem('introCompleted', 'true');
        });

        // Fechamento automático após animação
        setTimeout(function() {
            if (!state.isFinished) {
                closeIntro();
                sessionStorage.setItem('introCompleted', 'true');
            }
        }, CONFIG.animationTime + CONFIG.extraTime);
    }

    // ========================================
    // Executar quando o DOM estiver pronto
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();