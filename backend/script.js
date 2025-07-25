const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const servicesPath = 'src/services/'
const serviceFolders = fs.readdirSync(servicesPath)


function replaceErrorType (filePath) {
  let fileContent = fs.readFileSync(filePath).toString()
  if (fileContent.includes('return this.addError(')) {
    const regex = /return this\.addError\(([^)]+)\)/g
    const errorStringsItr = fileContent.matchAll(regex);
    // const errorStringsItr = fileContent.matchAll('return this.addError([^\n]+)')
    for (const errorString of errorStringsItr) {
      const errorThrowString = errorString[0]
      const errMessage = errorString[1]
      const baseErrorType = errMessage.replace(/'/g, '').replace(/ErrorType$/, '') // Remove "ErrorType" suffix
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2') // Add underscores before capital letters
        .toUpperCase(); // Convert to uppercase

      // Log the result in the correct format, ensuring no quotes around the constant
      if (!fileContent.includes(`import { AppError } from "@src/errors/app.error"`)) {
        fileContent = `import { AppError } from "@src/errors/app.error"\n` + fileContent;
      }
      if (!fileContent.includes(`import { Errors } from "@src/errors/errorCodes"\n`)) {
        fileContent = `import { Errors } from "@src/errors/errorCodes"\n` + fileContent;
      }
      fileContent = fileContent.replaceAll(errorThrowString, `throw new AppError(Errors.${baseErrorType.replace(/'/g, '')})`)
    }
    fs.writeFileSync(path.join(filePath), fileContent)
    console.log('>>>>>>>>>> done', filePath)
  }
}

serviceFolders.forEach(serviceFolder => {
  const services = fs.readdirSync(path.join(servicesPath, serviceFolder))
  services.forEach(service => {
    const servicePath = path.join(servicesPath, serviceFolder, service)
    const meta = fs.statSync(servicePath)
    if (meta.isFile()) {
      replaceErrorType(servicePath)
    } else if (meta.isDirectory()) {
      const internalServices = fs.readdirSync(servicePath)
      internalServices.forEach(internalService => {
        replaceErrorType(path.join(servicesPath, serviceFolder, service, internalService))
      })
    }
  })
})

/**
 * @param {string} content
 */
function replaceImport (content) {
  return content.replaceAll('import { APIError } from \'@src/errors/api.error\'', 'import { messages } from \'@src/utils/constants/error.constants\'\nimport { ServiceError } from \'@src/errors/service.error\'')
}

// /**
//  * @param {string} content
//  */
// function replaceThrow(content) {
//   return content.replaceAll('this.addError(' / InvalidDocumentLabelIdErrorType / ')', 'this.addError(' / InvalidDocumentLabelIdErrorType / ')')
// }

// function replaceServiceError(filePath) {
//   const fileContent = replaceThrow(fs.readFileSync(filePath).toString())
//   fs.writeFileSync(filePath, fileContent)
//   console.log('Done>>>>>', filePath)
// }


console.log(async () => [a, b, c])
const { StatusCodes } = require('http-status-codes')

// common errors for all the backend services
const errors = {
 
}

// const fs = require('fs')
// Function to transform the object to the desired format
function convertErrorTypeToConstant (errorType) {
  const constantName = errorType.name
    .replace(/ErrorType$/, '') // Remove "ErrorType" suffix
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2') // Add underscores before capital letters
    .toUpperCase(); // Convert to uppercase

  customErros[constantName] = {
    name: errorType.name,
    message: errorType.description,
    explanation: 'An unexpected error occurred while processing your request. Please try again later.',
    code: errorType.errorCode,
    httpStatusCode: errorType.statusCode
  }
  return
}
const customErros = {}
for (const [key, errorType] of Object.entries(errors)) {
  console.log(convertErrorTypeToConstant(errors[key]))
}
console.log(customErros)
// const jsObjectString = const customErrors = ${JSON.stringify(customErros, null, 2)};;


// fs.writeFileSync('./customErrors.js', jsObjectString);
