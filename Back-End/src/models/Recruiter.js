import { DataTypes } from 'sequelize'
import DBConnection from '../database/database'
import Enterprise from './Enterprise.js'

const Recruiter = DBConnection.define('Recruiter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  enterprise_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Enterprise,
      key: 'id'
    }
  }
})

Enterprise.hasMany(Recruiter)
Recruiter.belongsTo(Enterprise)

export default Recruiter