import db from "@src/db/models";
import { BaseHandler } from "@src/libs/logicBase";
import { filterByDate, pageValidation } from "@src/utils/common";
import { SUCCESS_MSG } from "@src/utils/success";

export class GetAllWithdrawRequestsHandler extends BaseHandler {
  async run() {
    const { limit, pageNo, status, userId, startDate, endDate, search } = this.args;

    const { page, size } = pageValidation(pageNo, limit);
    let query = { userId };

    if (status && status !== "null" && status !== "") {
      query = { ...query, status };
    }

    if (startDate || endDate) {
      query = filterByDate(query, startDate, endDate);
    }


    const withdrawRequest = await db.Withdrawal.findAndCountAll({
      attributes: ["id", "userId", "createdAt", "updatedAt", "status", "amount"],
      where: query,
      include: {
        model: db.TransactionLedger,
        as: 'withdrawalLedger'
      },
      limit: size,
      offset: (page - 1) * size,
      order: [["createdAt", "DESC"]],
    });

    const formattedData = withdrawRequest.rows.map((row) => row.get());
    return {
      data: {
        withdrawRequests: formattedData,
        totalCount: withdrawRequest.count,
        page,
        size,
      },
      message: SUCCESS_MSG.GET_SUCCESS,
    };
  }
}
