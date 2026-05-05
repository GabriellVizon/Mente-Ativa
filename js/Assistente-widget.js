(function () {
  'use strict';

  if (window.MenteAtivaAssistant && window.MenteAtivaAssistant._installed) return;
  


  

  // ----------- Configurações ------------
  const STORAGE_KEY = 'ma-assistant-history';
  const MAX_HISTORY = 80;
  const TYPING_MIN = 500;
  const TYPING_MAX = 1300;
  const API_URL = window.MENTE_ATIVA_API_URL || 'https://mente-ativa-1.onrender.com/api';


  // ============== BASE DE DADOS DO SITE ==============
  const PAGES = {
    'index':          { titulo: 'Página Inicial',  descricao: 'a porta de entrada do Mente Ativa, com um carinho de boas-vindas.', dicas: ['Toque em \"Começar\" para iniciar.', 'Você pode escolher entre os grupos Simples, Moderado ou Com Ajuda.'] },
    'intro':          { titulo: 'Introdução',      descricao: 'uma apresentação tranquila do site.', dicas: ['Leia com calma e siga para o menu de jogos.'] },
    'menu':           { titulo: 'Menu Principal',  descricao: 'o lugar onde você escolhe um jogo para treinar a mente.', dicas: ['Comece pelos jogos simples como Memória, Cores ou Toque.', 'Cada jogo treina uma habilidade diferente.'] },
    'exercicios':     { titulo: 'Exercícios',      descricao: 'uma área com diferentes exercícios para você praticar.', dicas: ['Faça um exercício por dia. Pequenos passos fazem grande diferença.'] },
    'calendario':     { titulo: 'Calendário',      descricao: 'onde você acompanha sua rotina e os dias em que treinou.', dicas: ['Tente manter uma sequência. A constância ajuda muito a memória.'] },
    'seguranca':      { titulo: 'Segurança',       descricao: 'dicas para usar a internet com tranquilidade e proteção.', dicas: ['Nunca compartilhe senhas com ninguém, nem por telefone.'] },
    'com-ajuda':      { titulo: 'Com Ajuda',       descricao: 'um modo carinhoso, pensado para quem está com um acompanhante.', dicas: ['Peça para a pessoa que está te ajudando ler junto com você.'] },
    'grupo-simples':  { titulo: 'Grupo Simples',   descricao: 'jogos mais fáceis, ótimos para começar.', dicas: ['Não tem pressa. Foque em se divertir.'] },
    'grupo-moderado': { titulo: 'Grupo Moderado',  descricao: 'jogos com um pouquinho mais de desafio.', dicas: ['Se achar difícil, volte ao grupo simples sem nenhum problema.'] },
    'assistente':     { titulo: 'Página do Assistente', descricao: 'o cantinho onde você pode tirar dúvidas comigo.', dicas: ['Pode me perguntar qualquer coisa do site!'] }
  };

  const JOGOS = {
    'jogo-memoria':            { nome: 'Jogo da Memória',            como: 'Vire as cartas e encontre os pares iguais.', habilidade: 'memória visual e concentração' },
    'jogo-cores':              { nome: 'Jogo das Cores',             como: 'Identifique e combine as cores corretas.',   habilidade: 'percepção visual e atenção' },
    'jogo-associacao':         { nome: 'Jogo de Associação',         como: 'Ligue itens que combinam entre si.',         habilidade: 'raciocínio lógico' },
    'jogo-escolha':            { nome: 'Jogo da Escolha',            como: 'Selecione a opção correta entre as alternativas.', habilidade: 'tomada de decisão' },
    'jogo-frases':             { nome: 'Jogo das Frases',            como: 'Complete e organize frases.',                habilidade: 'linguagem' },
    'jogo-multitarefas':       { nome: 'Jogo das Multitarefas',      como: 'Execute mais de uma tarefa ao mesmo tempo.', habilidade: 'atenção dividida' },
    'jogo-musica':             { nome: 'Jogo da Música',             como: 'Relaxe e treine com sons e melodias.',       habilidade: 'memória auditiva' },
    'jogo-objeto-funcao':      { nome: 'Objeto e Função',            como: 'Ligue cada objeto à sua utilidade.',         habilidade: 'associação' },
    'jogo-palavras-cruzadas':  { nome: 'Palavras Cruzadas',          como: 'Preencha as palavras com calma.',            habilidade: 'vocabulário' },
    'jogo-quebra-cabeca':      { nome: 'Quebra-cabeça',              como: 'Monte a imagem peça por peça.',              habilidade: 'percepção espacial' },
    'jogo-reconhecimento':     { nome: 'Reconhecimento',             como: 'Identifique imagens e formas.',              habilidade: 'reconhecimento visual' },
    'jogo-repeticao':          { nome: 'Repetição',                  como: 'Repita a sequência mostrada na tela.',       habilidade: 'memória de curto prazo' },
    'jogo-sequencia':          { nome: 'Sequência',                  como: 'Siga a ordem certa das peças.',              habilidade: 'lógica e memória' },
    'jogo-sequencia-simples':  { nome: 'Sequência Simples',          como: 'Versão mais leve do jogo de sequência.',     habilidade: 'lógica' },
    'jogo-sudoku':             { nome: 'Sudoku',                     como: 'Preencha o tabuleiro sem repetir números.',  habilidade: 'raciocínio lógico' },
    'jogo-toque':              { nome: 'Toque',                      como: 'Toque nos elementos que aparecem na tela.',  habilidade: 'reflexo e atenção' },
    'jogo-treino-cerebral':    { nome: 'Treino Cerebral',            como: 'Exercícios variados para o cérebro.',        habilidade: 'várias funções cognitivas' },
    'jogo-xadrez':             { nome: 'Xadrez',                     como: 'Clássico jogo de estratégia.',               habilidade: 'estratégia e planejamento' }
  };

  // ============== BASES DE CONHECIMENTO GERAIS ==============
  const CAPITAIS_BR = {
    'acre': 'Rio Branco', 'alagoas': 'Maceió', 'amapa': 'Macapá',
    'amazonas': 'Manaus', 'bahia': 'Salvador', 'ceara': 'Fortaleza',
    'distrito federal': 'Brasília', 'espirito santo': 'Vitória',
    'goias': 'Goiânia', 'maranhao': 'São Luís', 'mato grosso': 'Cuiabá',
    'mato grosso do sul': 'Campo Grande', 'minas gerais': 'Belo Horizonte',
    'para': 'Belém', 'paraiba': 'João Pessoa', 'parana': 'Curitiba',
    'pernambuco': 'Recife', 'piaui': 'Teresina',
    'rio de janeiro': 'Rio de Janeiro', 'rio grande do norte': 'Natal',
    'rio grande do sul': 'Porto Alegre', 'rondonia': 'Porto Velho',
    'roraima': 'Boa Vista', 'santa catarina': 'Florianópolis',
    'sao paulo': 'São Paulo', 'sergipe': 'Aracaju', 'tocantins': 'Palmas'
  };

  const PAISES = {
    'brasil':         { capital: 'Brasília',         continente: 'América do Sul' },
    'argentina':      { capital: 'Buenos Aires',     continente: 'América do Sul' },
    'chile':          { capital: 'Santiago',         continente: 'América do Sul' },
    'uruguai':        { capital: 'Montevidéu',       continente: 'América do Sul' },
    'paraguai':       { capital: 'Assunção',         continente: 'América do Sul' },
    'peru':           { capital: 'Lima',             continente: 'América do Sul' },
    'colombia':       { capital: 'Bogotá',           continente: 'América do Sul' },
    'venezuela':      { capital: 'Caracas',          continente: 'América do Sul' },
    'bolivia':        { capital: 'La Paz / Sucre',   continente: 'América do Sul' },
    'equador':        { capital: 'Quito',            continente: 'América do Sul' },
    'estados unidos': { capital: 'Washington',       continente: 'América do Norte' },
    'eua':            { capital: 'Washington',       continente: 'América do Norte' },
    'canada':         { capital: 'Ottawa',           continente: 'América do Norte' },
    'mexico':         { capital: 'Cidade do México', continente: 'América do Norte' },
    'cuba':           { capital: 'Havana',           continente: 'América Central' },
    'portugal':       { capital: 'Lisboa',           continente: 'Europa' },
    'espanha':        { capital: 'Madri',            continente: 'Europa' },
    'franca':         { capital: 'Paris',            continente: 'Europa' },
    'italia':         { capital: 'Roma',             continente: 'Europa' },
    'alemanha':       { capital: 'Berlim',           continente: 'Europa' },
    'inglaterra':     { capital: 'Londres',          continente: 'Europa' },
    'reino unido':    { capital: 'Londres',          continente: 'Europa' },
    'russia':         { capital: 'Moscou',           continente: 'Europa/Ásia' },
    'grecia':         { capital: 'Atenas',           continente: 'Europa' },
    'holanda':        { capital: 'Amsterdã',         continente: 'Europa' },
    'paises baixos':  { capital: 'Amsterdã',         continente: 'Europa' },
    'japao':          { capital: 'Tóquio',           continente: 'Ásia' },
    'china':          { capital: 'Pequim',           continente: 'Ásia' },
    'india':          { capital: 'Nova Délhi',       continente: 'Ásia' },
    'coreia do sul':  { capital: 'Seul',             continente: 'Ásia' },
    'australia':      { capital: 'Canberra',         continente: 'Oceania' },
    'egito':          { capital: 'Cairo',            continente: 'África' },
    'africa do sul':  { capital: 'Pretória',         continente: 'África' },
    'nigeria':        { capital: 'Abuja',            continente: 'África' }
  };

  const FATOS_HISTORICOS = [
    { keys: ['descobrimento brasil', 'descoberta brasil', 'pedro alvares cabral', 'cabral chegou'], texto: 'O Brasil foi descoberto por <strong>Pedro Álvares Cabral</strong> em <strong>22 de abril de 1500</strong>. 🚢' },
    { keys: ['independencia brasil', 'independencia do brasil', 'grito ipiranga'], texto: 'A Independência do Brasil foi proclamada por <strong>Dom Pedro I</strong> em <strong>7 de setembro de 1822</strong>, às margens do Rio Ipiranga. 🇧🇷' },
    { keys: ['proclamacao republica', 'proclamacao da republica'], texto: 'A Proclamação da República no Brasil aconteceu em <strong>15 de novembro de 1889</strong>, liderada pelo <strong>Marechal Deodoro da Fonseca</strong>.' },
    { keys: ['abolicao escravatura', 'abolicao da escravatura', 'lei aurea', 'princesa isabel'], texto: 'A escravidão foi abolida no Brasil pela <strong>Lei Áurea</strong>, assinada pela <strong>Princesa Isabel</strong> em <strong>13 de maio de 1888</strong>.' },
    { keys: ['segunda guerra mundial', 'segunda guerra'], texto: 'A Segunda Guerra Mundial ocorreu entre <strong>1939 e 1945</strong>, envolvendo a maior parte do mundo.' },
    { keys: ['primeira guerra mundial', 'primeira guerra'], texto: 'A Primeira Guerra Mundial aconteceu entre <strong>1914 e 1918</strong>.' },
    { keys: ['queda muro berlim', 'muro de berlim', 'muro berlim'], texto: 'O Muro de Berlim caiu em <strong>9 de novembro de 1989</strong>, marcando o fim simbólico da Guerra Fria.' },
    { keys: ['homem na lua', 'chegada lua', 'apolo 11', 'neil armstrong'], texto: 'Em <strong>20 de julho de 1969</strong>, <strong>Neil Armstrong</strong> foi o primeiro homem a pisar na Lua, na missão Apollo 11. 🌕' },
    { keys: ['copa mundo brasil', 'brasil copas'], texto: 'O Brasil é <strong>pentacampeão</strong> da Copa do Mundo: <strong>1958, 1962, 1970, 1994 e 2002</strong>. 🏆⚽' },
    { keys: ['descobrimento america', 'colombo'], texto: 'A América foi \"descoberta\" por <strong>Cristóvão Colombo</strong> em <strong>12 de outubro de 1492</strong>.' },
    { keys: ['constituicao brasil', 'constituicao 1988'], texto: 'A atual Constituição do Brasil é a <strong>Constituição Cidadã de 1988</strong>, promulgada em 5 de outubro de 1988.' }
  ];

  const SINONIMOS = {
    'feliz':       ['contente', 'alegre', 'satisfeito', 'radiante'],
    'triste':      ['melancólico', 'abatido', 'desanimado'],
    'bonito':      ['belo', 'lindo', 'formoso', 'encantador'],
    'feio':        ['horroroso', 'desagradável'],
    'rapido':      ['veloz', 'ágil', 'ligeiro'],
    'lento':       ['devagar', 'vagaroso'],
    'grande':      ['enorme', 'gigante', 'amplo'],
    'pequeno':     ['minúsculo', 'reduzido', 'diminuto'],
    'inteligente': ['esperto', 'sagaz', 'astuto'],
    'amigo':       ['camarada', 'companheiro', 'parceiro'],
    'casa':        ['lar', 'residência', 'moradia'],
    'bom':         ['ótimo', 'excelente', 'maravilhoso'],
    'ruim':        ['péssimo', 'terrível', 'horrível'],
    'velho':       ['antigo', 'idoso', 'ancião'],
    'novo':        ['recente', 'moderno']
  };

  const CURIOSIDADES = [
    'Você sabia? Ler 20 minutos por dia já melhora a memória em poucas semanas. 📚',
    'O cérebro humano consome cerca de <strong>20%</strong> de toda a energia que usamos por dia. 🧠',
    'A música pode ativar áreas do cérebro ligadas à memória e à emoção. 🎵',
    'Rir libera endorfinas, que são hormônios do bem-estar. 😄',
    'O cérebro continua aprendendo a vida toda — não importa a idade!',
    'Você tem cerca de <strong>86 bilhões</strong> de neurônios no cérebro. 🤯',
    'O coração humano bate, em média, <strong>100 mil vezes</strong> por dia. ❤️',
    'A água representa cerca de <strong>60%</strong> do peso do corpo humano. 💧',
    'Dormir bem ajuda a fixar o que aprendemos durante o dia. 😴',
    'O nervo mais longo do corpo é o nervo ciático.'
  ];

  const DICAS_SAUDE = [
    '💧 Beber bastante água ao longo do dia ajuda muito a memória e a disposição.',
    '🚶 Caminhadas leves de 20 minutos por dia fazem bem para o corpo e a mente.',
    '😴 Dormir 7 a 8 horas é um dos melhores remédios para a memória.',
    '💚 Manter contato com amigos e familiares mantém o cérebro ativo.',
    '🐟🥗 Comer frutas, verduras e peixes (como sardinha) fortalece o cérebro.',
    '🎵 Ouvir músicas que você ama traz lembranças e bem-estar.',
    '☀️ Tomar um pouquinho de sol pela manhã ajuda na produção de vitamina D.',
    '🧘 Respirar fundo por 1 minuto, devagarinho, acalma o coração.'
  ];

  const FRASES_MOTIVACIONAIS = [
    '\"Cada pequeno passo conta. Você é mais forte do que imagina.\" 💪',
    '\"Aprender não tem idade. Continue, com calma.\" 🌱',
    '\"O tempo que você dedica a si mesmo nunca é perdido.\" 💚',
    '\"Hoje é um bom dia para tentar algo novo.\" ☀️',
    '\"Errar faz parte. O importante é continuar tentando.\" 🌟',
    '\"Sua experiência de vida é um tesouro.\" 💎'
  ];

  const PIADAS = [
    'O que o pato disse para a pata? Vem quá! 🦆',
    'Por que o livro de matemática estava triste? Porque tinha muitos problemas! 📚',
    'O que a impressora falou para a outra? Esse papel é seu ou é impressão minha? 🖨️',
    'Qual o contrário de volátil? Vem cá, sobrinho! 😄'
  ];

  const DEFAULT_SUGGESTIONS = [
    'Como começar?',
    'Quais jogos existem?',
    'Conte uma curiosidade',
    'Onde está o menu?'
  ];

  // ============== UTILITÁRIOS ==============
  function getCurrentPageKey() {
    let path = (window.location.pathname || '').split('/').pop() || 'index.html';
    path = path.replace(/\.html?$/i, '').toLowerCase();
    if (!path) path = 'index';
    return path;
  }
  const isJogo = (k) => Object.prototype.hasOwnProperty.call(JOGOS, k);

  function nowTime() {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function formatPlainText(s) {
    return escapeHTML(s).replace(/\n/g, '<br>');
  }

  function normalize(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

  // ----- Distância de Levenshtein (para tolerar erros ortográficos) -----
  function levenshtein(a, b) {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    let prev = new Array(n + 1), curr = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      curr[0] = i;
      for (let j = 1; j <= n; j++) {
        const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
        curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      }
      [prev, curr] = [curr, prev];
    }
    return prev[n];
  }

  // Tolera ~25% de diferença para palavras com 4+ letras
  function fuzzyContains(haystackNorm, needleNorm) {
    if (!needleNorm) return false;
    if (haystackNorm.indexOf(needleNorm) !== -1) return true;
    const needleWords = needleNorm.split(' ');
    const hayWords = haystackNorm.split(' ');
    if (needleWords.length === 1) {
      const len = needleNorm.length;
      if (len < 4) return false;
      const tol = Math.max(1, Math.floor(len * 0.25));
      return hayWords.some(w => Math.abs(w.length - len) <= tol + 1 && levenshtein(w, needleNorm) <= tol);
    }
    // janela do tamanho do needle
    const N = needleWords.length;
    for (let i = 0; i <= hayWords.length - N; i++) {
      const window = hayWords.slice(i, i + N).join(' ');
      const tol = Math.max(2, Math.floor(needleNorm.length * 0.2));
      if (levenshtein(window, needleNorm) <= tol) return true;
    }
    return false;
  }

  // ----- localStorage -----
  function loadHistory() {
    try {
      const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function saveHistory(h) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(h.slice(-MAX_HISTORY))); } catch (e) {}
  }

  // ============== CALCULADORA INTERNA (sem eval) ==============
  function tryMath(text) {
    let s = ' ' + normalize(text) + ' ';
    // Raízes especiais
    const mRaiz = s.match(/raiz\s+(?:quadrada\s+)?(?:de\s+)?(\d+(?:\.\d+)?)/);
    if (mRaiz) {
      const n = parseFloat(mRaiz[1]);
      if (n < 0) return 'A raiz quadrada de número negativo não é um número real. 🤓';
      const r = Math.sqrt(n);
      return 'A raiz quadrada de <strong>' + n + '</strong> é <strong>' + (Math.round(r * 1e6) / 1e6) + '</strong>. 🧮';
    }
    // Potência: \"X elevado a Y\", \"X ao quadrado\", \"X ao cubo\"
    const mQuad = s.match(/(\d+(?:\.\d+)?)\s+ao\s+quadrado/);
    if (mQuad) { const n = parseFloat(mQuad[1]); return n + '² = <strong>' + (n * n) + '</strong>. 🧮'; }
    const mCubo = s.match(/(\d+(?:\.\d+)?)\s+ao\s+cubo/);
    if (mCubo) { const n = parseFloat(mCubo[1]); return n + '³ = <strong>' + (n * n * n) + '</strong>. 🧮'; }
    const mPot = s.match(/(\d+(?:\.\d+)?)\s+(?:elevado\s+a|elevado|a\s+potencia\s+de)\s+(\d+(?:\.\d+)?)/);
    if (mPot) {
      const a = parseFloat(mPot[1]), b = parseFloat(mPot[2]);
      return a + '^' + b + ' = <strong>' + Math.pow(a, b) + '</strong>. 🧮';
    }

    // Substitui palavras-chave por símbolos
    let expr = s
      .replace(/\bquanto\s+(?:e|eh|sao|da)\b/g, '')
      .replace(/\bcalcule|calcular|conta\b/g, '')
      .replace(/\bmais\b/g, '+')
      .replace(/\bmenos\b/g, '-')
      .replace(/\bvezes\b|\bvez\b|\bmultiplicado\s+por\b/g, '*')
      .replace(/\bdividido\s+por\b|\bdividido\b|\bsobre\b/g, '/')
      .replace(/\b(\d)\s*x\s*(\d)/g, '$1*$2')
      .replace(/,/g, '.')
      .replace(/[^\d+\-*/().\s]/g, '')
      .replace(/\s+/g, '')
      .trim();

    if (!expr || !/[\d]/.test(expr)) return null;
    if (!/[+\-*/]/.test(expr) && !/\(.*\)/.test(expr)) return null;
    if (!/^[\d+\-*/().]+$/.test(expr)) return null;

    // Parser recursivo descendente
    let pos = 0;
    function peek() { return expr[pos]; }
    function eat() { return expr[pos++]; }
    function parseNum() {
      let start = pos;
      while (pos < expr.length && /[\d.]/.test(expr[pos])) pos++;
      if (start === pos) throw new Error('num');
      return parseFloat(expr.slice(start, pos));
    }
    function parseFactor() {
      if (peek() === '(') { eat(); const v = parseExpr(); if (eat() !== ')') throw new Error(')'); return v; }
      if (peek() === '-') { eat(); return -parseFactor(); }
      if (peek() === '+') { eat(); return parseFactor(); }
      return parseNum();
    }
    function parseTerm() {
      let v = parseFactor();
      while (peek() === '*' || peek() === '/') {
        const op = eat();
        const r = parseFactor();
        v = op === '*' ? v * r : v / r;
      }
      return v;
    }
    function parseExpr() {
      let v = parseTerm();
      while (peek() === '+' || peek() === '-') {
        const op = eat();
        const r = parseTerm();
        v = op === '+' ? v + r : v - r;
      }
      return v;
    }
    try {
      const result = parseExpr();
      if (pos < expr.length) return null;
      if (!isFinite(result)) return 'Hmm... não consegui calcular isso. Talvez uma divisão por zero? 🤔';
      const rounded = Math.round(result * 1e6) / 1e6;
      return 'O resultado é <strong>' + rounded + '</strong>. 🧮';
    } catch (e) {
      return null;
    }
  }

  // ============== HANDLERS ESPECIAIS ==============

  // Capital de X (estado ou país)
  function tryGeografia(text) {
    const norm = normalize(text);

    // \"qual a capital de X\" / \"capital de X\"
    const m = norm.match(/capital\s+(?:de|do|da|dos|das)?\s*(.+?)(?:\s+e|\s+fica|$)/);
    if (m) {
      const alvo = m[1].trim();
      // Brasil: estados
      for (const est in CAPITAIS_BR) {
        if (fuzzyContains(alvo, est) || fuzzyContains(est, alvo)) {
          return 'A capital de <strong>' + capitalize(est) + '</strong> é <strong>' + CAPITAIS_BR[est] + '</strong>. 🏙️';
        }
      }
      // Países
      for (const pais in PAISES) {
        if (fuzzyContains(alvo, pais) || fuzzyContains(pais, alvo)) {
          const p = PAISES[pais];
          return 'A capital ' + (pais === 'eua' ? 'dos' : 'da') + ' <strong>' + capitalize(pais) + '</strong> é <strong>' + p.capital + '</strong> (' + p.continente + '). 🌍';
        }
      }
    }

    // \"X fica em qual continente\"
    const mC = norm.match(/(?:onde\s+fica|qual\s+continente|que\s+continente).*?\b([a-z\s]+?)\s*$/);
    if (mC) {
      const alvo = mC[1].trim();
      for (const pais in PAISES) {
        if (fuzzyContains(alvo, pais) || fuzzyContains(pais, alvo)) {
          return capitalize(pais) + ' fica na <strong>' + PAISES[pais].continente + '</strong>. 🌎';
        }
      }
    }

    // Pergunta direta sobre país (ex: \"fale sobre o brasil\")
    const mP = norm.match(/(?:sobre|fale\s+(?:de|sobre)|conte\s+sobre|o\s+que\s+e)\s+(?:o|a|os|as)?\s*(.+)$/);
    if (mP) {
      const alvo = mP[1].trim();
      for (const pais in PAISES) {
        if (alvo === pais || (pais.length > 4 && fuzzyContains(alvo, pais))) {
          const p = PAISES[pais];
          return '<strong>' + capitalize(pais) + '</strong> é um país da <strong>' + p.continente + '</strong>. Sua capital é <strong>' + p.capital + '</strong>. 🌍';
        }
      }
    }

    return null;
  }

  function capitalize(s) {
    return s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  // Fatos históricos
  function tryHistoria(text) {
    const norm = normalize(text);
    for (const fato of FATOS_HISTORICOS) {
      for (const k of fato.keys) {
        if (fuzzyContains(norm, normalize(k))) return fato.texto;
      }
    }
    // \"em que ano foi X\"
    if (/\b(em que ano|que ano|quando foi|qual ano)\b/.test(norm)) {
      for (const fato of FATOS_HISTORICOS) {
        for (const k of fato.keys) {
          const w = normalize(k).split(' ');
          if (w.some(x => x.length > 4 && fuzzyContains(norm, x))) return fato.texto;
        }
      }
    }
    return null;
  }

  // Português: sinônimos, plural simples
  function tryPortugues(text) {
    const norm = normalize(text);

    // \"sinonimo de X\"
    const mSin = norm.match(/(?:sinonimo|outra palavra|parecida com|similar a)\s+(?:de|para|com)?\s*(.+)$/);
    if (mSin) {
      const palavra = mSin[1].trim().split(' ')[0];
      for (const k in SINONIMOS) {
        if (fuzzyContains(palavra, k) || fuzzyContains(k, palavra)) {
          return 'Sinônimos de <strong>' + k + '</strong>: ' + SINONIMOS[k].join(', ') + '. ✨';
        }
      }
      return 'Hmm, não tenho sinônimos para \"' + palavra + '\" no momento. Tente outra palavra! 📖';
    }

    // \"plural de X\"
    const mPl = norm.match(/plural\s+de\s+(\w+)/);
    if (mPl) {
      const palavra = mPl[1];
      const plural = pluralizar(palavra);
      return 'O plural de <strong>' + palavra + '</strong> costuma ser <strong>' + plural + '</strong>. 📝';
    }

    return null;
  }

  function pluralizar(palavra) {
    const p = palavra.toLowerCase();
    if (p.endsWith('ao'))      return p.slice(0, -2) + 'oes';     // mão -> mãos (aproximação)
    if (p.endsWith('ão'))      return p.slice(0, -2) + 'ões';
    if (p.endsWith('m'))       return p.slice(0, -1) + 'ns';
    if (p.endsWith('al') || p.endsWith('el') || p.endsWith('ol') || p.endsWith('ul')) return p.slice(0, -1) + 'is';
    if (p.endsWith('il'))      return p.slice(0, -1) + 'is';
    if (p.endsWith('r') || p.endsWith('z') || p.endsWith('s')) return p + 'es';
    return p + 's';
  }

  // Data/hora
  function tryDataHora(text) {
    const norm = normalize(text);
    if (/\b(que horas|hora atual|hora agora|me diz a hora|que horas sao)\b/.test(norm)) {
      return 'Agora são <strong>' + nowTime() + '</strong>. ⏰';
    }
    if (/\b(que dia|dia hoje|data hoje|hoje e dia|hoje qual e o dia)\b/.test(norm)) {
      return 'Hoje é <strong>' + dataPorExtenso() + '</strong>. 📅';
    }
    if (/\b(dia da semana|que dia da semana)\b/.test(norm)) {
      const dias = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
      return 'Hoje é <strong>' + dias[new Date().getDay()] + '</strong>. 🗓️';
    }
    if (/\b(que mes|mes atual|mes agora)\b/.test(norm)) {
      const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
      return 'Estamos no mês de <strong>' + meses[new Date().getMonth()] + '</strong>. 🌸';
    }
    if (/\b(que ano|ano atual|ano agora)\b/.test(norm)) {
      return 'Estamos no ano de <strong>' + new Date().getFullYear() + '</strong>. 📆';
    }
    return null;
  }

  function dataPorExtenso() {
    const d = new Date();
    const dias = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return dias[d.getDay()] + ', ' + d.getDate() + ' de ' + meses[d.getMonth()] + ' de ' + d.getFullYear();
  }

  // ============== REGRAS PRINCIPAIS ==============
  // Cada regra: keywords (lista de grupos; cada grupo é uma lista de palavras que TODAS devem aparecer com fuzzy match)
  const RULES = [
    // === Saudações ===
    {
      keywords: [['oi'], ['ola'], ['eai'], ['e ai'], ['bom dia'], ['boa tarde'], ['boa noite'], ['hey'], ['salve']],
      responses: [
        'Olá, que bom ter você por aqui! 💙 Como posso te ajudar hoje?',
        'Oi! Fico feliz com a sua visita. Em que posso te ajudar?',
        'Olá, seja muito bem-vindo(a) ao Mente Ativa! 🌿'
      ]
    },
    { keywords: [['tchau'], ['ate logo'], ['ate mais'], ['adeus'], ['ate breve'], ['ate amanha']],
      responses: ['Até logo! Foi um prazer conversar com você. Volte sempre! 💙', 'Tchau, tchau! Cuide-se com carinho.'] },
    { keywords: [['obrigado'], ['obrigada'], ['valeu'], ['agradeco'], ['grato'], ['muito obrigado']],
      responses: ['De nada! Fico feliz em ajudar. 🌿', 'Imagina! Estou sempre aqui pra você.', 'Por nada! Qualquer coisa, é só me chamar.'] },
    { keywords: [['como vai'], ['tudo bem'], ['como esta'], ['como voce esta']],
      responses: ['Estou ótimo, obrigado por perguntar! 💚 E você, como está se sentindo hoje?'] },

    // === Sobre o site ===
    { keywords: [['o que', 'site'], ['o que', 'mente ativa'], ['para que', 'site'], ['serve', 'site'], ['sobre', 'mente ativa'], ['o que e isso']],
      responses: ['O <strong>Mente Ativa</strong> é uma plataforma feita com muito carinho, com jogos que ajudam a treinar a memória, a atenção e o raciocínio. Tudo de um jeito simples e tranquilo. 💚'] },

    // === Como começar ===
    { keywords: [['como', 'comecar'], ['como', 'comeco'], ['por onde', 'comecar'], ['nao sei', 'comecar'], ['nao sei', 'fazer'], ['perdido'], ['perdida'], ['primeira vez'], ['ajuda inicial']],
      responses: [
        'Claro! Vou te guiar com calma:\n\n1️⃣ Vá até o <strong>Menu</strong> e escolha um grupo: Simples, Moderado ou Com Ajuda.\n2️⃣ Toque em qualquer jogo que chamar sua atenção.\n3️⃣ Leia as instruções na tela e divirta-se. Não há pressa nem cobrança!\n\nQuer que eu te leve para o menu agora?'
      ]
    },

    // === Navegação ===
    { keywords: [['ir', 'menu'], ['levar', 'menu'], ['quero', 'menu'], ['abrir', 'menu'], ['leva', 'menu'], ['vai pro menu']],
      action: 'goto', target: 'menu.html' },
    { keywords: [['voltar', 'inicio'], ['ir', 'inicio'], ['pagina inicial'], ['home'], ['tela inicial']],
      action: 'goto', target: 'index.html' },
    { keywords: [['voltar'], ['pagina anterior']], action: 'back' },
    { keywords: [['calendario'], ['agenda'], ['dias treinei']],
      action: 'goto', target: 'calendario.html', preMessage: 'Vou te levar até o calendário. 📅' },
    { keywords: [['seguranca'], ['proteger', 'internet'], ['golpe'], ['evitar golpe']],
      action: 'goto', target: 'seguranca.html', preMessage: 'A página de Segurança traz dicas importantes! 🔒' },
    { keywords: [['exercicios'], ['quero exercicios']],
      action: 'goto', target: 'exercicios.html', preMessage: 'Te levando para os Exercícios. 💪' },

    // === Lista de jogos ===
    { keywords: [['quais', 'jogos'], ['lista', 'jogos'], ['mostrar', 'jogos'], ['todos', 'jogos'], ['tem', 'jogos'], ['jogos disponiveis']],
      handler: () => {
        const lista = Object.values(JOGOS).slice(0, 10).map(j => '• ' + j.nome).join('<br>');
        return 'Temos <strong>18 jogos</strong>! Alguns deles:<br><br>' + lista + '<br><br>...e muitos outros! Vá ao <strong>menu</strong> para ver todos. 🌿';
      }
    },

    // === Características técnicas do site ===
    { keywords: [['modo escuro'], ['tema escuro'], ['dark mode'], ['fundo preto'], ['tela escura']],
      responses: ['O modo escuro deixa a tela mais suave para os olhos. No site, geralmente há um botão de sol/lua no topo da página. ✨ Toque nele para alternar.'] },
    { keywords: [['letra', 'pequena'], ['fonte', 'pequena'], ['aumentar', 'letra'], ['nao consigo ler'], ['letras pequenas'], ['texto pequeno']],
      responses: ['Sem problemas! Pressione <strong>Ctrl</strong> e <strong>+</strong> (mais) para aumentar a letra. Para diminuir, use <strong>Ctrl</strong> e <strong>-</strong>. 💚'] },

    // === Dicas / orientações ===
    { keywords: [['treinar', 'memoria'], ['melhorar', 'memoria'], ['exercicio', 'memoria'], ['esquecendo'], ['ando esquecido'], ['esqueço muito']],
      responses: ['Que maravilha cuidar da memória! 💙 Recomendo o <strong>Jogo da Memória</strong>, depois <strong>Repetição</strong> e <strong>Sequência</strong>. Praticar um pouquinho todo dia faz muita diferença!'] },
    { keywords: [['esta dificil'], ['muito dificil'], ['nao consigo'], ['dificil demais'], ['complicado']],
      responses: ['Calma, está tudo bem. 💙 Tente o <strong>Grupo Simples</strong> ou jogos com a palavra \"simples\". O importante é se sentir confortável.'] },
    { keywords: [['esta facil'], ['muito facil'], ['quero desafio'], ['mais dificil']],
      responses: ['Que bom que está confiante! 🌟 Experimente o <strong>Grupo Moderado</strong>, ou jogos como <strong>Sudoku</strong>, <strong>Xadrez</strong> e <strong>Multitarefas</strong>.'] },

    // === Sentimentos / cotidiano ===
    { keywords: [['cansado'], ['cansada'], ['exausto'], ['nao quero mais']],
      responses: ['Entendo. Não tem pressa nenhuma. 💙 Pode descansar e voltar quando quiser. Que tal o <strong>Jogo da Música</strong> para relaxar?'] },
    { keywords: [['triste'], ['deprimido'], ['solitario'], ['sozinho']],
      responses: ['Sinto muito que você esteja assim. 🤗 Conversar com alguém querido, dar uma caminhada ou ouvir uma música boa pode ajudar. E sabe, eu estou aqui pra você. 💙'] },
    { keywords: [['feliz'], ['otimo dia'], ['estou bem'], ['estou alegre']],
      responses: ['Que ótimo saber disso! 🌟 Que tal aproveitar e treinar um pouquinho? Sua mente vai agradecer.'] },

    // === Identidade ===
    { keywords: [['quem', 'voce'], ['seu nome'], ['como se chama'], ['quem fala'], ['voce e quem']],
      responses: ['Eu sou o <strong>Assistente Mente Ativa</strong> 💚, seu companheiro virtual aqui no site. Posso tirar dúvidas, sugerir jogos, contar curiosidades, fazer contas e até bater um papo!'] },
    { keywords: [['o que', 'sabe', 'fazer'], ['o que', 'voce', 'faz'], ['suas funcoes'], ['no que', 'pode', 'ajudar']],
      responses: ['Eu posso:<br>🎮 Te guiar pelos jogos do site<br>🧮 Fazer contas (ex: <em>\"quanto é 12 x 7\"</em>)<br>🌍 Falar sobre capitais, países e continentes<br>📚 Contar fatos históricos<br>📖 Dar sinônimos<br>💚 Bater um papo e dar dicas de saúde<br><br>Pode mandar a sua dúvida!'] },

    // === Curiosidades / piadas ===
    { keywords: [['curiosidade'], ['fato interessante'], ['me conte algo'], ['conte algo'], ['voce sabia'], ['me surpreenda']],
      handler: () => pick(CURIOSIDADES) },
    { keywords: [['piada'], ['conte uma piada'], ['me faca rir'], ['quero rir']],
      handler: () => pick(PIADAS) },
    { keywords: [['frase motivacional'], ['frase do dia'], ['me motive'], ['preciso de motivacao']],
      handler: () => pick(FRASES_MOTIVACIONAIS) },
    { keywords: [['dica de saude'], ['dica saude'], ['como cuidar'], ['conselho saude']],
      handler: () => pick(DICAS_SAUDE) },

    // === Comandos ===
    { keywords: [['limpar', 'historico'], ['apagar', 'conversa'], ['limpar', 'chat'], ['esquecer', 'conversa'], ['comecar de novo'], ['reiniciar conversa']],
      action: 'clear' },

    // === Elogios ===
    { keywords: [['legal'], ['gostei'], ['bonito'], ['adorei'], ['otimo'], ['maravilha'], ['perfeito'], ['voce e bom']],
      responses: ['Aaah, que bom que você gostou! 💚', 'Fico encantado em ouvir isso! 🌟', 'Obrigado, você é muito gentil! 🤗'] },

    // === Problemas técnicos ===
    { keywords: [['nao abre'], ['travou'], ['nao funciona'], ['esta lento'], ['tem bug'], ['erro']],
      responses: ['Que pena! Tente atualizar a página tocando em <strong>F5</strong> ou na seta circular. Se continuar, peça ajuda a alguém de confiança. 🤝'] },

    // === Idoso / família ===
    { keywords: [['idoso'], ['idosa'], ['vovo'], ['vovó'], ['minha mae'], ['meu pai'], ['minha avo'], ['terceira idade']],
      responses: ['Que carinho! 💙 O Mente Ativa foi pensado especialmente para acolher pessoas mais velhas. Tudo é simples, sem pressa e sem cobrança. Comece pelo <strong>Grupo Simples</strong> ou pelo modo <strong>Com Ajuda</strong>.'] },

    // === Clima / tempo ===
    { keywords: [['esta chovendo'], ['vai chover'], ['tempo hoje'], ['previsao tempo']],
      responses: ['Não consigo ver o tempo daqui 🌦️, mas você pode olhar pela janela ou perguntar ao Google. Se estiver chuvoso, é o dia perfeito pra um joguinho aqui dentro! ☔💚'] },

    // === Ajuda genérica ===
    { keywords: [['ajuda'], ['preciso de ajuda'], ['me ajude'], ['help'], ['socorro']],
      responses: ['Estou aqui! 💚 Você pode me perguntar sobre:<br>• Como usar o site<br>• Quais jogos existem<br>• Capitais, países, história<br>• Contas de matemática<br>• Curiosidades e dicas<br><br>O que você gostaria de saber?'] },

    // === Comer / alimentação ===
    { keywords: [['o que comer'], ['alimentacao'], ['comida saudavel']],
      responses: ['Para a memória, são ótimos: peixes (sardinha, atum), nozes, frutas vermelhas, verduras escuras (brócolis, espinafre) e azeite. 🥗🐟 E muita água, claro!'] },

    // === Sono ===
    { keywords: [['dormir'], ['sono'], ['insonia'], ['nao consigo dormir']],
      responses: ['Para um sono melhor: evite café à noite, deixe o quarto escurinho, e tente uma rotina (mesmo horário todos os dias). Um chá calminho de camomila pode ajudar. 🌙😴'] },

    // === Exercícios físicos ===
    { keywords: [['exercicio fisico'], ['atividade fisica'], ['caminhada']],
      responses: ['Caminhar 20-30 minutos por dia já é maravilhoso para o corpo e para a mente! 🚶‍♀️💚 Comece devagar, no seu ritmo.'] }
  ];

  // ============== MOTOR DE MATCHING ==============
  function findRule(text) {
    const norm = normalize(text);
    for (const rule of RULES) {
      for (const group of rule.keywords) {
        const allMatch = group.every(kw => fuzzyContains(norm, normalize(kw)));
        if (allMatch) return rule;
      }
    }
    return null;
  }

  function pageContextAnswer() {
    const key = getCurrentPageKey();
    if (PAGES[key]) {
      const p = PAGES[key];
      const dica = p.dicas && p.dicas.length ? '<br><br>💡 <em>' + pick(p.dicas) + '</em>' : '';
      return 'Você está na <strong>' + p.titulo + '</strong> — ' + p.descricao + dica;
    }
    if (isJogo(key)) {
      const j = JOGOS[key];
      return 'Você está no <strong>' + j.nome + '</strong>. ' + j.como + '<br><br>🧠 <em>Esse jogo treina ' + j.habilidade + '.</em>';
    }
    return 'Você está em uma página do Mente Ativa. Posso te ajudar a entender o que tem aqui?';
  }

  function isAboutCurrentPage(text) {
    const n = normalize(text);
    return /\b(onde estou|que pagina|essa pagina|esta pagina|aqui|nessa tela|nesta tela|qual pagina)\b/.test(n);
  }

  // Detecta se o texto cita um jogo específico
  function detectJogoMencionado(text) {
    const norm = normalize(text);
    for (const key of Object.keys(JOGOS)) {
      const slug = key.replace('jogo-', '').replace(/-/g, ' ');
      if (fuzzyContains(norm, slug)) {
        return key;
      }
    }
    return null;
  }

  function fallbackAnswer(userText) {
    const sugestoes = [
      'Hmm, não tenho certeza do que você quis dizer. 💭<br>Tente perguntar de outro jeito, ou experimente:<br>• <em>\"Capital do Brasil\"</em><br>• <em>\"Quanto é 7 vezes 8\"</em><br>• <em>\"Conte uma curiosidade\"</em><br>• <em>\"Como começar?\"</em>',
      'Não entendi muito bem... 🤔 Posso te ajudar com:<br>🎮 Jogos do site • 🧮 Matemática • 🌍 Geografia • 📚 História • 💚 Dicas e curiosidades.<br>Pergunte sobre algum desses temas!',
      'Desculpa, não captei a sua pergunta. 🌿 Tente reformular ou toque em uma das sugestões abaixo!'
    ];
    return pick(sugestoes);
  }

  // ============== WIDGET ==============
  const Assistant = {
    _installed: false,
    history: [],
    typing: false,

    init() {
      this.history = loadHistory();
      this._buildDOM();
      this._bindEvents();
      this._renderHistory();
      if (this.history.length === 0) this._initialGreeting();
      this._installed = true;
    },

    _buildDOM() {
      const wrapper = document.createElement('div');
      wrapper.id = 'ma-assistant';
      wrapper.innerHTML = `
        <button class=\"ma-toggle\" aria-label=\"Abrir assistente Mente Ativa\" data-testid=\"ma-toggle-btn\">
          <span class=\"ma-badge\"></span>
          <img src=\"img/Logo.png\" alt=\"Logo Mente Ativa\"/>
            <path d=\"M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z\"/>
          </svg>
            <line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"/><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"/>
          </svg>
        </button>
        <div class=\"ma-window\" role=\"dialog\" aria-label=\"Assistente Mente Ativa\" aria-modal=\"false\" data-testid=\"ma-window\">
          <div class=\"ma-header\">
            <div class=\"ma-avatar\" aria-hidden=\"true\"><img src=\"img/unnamed.jpg\" alt=\"Logo Mente Ativa\"/></div>
            <div class=\"ma-header-info\">
              <h3>Assistente Mente Ativa</h3>
              <p>Sempre por aqui pra ajudar</p>
            </div>
            <div class=\"ma-header-actions\">
              <button class=\"ma-icon-btn ma-clear\" title=\"Limpar conversa\" aria-label=\"Limpar conversa\" data-testid=\"ma-clear-btn\">
                <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">
                  <polyline points=\"3 6 5 6 21 6\"/><path d=\"M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6\"/>
                  <path d=\"M10 11v6\"/><path d=\"M14 11v6\"/><path d=\"M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2\"/>
                </svg>
              </button>
              <button class=\"ma-icon-btn ma-close\" title=\"Fechar\" aria-label=\"Fechar assistente\" data-testid=\"ma-close-btn\">
                <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">
                  <line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"/><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"/>
                </svg>
              </button>
            </div>
          </div>
          <div class=\"ma-messages\" data-testid=\"ma-messages\" aria-live=\"polite\"></div>
          <div class=\"ma-suggestions\" data-testid=\"ma-suggestions\"></div>
          <div class=\"ma-input-area\">
            <textarea class=\"ma-input\" placeholder=\"Escreva sua mensagem...\" rows=\"1\" aria-label=\"Digite sua mensagem\" data-testid=\"ma-input\"></textarea>
            <button class=\"ma-send\" aria-label=\"Enviar mensagem\" data-testid=\"ma-send-btn\">
              <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">
                <line x1=\"22\" y1=\"2\" x2=\"11\" y2=\"13\"/>
                <polygon points=\"22 2 15 22 11 13 2 9 22 2\" fill=\"currentColor\" stroke=\"currentColor\"/>
              </svg>
            </button>
          </div>
          <div class=\"ma-footer\">Mente Ativa 💚 — feito com carinho</div>
        </div>
      `;
      document.body.appendChild(wrapper);
      this.root = wrapper;
      this.toggleBtn = wrapper.querySelector('.ma-toggle');
      this.windowEl = wrapper.querySelector('.ma-window');
      this.messagesEl = wrapper.querySelector('.ma-messages');
      this.suggestionsEl = wrapper.querySelector('.ma-suggestions');
      this.inputEl = wrapper.querySelector('.ma-input');
      this.sendBtn = wrapper.querySelector('.ma-send');
      this.closeBtn = wrapper.querySelector('.ma-close');
      this.clearBtn = wrapper.querySelector('.ma-clear');
    },

    _bindEvents() {
      this.toggleBtn.addEventListener('click', () => this.toggle());
      this.closeBtn.addEventListener('click', () => this.close());
      this.clearBtn.addEventListener('click', () => { if (confirm('Deseja apagar toda a conversa?')) this.clear(); });
      this.sendBtn.addEventListener('click', () => this._handleSend());
      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._handleSend(); }
      });
      this.inputEl.addEventListener('input', () => this._autoResize());
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.windowEl.classList.contains('is-open')) this.close();
      });
    },

    _autoResize() {
      this.inputEl.style.height = 'auto';
      this.inputEl.style.height = Math.min(this.inputEl.scrollHeight, 110) + 'px';
    },

    open() {
      this.windowEl.classList.add('is-open');
      this.toggleBtn.classList.add('is-open');
      this.toggleBtn.classList.remove('has-notification');
      this.toggleBtn.setAttribute('aria-label', 'Fechar assistente');
      setTimeout(() => this.inputEl.focus(), 280);
      this._scrollBottom();
    },
    close() {
      this.windowEl.classList.remove('is-open');
      this.toggleBtn.classList.remove('is-open');
      this.toggleBtn.setAttribute('aria-label', 'Abrir assistente Mente Ativa');
    },
    toggle() { this.windowEl.classList.contains('is-open') ? this.close() : this.open(); },
    clear() {
      this.history = [];
      saveHistory(this.history);
      this.messagesEl.innerHTML = '';
      this._initialGreeting();
    },

    _initialGreeting() {
      const key = getCurrentPageKey();
      let primeira;
      if (PAGES[key]) {
        primeira = `Olá! 💚 Que bom ter você na <strong>${PAGES[key].titulo}</strong>. ${PAGES[key].descricao} Posso te ajudar com algo?`;
      } else if (isJogo(key)) {
        primeira = `Olá! 💚 Vejo que você está no <strong>${JOGOS[key].nome}</strong>. Se precisar, é só me chamar!`;
      } else {
        primeira = 'Olá! 💚 Eu sou o Assistente Mente Ativa. Posso responder dúvidas do site, fazer contas, falar de geografia, história e mais. No que posso ajudar?';
      }
      this._addBotMessage(primeira, true);
      this._renderSuggestions(DEFAULT_SUGGESTIONS);
      if (!this.windowEl.classList.contains('is-open')) {
        this.toggleBtn.classList.add('has-notification');
      }
    },

    _renderHistory() {
      this.messagesEl.innerHTML = '';
      this.history.forEach(m => this._renderMessage(m.text, m.from, m.time, false));
      this._renderSuggestions(DEFAULT_SUGGESTIONS);
      this._scrollBottom();
    },

    _renderSuggestions(list) {
      this.suggestionsEl.innerHTML = '';
      list.forEach(text => {
        const chip = document.createElement('button');
        chip.className = 'ma-suggestion';
        chip.type = 'button';
        chip.textContent = text;
        chip.setAttribute('data-testid', 'ma-suggestion-chip');
        chip.addEventListener('click', () => { this.inputEl.value = text; this._handleSend(); });
        this.suggestionsEl.appendChild(chip);
      });
    },

    _renderMessage(text, from, time, animate) {
      const el = document.createElement('div');
      el.className = 'ma-msg ' + (from === 'user' ? 'is-user' : 'is-bot');
      if (!animate) el.style.animation = 'none';
      el.innerHTML = text + '<span class=\"ma-time\">' + escapeHTML(time) + '</span>';
      this.messagesEl.appendChild(el);
    },

    _addUserMessage(text) {
      const time = nowTime();
      this._renderMessage(escapeHTML(text), 'user', time, true);
      this.history.push({ text: escapeHTML(text), from: 'user', time });
      saveHistory(this.history);
      this._scrollBottom();
    },
    _addBotMessage(html, save) {
      const time = nowTime();
      this._renderMessage(html, 'bot', time, true);
      if (save !== false) { this.history.push({ text: html, from: 'bot', time }); saveHistory(this.history); }
      this._scrollBottom();
    },

    _showTyping() {
      const t = document.createElement('div');
      t.className = 'ma-typing';
      t.setAttribute('data-testid', 'ma-typing');
      t.innerHTML = '<span></span><span></span><span></span>';
      this.messagesEl.appendChild(t);
      this._scrollBottom();
      return t;
    },

    _scrollBottom() {
      requestAnimationFrame(() => { this.messagesEl.scrollTop = this.messagesEl.scrollHeight; });
    },

    _handleSend() {
      if (this.typing) return;
      const value = this.inputEl.value.trim();
      if (!value) return;
      this.inputEl.value = '';
      this._autoResize();
      this._addUserMessage(value);
      this._respond(value);
    },

    _respond(userText) {
      this.typing = true;
      this.sendBtn.disabled = true;
      const typingEl = this._showTyping();
      const delay = randInt(TYPING_MIN, TYPING_MAX);

      setTimeout(async () => {
        let result = this._buildResponse(userText);

        if (result.isFallback) {
          try {
            result = { message: await this._fetchAIResponse(userText) };
          } catch (error) {
            console.warn('Falha ao consultar IA remota:', error.message);
          }
        }

        typingEl.remove();
        this.typing = false;
        this.sendBtn.disabled = false;

        if (result.preMessage) this._addBotMessage(result.preMessage);
        if (result.message)    this._addBotMessage(result.message);

        if (result.action === 'goto' && result.target) {
          setTimeout(() => { window.location.href = result.target; }, 1100);
        } else if (result.action === 'back') {
          setTimeout(() => { window.history.back(); }, 800);
        } else if (result.action === 'clear') {
          setTimeout(() => this.clear(), 600);
        }
      }, delay);
    },

    async _fetchAIResponse(userText) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pergunta: userText }),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error('Erro ' + response.status);
        }

        const data = await response.json();
        if (!data || !data.resposta) {
          throw new Error('Resposta vazia da IA');
        }

        return formatPlainText(data.resposta);
      } finally {
        clearTimeout(timeoutId);
      }
    },

    _buildResponse(userText) {
      // Pipeline em ordem de prioridade
      // 1. Saudações / regras simples mais comuns (mais rápido)
      const ruleEarly = findRule(userText);
      if (ruleEarly && ruleEarly.responses && ruleEarly.responses.length && !ruleEarly.action) {
        // Apenas se for saudação curta — para outras regras priorizamos handlers específicos depois
      }

      // 2. Pergunta sobre a página atual
      if (isAboutCurrentPage(userText)) return { message: pageContextAnswer() };

      // 3. Calculadora
      const mathAns = tryMath(userText);
      if (mathAns) return { message: mathAns };

      // 4. Geografia
      const geoAns = tryGeografia(userText);
      if (geoAns) return { message: geoAns };

      // 5. História
      const histAns = tryHistoria(userText);
      if (histAns) return { message: histAns };

      // 6. Português (sinônimos, plural)
      const portAns = tryPortugues(userText);
      if (portAns) return { message: portAns };

      // 7. Data e hora
      const dataAns = tryDataHora(userText);
      if (dataAns) return { message: dataAns };

      // 8. Jogo específico mencionado
      const jogoKey = detectJogoMencionado(userText);
      if (jogoKey) {
        const norm = normalize(userText);
        const j = JOGOS[jogoKey];
        if (/\b(abrir|jogar|ir|leva|me leva|ver|abre|abra)\b/.test(norm)) {
          return { preMessage: 'Claro! Vou abrir o jogo pra você. 💚', action: 'goto', target: jogoKey + '.html' };
        }
        return { message: '🎮 <strong>' + j.nome + '</strong><br>' + j.como + '<br><br>🧠 <em>Treina ' + j.habilidade + '.</em><br><br>Quer que eu abra esse jogo agora?' };
      }

      // 9. Regras gerais (com fuzzy)
      const rule = findRule(userText);
      if (rule) {
        if (rule.handler) return { message: rule.handler() };
        if (rule.action === 'goto') return { preMessage: rule.preMessage || 'Combinado! Vou te levar até lá. 🌿', action: 'goto', target: rule.target };
        if (rule.action === 'back') return { message: 'Voltando uma página... ↩️', action: 'back' };
        if (rule.action === 'clear') return { message: 'Pronto, vou limpar a nossa conversa. 💙', action: 'clear' };
        if (rule.responses && rule.responses.length) return { message: pick(rule.responses) };
      }

      // 10. Fallback
      return { message: fallbackAnswer(userText), isFallback: true };
    }
  };

  function boot() {
    Assistant.init();
    window.MenteAtivaAssistant = Assistant;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
