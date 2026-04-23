/* ============================================
   JavaScript da Intro Cinematográfica
   ============================================ */

(function() {
    // Mostrar apenas na primeira vez que acessar o site
    if (localStorage.getItem('intro_vista')) {
        const intro = document.getElementById('intro-overlay');
        if (intro) intro.style.display = 'none';
        document.body.style.overflow = '';
        return;
    }

    localStorage.setItem('intro_vista', 'true');

    const intro = document.getElementById('intro-overlay');
    const title = document.getElementById('title');
    const main = document.getElementById('main');
    const desc = document.getElementById('desc');

    const text = "Mente Ativa";
    let index = 0;

    function typeWriter() {
        if (index === 0) {
            title.textContent = "";
            title.style.opacity = 1;
        }

        if (index < text.length) {
            title.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 80 + Math.random() * 40);
        } else {
            title.classList.add('typing');
        }
    }

    // Sequência de animações
    setTimeout(function() {
        main.classList.add('move');
        title.style.opacity = 1;
        typeWriter();
    }, 1800);

    setTimeout(function() {
        desc.style.opacity = 1;
        desc.style.transform = 'translateY(0)';
        desc.style.transition = 'all 0.8s ease';
    }, 3500);

    function closeIntro() {
        intro.classList.add('intro-fade-out');
        document.body.style.overflow = '';
        setTimeout(function() {
            intro.style.display = 'none';
            document.dispatchEvent(new CustomEvent('mente-ativa-intro-fechada'));
        }, 800);
    }

    // Clique para fechar
    intro.addEventListener('click', closeIntro);

    // Fechar automaticamente após 12 segundos
    setTimeout(closeIntro, 12000);
})();