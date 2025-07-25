import { vipIcon } from '@/assets/png';
import { coins, usd } from '@/assets/svg';

export const options = [
  {
    label: 'Progress',
    value: 'progress',
  },
  // {
  //   label: 'Bonus',
  //   value: 'bonus',
  // },
  // {
  //   label: 'Rakeback',
  //   value: 'rakeback',
  // },
];

export const bonusData = [
  { id: 1, title: 'Welcome Vip Bonus', operation: 'Claim' },
  { id: 2, title: 'Level 4 Up Bonus', operation: 'Claim' },
  { id: 3, title: 'Level 5 Up Bonus', operation: 'Claim' },
  { id: 4, title: 'Level 6 Up Bonus', operation: 'Claim' },
  { id: 5, title: 'Level 7 Up Bonus', operation: 'Claim' },
  { id: 6, title: 'Level 8 Up Bonus', operation: 'Claim' },
  { id: 7, title: 'Level 9 Up Bonus', operation: 'Claim' },
];
export const CurrencyList = [
  {
    id: 1,
    icon: coins,
    name: 'GC',
  },
  {
    id: 2,
    icon: usd,
    name: 'SC',
  },
];
export const VIP_REWARDS = [
  {
    id: 1,
    icon: vipIcon,
    name: 'Bronze',
    boost: '2% Weekly Boost',
    rakeback: '5% Rakeback',
    bonusSc: 10,
    bonusGc: 10,
  },
  {
    id: 2,
    icon: vipIcon,
    name: 'Silver',
    boost: '2% Weekly Boost',
    rakeback: '5% Rakeback',
    bonusSc: 10,
    bonusGc: 10,
  },
  {
    id: 3,
    icon: vipIcon,
    name: 'Gold',
    boost: '2% Weekly Boost',
    rakeback: '5% Rakeback',
    bonusSc: 10,
    bonusGc: 10,
  },
  {
    id: 4,
    icon: vipIcon,
    name: 'Platinum',
    boost: '2% Weekly Boost',
    rakeback: '5% Rakeback',
    bonusSc: 10,
    bonusGc: 10,
  },
];
