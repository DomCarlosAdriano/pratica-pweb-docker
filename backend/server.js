import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bd from "./src/models/index.js";

// Controllers
import AuthController from "./src/controllers/AuthController.js";
import TaskController from "./src/controllers/TaskController.js";
import ProfileController from "./src/controllers/ProfileController.js"; // <--- NOVO: Importa o controller de perfil

// Configs e Middlewares
import authMiddleware from "./src/middleware/auth.js";
import upload from "./src/config/multer.js"; // <--- NOVO: Importa o multer configurado

dotenv.config();

// Testa DB
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
  res.json({ message: "API Todo List rodando com Docker + Redis + Supabase" });
});

// --- ROTAS PÚBLICAS ---
app.post("/signin", AuthController.signin);
app.post("/signup", AuthController.signup);

// --- ROTAS PRIVADAS ---
// Todas as rotas abaixo requerem o token JWT no header Authorization
app.use(authMiddleware);

// Tarefas (Com Cache Redis)
app.get("/tasks", TaskController.index);
app.post("/tasks", TaskController.store);
app.put("/tasks/:id", TaskController.update);
app.delete("/tasks/:id", TaskController.delete);

// Perfil
app.get("/profile", (req, res) => {
  res.json({ message: "Perfil do usuário", userId: req.userId });
});

// Upload de Avatar (NOVA ROTA)
// - upload.single('file'): Middleware que pega o arquivo do campo 'file' do form-data
// - ProfileController.updateAvatar: Lógica que envia pro Supabase
app.patch("/profile/avatar", upload.single('file'), ProfileController.updateAvatar);

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${port}`);
});