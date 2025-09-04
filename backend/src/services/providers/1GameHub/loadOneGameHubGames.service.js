import config from '@src/configs/app.config'
import { BaseHandler } from '@src/libs/logicBase'
import { DEFAULT_CATEGORIES } from '@src/utils/constants/casinoManagement.constants'
import { AGGREGATORS } from '@src/utils/constants/casinoManagement.constants'
import axios from 'axios'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'

export class LoadOneGameHubGamesHandler extends BaseHandler {
  async run () {
    const transaction = this.context.sequelizeTransaction

    try {
      // Create/find 1GameHub aggregator
      const aggregator = await this.createAggregator(AGGREGATORS.ONEGAMEHUB.id, AGGREGATORS.ONEGAMEHUB.name, transaction)

      // Fetch games from 1GameHub API
      const gamesData = await this.fetchGamesFromOneGameHub()

      // Create providers and get provider mappings
      const providerIdsMap = await this.createProviders(aggregator.id, gamesData, transaction)

      // Create categories
      const categoryIdsMap = await this.createCategories(transaction)

      // Create/update games
      await this.createGames(categoryIdsMap, providerIdsMap, gamesData, transaction)

      return { success: true, message: '1GameHub games synchronized successfully' }
    } catch (error) {
      console.error('Error syncing 1GameHub games:', error.message)
      throw new AppError(error)
    }
  }

  /**
   * Fetch games from 1GameHub available_games API
   */
  async fetchGamesFromOneGameHub() {
    const baseUrl = config.get('gameHub1.baseUrl')
    const secretToken = config.get('gameHub1.secretToken')

    if (!baseUrl || !secretToken) {
      throw new AppError(Errors.INTERNAL_SERVER_ERROR, '1GameHub configuration missing. Please check GAMEHUB1_BASE_URL and GAMEHUB1_SECRET_TOKEN in your .env file')
    }

    const url = `${baseUrl}?action=available_games&secret=${secretToken}`

    console.log('Fetching 1GameHub games from:', url)

    try {
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'User-Agent': 'DineroSweeps/1.0',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      console.log('1GameHub API Response Status:', response.status)

      if (response.data && response.data.code && response.data.code !== 'SUCCESS') {
        console.error('1GameHub API Error:', response.data)
        throw new AppError(Errors.INTERNAL_SERVER_ERROR, `1GameHub API error: ${response.data.message || 'Unknown error'}`)
      }

      // Extract games from response
      let games = []
      if (response.data?.games) {
        games = response.data.games
      } else if (Array.isArray(response.data)) {
        games = response.data
      } else {
        console.error('Unexpected 1GameHub response structure:', response.data)
        throw new AppError(Errors.INTERNAL_SERVER_ERROR, 'Invalid response structure from 1GameHub')
      }

      console.log(`Fetched ${games.length} games from 1GameHub`)
      return games

    } catch (error) {
      console.error('Error fetching games from 1GameHub:', error.message)
      if (error.response) {
        console.error('1GameHub Error Response:', error.response.data)
      }
      throw new AppError(Errors.INTERNAL_SERVER_ERROR, `Failed to fetch games from 1GameHub: ${error.message}`)
    }
  }

  /**
   * Create/find aggregator
   */
  async createAggregator(uniqueId, name, transaction) {
    const aggregatorNames = this.getNames(['EN'], name)
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
   * Create providers from games data
   */
  async createProviders(aggregatorId, games, transaction) {
    // Extract unique providers from games
    const uniqueProvidersMap = new Map()

    games.forEach(game => {
      if (game.provider && !uniqueProvidersMap.has(game.provider.id)) {
        uniqueProvidersMap.set(game.provider.id, {
          casinoAggregatorId: aggregatorId,
          uniqueId: game.provider.id,
          name: this.getNames(['EN'], game.provider.name || `Provider ${game.provider.id}`)
        })
      }
    })

    // Convert map to array
    const uniqueProviders = Array.from(uniqueProvidersMap.values())

    if (uniqueProviders.length === 0) {
      // If no providers found, create a default one
      uniqueProviders.push({
        casinoAggregatorId: aggregatorId,
        uniqueId: '1gamehub-default',
        name: this.getNames(['EN'], '1GameHub Provider')
      })
    }

    const updatedProviders = await this.context.sequelize.models.casinoProvider.bulkCreate(uniqueProviders, {
      updateOnDuplicate: ['name'],
      transaction,
      logging: true
    })

    // Create mapping
    return updatedProviders.reduce((prev, updatedProvider) => {
      prev[updatedProvider.uniqueId] = updatedProvider.id
      return prev
    }, {})
  }

  /**
   * Create categories
   */
  async createCategories(transaction) {
    const categories = DEFAULT_CATEGORIES.map(category => ({
      uniqueId: category.id.toString(),
      name: this.getNames(['EN'], category.name)
    }))

    const updatedCategories = await this.context.sequelize.models.casinoCategory.bulkCreate(categories, {
      updateOnDuplicate: ['name'],
      transaction,
      logging: true
    })

    return updatedCategories.reduce((prev, category) => {
      prev[category.name.EN] = category.id
      return prev
    }, {})
  }

  /**
   * Create/update games
   */
  async createGames(categoryIdsMap, providerIdsMap, games, transaction) {
    const gamesToCreate = games.map(game => {
      // Map category - use default if not found
      let categoryId = categoryIdsMap[game.category] || categoryIdsMap['Slots'] || 2

      // Map provider - use default if not found
      let providerId = providerIdsMap[game.provider?.id] || providerIdsMap['1gamehub-default']

      if (!providerId) {
        console.warn(`No provider found for game ${game.id}, using first available provider`)
        providerId = Object.values(providerIdsMap)[0]
      }

      return {
        casinoProviderId: providerId,
        casinoCategoryId: categoryId,
        uniqueId: game.id.toString(),
        name: this.getNames(['EN'], game.name || `Game ${game.id}`),
        wageringContribution: 0,
        devices: game.devices || ['Desktop', 'Mobile'],
        demoAvailable: game.demo || false,
        thumbnailUrl: game.thumbnail || game.image || null,
        mobileThumbnailUrl: game.mobileThumbnail || game.thumbnail || game.image || null,
        returnToPlayer: game.rtp || 0,
        isFeatured: game.featured || false,
        moreDetails: game.description || null
      }
    })

    await this.context.sequelize.models.casinoGame.bulkCreate(gamesToCreate, {
      updateOnDuplicate: ['name', 'thumbnailUrl', 'mobileThumbnailUrl', 'returnToPlayer', 'isFeatured', 'moreDetails'],
      transaction,
      logging: true
    })

    return true
  }

  /**
   * Helper to create multilingual names
   */
  getNames(languages, defaultName) {
    return languages.reduce((prev, language) => {
      prev[language] = defaultName
      return prev
    }, {})
  }
}
