export class BarberModel {
    #storageKey = 'barberflow_agendamentos_v4';

    constructor() {
        this.#seedMockData();
    }

    #seedMockData() {
        if (!localStorage.getItem(this.#storageKey)) {
            const hoje = new Date();
            const amanha = new Date(hoje);
            amanha.setDate(hoje.getDate() + 1);

            const mock = [
                { id: 101, nome: "Carlos Mendes", data: `${hoje.toISOString().split('T')[0]}T14:00`, servico: "Corte Clássico" },
                { id: 102, nome: "Ricardo Alves", data: `${hoje.toISOString().split('T')[0]}T15:30`, servico: "Combo Completo" },
                { id: 103, nome: "Felipe Moura", data: `${amanha.toISOString().split('T')[0]}T09:00`, servico: "Barba Premium" },
                { id: 104, nome: "André Lima", data: `${amanha.toISOString().split('T')[0]}T11:15`, servico: "Corte Clássico" }
            ];
            localStorage.setItem(this.#storageKey, JSON.stringify(mock));
        }
    }

    getTodosAgendamentos() {
        const data = localStorage.getItem(this.#storageKey);
        const lista = data ? JSON.parse(data) : [];
        return lista.sort((a, b) => new Date(a.data) - new Date(b.data));
    }

    getAgendamentosPorPeriodo(inicioISO, fimISO) {
        let lista = this.getTodosAgendamentos();
        if (!inicioISO && !fimISO) return lista;

        const inicio = inicioISO ? new Date(inicioISO) : null;
        const fim = fimISO ? new Date(fimISO) : null;
        if (inicio) inicio.setHours(0, 0, 0, 0);
        if (fim) fim.setHours(23, 59, 59, 999);

        return lista.filter(item => {
            const data = new Date(item.data);
            if (inicio && data < inicio) return false;
            if (fim && data > fim) return false;
            return true;
        });
    }

    adicionarAgendamento(nome, dataISO, servico) {
        const agendamentos = this.getTodosAgendamentos();
        const novo = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            nome: nome.trim(),
            data: dataISO,
            servico
        };
        agendamentos.push(novo);
        localStorage.setItem(this.#storageKey, JSON.stringify(agendamentos));
        return novo;
    }

    removerAgendamento(id) {
        const filtrado = this.getTodosAgendamentos().filter(a => a.id !== id);
        localStorage.setItem(this.#storageKey, JSON.stringify(filtrado));
    }
}