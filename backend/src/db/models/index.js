import config from '@src/configs/app.config'
import databaseOptions from '@src/configs/database.config'
import { Logger } from '@src/libs/logger'
import { readdirSync } from 'fs'
import path, { basename as _basename } from 'path'
import Sequelize from 'sequelize'

const basename = _basename(__filename)
const env = config.get('env')
const dbConfig = require('@src/configs/database.config')[env]


const db = {}
let sequelize
if (databaseOptions) {
  sequelize = new Sequelize({
    ...databaseOptions, logging: (sql) => Logger.info(`Database Query Executed - ${sql}`)
  })
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  )
}

readdirSync(__dirname)
  .filter((file) => (
    file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  ))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize
export default db
