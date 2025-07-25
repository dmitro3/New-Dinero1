import { vipBanner } from '@/assets/png';

export const banners = [
  {
    id: 1,
    imageUrl: vipBanner,
    alt: 'image-1',
  },
];
export const PROGRESS_FIELDS = [
  { name: 'Big Bet Amount', value: 'bigBetsThreshold' },
  // { name: 'Big Bet Amount', value: 'bigBetAmount' },
  { name: 'Total Deposit Amount', value: 'depositsThreshold' },
  { name: 'Games Played', value: 'gamesPlayed' },
  { name: 'Login Streak', value: 'loginStreak' },
  { name: 'Referrals Count', value: 'referralsCount' },
  // { name: 'Sweepstakes Entries', value: 'sweepstakesEntries' },
  // { name: 'Sweepstakes Wins', value: 'sweepstakesWins' },
  // { name: 'Time-Based Consistency', value: 'timeBasedConsistency' },
  { name: 'Minimum Spend Amount', value: 'wageringThreshold' },
];
export const REWARDS = [
  { name: 'Cash Bonus', value: 'cashBonus' },
  // { name: 'Free Spins', value: 'freeSpin' },
  { name: 'Rackback', value: 'rackback' },
];
