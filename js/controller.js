export class BarberController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        this.view.form.onsubmit = (e) => this.handleNovoAgendamento(e);
        document.getElementById('btn-cliente').onclick = () => this.view.mostrarSecao('view-cliente');
        document.getElementById('btn-dashboard').onclick = () => {
            this.view.mostrarSecao('view-dashboard');
            this.setPeriodo('semana');
        };

        // Filtros de Botão
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.onclick = () => {
                this.view.filtroDia.value = ''; // Limpa o calendário ao usar botões
                document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setPeriodo(btn.dataset.period);
            };
        });

        // Filtro de Calendário (Dia Específico)
        this.view.filtroDia.onchange = (e) => {
            document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
            this.atualizarDashboard(e.target.value, e.target.value);
        };
    }

    setPeriodo(periodo) {
        const hoje = new Date();
        let inicio, fim;

        if (periodo === 'hoje') {
            const str = hoje.toISOString().split('T')[0];
            inicio = fim = str;
        } else if (periodo === 'semana') {
            const d = new Date(hoje);
            const day = d.getDay();
            const diff = d.getDate() - day;
            inicio = new Date(d.setDate(diff)).toISOString().split('T')[0];
            fim = new Date(d.setDate(diff + 6)).toISOString().split('T')[0];
        } else if (periodo === 'mes') {
            inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
            fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString().split('T')[0];
        }
        this.atualizarDashboard(inicio, fim);
    }

    handleNovoAgendamento(e) {
        e.preventDefault();
        const { nome, data, servico } = e.target.elements;
        this.model.adicionarAgendamento(nome.value, data.value, servico.value);
        e.target.reset();
        alert('Agendado!');
        this.view.mostrarSecao('view-dashboard');
        this.setPeriodo('semana');
    }

    atualizarDashboard(inicio, fim) {
        const dados = this.model.getAgendamentosPorPeriodo(inicio, fim);
        this.view.renderizarAgenda(dados, (id) => {
            if(confirm('Concluir?')) {
                this.model.removerAgendamento(id);
                this.atualizarDashboard(inicio, fim);
            }
        });
    }
}