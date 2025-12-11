class Projeto {
  constructor({ id = null, titulo, descricao, prazo, ownerId, criadoEm = null }) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    
    // Normalizar data para evitar problemas de fuso horário
    if (typeof prazo === 'string' && prazo.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Se vier no formato YYYY-MM-DD, adicionar horário local
      this.prazo = new Date(prazo + 'T00:00:00');
    } else {
      this.prazo = new Date(prazo);
    }
    
    this.ownerId = ownerId;
    this.criadoEm = criadoEm;
  }

  validar() {
    if (!this.titulo || this.titulo.length < 3) {
      throw new Error('Título deve ter no mínimo 3 caracteres');
    }
    if (!this.descricao) {
      throw new Error('Descrição é obrigatória');
    }
    
    // Comparar apenas a data (sem hora) para permitir prazo de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (!this.prazo || this.prazo < hoje) {
      throw new Error('Prazo deve ser a partir de hoje');
    }
    
    if (!this.ownerId) {
      throw new Error('Proprietário (ownerId) é obrigatório');
    }
  }

  podeSerEditadoPor(usuarioId) {
    return this.ownerId === usuarioId;
  }
}

module.exports = Projeto;