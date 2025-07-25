import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
import { pageValidation } from '@src/utils/common'
import { SUCCESS_MSG } from '@src/utils/success'

export class GetAllPackagesHandler extends BaseHandler {
  async run() {
    const { limit, pageNo } = this.args

    const { page, size } = pageValidation(pageNo, limit)
    const offset = (page - 1) * size

    const packages = await db.Package.findAndCountAll({
      where: {
        isActive: true,
        isVisibleInStore: true
      },
      order: [['id', 'ASC']],
      limit: size,
      offset
    })

    if (!packages) throw new AppError(Errors.PACKAGE_NOT_EXISTS)

    return { packages, message: SUCCESS_MSG.GET_SUCCESS }
  }
}