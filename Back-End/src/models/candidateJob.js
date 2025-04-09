import DBConnection from '../database/database.js'
import Candidate from './Candidate.js'

const candidateJob = await DBConnection.define('Candidate_job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
})
