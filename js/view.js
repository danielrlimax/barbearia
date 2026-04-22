export class BarberView {
    constructor() {
        this.form = document.getElementById('form-agendamento');
        this.listaContainer = document.getElementById('lista-agendamentos');
        this.countBadge = document.getElementById('count-agendamentos');
        this.filtroDia = document.getElementById('filtro-dia');
        this.feedbackCliente = document.getElementById('feedback-cliente');
    }

    mostrarSecao(secaoId) {
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(secaoId).classList.remove('hidden');

        const isCliente = secaoId === 'view-cliente';
        document.getElementById('btn-cliente').classList.toggle('active', isCliente);
        document.getElementById('btn-dashboard').classList.toggle('active', !isCliente);
    }

    limparFormulario() {
        this.form.reset();
    }

    exibirFeedback(mensagem, tipo = 'success') {
        if (this.feedbackCliente) {
            this.feedbackCliente.textContent = mensagem;
            this.feedbackCliente.style.color = tipo === 'success' ? 'var(--success)' : 'var(--danger)';
            setTimeout(() => this.feedbackCliente.textContent = '', 3000);
        }
    }

    renderizarAgenda(agendamentos, callbackRemover) {
        this.countBadge.textContent = agendamentos.length;
        this.listaContainer.innerHTML = '';

        if (agendamentos.length === 0) {
            this.listaContainer.innerHTML = '<p class="text-muted"><i class="far fa-calendar-times"></i> Nenhum agendamento neste período.</p>';
            return;
        }

        const grupos = agendamentos.reduce((acc, item) => {
            const dataKey = item.data.split('T')[0];
            if (!acc[dataKey]) acc[dataKey] = [];
            acc[dataKey].push(item);
            return acc;
        }, {});

        Object.entries(grupos).forEach(([dataKey, itens]) => {
            const dataObj = new Date(dataKey + 'T12:00:00');
            const diaFormatado = dataObj.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

            const section = document.createElement('div');
            section.className = 'day-group';
            section.innerHTML = `<div class="day-header"><span>${diaFormatado}</span> <span>${itens.length} agend.</span></div>`;

            itens.forEach(item => {
                const hora = item.data.split('T')[1].substring(0, 5);
                const card = document.createElement('div');
                card.className = 'card-agendamento';
                card.innerHTML = `
                    <div class="info-cliente">
                        <strong>${hora} – ${item.nome}</strong>
                        <span>${item.servico}</span>
                    </div>
                    <button class="btn-delete" data-id="${item.id}" title="Concluir atendimento">
                        <i class="fas fa-check-circle"></i>
                    </button>
                `;
                section.appendChild(card);
            });

            this.listaContainer.appendChild(section);
        });

        this.listaContainer.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => callbackRemover(Number(btn.dataset.id)));
        });
    }

    bindEventos(handlers) {
        this.form.addEventListener('submit', handlers.onAgendar);
        document.getElementById('btn-cliente').addEventListener('click', handlers.onMostrarCliente);
        document.getElementById('btn-dashboard').addEventListener('click', handlers.onMostrarDashboard);
        this.filtroDia.addEventListener('change', handlers.onFiltroDia);

        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.addEventListener('click', () => handlers.onFiltroPeriodo(btn.dataset.period));
        });
    }

    destacarFiltroAtivo(periodo) {
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.period === periodo);
        });
        this.filtroDia.value = '';
    }
}