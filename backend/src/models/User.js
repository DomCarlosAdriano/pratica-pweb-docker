import { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Associações aqui
    }

    // Método para verificar senha
    checkPassword(password) {
      return bcrypt.compare(password, this.password_hash);
    }
  }

  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.VIRTUAL,
    password_hash: DataTypes.STRING,
    avatar_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  // Criptografar senha antes de salvar
  User.addHook('beforeSave', async (user) => {
    if (user.password) {
      user.password_hash = await bcrypt.hash(user.password, 8);
    }
  });

  return User;
};