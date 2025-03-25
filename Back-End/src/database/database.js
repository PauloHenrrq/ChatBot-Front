import { Sequelize } from 'sequelize'

DBConnection = new Sequelize('Chat_bot', 'root', null, {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  logging: false
})

const testConnection = async() => {
    try {
        await DBConnection.authenticate()
        console.log("Database connected sucessfully")
    } catch (error) {
        console.log("Database Connection Error", error)
    }
}

testConnection()

export default DBConnection