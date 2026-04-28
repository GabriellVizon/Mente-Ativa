import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

console.log('API Key carregada:', process.env.OPENROUTER_API_KEY ? 'Sim' : 'Não');

app.post('/api', async (req, res) => {
  try {
    const { pergunta } = req.body;

    if (!pergunta || pergunta.trim() === '') {
      return res.status(400).json({ resposta: 'Digite uma pergunta.' });
    }

    console.log('Pergunta recebida:', pergunta);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um assistente chamado Mente Ativa. Responda de forma simples, clara e amigável para idosos."
          },
          {
            role: "user",
            content: pergunta
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      console.error("Erro da API:", data);
      return res.status(500).json({ resposta: "Erro na IA." });
    }

    const resposta = data.choices[0].message.content;

    console.log('Resposta:', resposta);

    res.json({ resposta });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ resposta: 'Erro ao responder.' });
  } 
});

app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});