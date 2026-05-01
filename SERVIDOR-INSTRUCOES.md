# 🤖 Guia: Manter o Servidor da IA Sempre Funcionando

## ⚙️ Para Desenvolvimento Local

### 1️⃣ Inicie o servidor na pasta `TCC-Idosos`:
```bash
cd TCC-Idosos
npm start
```

### 2️⃣ O servidor rodará em:
```
http://localhost:3000
```

### 3️⃣ Teste se está funcionando:
```
http://localhost:3000/test
```

---

## 🚀 Para Produção (Qualquer Pessoa, Em Qualquer Lugar)

Para que a IA funcione **SEMPRE** para qualquer pessoa que entrar no site (sem depender do seu computador), você tem 3 opções:

### **OPÇÃO 1: Deploy na Nuvem (Recomendado)** ⭐

Escolha um dos serviços abaixo (GRATUITOS para começar):

#### 🔵 **Render** (Fácil - Recomendado)
1. Acesse: https://render.com
2. Conecte seu GitHub
3. Clique em "New +" → "Web Service"
4. Selecione seu repositório
5. Preencha:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Adicione `OPENROUTER_API_KEY` com sua chave
6. Clique em "Deploy"

#### 🌩️ **Heroku** (Histórico)
1. Acesse: https://www.heroku.com
2. Crie uma aplicação
3. Configure a variável de ambiente `OPENROUTER_API_KEY`
4. Faça push do código para o Heroku

#### ☁️ **Vercel** (Para APIs Node.js simples)
1. Acesse: https://vercel.com
2. Conecte seu GitHub
3. Configure `OPENROUTER_API_KEY` nas variáveis de ambiente

### **OPÇÃO 2: Usar um VPS** 💻
1. Alugue um servidor VPS (AWS, DigitalOcean, Linode, etc.)
2. SSH no servidor
3. Clone o repositório
4. Configure a chave de API
5. Use `pm2` ou `systemd` para manter o servidor sempre rodando:

```bash
npm install -g pm2
pm2 start server.js --name "mente-ativa"
pm2 save
pm2 startup
```

### **OPÇÃO 3: Sincronizar o URL da API**

Se não quiser usar a nuvem ainda, edite o `assistente.js` para apontar para seu IP real:

1. Descubra seu IP local: `ipconfig` (procure por `IPv4 Address`)
2. Edite em `js/assistente.js`:
```javascript
// Trocar de:
const response = await fetch('http://localhost:3000/api', {

// Para:
const response = await fetch('http://SEU_IP:3000/api', {
```

Mas isso **só funciona na mesma rede**. Para internet, use a **OPÇÃO 1**.

---

## 🔑 Verificar/Testar a Chave de API

Veja se sua chave `OPENROUTER_API_KEY` no arquivo `.env` é válida:

```bash
npm start
```

Procure por:
```
API Key carregada: Sim
✅ Servidor rodando em http://localhost:3000
```

---

## 🆘 Troubleshooting

### ❌ Porta 3000 já está em uso?
```bash
netstat -ano | findstr ":3000"
taskkill /PID <PID> /F
```

### ❌ "API Key not working"?
1. Gere uma nova chave em: https://openrouter.ai
2. Edite `.env` e atualize `OPENROUTER_API_KEY`
3. Reinicie o servidor: `npm start`

### ❌ Servidor não responde?
1. Certifique-se de estar na pasta `TCC-Idosos`
2. Execute: `npm install`
3. Execute: `npm start`

---

## 📊 Resumo

| Solução | Sempre Funciona? | Custo | Dificuldade |
|---------|------------------|-------|------------|
| Localhost | ❌ Só localmente | Grátis | ⭐ Fácil |
| Render (Nuvem) | ✅ SIM | Grátis | ⭐ Fácil |
| VPS | ✅ SIM | ~$5/mês | ⭐⭐ Médio |

**Para que qualquer pessoa no mundo acesse, escolha a OPÇÃO 1 (Render).**

