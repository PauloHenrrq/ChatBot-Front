import { DataTypes } from 'sequelize'
import DBConnection from '../database/database.js'

const Enterprise = DBConnection.define('Enterprise', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  corporative_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  corporative_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  CNPJ: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
})
