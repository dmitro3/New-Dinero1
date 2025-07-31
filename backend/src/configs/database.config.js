// import { Logger } from '@src/libs/logger'
import config from './app.config'

const dbSettings = {
  database: config.get('sequelize.name'),
  replication: {
    read: [{
      username: config.get('sequelize.user'),
      password: config.get('sequelize.password'),
      host: config.get('sequelize.readHost'),
      port: config.get('sequelize.port')
    }],
    write: {
      username: config.get('sequelize.user'),
      password: config.get('sequelize.password'),
      host: config.get('sequelize.writeHost'),
      port: config.get('sequelize.port')
    }
  },
  pool: {
    max: 30,
    min: 0,
    acquire: 60000,
    idle: 5000
  },
  dialect: 'postgres',
  dialectOptions: {
    application_name: config.get('app.name'),
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  migrationStorage: 'sequelize',
  migrationStorageTableName: 'sequelize_migration_meta',
  seederStorage: 'sequelize',
  seederStorageTableName: 'sequelize_seed_meta',
  define: {
    underscored: true,
    timestamps: true
  }
}

const databaseOptions = {
  development: {
    ...dbSettings
  },
  test: {
    ...dbSettings
  },
  staging: {
    ...dbSettings
  },
  production: {
    ...dbSettings
  }
}[config.get('env')]

export default databaseOptions
