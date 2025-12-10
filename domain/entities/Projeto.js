class Projeto {
  constructor({ id = null, titulo, descricao, prazo, ownerId, criadoEm = null }) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.prazo = new Date(prazo); // Garantir que é Date
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
    if (!this.prazo || this.prazo < new Date()) {
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