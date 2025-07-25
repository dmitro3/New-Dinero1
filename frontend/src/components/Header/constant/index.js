import {
  affiliate,
  // affiliate,
  coins,
  logout,
  notice,
  profile,
  setting,
  share,
  transactions,
  usd,
  vip,
} from '@/assets/svg';

export const PROFILE_ITEMS = [
  {
    label: 'myInfo',
    title: 'My Info',
    value: 'myAccount',
    icon: profile,
    button: true,
  },
  {
    icon: setting,
    label: 'settings',
    value: 'setting',
  },
  {
    label: 'notice',
    icon: notice,
    value: 'notice',
    button: true,
  },
  {
    icon: vip,
    label: 'VIP',
    value: 'vip',
    button: true,
  },
  {
    icon: affiliate,
    label: 'Affiliate',
    value: 'affiliate',
  },
  {
    icon: transactions,
    label: 'transactions',
    value: 'transactions',
    // button: true,
  },
  {
    icon: share,
    label: 'Share',
    value: 'share',
    button: true,
  },
  {
    icon: logout,
    label: 'logout',
    value: 'logout',
    button: true,
  },
];

export const CURRENCY = [
  {
    label: 'GC',
    icon: coins,
    value: 'gold',
  },
  {
    label: 'SC',
    icon: usd,
    value: 'sc',
  },
];
