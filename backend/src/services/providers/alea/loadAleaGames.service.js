import { AppError } from '@src/errors/app.error'
import { BaseHandler } from '@src/libs/logicBase'
import { DEFAULT_CATEGORIES } from '@src/utils/constants/casinoManagement.constants'
import { AGGREGATORS } from '@src/utils/constants/constants'

export class LoadAleaGamesHandler extends BaseHandler {
  async run () {
    /** @type {Language[]} */
    const languages = this.args.languages
    const data = this.args.data
    const transaction = this.context.sequelizeTransaction

    try {
      const aggregator = await this.createAggregator(AGGREGATORS.ALEA.id, AGGREGATORS.ALEA.name, languages, transaction)
      const providerIdsMap = await this.createProviders(aggregator.id, data, languages, transaction)

      const categories = DEFAULT_CATEGORIES.map(category => {
        return {
          uniqueId: category.id,
          name: this.getNames(languages, category.name)
        }
      })
      const updatedCategories = await this.context.sequelize.models.casinoCategory.bulkCreate(categories, {
        updateOnDuplicate: ['name'],
        transaction,
        logging: true
      })

      const categoryMap = updatedCategories.reduce((map, category) => {
        const names = category.name
        console.log(names)
        map[names.EN] = category.id // Map the English name to the category id
        return map
      }, {})

      await this.createGames(categoryMap, providerIdsMap, data, languages, transaction)

      return { success: true }
    } catch (error) {
      throw new AppError(error)
    }
  }

  /**
     * @param {Language[]} languages
     * @param {string} defaultName
     */
  getNames(languages, defaultName) {
    return languages.reduce((prev, language) => {
      prev[language.code] = defaultName
      return prev
    }, {})
  }

  /**
     * @param {string} uniqueId
     * @param {string} name
     * @param {Language[]} languages
     * @param {import ('sequelize').Transaction} transaction
     * @returns {{ id: string }}
     */
  async createAggregator(uniqueId, name, languages, transaction) {
    const aggregatorNames = this.getNames(languages, name)
    const [aggregator] = await this.context.sequelize.models.casinoAggregator.findOrCreate({
      defaults: { name: aggregatorNames, uniqueId },
      where: { uniqueId },
      returning: ['id'],
      transaction,
      logging: true
    })

    return aggregator
  }

  /**
     * @param {string} aggregatorId
     * @param {{ id: number, name: string, logo: string, category: number }[]} providers
     * @param {Language[]} languages
     * @param {import ('sequelize').Transaction} transaction
     * @returns {Object.<string, string>}
     */
  async createProviders(aggregatorId, providers, languages, transaction) {
    // Create a map to filter out duplicates based on provider.software.id
    const uniqueProvidersMap = new Map()

    providers.forEach(provider => {
      if (!uniqueProvidersMap.has(provider.software.id)) {
        uniqueProvidersMap.set(provider.software.id, {
          casinoAggregatorId: aggregatorId,
          uniqueId: provider.software.id,
          name: this.getNames(languages, provider.software.name)
          // iconUrl: provider.image
        })
      }
    })

    // Convert the map values back to an array for bulkCreate
    const uniqueProviders = Array.from(uniqueProvidersMap.values())
    const updatedProviders = await this.context.sequelize.models.casinoProvider.bulkCreate(uniqueProviders, {
      updateOnDuplicate: ['name', 'iconUrl'],
      transaction,
      logging: true
    })

    // Reduce the result to map uniqueId to the corresponding id
    return updatedProviders.reduce((prev, updatedProvider) => {
      prev[updatedProvider.uniqueId] = updatedProvider.id
      return prev
    }, {})
  }

  /**
     * @param {typeof DEFAULT_CATEGORIES[string]} categories
     * @param {Language[]} languages
     * @param {import ('sequelize').Transaction} transaction
     * @returns {Object.<string, string>}
     */
  async createCategories(categories, languages, transaction) {
    const updatedCategories = await this.context.sequelize.models.casinoCategory.bulkCreate(categories.map(category => {
      return {
        uniqueId: category.id,
        name: this.getNames(languages, category.name)
      }
    }), {
      returning: ['id', 'uniqueId'],
      updateOnDuplicate: ['updatedAt'],
      transaction,
      logging: true
    })

    return updatedCategories.reduce((prev, category) => {
      prev[category.uniqueId] = category.id
      return prev
    }, {})
  }

  /**
     * @param {Object.<string, string>} categoryIdsMap
     * @param {Object.<string, string>} providerIdsMap
     * @param {{ id: string, name: string, basicRTP: number, device: string, typeId: string, providerId: string, img_provider: string, img: string, demo: boolean }[]} games
     * @param {Language[]} languages
     * @param {import ('sequelize').Transaction} transaction
     * @returns {Boolean}
     */
  async createGames(categoryIdsMap, providerIdsMap, games, languages, transaction) {
    await this.context.sequelize.models.casinoGame.bulkCreate(games.reduce((prev, game) => {
      const providerId = providerIdsMap[game.software.id]
      if (!providerId) return prev
      const categoryId = categoryIdsMap[game.genre] ? categoryIdsMap[game.genre] : 1

      prev.push({
        casinoProviderId: providerId,
        casinoCategoryId: categoryId,
        uniqueId: game.id,
        name: this.getNames(languages, game.name),
        wageringContribution: 0,
        iconUrl: game.assetsLink,
        devices: 'Desktop',
        demoAvailable: game.demoAvailable
      })
      return prev
    }, []), {
      updateOnDuplicate: ['name', 'iconUrl'],
      transaction,
      logging: true
    })

    return true
  }
}
