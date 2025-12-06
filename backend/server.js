
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bd from "./src/models/index.js";

// Importação dos Controllers
import AuthController from "./src/controllers/AuthController.js";
import TaskController from "./src/controllers/TaskController.js";

// Importação do Middleware de Autenticação
import authMiddleware from "./src/middleware/auth.js";

dotenv.config();

// Testa a conexão com o banco de dados
try {
  await bd.sequelize.authenticate();
  console.log("✅ Conexão com o banco de dados estabelecida.");
} catch (error) {
  console.error("❌ Erro ao conectar ao banco de dados:", error);
  process.exit(1);
}

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "API Todo List rodando com Docker + Redis" });
});

// --- ROTAS PÚBLICAS ---
app.post("/signin", AuthController.signin);
app.post("/signup", AuthController.signup);

// --- ROTAS PRIVADAS (Requer Token JWT) ---
// Tudo que estiver abaixo desta linha passará pelo middleware de autenticação
app.use(authMiddleware);

// Rotas de Tarefas (Usando o TaskController com Redis)
app.get("/tasks", TaskController.index);      // Lista (Cacheada)
app.post("/tasks", TaskController.store);     // Cria (Limpa Cache)
app.put("/tasks/:id", TaskController.update); // Atualiza (Limpa Cache)
app.delete("/tasks/:id", TaskController.delete); // Deleta (Limpa Cache)

// Rota de Perfil
app.get("/profile", (req, res) => {
  res.json({ message: "Perfil do usuário", userId: req.userId });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${port}`);
});