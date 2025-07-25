import config from '@src/configs/app.config'
import { S3Client, HeadObjectCommand, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import path from 'path'
import { dayjs } from '@src/libs/dayjs'

// Initialize S3 client with credentials and region
const s3Client = new S3Client({
  credentials: {
    accessKeyId: config.get('aws.accessKeyId'), // Access Key ID
    secretAccessKey: config.get('aws.secretAccessKey') // Secret Access Key
  },
  region: config.get('aws.region') // AWS Region
})

// Your S3 bucket name
const bucketName = config.get('aws.bucket')

/**
 * Check if a file exists in the S3 bucket.
 * @param {string} key - The key of the file in S3.
 * @returns {Promise<boolean>} - Returns true if the file exists, false otherwise.
 */
export async function checkFileExists(key) {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key
    })
    await s3Client.send(command)
    return true // File exists
  } catch (err) {
    if (err.name === 'NotFound') {
      return false // File does not exist
    }
    throw err // Some other error occurred
  }
}

/**
 * Delete a file from S3.
 * @param {string} key - The key of the file to delete.
 */
export async function deleteFileFromS3(key) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key
  })
  await s3Client.send(command)
}

/**
 * Upload a file to S3.
 * @param {Buffer} file - The file buffer.
 * @param {FileOpts} fileOpts - File options including name and path.
 * @returns {Promise<object>} - Returns the data of the uploaded file.
 */
export async function s3FileUpload(file, fileOpts) {
  try {
    // const [extension1, extension2] = fileOpts.mimetype.split('/')
    // fileOpts.name = `${fileOpts.name.toLowerCase().replaceAll(' ', '_')}_${Date.now()}.${extension2 ?? extension1}`
    fileOpts.name = `${dayjs().valueOf()}_${fileOpts.name.toLowerCase().replaceAll(' ', '_')}`
    // Define the S3 key for the file
    const s3Key = path.join(fileOpts.filePathInS3Bucket, fileOpts.name)

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: file,
      ContentType: fileOpts.mimetype,
      ACL: 'public-read', // Uncomment and set ACL if needed
    })
    const data = await s3Client.send(command)
    return { data, location: `https://${bucketName}.s3.${config.get('aws.region')}.amazonaws.com/${s3Key}` } // Return the data of the uploaded file
  } catch (error) {
    console.log(error)
    throw new Error(error.message || 'Error uploading file to S3')
  }
}
