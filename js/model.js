export class BarberModel {
    constructor() {
        this.storageKey = 'agendamentos_barberflow_v3';
    }

    getAgendamentos() {
        const dados = localStorage.getItem(this.storageKey);
        const lista = dados ? JSON.parse(dados) : [];
        // Ordenação cronológica obrigatória
        return lista.sort((a, b) => new Date(a.data) - new Date(b.data));
    }

    getAgendamentosPorPeriodo(dataInicio, dataFim) {
        let lista = this.getAgendamentos();

        if (dataInicio) {
            const inicio = new Date(dataInicio);
            inicio.setHours(0, 0, 0, 0);
            lista = lista.filter(a => new Date(a.data) >= inicio);
        }

        if (dataFim) {
            const fim = new Date(dataFim);
            fim.setHours(23, 59, 59, 999);
            lista = lista.filter(a => new Date(a.data) <= fim);
        }

        return lista;
    }

    adicionarAgendamento(nome, data, servico) {
        const agendamentos = this.getAgendamentos();
        const novo = { id: Date.now(), nome, data, servico };
        agendamentos.push(novo);
        localStorage.setItem(this.storageKey, JSON.stringify(agendamentos));
    }

    removerAgendamento(id) {
        const agendamentos = this.getAgendamentos().filter(a => a.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(agendamentos));
    }
}