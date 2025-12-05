import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Importação EXPLÍCITA dos modelos (evita erros de caminho no Docker)
import TaskModel from './Task.js';
import UserModel from './User.js'; 

dotenv.config();

// Carrega config do Docker ou Fallback local
const dbName = process.env.DB_NAME || 'todolist';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

console.log(`Tentando conectar ao banco: ${dbHost}:${dbPort} / DB: ${dbName}`);

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: false, 
});

const db = {};

// Inicializa os modelos
db.Task = TaskModel(sequelize, Sequelize.DataTypes);
db.User = UserModel(sequelize, Sequelize.DataTypes);

// Configura associações (se houver)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;