export class BarberView {
    constructor() {
        this.form = document.getElementById('form-agendamento');
        this.lista = document.getElementById('lista-agendamentos');
        this.countBadge = document.getElementById('count-agendamentos');
        this.filtroDia = document.getElementById('filtro-dia');
    }

    renderizarAgenda(agendamentos, onDelete) {
        this.lista.innerHTML = '';
        this.countBadge.textContent = agendamentos.length;

        if (agendamentos.length === 0) {
            this.lista.innerHTML = '<p class="text-muted">Nenhum cliente agendado.</p>';
            return;
        }

        const grupos = {};
        agendamentos.forEach(a => {
            const dataIso = a.data.split('T')[0];
            if (!grupos[dataIso]) grupos[dataIso] = [];
            grupos[dataIso].push(a);
        });

        Object.keys(grupos).forEach(data => {
            const dataObj = new Date(data + 'T12:00:00');
            const dataFormatada = dataObj.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
            
            const section = document.createElement('div');
            section.className = 'day-group';
            section.innerHTML = `<div class="day-header"><span>${dataFormatada}</span> <small>${grupos[data].length}</small></div>`;

            grupos[data].forEach(a => {
                const hora = a.data.split('T')[1];
                const card = document.createElement('div');
                card.className = 'card-agendamento';
                card.innerHTML = `
                    <div class="info-cliente">
                        <strong>${hora} - ${a.nome}</strong>
                        <span>${a.servico}</span>
                    </div>
                    <button class="btn-delete" data-id="${a.id}"><i class="fas fa-check-circle"></i></button>
                `;
                section.appendChild(card);
            });
            this.lista.appendChild(section);
        });

        this.lista.querySelectorAll('.btn-delete').forEach(btn => {
            btn.onclick = () => onDelete(Number(btn.dataset.id));
        });
    }

    mostrarSecao(id) {
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        document.querySelectorAll('.btn-nav').forEach(b => b.classList.toggle('active', b.id.includes(id.split('-')[1])));
    }
}