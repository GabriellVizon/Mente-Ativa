import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

console.log('API Key carregada:', process.env.GEMINI_API_KEY ? 'Sim' : 'Não');

app.post('/api', async (req, res) => {
  try {
    const { pergunta } = req.body;
    
    if (!pergunta || pergunta.trim() === '') {
      return res.status(400).json({ resposta: 'Por favor, digite uma pergunta.' });
    }

    console.log('Pergunta recebida:', pergunta);

    const prompt = `Você é um assistente virtual amigável chamado "Mente Ativa". Você ajuda idosos com perguntas sobre o site Mente Ativa, jogos cognitivos, exercícios físicos, segurança digital e bem-estar. Responda de forma muito simples, com frases curtas e claras. Use linguagem acessível para pessoas idosas. Sempre seja respeitoso e paciente. Pergunta: ${pergunta}`;

    const result = await model.generateContent(prompt);
    const resposta = result.response.text();

    console.log('Resposta:', resposta);
    res.json({ resposta });
  } catch (error) {
    console.error('Erro completo:', error);
    console.error('Erro na API:', error.message);
    res.status(500).json({ resposta: 'Desculpe, ocorreu um erro: ' + error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Servidor do Assistente Virtual Mente Ativa rodando!');
});

app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('API disponível em http://localhost:${PORT}/api');
});
