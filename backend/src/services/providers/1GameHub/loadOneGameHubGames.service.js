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
      console.log('Starting 1GameHub games synchronization...')

      // Step 1: Create/find 1GameHub aggregator
      console.log('Step 1: Creating/finding aggregator...')
      let aggregator
      try {
        aggregator = await this.createAggregator(AGGREGATORS.ONEGAMEHUB.id, AGGREGATORS.ONEGAMEHUB.name, transaction)
        console.log('Aggregator created/found:', aggregator.id)
      } catch (error) {
        console.error('Error in createAggregator:', error.message, error.stack)
        throw new AppError(Errors.INTERNAL_SERVER_ERROR, `Failed to create/find aggregator: ${error.message}`)
      }

      // Step 2: Fetch games from 1GameHub API
      console.log('Step 2: Fetching games from 1GameHub API...')
      let gamesData
      try {
        gamesData = await this.fetchGamesFromOneGameHub()
        console.log(`Fetched ${gamesData.length} games from 1GameHub`)

        // Validate games data structure
        if (!Array.isArray(gamesData)) {
          throw new AppError(Errors.INTERNAL_SERVER_ERROR, 'Games data is not an array')
        }

        // Log sample game structure for debugging
        if (gamesData.length > 0) {
          console.log('Sample game keys:', Object.keys(gamesData[0]))
          console.log('Sample game id:', gamesData[0].id)
          console.log('Sample game name:', gamesData[0].name)
        }
      } catch (error) {
        console.error('Error in fetchGamesFromOneGameHub:', error.message, error.stack)
        throw new AppError(Errors.INTERNAL_SERVER_ERROR, `Failed to fetch games: ${error.message}`)
      }

      // Step 3: Create providers and get provider mappings
      console.log('Step 3: Creating providers...')
      let providerIdsMap
      try {
        providerIdsMap = await this.createProviders(aggregator.id, gamesData, transaction)
        console.log(`Created ${Object.keys(providerIdsMap).length} providers`)
      } catch (error) {
        console.error('Error in createProviders:', error.message, error.stack)
        throw new AppError(Errors.INTERNAL_SERVER_ERROR, `Failed to create providers: ${error.message}`)
      }

      // Step 4: Create categories
      console.log('Step 4: Creating categories...')
      let categoryIdsMap
      try {
        categoryIdsMap = await this.createCategories(transaction)
        console.log(`Created ${Object.keys(categoryIdsMap).length} categories`)
      } catch (error) {
        console.error('Error in createCategories:', error.message, error.stack)
        throw new AppError(Errors.INTERNAL_SERVER_ERROR, `Failed to create categories: ${error.message}`)
      }

      // Step 5: Create/update games
      console.log('Step 5: Creating/updating games...')
      try {
        await this.createGames(categoryIdsMap, providerIdsMap, gamesData, transaction)
        console.log('Games synchronization completed successfully')
      } catch (error) {
        console.error('Error in createGames:', error.message, error.stack)
        throw new AppError(Errors.INTERNAL_SERVER_ERROR, `Failed to create games: ${error.message}`)
      }

      return { success: true, message: '1GameHub games synchronized successfully' }
    } catch (error) {
      console.error('Error syncing 1GameHub games:', error.message, error.stack)
      if (error.innerError) {
        console.error('Inner error:', error.innerError)
      }
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

    const maxRetries = 5
    let attempt = 0

    while (attempt < maxRetries) {
      try {
        const response = await axios.get(url, {
          timeout: 120000, // Increased timeout for large data (2 minutes)
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
        console.log('1GameHub response data type:', typeof response.data)
        console.log('1GameHub response data keys:', Object.keys(response.data))

        if (response.data?.games && Array.isArray(response.data.games)) {
          games = response.data.games
          console.log('Found games in response.data.games')
        } else if (Array.isArray(response.data)) {
          games = response.data
          console.log('Response data is direct array')
        } else if (typeof response.data === 'object') {
          // Try to find games array in any property
          const possibleKeys = ['games', 'data', 'result', 'items', 'list', 'response']
          for (const key of possibleKeys) {
            if (response.data[key] && Array.isArray(response.data[key])) {
              games = response.data[key]
              console.log(`Found games in response.data.${key}`)
              break
            }
          }

          // If still no games found, check if response.data itself contains game-like objects
          if (games.length === 0 && Object.keys(response.data).length > 0) {
            const firstValue = Object.values(response.data)[0]
            if (Array.isArray(firstValue) && firstValue.length > 0 && firstValue[0]?.id) {
              games = firstValue
              console.log('Found games in first object property')
            }
          }

          // Last resort: if response.data has properties that look like games
          if (games.length === 0) {
            const dataKeys = Object.keys(response.data)
            if (dataKeys.length > 0 && response.data[dataKeys[0]]?.id) {
              games = [response.data]
              console.log('Treating response.data as single game object')
            }
          }
        }

        if (games.length === 0) {
          console.error('Could not extract games from response. Response structure:', {
            type: typeof response.data,
            keys: Object.keys(response.data),
            hasGames: !!response.data?.games,
            gamesType: typeof response.data?.games,
            isGamesArray: Array.isArray(response.data?.games)
          })
          throw new AppError(Errors.INTERNAL_SERVER_ERROR, 'Could not extract games data from 1GameHub response')
        }

        console.log(`Fetched ${games.length} games from 1GameHub`)

        // Validate that we have games data
        if (!Array.isArray(games) || games.length === 0) {
          throw new AppError(Errors.INTERNAL_SERVER_ERROR, 'No games data received from 1GameHub')
        }

        // Log sample without full JSON stringify to avoid memory issues
        if (games.length > 0) {
          console.log('Sample game keys:', Object.keys(games[0]))
          console.log('Sample game id:', games[0].id)
          console.log('Sample game name:', games[0].name)
        }

        return games

      } catch (error) {
        attempt++
        console.error(`Attempt ${attempt} - Error fetching games from 1GameHub:`, error.message)
        if (error.response) {
          console.error('1GameHub Error Response Status:', error.response.status)
          try {
            console.error('1GameHub Error Response Data:', JSON.stringify(error.response.data, null, 2))
          } catch (jsonError) {
            console.error('Failed to stringify error response data:', jsonError)
          }
          console.error('1GameHub Error Response Data keys:', Object.keys(error.response.data))
          console.error('1GameHub Error Response Data type:', typeof error.response.data)
          console.error('1GameHub Error Response Data has games:', !!error.response.data.games)
          // If error response has games data, use it (API might be buggy)
          if (error.response.data) {
            // Try to extract games from different possible structures
            if (error.response.data.games && Array.isArray(error.response.data.games)) {
              console.log('1GameHub returned error but with games data.games array, using it anyway')
              return error.response.data.games
            }
            if (Array.isArray(error.response.data)) {
              console.log('1GameHub returned error but with games array, using it anyway')
              return error.response.data
            }
            // If data is object with nested games array
            for (const key in error.response.data) {
              if (Array.isArray(error.response.data[key])) {
                console.log(`1GameHub returned error but with games array in key '${key}', using it anyway`)
                return error.response.data[key]
              }
            }
            // If data itself is an object but not array, try to convert to array
            if (typeof error.response.data === 'object') {
              console.log('1GameHub returned error with object data, converting to array')
              return [error.response.data]
            }
          }
        }
        if (attempt < maxRetries) {
          const delay = 2000 * attempt
          console.log(`Retrying after ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        } else {
          throw new AppError(Errors.INTERNAL_SERVER_ERROR, `Failed to fetch games from 1GameHub after ${maxRetries} attempts: ${error.message}`)
        }
      }
    }
  }

  /**
   * Create/find aggregator
   */
  async createAggregator(id, name, transaction) {
    const aggregatorNames = this.getNames(['EN'], name)
    const aggregatorId = parseInt(id, 10)

    console.log('Creating/finding aggregator with id:', aggregatorId, 'name:', aggregatorNames)

    try {
      // First try to find existing aggregator
      let aggregator = await this.context.sequelize.models.CasinoAggregator.findOne({
        where: { id: aggregatorId },
        transaction,
        logging: true
      })

      if (aggregator) {
        console.log('Found existing aggregator:', aggregator.id, aggregator.name)
        return aggregator
      }

      // If not found, create new one
      console.log('Creating new aggregator with id:', aggregatorId)
      aggregator = await this.context.sequelize.models.CasinoAggregator.create({
        id: aggregatorId,
        name: aggregatorNames
      }, {
        transaction,
        logging: true
      })

      console.log('Created new aggregator:', aggregator.id, aggregator.name)
      return aggregator
    } catch (error) {
      console.error('Error in createAggregator:', error.message, error.stack)
      // If creation with specific id fails, try without id
      if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
        console.log('Aggregator with id', aggregatorId, 'already exists, finding it...')
        const existingAggregator = await this.context.sequelize.models.CasinoAggregator.findOne({
          where: { id: aggregatorId },
          transaction,
          logging: true
        })
        if (existingAggregator) {
          console.log('Found existing aggregator after error:', existingAggregator.id)
          return existingAggregator
        }
      }
      throw error
    }
  }

  /**
   * Create providers from games data
   */
    async createProviders(aggregatorId, games, transaction) {
      // Extract unique providers from games
      const uniqueProvidersMap = new Map()

      games.forEach(game => {
        if (game.provider) {
          const providerKey = (typeof game.provider === 'string' ? game.provider : game.provider?.id)?.toString()
          if (providerKey && !uniqueProvidersMap.has(providerKey)) {
            uniqueProvidersMap.set(providerKey, {
              gameAggregatorId: aggregatorId,  // updated foreign key column name
              uniqueId: providerKey,
              name: this.getNames(['EN'], typeof game.provider === 'string' ? game.provider : game.provider?.name || `Provider ${providerKey}`),
              isActive: true,
              thumbnailUrl: game.media?.[0]?.url || null,
              mobileThumbnailUrl: game.media?.[0]?.url || null
            })
          }
        }
      })

      // Convert map to array
      const uniqueProviders = Array.from(uniqueProvidersMap.values())

      if (uniqueProviders.length === 0) {
        // If no providers found, create a default one
        uniqueProviders.push({
          gameAggregatorId: aggregatorId,  // updated foreign key column name
          uniqueId: '999999',
          name: this.getNames(['EN'], '1GameHub Provider'),
          isActive: true,
          thumbnailUrl: null,
          mobileThumbnailUrl: null
        })
      }

      console.log(`Found ${uniqueProviders.length} unique providers to create`)
      if (uniqueProviders.length > 0) {
        console.log('Sample provider:', {
          uniqueId: uniqueProviders[0].uniqueId,
          name: uniqueProviders[0].name,
          gameAggregatorId: uniqueProviders[0].gameAggregatorId,
          thumbnailUrl: uniqueProviders[0].thumbnailUrl,
          mobileThumbnailUrl: uniqueProviders[0].mobileThumbnailUrl
        })
      }

      try {
        // Check existing providers to avoid duplicates
        const existingProviders = await this.context.sequelize.models.CasinoProvider.findAll({
          where: {
            uniqueId: Array.from(uniqueProvidersMap.keys()).map(k => k.toString())
          },
          transaction,
          logging: true
        })

        const existingUniqueIds = new Set(existingProviders.map(p => p.uniqueId))

        // Filter out providers that already exist
        const providersToCreate = uniqueProviders.filter(p => !existingUniqueIds.has(p.uniqueId))

        if (providersToCreate.length > 0) {
          await this.context.sequelize.models.CasinoProvider.bulkCreate(providersToCreate, {
            transaction,
            logging: true
          })
        }

        // Fetch all providers again to get their IDs
        const allProviders = await this.context.sequelize.models.CasinoProvider.findAll({
          where: {
            uniqueId: Array.from(uniqueProvidersMap.keys()).map(k => k.toString())
          },
          transaction,
          logging: true
        })

        // Create mapping
        return allProviders.reduce((prev, provider) => {
          prev[provider.uniqueId] = provider.id
          return prev
        }, {})
      } catch (error) {
        console.error('Error in bulkCreate for providers:', error.message, error.stack)
        throw error
      }
    }

  /**
   * Create categories
   */
  async createCategories(transaction) {
    const categories = DEFAULT_CATEGORIES.map(category => ({
      uniqueId: category.id,
      name: this.getNames(['EN'], category.name)
    }))

    const updatedCategories = await this.context.sequelize.models.CasinoCategory.bulkCreate(categories, {
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
    console.log(`Processing ${games.length} games...`)

    const batchSize = 500 // Process games in batches to avoid overwhelming the database
    const totalBatches = Math.ceil(games.length / batchSize)

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIndex = batchIndex * batchSize
      const endIndex = Math.min(startIndex + batchSize, games.length)
      const gamesBatch = games.slice(startIndex, endIndex)

      console.log(`Processing batch ${batchIndex + 1}/${totalBatches} (games ${startIndex + 1}-${endIndex})`)

      try {
        const gamesToCreate = gamesBatch.map(game => {
          // Validate game structure
          if (!game || !game.id) {
            console.warn('Invalid game structure:', game)
            return null
          }

          // Map category - use default if not found
          let categoryKey = game.categories?.[0] || game.category
          // Normalize category name to match DEFAULT_CATEGORIES casing
          if (categoryKey && typeof categoryKey === 'string') {
            // Handle hyphenated categories: split by '-', capitalize each part, join with space
            categoryKey = categoryKey.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
          }
          let categoryId = categoryIdsMap[categoryKey] || categoryIdsMap['Slots'] || Object.values(categoryIdsMap)[0]

          // Map provider - use default if not found
          let providerKey = (typeof game.provider === 'string' ? game.provider : game.provider?.id)?.toString()
          let providerId = providerIdsMap[providerKey] || providerIdsMap['999999']

          if (!providerId) {
            console.warn(`No provider found for game ${game.id}, using first available provider`)
            providerId = Object.values(providerIdsMap)[0]
          }

          const moreDetailsObj = {
            id: game.id,
            bets: game.bets || [],
            name: game.name || '',
            alias: game.alias || '',
            brand: game.brand || '',
            media: {
              icon: game.media?.icon || '',
              thumbnails: {
                '250x180': game.media?.thumbnails?.['250x180'] || '',
                '500x280': game.media?.thumbnails?.['500x280'] || '',
                '500x360': game.media?.thumbnails?.['500x360'] || '',
                '500x500': game.media?.thumbnails?.['500x500'] || ''
              }
            },
            brand_id: game.brand_id || 0,
            demo_url: game.demo_url || '',
            paylines: game.paylines || 0,
            provider: game.provider || '',
            categories: game.categories || [],
            subcategories: game.subcategories || [],
            is_demo_supported: game.is_demo_supported || false,
            is_free_rounds_supported: game.is_free_rounds_supported || false
          }

          return {
            casinoProviderId: providerId,
            casinoCategoryId: categoryId,
            casinoGameId: game.id.toString(),
            name: game.name || `Game ${game.id}`,
            wageringContribution: 0,
            devices: game.devices || ['Desktop', 'Mobile'],
            demoAvailable: game.is_demo_supported || game.demo || false,
            thumbnailUrl: game.media?.icon || game.media?.thumbnails?.['500x500'] || game.thumbnail || game.image || null,
            mobileThumbnailUrl: game.media?.thumbnails?.['250x180'] || game.mobileThumbnail || game.thumbnail || game.image || null,
            returnToPlayer: game.rtp || 0,
            isFeatured: game.featured || false,
            description: game.description || null,
            moreDetails: moreDetailsObj,
            isActive: true
          }
        }).filter(game => game !== null) // Remove invalid games

        if (gamesToCreate.length > 0) {
          await this.context.sequelize.models.CasinoGame.bulkCreate(gamesToCreate, {
            updateOnDuplicate: ['name', 'thumbnailUrl', 'mobileThumbnailUrl', 'returnToPlayer', 'isFeatured', 'description'],
            transaction,
            logging: false // Disable logging for bulk operations to reduce noise
          })
          console.log(`Successfully processed ${gamesToCreate.length} games in batch ${batchIndex + 1}`)
        } else {
          console.warn(`No valid games found in batch ${batchIndex + 1}`)
        }
      } catch (error) {
        console.error(`Error processing batch ${batchIndex + 1}:`, error.message)
        // Continue with next batch instead of failing completely
        console.log('Continuing with next batch...')
      }
    }

    console.log(`Completed processing all ${games.length} games in ${totalBatches} batches`)
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
