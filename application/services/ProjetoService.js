const Projeto = require('../../domain/entities/Projeto');

class ProjetoService {
  constructor(projetoRepository, tarefaRepository) {
    this.projetoRepository = projetoRepository;
    this.tarefaRepository = tarefaRepository;
  }

  async criar(titulo, descricao, prazo, ownerId) {
    const projeto = new Projeto({ titulo, descricao, prazo, ownerId });
    projeto.validar();
    return await this.projetoRepository.create(projeto);
  }

  async listar(usuarioId) {
    return await this.projetoRepository.findAll(usuarioId);
  }

  async obter(id) {
    return await this.projetoRepository.findById(id);
  }

  async atualizar(id, ownerId, { titulo, descricao, prazo }) {
    const projeto = await this.projetoRepository.findById(id);
    if (!projeto) {
      throw new Error('Projeto não encontrado');
    }

    if (!projeto.podeSerEditadoPor(ownerId)) {
      throw new Error('Você não tem permissão para editar este projeto');
    }

    // Verificar se novo prazo respeita as tarefas
    const tarefas = await this.tarefaRepository.findByProjetoId(id);
    if (tarefas.length > 0) {
      const maiorPrazoTarefa = new Date(
        Math.max(...tarefas.map(t => new Date(t.prazo)))
      );
      if (new Date(prazo) < maiorPrazoTarefa) {
        throw new Error('Prazo do projeto não pode ser menor que o prazo das tarefas');
      }
    }

    const atualizado = new Projeto({ 
      ...projeto, 
      titulo, 
      descricao, 
      prazo 
    });
    atualizado.validar();

    return await this.projetoRepository.update(atualizado);
  }

  async excluir(id, ownerId) {
    const projeto = await this.projetoRepository.findById(id);
    if (!projeto) {
      throw new Error('Projeto não encontrado');
    }

    if (!projeto.podeSerEditadoPor(ownerId)) {
      throw new Error('Você não tem permissão para excluir este projeto');
    }

    // Excluir tarefas associadas
    const tarefas = await this.tarefaRepository.findByProjetoId(id);
    for (const tarefa of tarefas) {
      await this.tarefaRepository.deleteById(tarefa.id);
    }

    await this.projetoRepository.deleteById(id);
  }
}

module.exports = ProjetoService;