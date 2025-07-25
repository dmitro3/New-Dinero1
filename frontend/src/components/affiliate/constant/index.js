export const REF_LINK = `${process.env.NEXT_PUBLIC_APP_URL}/?ref=r_`;

export const TAB_CONTROLS = [
  { label: 'Get Start', value: 'getStart' },
  // { label: 'Funds', value: 'funds' },
  { label: 'Referred Users', value: 'referrals' },
];

export const TABLE_CONTROLS = [
  {
    label: 'Username',
    value: 'username',
  },
  {
    label: 'Registered',
    value: 'joinedAt',
  },
  {
    label: 'Wager',
    value: 'wageredAmount',
  },
  {
    label: 'Commission',
    value: 'earnedCommission',
  },
];

export const SORT_OPTIONS = [
  {
    label: 'Registered',
    value: 'createdAt',
  },
  // {
  //   label: 'Registered Asc',
  //   value: 'registeredAsc',
  // },
  // {
  //   label: 'Wager Desc',
  //   value: 'wagerDesc',
  // },
  {
    label: 'Wagered Amount',
    value: 'wageredAmount',
  },
  {
    label: 'Earned Commission',
    value: 'earnedCommission',
  },
  // {
  //   label: 'Commission Asc',
  //   value: 'commissionAsc',
  // },
];
