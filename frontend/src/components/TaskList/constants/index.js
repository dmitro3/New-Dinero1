export const options = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Achived',
    value: 'claimed',
  },
];

export const activeTaskList = [
  {
    id: 1,
    title: 'First Buy Bonus',
    gcValue: 50000,
    treasureChest: null,
    scValue: 5,
    missionTarget: [
      {
        text: null,
      },
      {
        list: [
          {
            id: 100,
            point: 'Purchases of more than $10',
          },
          {
            id: 101,
            point: 'Complete KYC verification',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Set Up 2FA',
    gcValue: null,
    treasureChest: null,
    scValue: 0.02,
    missionTarget: [
      {
        text: 'Go to the Settings page, switch to the Two Factor TAB and scan the QR code with Google Validator Settings 2FA',
      },
      {
        list: [],
      },
    ],
  },
  {
    id: 3,
    title: 'Follow Twitter',
    gcValue: null,
    treasureChest: null,
    scValue: 0.02,
    missionTarget: [
      {
        text: 'Follow dinerosweepsofficial twitter, get the latest news and grab the bonus drop in time',
      },
      {
        list: [],
      },
    ],
  },
];
export const claimedTaskList = [
  {
    id: 4,
    title: 'Join Telegram Channel',
    gcValue: null,
    treasureChest: null,
    scValue: 0.02,
    missionTarget: [
      {
        text: 'Join the dinerosweepstelegram channel, and get the bonus drop just in time!',
      },
      {
        list: [],
      },
    ],
  },
];

export const labelMapping = {
  wageringThreshold: {
    label: 'Wager Threshold',
    generateTask: (value) => `Reach a wagering threshold of ${value}`,
  },
  gamesPlayed: {
    label: 'Games Played',
    generateTask: (value) => `Play ${value} games`,
  },
  bigBetsThreshold: {
    label: 'Big Bets Threshold',
    generateTask: (value) => `Place ${value} big bets`,
  },
  bigBetAmount: {
    label: 'Big Bet Amount',
    generateTask: (value) => `Place a bet of ${value} or more`,
  },
  depositsThreshold: {
    label: 'Deposits Threshold',
    generateTask: (value) => `Deposit at least ${value}`,
  },
  loginStreak: {
    label: 'Login Streak',
    generateTask: (value) => `Log in for ${value} consecutive days`,
  },
  referralsCount: {
    label: 'Referrals Count',
    generateTask: (value) => `Refer ${value} new users`,
  },
  sweepstakesEntries: {
    label: 'Sweepstakes Entries',
    generateTask: (value) => `Earn ${value} sweepstakes entries`,
  },
  sweepstakesWins: {
    label: 'Sweepstakes Wins',
    generateTask: (value) => `Win ${value} sweepstakes prizes`,
  },
  timeBasedConsistency: {
    label: 'Time-Based Consistency',
    generateTask: (value) => `Maintain consistency for ${value} time periods`,
  },
};

