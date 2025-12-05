import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bd from "./src/models/index.js";

// Importações novas
import AuthController from "./src/controllers/AuthController.js";
import authMiddleware from "./src/middleware/auth.js";

dotenv.config();

const { Task } = bd;

// Testa a conexão com o banco de dados
try {
  await bd.sequelize.authenticate();
  console.log("Conexão com o banco de dados estabelecida com sucesso.");
} catch (error) {
  console.error("Erro ao conectar ao banco de dados:", error);
  process.exit(1);
}

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

// --- Rotas Públicas (Auth) ---
app.post("/signin", AuthController.signin);
app.post("/signup", AuthController.signup);

// --- Rotas Privadas (Todas abaixo usam o middleware) ---
app.use(authMiddleware);

app.get("/profile", (req, res) => {
  res.json({ message: "Perfil do usuário", userId: req.userId });
});

app.get("/tasks", async (req, res) => {
  // Opcional: Filtrar tasks pelo usuário logado
  // const tasks = await Task.findAll({ where: { userId: req.userId } });
  const tasks = await Task.findAll();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: "Descrição obrigatória" });
  
  // Opcional: Associar task ao usuário
  // const task = await Task.create({ description, completed: false, userId: req.userId });
  const task = await Task.create({ description, completed: false });
  res.status(201).json(task);
});

app.get("/tasks/:id", async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });
  res.json(task);
});

app.put("/tasks/:id", async (req, res) => {
  const { description, completed } = req.body;
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });
  await task.update({ description, completed });
  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  const deleted = await Task.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ error: "Tarefa não encontrada" });
  res.status(204).send();
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  // Ajuste: DB_PORT pode vir undefined se não estiver no .env do local, 
  // mas dentro do container as variáveis do docker-compose funcionam.
  console.log(`Database info available.`);
});