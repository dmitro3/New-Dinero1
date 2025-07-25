import {
  affiliate,
  categoryIcon,
  // chestAndCard,
  // coinflip,
  // crash,
  dice,
  faq,
  faucetIcon,
  favourite,
  // gems,
  // hilo,
  // keno,
  // limbo,
  // livesupport,
  logout,
  // mines,
  notice,
  // plinko,
  // poker,
  profile,
  promotions,
  providerIcon,
  // provablyfair,
  // roulette,
  // seed,
  setting,
  slots,
  spinWheel,
  task,
  tickets,
  tower,
  transactions,
  share,
  vip,
  // wheel,
} from '@/assets/svg';

export const sidebarData = [
  {
    id: 1,
    title: 'Profile',
    icon: profile,
    type: 'dropdown',
    options: [
      {
        icon: profile,
        title: 'My Info',
        url: 'myAccount',
        button: true,
      },
      {
        icon: setting,
        title: 'Setting',
        url: '/setting',
      },
      {
        title: 'Notice',
        icon: notice,
        url: 'notice',
        button: true,
      },
      {
        icon: vip,
        title: 'VIP',
        url: 'vip',
        button: true,
      },
      {
        icon: affiliate,
        title: 'Affiliate',
        url: '/affiliate',
      },
      {
        icon: transactions,
        title: 'Transactions',
        url: '/transactions',
        // button: true,
      },
      {
        icon: share,
        title: 'Share',
        url: 'share',
        button: true,
      },
      {
        icon: logout,
        title: 'Logout',
        url: 'logout',
        button: true,
      },
    ],
  },

  {
    id: 2,
    title: 'MainNavigation',
    icon: profile,
    type: 'link',
    options: [
      {
        title: 'Promotions',
        icon: promotions,
        url: '/promotions',
      },
      {
        title: 'Favourites',
        icon: favourite,
        url: '/favourites',
      },
      {
        title: 'Task List',
        icon: task,
        url: 'tasklist',
        button: true,
      },
      {
        title: 'Faucet',
        icon: faucetIcon,
        url: 'faucet',
        button: true,
      },
      // {
      //   title: 'Chest & Card',
      //   icon: chestAndCard,
      //   url: '/chest&card',
      // },
      // {
      //   title: 'Seed',
      //   icon: seed,
      //   url: 'seed',
      //   button: true,
      // },
      {
        title: 'Stores',
        icon: tower,
        url: 'stores',
      },
      {
        title: 'FAQ',
        icon: faq,
        url: '/faq',
      },
    ],
  },
  // {
  //   id: 3,
  //   title: 'Originals',
  //   icon: poker,
  //   type: 'dropdown',
  //   options: [
  //     {
  //       icon: dice,
  //       title: 'Dice',
  //       url: 'dice',
  //     },
  //     {
  //       icon: limbo,
  //       title: 'Limbo',
  //       url: 'limbo',
  //     },
  //     {
  //       icon: crash,
  //       title: 'Crash',
  //       url: 'crash',
  //     },
  //     {
  //       icon: plinko,
  //       title: 'Plinko',
  //       url: 'plinko',
  //     },
  //     {
  //       icon: tower,
  //       title: 'Tower',
  //       url: 'tower',
  //     },
  //     {
  //       icon: keno,
  //       title: 'Keno',
  //       url: 'keno',
  //     },
  //     {
  //       icon: mines,
  //       title: 'Mines',
  //       url: 'mines',
  //     },
  //     {
  //       icon: gems,
  //       title: 'Gems',
  //       url: 'gems',
  //     },
  //     {
  //       icon: hilo,
  //       title: 'Hilo',
  //       url: 'hilo',
  //     },
  //     {
  //       icon: coinflip,
  //       title: 'CoinFlip',
  //       url: 'coinflip',
  //     },
  //     {
  //       icon: notice,
  //       title: 'Super Bird',
  //       url: 'superbird',
  //     },
  //     {
  //       icon: wheel,
  //       title: 'wheel',
  //       url: 'wheel',
  //     },
  //     {
  //       icon: dice,
  //       title: 'Lucky Dice',
  //       url: 'luckydice',
  //     },
  //     {
  //       icon: roulette,
  //       title: 'Roulette Solo',
  //       url: 'roulettesolo',
  //     },
  //     {
  //       icon: poker,
  //       title: 'Black Jack',
  //       url: 'blackjack',
  //     },
  //     {
  //       icon: poker,
  //       title: 'Video Poker',
  //       url: 'videopoker',
  //     },
  //     {
  //       icon: roulette,
  //       title: 'Roulette Multi',
  //       url: 'roulettemulti',
  //     },
  //   ],
  // },
  {
    id: 4,
    title: 'Provider',
    icon: providerIcon,
    type: 'dropdown',
    options: [
      {
        icon: profile,
        title: 'RedRake',
        url: '/provider/redRake',
      },
      {
        icon: profile,
        title: 'Mobilots',
        url: '/provider/mobilots',
      },
      {
        icon: profile,
        title: 'Ezugi Premium',
        url: '/provider/ezugi-premium',
      },
      {
        icon: profile,
        title: 'FrankenStein',
        url: '/provider/frankenstein',
      },
      {
        icon: profile,
        title: 'Mancala',
        url: '/provider/mancala',
      },
      {
        icon: profile,
        title: 'Wazdan',
        url: '/provider/wazdan',
      },
      {
        icon: profile,
        title: 'Pragmatic',
        url: '/provider/pragmatic',
      },
      {
        icon: profile,
        title: 'Spribe',
        url: '/provider/spribe',
      },
      {
        icon: profile,
        title: 'Spinmatic',
        url: '/provider/spinmatic',
      },
      {
        icon: profile,
        title: 'TurboGames',
        url: '/provider/turboGames',
      },
      {
        icon: profile,
        title: 'Tpg',
        url: '/provider/tpg',
      },
      {
        icon: profile,
        title: 'Playson',
        url: '/provider/playson',
      },
      {
        icon: profile,
        title: 'Endorphina',
        url: '/provider/endorphina',
      },
      {
        icon: profile,
        title: 'Nolimit City',
        url: '/provider/nolimit-city',
      },
      {
        icon: profile,
        title: '7Mojos Live',
        url: '/provider/7Mojos-live',
      },
      {
        icon: profile,
        title: 'CQ9 Casino',
        url: '/provider/cq9-casino',
      },
      {
        icon: profile,
        title: 'Revolver Gaming',
        url: '/provider/revolver-gaming',
      },

      {
        icon: profile,
        title: 'Woohoo Games',
        url: '/provider/woohoo-games',
      },
      {
        icon: profile,
        title: 'GoldenRace',
        url: '/provider/goldenRace',
      },
      {
        icon: profile,
        title: 'Imagine Live',
        url: '/provider/imagine-live',
      },
      {
        icon: profile,
        title: 'Barbara Bang',
        url: '/provider/barbara-bang',
      },
      {
        icon: profile,
        title: 'Skywind Live',
        url: '/provider/skywind-live',
      },
      {
        icon: profile,
        title: 'Evolution Premium',
        url: '/provider/evolution-premium',
      },
      {
        icon: profile,
        title: 'Spinthon',
        url: '/provider/spinthon',
      },
      {
        icon: profile,
        title: 'OMI Gaming',
        url: '/provider/omi-gaming',
      },
      {
        icon: profile,
        title: 'Dragoon Soft',
        url: '/provider/dragoon-soft',
      },
      {
        icon: profile,
        title: 'Skill Games by Galaxsys',
        url: '/provider/skill-games-by-galaxsys',
      },
      {
        icon: profile,
        title: 'Fantasma Games',
        url: '/provider/fantasma-games',
      },
      {
        icon: profile,
        title: 'Elk Studios',
        url: '/provider/elk-studios',
      },
      {
        icon: profile,
        title: 'Ezugi',
        url: '/provider/ezugi',
      },
      {
        icon: profile,
        title: 'Elbet',
        url: '/provider/elbet',
      },
      {
        icon: profile,
        title: '1x2 Network',
        url: '/provider/1x2-network',
      },
      {
        icon: profile,
        title: 'RubyPlay',
        url: '/provider/ruby-play',
      },
      {
        icon: profile,
        title: 'Espresso',
        url: '/provider/espresso',
      },
      {
        icon: profile,
        title: 'NetEnt',
        url: '/provider/netEnt',
      },
      {
        icon: profile,
        title: 'NetGaming',
        url: '/provider/net-gaming',
      },
      {
        icon: profile,
        title: 'Betgamestv',
        url: '/provider/betgamestv',
      },
    ],
  },
  {
    id: 5,
    title: 'Casino',
    icon: slots,
    type: 'link',
    options: [
      {
        title: 'Casino',
        icon: slots,
        url: '/casino',
      },
    ],
  },
  {
    id: 6,
    title: 'Category',
    icon: categoryIcon,
    type: 'dropdown',
    options: [
      {
        icon: profile,
        title: '777Slots',
        url: '/category/777slots',
      },
      {
        icon: setting,
        title: 'FrogPrinceSlots',
        url: '/category/frogprinceslots',
      },
      {
        icon: notice,
        title: 'CinderellaSlots',
        url: '/category/cinderellaslots',
      },
      {
        icon: profile,
        title: 'OzSlots',
        url: '/category/ozslots',
      },
      {
        icon: setting,
        title: 'AliceSlots',
        url: '/category/aliceslots',
      },
      {
        icon: notice,
        title: 'RedHatSlots',
        url: '/category/redratslots',
      },
      {
        icon: setting,
        title: 'ChinaSlots',
        url: '/category/chinaslots',
      },
    ],
  },
  {
    id: 7,
    title: 'Spin Wheel',
    icon: categoryIcon,
    type: 'link',
    options: [
      {
        title: 'Spin Wheel',
        icon: spinWheel,
        url: 'spinWheel',
        button: true,
      },
    ],
  },
  {
    id: 8,
    title: 'Tickets',
    icon: tickets,
    type: 'link',
    options: [
      {
        title: 'Tickets',
        icon: tickets,
        url: '/tickets',
      },
    ],
  },
  {
    id: 9,
    title: 'Responsible Gaming',
    icon: dice,
    type: 'link',
    options: [
      {
        title: 'Responsible Gaming',
        icon: dice,
        url: '/responsible-gambling',
      },
    ],
  },
];
