import BaseError from './base.error'
import { Errors } from './errorCodes'

export default class InvalidSocketArgumentError extends BaseError {
  constructor(fields = {}) {
    super(Errors.REQUEST_INPUT_VALIDATION_ERROR)
    this.fields = fields
  }
}
