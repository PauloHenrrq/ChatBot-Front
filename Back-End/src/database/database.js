import { Sequelize } from 'sequelize'

const DBname = process.env.DB_NAME 
const DBuser = process.env.DB_USER
const DBpassword = process.env.DB_PASSWORD
const DBport = process.env.DB_PORT

const DBConnection = new Sequelize(DBname, DBuser, DBpassword, {
  host: 'localhost',
  dialect: 'mariadb',
  port: DBport,
  logging: false
})

const testConnection = async() => {
    try {
        await DBConnection.authenticate()
        console.log("Database connected sucessfully")
    } catch (error) {
        console.log("Database Connection Error |", error)
    }
}

testConnection()

export default DBConnection