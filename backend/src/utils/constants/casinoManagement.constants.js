export const CASINO_ENTITY_TYPES = {
  GAME: 'game',
  CATEGORY: 'category',
  PROVIDER: 'provider',
  AGGREGATOR: 'aggregator',
  SUB_CATEGORY: 'sub_category'
}

// CasinoTransaction constants start
export const CASINO_TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed'
}

export const AGGREGATORS = {
  ALEA: {
    id: '2',
    name: 'alea'
  },
  ONEGAMEHUB: {
    id: '3',
    name: '1GameHub'
  }
}

/**
 * @type {Object.<string, { id: string, name: string, subCategories: { id: string, name: string }[] }[]>}
 */
export const DEFAULT_CATEGORIES = [{
  id: 1,
  name: 'Table Games'
}, {
  id: 2,
  name: 'Scratch Cards'
}, {
  id: 3,
  name: 'Instant Win'
}, {
  id: 4,
  name: 'Slots'
}, {
  id: 5,
  name: 'Video Poker'
}, {
  id: 6,
  name: 'Bingo'
}, {
  id: 7,
  name: 'Keno'
}, {
  id: 8,
  name: 'Crash Game'
}, {
  id: 9,
  name: 'Lottery'
}, {
  id: 10,
  name: 'Shooting'
}, {
  id: 11,
  name: 'Fishing'
}
]

export const CASINO_AGGREGATORS = {
  ALEA: 'ALEA',
  ONEGAMEHUB: 'ONEGAMEHUB',
}
