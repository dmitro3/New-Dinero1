import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { SUCCESS_MSG } from '@src/utils/success'

export class GetAllCountriesHandler extends BaseHandler {
   async run () {
  
      const countries = await db.Country.findAndCountAll({
        where: { status: true },
        order: [['name', 'ASC']],
        attributes: ['name', 'countryId', 'code']
      })

      if (!countries) throw new AppError(Errors.COUNTRY_NOT_FOUND)

      return { countries, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
