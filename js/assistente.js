document.addEventListener('DOMContentLoaded', function() {
    const API_URL = window.MENTE_ATIVA_API_URL || 'https://mente-ativa-1.onrender.com/api';
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const clearBtn = document.getElementById('clearBtn');
    const speakLastBtn = document.getElementById('speakLastBtn');

    let speechSynthesis = window.speechSynthesis;
    let lastAssistantMessage = '';
    let isSpeaking = false;

    // Função para falar o texto em voz alta
    function falar(texto) {
        // Interrompe qualquer fala anterior
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onstart = function() {
            isSpeaking = true;
        };

        utterance.onend = function() {
            isSpeaking = false;
        };

        utterance.onerror = function() {
            isSpeaking = false;
        };

        speechSynthesis.speak(utterance);
    }

    // Função para interromper a fala
    function pararFala() {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            isSpeaking = false;
        }
    }

    // Adicionar mensagem ao chat
    function formatMessageContent(content) {
        return String(content || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/\n/g, '<br>');
    }

    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;

        const avatar = isUser ? '👤' : '🤖';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p>${formatMessageContent(content)}</p>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Salva a última mensagem do assistente para poder ler depois
        if (!isUser) {
            lastAssistantMessage = content;
        }
    }

    // Mostrar indicador de digitação
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant typing';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Remover indicador de digitação
    function hideTyping() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Enviar pergunta para a API com retentativas
    async function sendQuestion() {
        const pergunta = userInput.value.trim();
        
        if (!pergunta) {
            return;
        }

        // Adicionar pergunta do usuário
        addMessage(pergunta, true);
        userInput.value = '';
        
        // Desabilitar botão enquanto carrega
        sendBtn.disabled = true;
        userInput.disabled = true;

        // Mostrar indicador de digitação
        showTyping();

        const maxTentativas = 3;
        let tentativa = 0;
        let sucesso = false;
        let ultimoErro = '';

        while (tentativa < maxTentativas && !sucesso) {
            try {
                tentativa++;
                console.log(`Tentativa ${tentativa}/${maxTentativas} para enviar pergunta`);

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos timeout

                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ pergunta }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    
                    if (data.resposta) {
                        // Remover indicador de digitação
                        hideTyping();

                        // Adicionar resposta do assistente
                        addMessage(data.resposta, false);

                        // Falar a resposta em voz alta
                        falar(data.resposta);

                        sucesso = true;
                    }
                } else {
                    ultimoErro = `Erro ${response.status}: ${response.statusText}`;
                    
                    if (response.status === 429) {
                        // Rate limited - aguardar antes de tentar novamente
                        console.warn('Rate limited. Aguardando...');
                        await new Promise(r => setTimeout(r, 2000 * tentativa));
                    } else if (response.status >= 500) {
                        // Erro do servidor - tentar novamente
                        if (tentativa < maxTentativas) {
                            await new Promise(r => setTimeout(r, 1000 * tentativa));
                        }
                    } else {
                        // Erro do cliente - não tentar novamente
                        throw new Error(ultimoErro);
                    }
                }

            } catch (error) {
                ultimoErro = error.message;
                console.error(`Tentativa ${tentativa} falhou:`, error);
                
                // Se for timeout ou erro de conexão, tentar novamente
                if ((error.name === 'AbortError' || ultimoErro.includes('Failed to fetch')) && tentativa < maxTentativas) {
                    console.log('Reconectando...');
                    await new Promise(r => setTimeout(r, 1000 * tentativa));
                } else if (tentativa === maxTentativas) {
                    // Última tentativa falhou
                    break;
                }
            }
        }

        if (!sucesso) {
            // Remover indicador de digitação
            hideTyping();

            // Mostrar mensagem de erro detalhada
            let mensagemErro = 'Desculpe, não consegui responder agora.\n\n';
            
            if (ultimoErro.includes('Failed to fetch') || ultimoErro.includes('ERR_')) {
                mensagemErro += 'Não consegui me conectar ao servidor da IA. Verifique se o serviço do Render está ativo e tente novamente.';
            } else if (ultimoErro.includes('timeout')) {
                mensagemErro += '⏱️ A resposta demorou muito. Tente novamente.';
            } else if (ultimoErro.includes('429')) {
                mensagemErro += '⚠️ Muitas requisições. Aguarde um pouco e tente novamente.';
            } else {
                mensagemErro += `Erro: ${ultimoErro}`;
            }

            addMessage(mensagemErro, false);
            console.error('Falha após retentativas:', ultimoErro);
        }

        // Reabilitar botão e input
        sendBtn.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }

    // Limpar o chat
    function clearChat() {
        // Interromper qualquer fala
        pararFala();
        
        // Limpar mensagens
        chatMessages.innerHTML = '';
        
        // Adicionar mensagem inicial
        addMessage('Olá! Eu sou o assistente virtual do Mente Ativa. Posso ajudar você com dúvidas sobre o site, jogos, exercícios e muito mais. Digite sua pergunta abaixo!', false);
        
        // Limpar última mensagem salva
        lastAssistantMessage = '';
    }

    // Ler a última mensagem do assistente
    function speakLastMessage() {
        if (lastAssistantMessage) {
            falar(lastAssistantMessage);
        } else {
            // Se não houver mensagem, fala a última do chat
            const messages = chatMessages.querySelectorAll('.message.assistant');
            if (messages.length > 0) {
                const lastMsg = messages[messages.length - 1];
                const text = lastMsg.querySelector('p').textContent;
                lastAssistantMessage = text;
                falar(text);
            }
        }
    }

    // Event listeners
    sendBtn.addEventListener('click', sendQuestion);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendQuestion();
        }
    });

    clearBtn.addEventListener('click', clearChat);
    speakLastBtn.addEventListener('click', speakLastMessage);

    // Adicionar eventos aos exemplos de perguntas
    document.querySelectorAll('.help-box li').forEach(function(li) {
        li.addEventListener('click', function() {
            const question = this.textContent;
            userInput.value = question;
            sendQuestion();
        });
    });

    // Focar no input ao carregar a página
    userInput.focus();
});
