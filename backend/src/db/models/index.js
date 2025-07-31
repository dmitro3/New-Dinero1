import config from '@src/configs/app.config'
import databaseOptions from '@src/configs/database.config'
import { Logger } from '@src/libs/logger'
import { readdirSync } from 'fs'
import path, { basename as _basename } from 'path'
import Sequelize from 'sequelize'

const basename = _basename(__filename)
const env = config.get('env')
const dbConfig = require('@src/configs/database.config')[env]

// Log database configuration
Logger.info('Database Models Initialization:', {
  env: env,
  databaseOptions: databaseOptions ? 'Loaded' : 'Not loaded',
  dbConfig: dbConfig ? 'Loaded' : 'Not loaded'
})

const db = {}
let sequelize
if (databaseOptions) {
  Logger.info('Using databaseOptions configuration')
  sequelize = new Sequelize({
    ...databaseOptions, 
    logging: false
  })
} else {
  Logger.info('Using dbConfig configuration')
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  )
}

// Log sequelize configuration
Logger.info('Sequelize Configuration:', {
  database: sequelize.config.database,
  host: sequelize.config.host,
  port: sequelize.config.port,
  username: sequelize.config.username,
  dialect: sequelize.config.dialect
})

const modelFiles = readdirSync(__dirname)
  .filter((file) => (
    file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  ))

Logger.info('Loading model files:', modelFiles)

modelFiles.forEach((file) => {
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

Logger.info('Database models loaded successfully')

export default db
