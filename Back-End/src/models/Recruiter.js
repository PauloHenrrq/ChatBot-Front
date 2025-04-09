import { DataTypes } from 'sequelize'
import DBConnection from '../database/database.js'
import Candidate from './Candidate.js'

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
  recruiter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Candidate,
      key: 'id'
    }
  }
})

Candidate.hasMany(Recruiter, { foreignKey: 'recruiter_id' })
Recruiter.belongsTo(Candidate, { foreignKey: 'recruiter_id' })

export default Recruiter