import config from '@src/configs/app.config'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { Logger } from '@src/libs/logger'
import { BaseHandler } from '@src/libs/logicBase'
import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'

export class SubmitKycToCoinflowService extends BaseHandler {
    async run() {
        const { userId } = this.args

        try {
            // 1. Fetch KYC data from your local database
            // const kycData =  await getKycDataFromDb(userId) {
            //     // Replace with actual DB call
            //     return {
            //       email: 'user@example.com', // take this from where user berify there email,
            //       country: 'us',
            //       idType: 'PASSPORT',ID_CARD, PASSPORT, DRIVERS, RESIDENCE_PERMIT
            //       idFrontPath: '/app/uploads/kyc/id-front-user1.jpg',
            //       idBackPath: '/app/uploads/kyc/id-back-user1.jpg', // optional
            //     }
            //   }

            // also check here kyc is verified or not if not then send error 
            // also check if document is selected is right 'PASSPORT',ID_CARD, PASSPORT, DRIVERS, RESIDENCE_PERMIT

            if (!kycData) {
                throw new AppError(Errors.NOT_FOUND, 'No KYC data found for user')
            }

            // 2. Prepare form data for Coinflow
            const form = new FormData()
            form.append('email', kycData.email)
            form.append('country', kycData.country)
            form.append('idType', kycData.idType) // Must be one of: ID_CARD, PASSPORT, DRIVERS, RESIDENCE_PERMIT
            form.append('merchantId', config.get('coinFlow.merchantId'))

            // Ensure files exist and paths are correct
            form.append('idFront', fs.createReadStream(path.resolve(kycData.idFrontPath)))
            if (kycData.idBackPath) {
                form.append('idBack', fs.createReadStream(path.resolve(kycData.idBackPath)))
            }

            // 3. Make POST request to Coinflow
            const response = await axios.post(
                'https://api-sandbox.coinflow.cash/api/withdraw/kyc-doc',
                form,
                {
                    headers: {
                        ...form.getHeaders(),
                        'Authorization': config.get('coinFlow.apiKey'),
                        'x-coinflow-auth-user-id': userId,
                    },
                }
            )

            return {
                success: true,
                status: response.status,
                data: response.data
            }

        } catch (error) {
            Logger.error('Error in SubmitKycToCoinflowService', { exception: error })

            if (error.response) {
                const { status, data } = error.response
                if (status === 401) {
                    throw new AppError(Errors.UNAUTHORIZED, 'Unauthorized access to Coinflow')
                }
                throw new AppError(Errors.INTERNAL_SERVER_ERROR, data?.message || 'Coinflow KYC upload failed', status)
            }

            throw new AppError(Errors.INTERNAL_ERROR)
        }
    }
}
