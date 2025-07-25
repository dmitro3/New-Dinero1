
import { AppError, createError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import RequestInputValidationError from '@src/errors/requestInputValidation.error'

/**
 *
 * @memberof Rest Middleware
 * @export
 * @name errorHandlerMiddleware
 * @param {*} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const errorHandlerMiddleware = (err, req, res, next) => {
  let formatedError = err
  // Handle any other errors
  if (!(err instanceof AppError)) {
    formatedError = createError(Errors.INTERNAL_ERROR, err)
  }

  if ((err instanceof RequestInputValidationError)) {
    formatedError = createError({ ...Errors.REQUEST_VALIDATION_ERROR, explanation: err.context }, err)
  }

  req?.context?.logger.error({ err }, `${err.name || Errors.INTERNAL_ERROR} + In ${req.path}`)

  // Send the formatted error response
  res.status(formatedError.httpStatusCode || 500).send({ data: {}, errors: formatedError.toResponse() })
}
