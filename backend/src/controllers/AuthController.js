import jwt from 'jsonwebtoken';
import bd from '../models/index.js'; // Importa do index dos models

const { User } = bd;

class AuthController {
  // Login
  async signin(req, res) {
    const { email, password } = req.body;

    // Busca usuário pelo email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Verifica senha
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const { id, name, avatar_url } = user;

    // Retorna usuário e token
    return res.json({
      user: { id, name, email, avatar_url },
      token: jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      }),
    });
  }

  // Cadastro
  async signup(req, res) {
    try {
      // Verifica se user já existe
      const userExists = await User.findOne({ where: { email: req.body.email } });
      if (userExists) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }

      const { id, name, email, avatar_url } = await User.create(req.body);
      return res.json({ id, name, email, avatar_url });
    } catch (err) {
      return res.status(400).json({ error: 'Falha no cadastro', messages: err.message });
    }
  }
}

export default new AuthController();