import { DataTypes, TINYINT } from "sequelize";
import DBConnection from "../database/database.js";
import Candidate from "./Candidate.js";

const Job = DBConnection.define('Job', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    enterprise: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    detailedDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salary: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
    },
    candidate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Candidate,
            key: 'id'
        }
    }
})

Candidate.hasMany(Job, { foreignKey: 'candidate_id' })
Job.belongsTo(Candidate, { foreignKey: 'candidate_id' })

export default Job