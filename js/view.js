export class BarberView {
    constructor() {
        this.form = document.getElementById('form-agendamento');
        this.lista = document.getElementById('lista-agendamentos');
        this.countBadge = document.getElementById('count-agendamentos');
        this.filtroInicio = document.getElementById('filtro-inicio');
        this.filtroFim = document.getElementById('filtro-fim');
        this.btnLimpar = document.getElementById('btn-limpar-filtro');
    }

    mostrarSecao(id) {
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        
        // Atualiza botões da nav
        document.querySelectorAll('.btn-nav').forEach(btn => {
            btn.classList.toggle('active', btn.id.includes(id.split('-')[1]));
        });
    }

    renderizarAgenda(agendamentos, onDelete) {
        this.lista.innerHTML = '';
        this.countBadge.textContent = agendamentos.length;

        if (agendamentos.length === 0) {
            this.lista.innerHTML = '<p class="text-muted">Nenhum agendamento encontrado para este período.</p>';
            return;
        }

        // Agrupamento por Data (YYYY-MM-DD)
        const grupos = {};
        agendamentos.forEach(a => {
            const dataIso = a.data.split('T')[0];
            if (!grupos[dataIso]) grupos[dataIso] = [];
            grupos[dataIso].push(a);
        });

        // Criar estrutura HTML agrupada
        Object.keys(grupos).forEach(dataKey => {
            // Formata cabeçalho do dia
            const dataObj = new Date(dataKey + 'T12:00:00');
            const dataFormatada = dataObj.toLocaleDateString('pt-BR', { 
                weekday: 'long', day: '2-digit', month: 'long' 
            });

            const daySection = document.createElement('div');
            daySection.className = 'day-group';
            daySection.innerHTML = `
                <div class="day-header">
                    <span>${dataFormatada}</span>
                    <small>${grupos[dataKey].length} cliente(s)</small>
                </div>
            `;

            grupos[dataKey].forEach(a => {
                const hora = a.data.split('T')[1];
                const card = document.createElement('div');
                card.className = 'card-agendamento';
                card.innerHTML = `
                    <div class="info-cliente">
                        <strong>${hora} - ${a.nome}</strong>
                        <span><i class="fas fa-cut"></i> ${a.servico}</span>
                    </div>
                    <button class="btn-delete btn-icon" data-id="${a.id}">
                        <i class="fas fa-check-circle"></i>
                    </button>
                `;
                daySection.appendChild(card);
            });

            this.lista.appendChild(daySection);
        });

        // Eventos de clique nos botões de completar/deletar
        this.lista.querySelectorAll('.btn-delete').forEach(btn => {
            btn.onclick = () => onDelete(Number(btn.dataset.id));
        });
    }

    setDatasFiltro(inicio, fim) {
        this.filtroInicio.value = inicio;
        this.filtroFim.value = fim;
    }
}