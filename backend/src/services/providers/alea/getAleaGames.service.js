import { aleaCasinoConfig } from '@src/configs/casinoproviders/alea.config'
import { BaseHandler } from '@src/libs/logicBase'
import axios from 'axios'
import { config } from 'dotenv'
import { LoadAleaGamesHandler } from './loadAleaGames.service'

export class AleaGetPagesHandler extends BaseHandler {
  async run() {
    const languages = this.args.languages
    const env = config.env !== 'production' ? 'gamesAvailable' : 'gamesReady'
    const queryPageDetails = JSON.stringify({
      query: `{
        ${env}(jurisdictionCode: "CAO", size: 500) {
          page {
            number
            size
            totalPages
            totalElements
          }
        }
      }`,
      variables: {}
    })

    const options = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://customer-api.aleaplay.com/api/graphql',
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJHYW1tYXN3ZWVwLTE1MV8xNzI4MDM0Mzc1IiwiaWF0IjoxNzI4MDM0Mzc1LCJleHAiOjIzNTg4MzQzNzUsImlzR2F0ZXdheSI6dHJ1ZSwiZG9tYWluIjoiaHR0cDovLzEwMy4yNDkuNDAuNTAvY2FsbGJhY2svdjEvYWxlYSIsInR5cGUiOiJURVNUIiwidmVyc2lvbiI6InYyIiwib3BlcmF0b3IiOjE1MX0.YGY8k34Wd0ED4o10M5o6GkE0UaPQx_yrnut06UiidbmhqBJ0d8FcerNT6Ec-vJkbjwpqhC-L8_vul691DZPq-g', // Replace with the actual token
        'Alea-CasinoId': aleaCasinoConfig.casinoId,
        'Content-Type': 'application/json'
      },
      data: queryPageDetails
    }
    // Fetching initial page details
    const { data: { data: pageData }, status } = await axios(options)
    if (status !== 200 || !pageData) {
      return this.addError('ThirdPartyApiErrorType')
    }

    const pageDetails = env === 'gamesAvailable' ? pageData.gamesAvailable.page : pageData.gamesReady.page
    const totalPages = pageDetails.totalPages
    const data = []

    // Fetching game data for all pages
    for (let i = 0; i < totalPages; i++) {
      const queryGames = JSON.stringify({
        query: `{
            ${env}(jurisdictionCode: "CAO", size: 500, page: ${i}) {
              results {
                id
                name
                software {
                  id
                  name
                }
                type
                status
                genre
                jackpot
                freeSpinsCurrencies
                ratio
                rtp
                volatility
                minBet
                maxBet
                maxExposure
                maxWinMultiplier
                lines
                hitFrequency
                buyFeature
                releaseDate
                features
                assetsLink
                thumbnailLinks
                demoAvailable
              }
            }
          }`,
        variables: {}
      })

      const pageOptions = {
        ...options,
        data: queryGames
      }

      try {
        const { data: { data: gamesData }, status: gameStatus } = await axios(pageOptions)
        if (gameStatus === 200) {
          const results = env === 'gamesAvailable' ? gamesData.gamesAvailable.results : gamesData.gamesReady.results
          data.push(...results)
        } else {
          console.error(`Error fetching page ${i}`)
        }
      } catch (error) {
        console.error(`Error while getting games for page ${i}:`, error)
      }
    }

    await LoadAleaGamesHandler.execute({ data, languages }, this.context)

    return {
      success: true
    }
  }
}
