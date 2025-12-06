import bd from '../models/index.js';
import redis from '../config/redis.js';

const { Task } = bd;

class TaskController {
  // GET /tasks
  async index(req, res) {
    try {
      // Chave única para o cache. 
      // Se fosse por usuário, seria `tasks:user:${req.userId}`
      const cacheKey = 'tasks:all';

      // 1. Tenta buscar no Cache (CACHE HIT)
      const cachedData = await redis.get(cacheKey);
      
      if (cachedData) {
        console.log('⚡ Cache HIT: Retornando dados do Redis');
        return res.json(JSON.parse(cachedData));
      }

      // 2. Se não achar, busca no DB (CACHE MISS)
      console.log('🐢 Cache MISS: Buscando no Banco de Dados');
      const tasks = await Task.findAll({
        order: [['createdAt', 'DESC']] // Ordena por mais recente
      });

      // 3. Salva no Redis com expiração de 1 hora (3600 segundos)
      await redis.setEx(cacheKey, 3600, JSON.stringify(tasks));

      return res.json(tasks);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
  }

  // POST /tasks
  async store(req, res) {
    try {
      const { description } = req.body;
      if (!description) return res.status(400).json({ error: "Descrição obrigatória" });

      const task = await Task.create({ description, completed: false });

      // INVALIDAÇÃO: Limpa o cache para que a próxima leitura pegue a nova tarefa
      await redis.del('tasks:all');
      console.log('🧹 Cache Invalidado (Nova Tarefa)');

      return res.status(201).json(task);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // PUT /tasks/:id
  async update(req, res) {
    try {
      const { description, completed } = req.body;
      const task = await Task.findByPk(req.params.id);

      if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

      await task.update({ description, completed });

      // INVALIDAÇÃO
      await redis.del('tasks:all');
      console.log('🧹 Cache Invalidado (Atualização)');

      return res.json(task);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE /tasks/:id
  async delete(req, res) {
    try {
      const deleted = await Task.destroy({ where: { id: req.params.id } });
      
      if (!deleted) return res.status(404).json({ error: "Tarefa não encontrada" });

      // INVALIDAÇÃO
      await redis.del('tasks:all');
      console.log('🧹 Cache Invalidado (Remoção)');

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new TaskController();