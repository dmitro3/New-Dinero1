import { AppError } from '@src/errors/app.error'
import { BaseHandler } from '@src/libs/logicBase'
import { getGeoLocation } from 'dist/src/libs/geoLocation'

export class GetIpLocationHandler extends BaseHandler {
  async run () {
    try {
      const { countryCode } = await getGeoLocation(this.args.ipAddress)
      const country = await this.context.sequelize.models.country.findOne({ where: { code: countryCode } })
      if (!country) return this.addError('YourCountryIsNotListedErrorType')

      return country
    } catch (error) {
      throw new AppError(error)
    }
  }
}
