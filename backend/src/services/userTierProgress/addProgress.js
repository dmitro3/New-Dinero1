import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
import { dayjs } from '@src/libs/dayjs'
import { TRANSACTION_PURPOSE, COINS } from '@src/utils/constants/public.constants'
import { TransactionHandlerHandler } from '@src/services/wallet'



export class AddUserTierProgressHandler extends BaseHandler {

    async run() {
        const { userId, casinoGameId, ...updateFields } = this.args;
        const transaction = this.context.sequelizeTransaction

        const userDetails = await db.UserDetails.findOne({
            where: { userId },
            attributes: ['userId', 'vipTierId', 'nextVipTierId'],
            include: [
                {
                    model: db.VipTier,
                    as: 'nextVipTier',
                    // attributes: ['vipTierId', 'level', 'wageringThreshold', 'gamesPlayed', 'bigBetsThreshold', 'depositsThreshold', 'loginStreak', 'referralsCount', 'sweepstakesEntries', 'sweepstakesWins', 'timeBasedConsistency'],
                }
            ],
            transaction
        });

        if (!userDetails || !userDetails.vipTierId) {
            return { success: false, message: 'user details not found in DB or vipTierId is null' }
        }
        const { nextVipTier } = userDetails;

        // Find the current VIP tier and its level
        // const currentVipTier = await db.VipTier.findOne({
        //     where: { vipTierId: userDetails.vipTierId },
        //     attributes: ['vipTierId', 'level'],
        //     transaction
        // });

        // if (!currentVipTier) {
        //     throw new AppError(Errors.VIP_TIER_NOT_FOUND, 404);
        // }

        //  Find the next VIP tier based on the current tier level
        // const nextVipTier = await db.VipTier.findOne({
        //     where: { level: currentVipTier.level + 1 },
        //     // attributes: ['vipTierId', 'level'],
        //     transaction
        // });

        if (!nextVipTier) {
            return { success: false, message: 'Next tier not found in DB' }
        }

        // Step 4: Check if a UserTierProgress exists for the next VIP tier and user
        const userTierProgress = await db.UserTierProgress.findOne({
            where: {
                userId: userId,
                vipTierId: nextVipTier.vipTierId,
                isActive: true
            },
            transaction
        });

        if (casinoGameId) {

            const transactionCount = await db.CasinoTransaction.count({
                where: {
                    userId: userId,
                    casinoGameId: casinoGameId
                },
                transaction
            });

            // Conditional logic based on the transaction count
            // if (transactionCount === 1 || transactionCount === 0 ) {
            if (transactionCount === 1) {
                updateFields["gamesPlayed"] = 1
            }
        }
        if (updateFields?.wageringThreshold) {
            if (nextVipTier?.bigBetAmount <= updateFields.wageringThreshold) {
                updateFields["bigBetsThreshold"] = 1
            }
        }

        if (!userTierProgress) {
            // If no progress exists, create a new entry for the user
            await db.UserTierProgress.create({
                userId: userId,
                vipTierId: nextVipTier.vipTierId,
                wageringThreshold: updateFields?.wageringThreshold || 0,
                gamesPlayed: updateFields?.gamesPlayed || 0,
                bigBetsThreshold: updateFields?.bigBetsThreshold || 0,
                depositsThreshold: updateFields?.depositsThreshold || 0,
                loginStreak: updateFields?.loginStreak || 0,
                referralsCount: updateFields?.referralsCount || 0,
                // sweepstakesEntries: updateFields?.sweepstakesEntries || 0,
                // sweepstakesWins: updateFields?.sweepstakesWins || 0,
                // timeBasedConsistency: updateFields?.timeBasedConsistency || 0
            }, transaction);
            return { success: true };
        }

        // If progress exists, update the fields with new values
        let fieldsToUpdate = {};

        for (let field in updateFields) {
            if (userTierProgress.dataValues.hasOwnProperty(field)) {
                // Ensure the current value is defined and numeric (default to 0 if undefined)
                const currentValue = userTierProgress[field] || 0;

                // Increment the existing value with the value from updateFields
                fieldsToUpdate[field] = currentValue + updateFields[field];
            }
        }

        // If no matching fields to update, return a success with no changes
        if (Object.keys(fieldsToUpdate).length === 0) {
            return { success: true };
        }

        // Save the updated progress back to the database
        await db.UserTierProgress.update(fieldsToUpdate, {
            where: {
                isActive: true,
                userId: userId,
                vipTierId: userTierProgress.vipTierId,
            },
            transaction
        });

        // Check if all conditions for the next VIP tier are met
        let allConditionsMet = true;
        // const fieldsToCheck = [
        //     'wageringThreshold', 'gamesPlayed', 'bigBetsThreshold', 'depositsThreshold',
        //     'loginStreak', 'referralsCount', 'sweepstakesEntries', 'sweepstakesWins', 'timeBasedConsistency'
        // ];
        const fieldsToCheck = [
            'wageringThreshold', 'gamesPlayed', 'bigBetsThreshold', 'depositsThreshold',
            'loginStreak', 'referralsCount'
        ];

        for (let field of fieldsToCheck) {

            const currentUserValue = userTierProgress[field] || 0;
            const updatedUserValue = fieldsToUpdate[field] !== undefined ? fieldsToUpdate[field] : currentUserValue;
            const requiredValue = nextVipTier[field];
            if (updatedUserValue < requiredValue) {
                allConditionsMet = false;
                break;
            }

        }

        if (nextVipTier.timeBasedConsistency) {
            // Calculate the number of days the user has been in the current VIP tier
            const createdAt = userTierProgress.createdAt;
            const daysInCurrentTier = dayjs().diff(dayjs(createdAt), 'day'); // Calculate difference in days
            // Check if the user has been in the tier long enough
            if (daysInCurrentTier > nextVipTier.timeBasedConsistency) {
                // also here we have to add function which drecreases user cureent tier to old tier
                let currentNewTierLevel = nextVipTier.level;
                let newNextTierLevel = nextVipTier.level - 1;
                let newCurrentTierLevel = newNextTierLevel - 1;
                let currentTierLevel = nextVipTier.level - 1;
                let newVipTierId = userDetails.vipTierId
                let currentVipTierId = null

                if (currentTierLevel === 0) {
                    newCurrentTierLevel = currentTierLevel
                    newNextTierLevel = currentNewTierLevel

                    currentVipTierId = userDetails.vipTierId
                    newVipTierId = nextVipTier.vipTierId
                }

                if (!currentVipTierId) {

                    const newCurrentTier = await db.VipTier.findOne({
                        where: { level: newCurrentTierLevel },
                        attributes: ['vipTierId', 'level'],
                        transaction
                    });

                    if (!newCurrentTier) {
                        // Handle case where the calculated tier level doesn't exist
                        // For example, if level goes below 1, we can skip the downgrade or handle appropriately
                        return { success: false, message: 'Unable to downgrade tier: invalid tier level' };
                    }

                    currentVipTierId = newCurrentTier.vipTierId

                }

                // Update userTierProgress to mark the current tier as inactive
                const updateUserTierProgressPromise = db.UserTierProgress.update({ isActive: false }, {
                    where: {
                        userId: userId,
                        vipTierId: userTierProgress.vipTierId,
                        isActive: true
                    },
                    transaction
                });

                const createNewUserTierProgressPromise = db.UserTierProgress.create({
                    userId: userId,
                    vipTierId: newVipTierId,
                    wageringThreshold: 0,
                    gamesPlayed: 0,
                    bigBetsThreshold: 0,
                    depositsThreshold: 0,
                    loginStreak: 0,
                    referralsCount: 0,
                    isActive: true, // The new progress is active
                }, transaction);

                const updateUserDetailsPromise = db.UserDetails.update(
                    {
                        vipTierId: currentVipTierId,
                        nextVipTierId: newVipTierId,
                    },
                    { where: { userId }, transaction }
                );

                // Execute all promises concurrently using Promise.all
                await Promise.all([updateUserTierProgressPromise, createNewUserTierProgressPromise, updateUserDetailsPromise]);

                allConditionsMet = false; // User hasn't been in the tier for the required days
            }
        }


        if (allConditionsMet) {
            const nextUpgradedVipTier = await db.VipTier.findOne({
                where: { level: nextVipTier.level + 1 },
                attributes: ['vipTierId', 'level'],
                transaction
            });
            // if (!nextUpgradedVipTier) {
            //     return { success: false };
            // }
            const getNewCurrentTierRwards = await db.Reward.findOne({
                where: { vipTierId: nextVipTier.vipTierId, isActive: true },
                attributes: ['vipTierId', 'cashBonus'],
                transaction
            });
            if (!getNewCurrentTierRwards) {
                return { success: false };
            }

            const updateUserTierPromise = db.UserDetails.update(
                { vipTierId: nextVipTier.vipTierId, nextVipTierId: (nextUpgradedVipTier?.vipTierId || nextVipTier.vipTierId) },
                { where: { userId } },
                transaction
            );
            const deactivateCurrentTierProgressPromise = db.UserTierProgress.update({ isActive: false }, {
                where: {
                    isActive: true,
                    userId: userId, // Target the specific user
                    vipTierId: userTierProgress.vipTierId // Ensure it's for the correct VIP tier
                },
                transaction // Include the transaction here if using one
            });
            const createNewUserTierProgressPromise = db.UserTierProgress.create({
                userId: userId,
                vipTierId: (nextUpgradedVipTier?.vipTierId || nextVipTier.vipTierId),
                wageringThreshold: 0,
                gamesPlayed: 0,
                bigBetsThreshold: 0,
                depositsThreshold: 0,
                loginStreak: 0,
                referralsCount: 0,
                isActive: true, // The new progress is active
            }, transaction);

            await Promise.all([
                updateUserTierPromise,
                deactivateCurrentTierProgressPromise,
                createNewUserTierProgressPromise,
                TransactionHandlerHandler.execute({ userId, amount: getNewCurrentTierRwards.cashBonus, currencyCode: COINS.SWEEP_COIN.BONUS_SWEEP_COIN, purpose: TRANSACTION_PURPOSE.BONUS_TIER }, this.context)

            ]);
        }

        return { success: true };
    }
}