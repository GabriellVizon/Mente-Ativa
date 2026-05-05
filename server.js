import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

console.log('API Key carregada:', process.env.OPENROUTER_API_KEY ? 'Sim' : 'Não');
console.log(`[${new Date().toLocaleTimeString('pt-BR')}] Servidor iniciando...`);

// Função para tentar diferentes APIs com fallback
async function obterRespostaIA(pergunta) {
  // Primeiro, tenta OpenRouter (se a chave estiver configurada)
  if (process.env.OPENROUTER_API_KEY) {
    try {
      console.log('Tentando OpenRouter...');
     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://mente-ativa-1.onrender.com",
    "X-Title": "Mente Ativa"
  },
  body: JSON.stringify({
    model: "openai/gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "Você é um assistente chamado Mente Ativa. Responda de forma simples, clara e amigável para idosos."
      },
      {
        role: "user",
        content: pergunta
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  })
});

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices[0]) {
          return data.choices[0].message.content;
        }
      } else {
        console.warn(`OpenRouter falhou (${response.status}). Tentando fallback...`);
      }
    } catch (error) {
      console.warn('OpenRouter erro:', error.message);
    }
  }

  

  // Último fallback: Resposta genérica baseada em palavras-chave
  return gerarRespostaGenérica(pergunta);
}

// Gerador de resposta genérica para quando nenhuma API funcionar
function gerarRespostaGenérica(pergunta) {
  const perguntaLower = pergunta.toLowerCase().replace(/[?!.]/g, '');
  
  // Mapeamento de palavras-chave para respostas mais abrangentes
  const respostas = {
    'golpe|segurança|scam|fraude|phishing|roubo|senha': `Na internet, sempre cuidado com sua segurança! Aqui estão dicas importantes:

1️⃣ Nunca compartilhe suas senhas com ninguém
2️⃣ Desconfie de emails e mensagens suspeitas pedindo dados pessoais
3️⃣ Não clique em links de pessoas desconhecidas
4️⃣ Ofertas muito boas para ser verdade geralmente são golpes
5️⃣ Sempre verifique o endereço do site antes de fazer login

Lembre-se: instituições legítimas nunca pedem senhas por email!`,

    'jogo|memoria|quebra|sequencia|cores|xadrez|sudoku|toque': `Os jogos do Mente Ativa são desenvolvidos para estimular o cérebro e melhorar suas capacidades cognitivas! 

Benefícios:
✅ Melhoram a memória e concentração
✅ Estimulam o raciocínio lógico
✅ Exercitam a agilidade mental
✅ Aumentam a autoconfiança

Você pode escolher entre diferentes níveis de dificuldade. Comece pelo fácil e vá aumentando conforme se sente mais confortável!`,

    'exercício|fisico|saude|corpo|movimento|atividade': `Os exercícios físicos são muito importantes para sua saúde!

Recomendações:
💪 Faça exercícios pelo menos 3 vezes por semana
⏱️ Comece com 15-20 minutos e aumente gradualmente
🧘 Combine exercícios aeróbicos com alongamento
🏥 Consulte seu médico antes de começar

Lembre-se: movimentar-se regularmente previne doenças e melhora a disposição!`,

    'calendário|data|compromisso|evento|horário|lembrete': `O calendário ajuda você a organizar melhor seu tempo!

Como usar:
📅 Adicione eventos e compromissos
🔔 Configure lembretes para não esquecer
⏰ Visualize seus compromissos por dia ou mês
📍 Receba notificações quando chegar a hora

Dica: Organize seus dias com antecedência para aproveitar melhor!`,

    'como|funciona|usar|modo|dúvida|ajuda|instruções': `Tenho prazer em ajudá-lo! 

Aqui estão algumas dicas:
📖 Leia os títulos e instruções na tela
🎯 Cada jogo tem um objetivo específico
⏸️ Pausar o jogo sempre que precisar
💡 Comece pelos exemplos mais simples
🎓 Aprenda no seu próprio ritmo

Não tenha pressa! O importante é aproveitar cada momento.`,

    'contato|suporte|problema|bug|erro': `Se encontrou algum problema, temos soluções!

Entre em contato:
📧 Envie um email para o suporte
💬 Deixe sua mensagem detalhando o problema
⏱️ Responderemos assim que possível

Nós estamos aqui para tornar sua experiência melhor!`,

    'accessibilidade|acessibilidade|fonte|tamanho|contraste|escuro': `A acessibilidade é importante para todos!

Opções disponíveis:
🌙 Modo escuro para conforto visual
🔤 Aumentar tamanho da fonte
🎨 Aumentar contraste
🔊 Suporte a leitura em voz alta
⌨️ Navegação por teclado

Ajuste as configurações conforme sua necessidade!`,

    'idoso|idade|melhor|mais facil': `Bem-vindo ao Mente Ativa! Este site foi especialmente pensado para você!

Temos:
✨ Interface clara e fácil de usar
🔊 Botões grandes para facilitar o clique
📢 Suporte a voz (ouve as perguntas e respostas)
🎮 Jogos divertidos que exercitam o cérebro
👨‍👩‍👧‍👦 Comunidade acolhedora

Aproveite para manter a mente ativa e se divertir!`,

    'grupo|comunidade|pessoas|amigos': `Conectar-se com outras pessoas é ótimo!

No Mente Ativa você pode:
👥 Participar de grupos de usuários
💬 Compartilhar experiências com outros
🎯 Fazer desafios em grupo
🏆 Competir amigavelmente

A interação social é importante para a saúde mental!`,

    'assistente|você|nome': `Olá! Eu sou o Mente Ativa! 🤖

Sou um assistente virtual criado especialmente para:
💡 Responder suas dúvidas
🎮 Guiá-lo nos jogos
📚 Fornecer informações úteis
😊 Ser seu companheiro no site

Estou sempre aqui para ajudá-lo!`,
  };

  // Procura por palavras-chave com melhor algoritmo
  let melhorResposta = null;
  let melhorPontuação = 0;

  for (const [palavras, resposta] of Object.entries(respostas)) {
    const palavrasArray = palavras.split('|');
    for (const palavra of palavrasArray) {
      if (perguntaLower.includes(palavra)) {
        // Prioriza correspondências mais específicas (palavras mais longas)
        if (palavra.length > melhorPontuação) {
          melhorResposta = resposta;
          melhorPontuação = palavra.length;
        }
      }
    }
  }

  if (melhorResposta) {
    return melhorResposta;
  }

  // Resposta padrão amigável e inclusiva
  return `Obrigado pela pergunta! 😊

Estou aqui para ajudá-lo com:
🎮 Dúvidas sobre os jogos
💪 Exercícios e saúde
🛡️ Segurança na internet
📅 Como usar o calendário
⚙️ Configurações de acessibilidade

Se tiver uma pergunta mais específica, tente reformular e tente novamente. Farei o meu melhor para ajudá-lo!`;
}

async function handleChat(req, res) {
  try {
    const { pergunta } = req.body;

    if (!pergunta || pergunta.trim() === '') {
      return res.status(400).json({ resposta: 'Digite uma pergunta.' });
    }

    console.log(`[${new Date().toLocaleTimeString('pt-BR')}] Pergunta recebida:`, pergunta.substring(0, 50) + '...');

    const resposta = await obterRespostaIA(pergunta);

    console.log(`[${new Date().toLocaleTimeString('pt-BR')}] ✓ Resposta enviada`);

    res.json({ resposta });

  } catch (error) {
    console.error(`[${new Date().toLocaleTimeString('pt-BR')}] Erro no servidor:`, error.message);
    res.status(500).json({ resposta: 'Desculpe, houve um erro. Por favor, tente novamente.' });
  } 
}

app.post('/api', handleChat);
app.post('/api/chat', handleChat);

app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando!' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em https://mente-ativa-1.onrender.com`);
  console.log(`📡 CORS habilitado`);
  console.log(`🤖 IA pronta para responder perguntas`);
});
