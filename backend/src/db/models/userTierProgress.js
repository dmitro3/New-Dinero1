'use strict'

module.exports = function (sequelize, DataTypes) {
  const UserTierProgress = sequelize.define(
    'UserTierProgress',
    {

      vipTierId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      wageringThreshold: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        description: 'Minimum spend amount required for this tier'

      },
      gamesPlayed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        description: 'Minimum total games played to qualify for this tier'

      },
      bigBetsThreshold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        description: 'Number of bets above a specific amount (defined in the next field)'
      },
      // bigBetAmount: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   description: 'Minimum bet amount to qualify as a big bet.'
      // },
      depositsThreshold: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        description: 'Total deposit amount required to qualify for this tier.'

      },
      loginStreak: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        description: 'Consecutive daily logins required for qualification.'

      },
      referralsCount: { // refParentId only in sign-up at the time when new user create account
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        description: 'Minimum number of referrals required to qualify.'

      },
      // sweepstakesEntries: { // every purchase we will call ( add in payment function )
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   description: 'Number of sweepstakes entries required for qualification.'

      // },
      // sweepstakesWins: { //  number of win count in  win service in call back
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   description: 'Number of sweepstakes wins required for this tier.'

      // },
      // timeBasedConsistency: { // means in how many days user need to spend some ammount (like wageringThreshold must be 1000 in 40 )
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   description: 'Minimum number of months the player needs to meet spending criteria (e.g., $1,000/month).'

      // },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        description: 'Indicates if this VIP tier is currently active.'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: 'UserTierProgress',
      tableName: 'user_tier_progress',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['userId', 'vipTierId', 'isActive']
        }
      ]
    }
  )
  UserTierProgress.associate = function (model) {
    UserTierProgress.belongsTo(model.VipTier, { foreignKey: 'vipTierId', as: 'viptire' })
    UserTierProgress.belongsTo(model.User, { foreignKey: 'userId', as: 'userTierProgresses', constraints: false })
  }

  return UserTierProgress
}
