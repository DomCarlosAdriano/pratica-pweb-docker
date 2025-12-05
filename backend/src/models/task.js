import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      // Futuro: Task.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Task.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Task',
  });

  return Task;
};