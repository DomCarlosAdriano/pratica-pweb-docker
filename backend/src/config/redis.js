import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  // Conecta usando as variáveis do docker-compose
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Conectado ao Redis com sucesso!'));

// Conecta assim que o arquivo é importado
await client.connect();

export default client;