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
    
    // Normalizar data para evitar problemas de fuso horário
    if (typeof prazo === 'string' && prazo.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Se vier no formato YYYY-MM-DD, adicionar horário local
      this.prazo = new Date(prazo + 'T00:00:00');
    } else {
      this.prazo = new Date(prazo);
    }
    
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
    
    // Comparar apenas a data (sem hora) para permitir prazo de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (!this.prazo || this.prazo < hoje) {
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