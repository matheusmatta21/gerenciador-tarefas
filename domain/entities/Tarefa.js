class Tarefa {
  constructor({ 
    id = null, 
    titulo, 
    status, 
    prioridade, 
    prazo, 
    projetoId, 
    criadoEm = null 
  }) {
    this.id = id;
    this.titulo = titulo;
    this.status = status; // 'pendente', 'em_progresso', 'concluida'
    this.prioridade = prioridade; // 'baixa', 'média', 'alta'
    this.prazo = new Date(prazo);
    this.projetoId = projetoId;
    this.criadoEm = criadoEm;
  }

  validar() {
    if (!this.titulo || this.titulo.length < 3) {
      throw new Error('Título deve ter no mínimo 3 caracteres');
    }
    if (!['pendente', 'em_progresso', 'concluida'].includes(this.status)) {
      throw new Error('Status inválido');
    }
    if (!['baixa', 'média', 'alta'].includes(this.prioridade)) {
      throw new Error('Prioridade deve ser: baixa, média ou alta');
    }
    if (!this.prazo || this.prazo < new Date()) {
      throw new Error('Prazo deve ser a partir de hoje');
    }
    if (!this.projetoId) {
      throw new Error('ProjetoId é obrigatório');
    }
  }

  podeSerGerenciadaPor(projeto) {
    return this.projetoId === projeto.id;
  }
}

module.exports = Tarefa;