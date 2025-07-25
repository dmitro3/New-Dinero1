import multer from 'multer'
import express from 'express'

import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import DocumentController from '@src/rest-resources/controllers/document.controllers'
import { isUserAuthenticated } from '@src/rest-resources/middlewares/isUserAuthenticated'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import { getUserDocumentSchema } from '@src/json-schemas/document/getUserDocument.schema'
import { getDocumentLabelsSchema } from '@src/json-schemas/document/getDocumentLabels.schema'
import { updateUserDocumentSchema } from '@src/json-schemas/document/updateUserDocument.schema'

const upload = multer()
const args = { mergeParams: true }
const documentRouter = express.Router(args)

documentRouter.route('/get-documents').get(contextMiddleware(false), requestValidationMiddleware(getUserDocumentSchema), isUserAuthenticated, DocumentController.getUserDocument)

documentRouter.route('/get-document-label').get(contextMiddleware(false), requestValidationMiddleware(getDocumentLabelsSchema), isUserAuthenticated, DocumentController.getDocumentLabels)

documentRouter.route('/update-user-document').put(contextMiddleware(true), upload.single('document'), requestValidationMiddleware(updateUserDocumentSchema), isUserAuthenticated, DocumentController.updateUserDocument)

export { documentRouter }
