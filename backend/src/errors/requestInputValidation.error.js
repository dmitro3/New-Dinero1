import { Errors } from '@src/errors/errorCodes'
import BaseError from './base.error'

export default class RequestInputValidationError extends BaseError {
  constructor (fields = {}) {
    super(Errors.REQUEST_INPUT_VALIDATION_ERROR)
    this.context = fields
  }
}
