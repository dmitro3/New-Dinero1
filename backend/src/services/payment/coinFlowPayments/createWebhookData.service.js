import db from '@src/db/models';
import { AppError } from '@src/errors/app.error';
import { Errors } from '@src/errors/errorCodes';
import { dayjs } from '@src/libs/dayjs';
import { Logger } from '@src/libs/logger';
import { BaseHandler } from '@src/libs/logicBase';

export class CreateWebhookDataService extends BaseHandler {
  async run () {
    try {
      const { userId, packageId, paymentType } = this.args;

      const userLimit = await db.Limit.findOne({ where: { userId } });
      if (userLimit) {
        const { isSelfExclusionPermanent, selfExclusionEndAt } = userLimit;
        const isValidDate = selfExclusionEndAt && dayjs(selfExclusionEndAt).isValid();
        if (isSelfExclusionPermanent || (isValidDate && dayjs().isBefore(dayjs(selfExclusionEndAt)))) {
          return Errors.SELF_EXCLUSION_ACTIVE;
        }
      }

      const packageDetails = await db.Package.findOne({
        where: { id: packageId, isActive: true },
        attributes: ['id', 'amount']
      });

      if (!packageDetails) throw new AppError(Errors.PACKAGE_NOT_FOUND);

      const orderId = `DINERO-${userId}-${packageDetails.id}-${dayjs().valueOf()}-${Math.random().toString().substring(2, 8)}`;

      await db.ApprovelyPaymentOrder.create({
        userId,
        orderId,
        paymentType,
        status: 'pending',
      });

      const webhookData = {
        userId,
        orderId,
        paymentType,
        packageId: packageDetails.id
      };

      return {
        success: true,
        data: webhookData,
        message: 'Webhook data created successfully',
      };

    } catch (error) {
      Logger.error('Error in CreateWebhookDataService', { exception: error });
      throw new AppError(Errors.INTERNAL_ERROR);
    }
  }
}
