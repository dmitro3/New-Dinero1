import BaseError from './base.error'
import { Errors } from './errorCodes'

export default class ResponseValidationError extends BaseError {
  constructor(fields = {}) {
    super(Errors.RESPONSE_INPUT_VALIDATION_ERROR)
    this.fields = fields
  }
}
