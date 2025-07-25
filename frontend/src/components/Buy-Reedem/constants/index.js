import {
  bchIcon,
  btcIcon,
  dogeIcon,
  ethIcon,
  ltcIcon,
  solIcon,
  trxIcon,
  usdtIcon,
  xlmIcon,
  xrpIcon,
} from '@/assets/png';
import { coins, usd } from '@/assets/svg';

export const options = [
  {
    label: 'Buy',
    value: 'buy',
  },
  {
    label: 'Redeem',
    value: 'redeem',
  },
  {
    label: 'Rain',
    value: 'rains',
  },
  {
    label: 'Tips',
    value: 'tips',
  },
];

export const BuyList = [
  {
    id: 1,
    amount: 10,
    coins: 100000,
  },
  {
    id: 2,
    amount: 20,
    coins: 200000,
  },
  {
    id: 3,
    amount: 30,
    coins: 300000,
  },
  {
    id: 4,
    amount: 40,
    coins: 400000,
  },
  {
    id: 5,
    amount: 50,
    coins: 500000,
  },
];

export const  REEDEM_DROPDOWN_LIST = [
  {
    id: 1,
    icon: btcIcon,
    name: 'BTC',
  },
  {
    id: 2,
    icon: ethIcon,
    name: 'ETH',
  },
  {
    id: 3,
    icon: dogeIcon,
    name: 'DOGE',
  },
  {
    id: 4,
    icon: ltcIcon,
    name: 'LTC',
  },
  {
    id: 5,
    icon: bchIcon,
    name: 'BCH',
  },
  {
    id: 6,
    icon: usdtIcon,
    name: 'USDT',
  },
  {
    id: 7,
    icon: trxIcon,
    name: 'TRX',
  },
  {
    id: 8,
    icon: xrpIcon,
    name: 'XRP',
  },
  {
    id: 9,
    icon: xlmIcon,
    name: 'XLM',
  },
  {
    id: 10,
    icon: solIcon,
    name: 'SOL',
  },
];

export const RainCurrencyList = [
  {
    id: 1,
    icon: coins,
    name: 'GC',
    placeholder: '50000',
    range: '50000GC - 5000000GC',
    value: 'GC',
    min: 50000,
    max: 5000000,
  },
  {
    id: 2,
    icon: usd,
    name: 'SC',
    placeholder: '1',
    range: '1SC - 100SC',
    value: 'BSC',
    min: 1,
    max: 100,
  },
];

export const Msg = [
  {
    id: 1,
    msg: 'Good luck everyone!',
  },
  {
    id: 2,
    msg: 'This site is amazing',
  },
  {
    id: 3,
    msg: 'Love you so much',
  },
  {
    id: 4,
    msg: 'What a day of luck',
  },
  {
    id: 5,
    msg: 'Winner winner bird dinner',
  },
];

export const TipCurrencyList = [
  {
    id: 1,
    icon: coins,
    name: 'GC',
    value: 'GC',
  },
  {
    id: 2,
    icon: usd,
    name: 'SC',
    value: 'BSC',
  },
];
export const BUY_CURRENCY_LIST = [
  {
    id: 1,
    icon: usdtIcon,
    name: 'USDTTRC20',
    description: 'USD Tether',
  },
  {
    id: 2,
    icon: btcIcon,
    name: 'BTC',
    description: 'Bitcoin',
  },
  // {
  //   id: 3,
  //   icon: btcIcon,
  //   name: 'Card',
  //   description: 'Credit / Debit Card',
  // },
  // {
  //   id: 4,
  //   icon: btcIcon,
  //   name: 'UPI',
  //   description: 'Unified Payment Interface',
  // },
];
