export class BarberController {
    #model;
    #view;
    #periodoAtual = 'semana';

    constructor(model, view) {
        this.#model = model;
        this.#view = view;
        this.#inicializar();
    }

    #inicializar() {
        this.#view.mostrarSecao('view-cliente');
        this.#view.bindEventos({
            onAgendar: (e) => this.#handleAgendamento(e),
            onMostrarCliente: () => this.#view.mostrarSecao('view-cliente'),
            onMostrarDashboard: () => {
                this.#view.mostrarSecao('view-dashboard');
                this.#aplicarPeriodo(this.#periodoAtual);
            },
            onFiltroPeriodo: (periodo) => this.#aplicarPeriodo(periodo),
            onFiltroDia: (e) => this.#filtrarPorDiaEspecifico(e.target.value)
        });

        // Define data/hora mínima como agora
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById('data').min = now.toISOString().slice(0, 16);
    }

    #handleAgendamento(e) {
        e.preventDefault();
        const { nome, data, servico } = e.target.elements;

        if (!nome.value.trim() || !data.value) {
            this.#view.exibirFeedback('Preencha todos os campos.', 'error');
            return;
        }

        const dataSelecionada = new Date(data.value);
        if (dataSelecionada < new Date()) {
            this.#view.exibirFeedback('A data/hora deve ser futura.', 'error');
            return;
        }

        this.#model.adicionarAgendamento(nome.value, data.value, servico.value);
        this.#view.limparFormulario();
        this.#view.exibirFeedback('✅ Agendamento confirmado!');

        this.#view.mostrarSecao('view-dashboard');
        this.#aplicarPeriodo(this.#periodoAtual);
    }

    #aplicarPeriodo(periodo) {
        this.#periodoAtual = periodo;
        this.#view.destacarFiltroAtivo(periodo);

        const { inicio, fim } = this.#calcularIntervalo(periodo);
        this.#atualizarDashboard(inicio, fim);
    }

    #filtrarPorDiaEspecifico(dataISO) {
        if (!dataISO) return;
        this.#view.destacarFiltroAtivo(null);
        this.#atualizarDashboard(dataISO, dataISO);
    }

    #calcularIntervalo(periodo) {
        const hoje = new Date();
        let inicio, fim;

        if (periodo === 'hoje') {
            inicio = fim = hoje.toISOString().split('T')[0];
        } else if (periodo === 'semana') {
            const domingo = new Date(hoje);
            domingo.setDate(hoje.getDate() - hoje.getDay());
            const sabado = new Date(domingo);
            sabado.setDate(domingo.getDate() + 6);
            inicio = domingo.toISOString().split('T')[0];
            fim = sabado.toISOString().split('T')[0];
        } else {
            inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
            fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString().split('T')[0];
        }
        return { inicio, fim };
    }

    #atualizarDashboard(inicio, fim) {
        const dados = this.#model.getAgendamentosPorPeriodo(inicio, fim);
        this.#view.renderizarAgenda(dados, (id) => this.#removerAgendamento(id, inicio, fim));
    }

    #removerAgendamento(id, inicio, fim) {
        if (confirm('Marcar como concluído e remover?')) {
            this.#model.removerAgendamento(id);
            this.#atualizarDashboard(inicio, fim);
        }
    }
}