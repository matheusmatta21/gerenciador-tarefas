const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../../domain/entities/Usuario');

class AuthService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async registrar(nome, email, senha) {
    // Verificar se usuário já existe
    const existente = await this.usuarioRepository.findByEmail(email);
    if (existente) {
      throw new Error('Email já registrado');
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar e salvar usuário
    const usuario = new Usuario({ nome, email, senha: senhaHash });
    usuario.validar();

    const saved = await this.usuarioRepository.create(usuario);
    return saved;
  }

  async autenticar(email, senha) {
    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario) {
      throw new Error('Email ou senha incorretos');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error('Email ou senha incorretos');
    }

    // Gerar JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { usuario, token };
  }

  verificarToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error('Token inválido ou expirado');
    }
  }
}

module.exports = AuthService;