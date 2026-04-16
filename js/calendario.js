// Mente Ativa - Calendário Interativo

const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

let dataAtual = new Date();
let dataSelecionada = new Date();
let eventos = {};

function inicializarCalendario() {
    carregarEventos();
    renderizarCalendario();
    renderizarEventos();
}

function carregarEventos() {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    const eventosSalvos = localStorage.getItem('menteativa_eventos');
    if (eventosSalvos) {
        eventos = JSON.parse(eventosSalvos);
    } else {
        eventos = {
            [`${anoAtual}-${mesAtual + 1}-2`]: [
                { tipo: 'medic', titulo: 'Tomar remédio', hora: '08:00', periodo: 'Manhã' }
            ],
            [`${anoAtual}-${mesAtual + 1}-7`]: [
                { tipo: 'activity', titulo: 'Caminhada', hora: '09:00', periodo: 'Parque' }
            ],
            [`${anoAtual}-${mesAtual + 1}-16`]: [
                { tipo: 'medical', titulo: 'Consulta médica', hora: '14:30', periodo: 'Dr. João' }
            ],
            [`${anoAtual}-${mesAtual + 1}-25`]: [
                { tipo: 'activity', titulo: 'Grupo de Alongamento', hora: '10:00', periodo: 'Centro Comunitário' }
            ],
            [`${anoAtual}-${mesAtual + 1}-${hoje.getDate()}`]: [
                { tipo: 'medic', titulo: 'Tomar remédio', hora: '08:00', periodo: 'Manhã' },
                { tipo: 'medical', titulo: 'Consulta médica', hora: '14:30', periodo: 'Dr. João' },
                { tipo: 'activity', titulo: 'Caminhada', hora: '07:00', periodo: 'Parque' }
            ]
        };
    }
}

function renderizarCalendario() {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    
    
    document.querySelector('.calendar-header h2').textContent = `${nomesMeses[mes]} ${ano}`;
    
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const hoje = new Date();
    
    const weekdaysDiv = document.querySelector('.weekdays');
    weekdaysDiv.innerHTML = nomesDias.map(dia => `<span>${dia}</span>`).join('');
    
    const daysDiv = document.querySelector('.days');
    daysDiv.innerHTML = '';
    
    for (let i = 0; i < primeiroDia; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day empty';
        daysDiv.appendChild(dayDiv);
    }
    
    const dataSelecionadaStr = `${dataSelecionada.getFullYear()}-${dataSelecionada.getMonth() + 1}-${dataSelecionada.getDate()}`;
    const hojeStr = `${hoje.getFullYear()}-${hoje.getMonth() + 1}-${hoje.getDate()}`;
    
    for (let dia = 1; dia <= diasNoMes; dia++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = dia;
        
        const dataStr = `${ano}-${mes + 1}-${dia}`;
        
        if (eventos[dataStr] && eventos[dataStr].length > 0) {
            dayDiv.classList.add('has-event');
        }
        
        if (dataStr === hojeStr) {
            dayDiv.classList.add('today');
        }
        
        if (dataStr === dataSelecionadaStr) {
            dayDiv.classList.add('selected');
        }
        
        dayDiv.addEventListener('click', () => {
            if (!dayDiv.classList.contains('empty')) {
                selecionarDia(dia);
            }
        });
        
        daysDiv.appendChild(dayDiv);
    }
}

function selecionarDia(dia) {
    dataSelecionada = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dia);
    renderizarCalendario();
    renderizarEventos();
}

function renderizarEventos() {
    const eventsListDiv = document.querySelector('.events-list');
    const dataStr = `${dataSelecionada.getFullYear()}-${dataSelecionada.getMonth() + 1}-${dataSelecionada.getDate()}`;
    const eventosDia = eventos[dataStr] || [];
    
    const diaSemana = dataSelecionada.getDay();
    const nomeDiaSemana = nomesDias[diaSemana];
    const dia = dataSelecionada.getDate();
    const mes = nomesMeses[dataSelecionada.getMonth()];
    
    if (eventosDia.length === 0) {
        eventsListDiv.innerHTML = `
            <h3>${nomeDiaSemana}, ${dia} de ${mes}</h3>
            <div class="no-events">
                <p>Nenhum evento neste dia</p>
            </div>
        `;
    } else {
        let html = `<h3>${nomeDiaSemana}, ${dia} de ${mes}</h3>`;
        
        eventosDia.forEach((evento, index) => {
            html += `
                <div class="event-item">
                    <div class="event-icon ${evento.tipo}">
                        <svg viewBox="0 0 24 24">
                            ${getIconEvento(evento.tipo)}
                        </svg>
                    </div>
                    <div class="event-details">
                        <div class="event-title">${evento.titulo}</div>
                        <div class="event-time">${evento.hora} - ${evento.periodo}</div>
                    </div>
                    <button class="delete-event-btn" data-index="${index}" aria-label="Remover evento ${evento.titulo}">
                        <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        Remover
                    </button>
                </div>
            `;
        });
        
        eventsListDiv.innerHTML = html;
        
        eventsListDiv.querySelectorAll('.delete-event-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                confirmarExclusao(index);
            });
        });
    }
}

function getIconEvento(tipo) {
    const icons = {
        medic: '<path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>',
        medical: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>',
        activity: '<path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>'
    };
    return icons[tipo] || icons.activity;
}

function mudarMes(delta) {
    dataAtual.setMonth(dataAtual.getMonth() + delta);
    dataSelecionada = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
    renderizarCalendario();
    renderizarEventos();
}

function abrirModal() {
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventType').value = 'medic';
    document.getElementById('eventTime').value = '09:00';
    document.getElementById('eventPeriod').value = '';
    document.getElementById('eventTitle').focus();
}

function fecharModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function fecharModalCliqueFora(event) {
    if (event.target === document.getElementById('modalOverlay')) {
        fecharModal();
    }
}

function salvarEvento() {
    const titulo = document.getElementById('eventTitle').value.trim();
    const tipo = document.getElementById('eventType').value;
    const hora = document.getElementById('eventTime').value;
    const periodo = document.getElementById('eventPeriod').value.trim();
    
    if (!titulo) {
        alert('Por favor, digite o nome do evento');
        return;
    }
    
    const dataStr = `${dataSelecionada.getFullYear()}-${dataSelecionada.getMonth() + 1}-${dataSelecionada.getDate()}`;
    
    if (!eventos[dataStr]) {
        eventos[dataStr] = [];
    }
    
    eventos[dataStr].push({
        tipo: tipo,
        titulo: titulo,
        hora: hora,
        periodo: periodo || ' '
    });
    
    localStorage.setItem('menteativa_eventos', JSON.stringify(eventos));
    
    fecharModal();
    renderizarCalendario();
    renderizarEventos();
}

function confirmarExclusao(index) {
    const dataStr = `${dataSelecionada.getFullYear()}-${dataSelecionada.getMonth() + 1}-${dataSelecionada.getDate()}`;
    const evento = eventos[dataStr][index];
    
    document.getElementById('deleteModalOverlay').classList.add('active');
    document.getElementById('deleteEventTitle').textContent = evento.titulo;
    document.getElementById('deleteEventTime').textContent = evento.hora;
    
    window.eventoParaExcluir = { index: index, dataStr: dataStr };
}

function fecharModalExclusao(event) {
    if (event && event.target !== document.getElementById('deleteModalOverlay')) {
        return;
    }
    document.getElementById('deleteModalOverlay').classList.remove('active');
    window.eventoParaExcluir = null;
}

function removerEvento() {
    if (!window.eventoParaExcluir) return;
    
    const { index, dataStr } = window.eventoParaExcluir;
    
    eventos[dataStr].splice(index, 1);
    
    if (eventos[dataStr].length === 0) {
        delete eventos[dataStr];
    }
    
    localStorage.setItem('menteativa_eventos', JSON.stringify(eventos));
    
    fecharModalExclusao();
    renderizarCalendario();
    renderizarEventos();
    
    alert('Atividade removida com sucesso');
}

function excluirEvento(index) {
    confirmarExclusao(index);
}

document.getElementById('btn-tts-calendario').addEventListener('click', function() {
    toggleLeitura('Calendário de Março de 2026. Organize seus compromissos e eventos.');
});
document.getElementById('btn-mes-anterior').addEventListener('click', () => mudarMes(-1));
document.getElementById('btn-proximo-mes').addEventListener('click', () => mudarMes(1));
document.getElementById('btn-adicionar-evento').addEventListener('click', abrirModal);
document.getElementById('modalOverlay').addEventListener('click', fecharModalCliqueFora);
document.getElementById('btn-cancelar-evento').addEventListener('click', fecharModal);
document.getElementById('btn-salvar-evento').addEventListener('click', salvarEvento);
document.getElementById('deleteModalOverlay').addEventListener('click', fecharModalExclusao);
document.getElementById('btn-cancelar-exclusao').addEventListener('click', fecharModalExclusao);
document.getElementById('btn-confirmar-exclusao').addEventListener('click', removerEvento);

document.addEventListener('DOMContentLoaded', () => {
    inicializarCalendario();
});
