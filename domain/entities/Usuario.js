class Usuario {
  constructor({ id = null, nome, email, senha, criadoEm = null }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha; // já será hash no service
    this.criadoEm = criadoEm;
  }

  validar() {
    if (!this.nome || this.nome.length < 3) {
      throw new Error('Nome deve ter no mínimo 3 caracteres');
    }
    if (!this.email || !this.email.includes('@')) {
      throw new Error('Email inválido');
    }
    if (!this.senha || this.senha.length < 6) {
      throw new Error('Senha deve ter no mínimo 6 caracteres');
    }
  }
}

module.exports = Usuario;