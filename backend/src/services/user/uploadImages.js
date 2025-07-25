import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { s3FileUpload } from '@src/utils/s3.utils'
import { SUCCESS_MSG } from '@src/utils/success'
import { createNewEntity } from '../helper/crud'

const schema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    file: { type: 'object' }
  },
  required: []
}



export class UploadImagesHandler extends BaseHandler {
  get constraints() {
    return constraints
  }

  async run() {
    const { id, file } = this.args


    const document = await s3FileUpload(file.buffer, {
      name: file.originalname,
      mimetype: file.mimetype,
      filePathInS3Bucket: S3_FILE_PREFIX.profileImage
    })
    const savedFile = await createNewEntity({
      model: db.UserDocument,
      data: {
        userId: id,
        documentUrl: document.documentUrl,
        documentName: document.fileName,
        status: document.status,
        actionee: id,
        actionPerformedAt: new Date().getTime()
      }
    })

    return { imageSignature: savedFile, message: SUCCESS_MSG.GET_SUCCESS }

  }
}
