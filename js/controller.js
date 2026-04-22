export class BarberController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        // Envio do Form
        this.view.form.onsubmit = (e) => this.handleNovoAgendamento(e);

        // Navegação
        document.getElementById('btn-cliente').onclick = () => this.view.mostrarSecao('view-cliente');
        document.getElementById('btn-dashboard').onclick = () => {
            this.view.mostrarSecao('view-dashboard');
            this.setPeriodoPreDefinido('semana'); // Padrão ao abrir
        };

        // Filtros Rápidos
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setPeriodoPreDefinido(btn.dataset.period);
            };
        });

        // Filtros Manuais
        this.view.filtroInicio.onchange = () => this.atualizarDashboard();
        this.view.filtroFim.onchange = () => this.atualizarDashboard();
        this.view.btnLimpar.onclick = () => {
            this.view.setDatasFiltro('', '');
            this.atualizarDashboard();
        };

        // Hero CTA
        document.getElementById('hero-cta').onclick = (e) => {
            e.preventDefault();
            this.view.mostrarSecao('view-cliente');
            window.scrollTo({ top: 500, behavior: 'smooth' });
        };
    }

    setPeriodoPreDefinido(periodo) {
        const hoje = new Date();
        let inicio, fim;

        if (periodo === 'hoje') {
            const str = hoje.toISOString().split('T')[0];
            inicio = str;
            fim = str;
        } else if (periodo === 'semana') {
            // Calcula o primeiro dia (domingo) e o último (sábado)
            const d = new Date(hoje);
            const day = d.getDay();
            const diff = d.getDate() - day;
            inicio = new Date(d.setDate(diff)).toISOString().split('T')[0];
            fim = new Date(d.setDate(diff + 6)).toISOString().split('T')[0];
        } else if (periodo === 'mes') {
            inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
            fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString().split('T')[0];
        }

        this.view.setDatasFiltro(inicio, fim);
        this.atualizarDashboard();
    }

    handleNovoAgendamento(e) {
        e.preventDefault();
        const { nome, data, servico } = e.target.elements;
        this.model.adicionarAgendamento(nome.value, data.value, servico.value);
        e.target.reset();
        alert('Agendamento realizado com sucesso!');
        this.view.mostrarSecao('view-dashboard');
        this.setPeriodoPreDefinido('semana');
    }

    atualizarDashboard() {
        const dados = this.model.getAgendamentosPorPeriodo(
            this.view.filtroInicio.value, 
            this.view.filtroFim.value
        );
        this.view.renderizarAgenda(dados, (id) => this.confirmarConclusao(id));
    }

    confirmarConclusao(id) {
        if (confirm('Marcar este atendimento como concluído?')) {
            this.model.removerAgendamento(id);
            this.atualizarDashboard();
        }
    }
}