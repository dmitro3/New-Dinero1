export class AppError extends Error {
  constructor ({ name, message, explanation, code, httpStatusCode }, innerError = null) {
    super()
    this.name = name || 'InternalServerError'
    this.message = message || 'An unexpected error occurred'
    this.explanation = explanation || ''
    this.code = code || 500
    this.httpStatusCode = httpStatusCode || 500
    this.innerError = innerError
  }
  // Method to return the error response
  toResponse () {
    return {
      statusCode: this.httpStatusCode,
      error: this.name,
      message: this.message,
      code: this.code,
      explanation: this.explanation
    }
  }
}

// Factory function to create a AppError
export const createError = (errorType, innerError = null) => {
  return new AppError(errorType, innerError)
}
