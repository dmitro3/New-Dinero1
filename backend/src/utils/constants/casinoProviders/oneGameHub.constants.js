
export const OneGameHubError = {
    unknownError: {
        status: 500,
        error: {
            code: "ERR001",
            message: "Unknown error occurred.",
            display: false,
            action: "restart"
        }
    },
    sessionTimeoutError: {
        status: 500,
        error: {
            code: "ERR002",
            message: "The session has timed out. Please login again to continue playing.",
            display: true,
            action: "restart"
        }
    },
    insufficientFundsError: {
        status: 500,
        error: {
            code: "ERR003",
            message: "Insufficient funds to place current wager. Please reduce the stake or add more funds to your balance.",
            display: true,
            action: "continue"
        }
    },
    wageringLimitExceededError: {
        status: 500,
        error: {
            code: "ERR004",
            message: "This wagering will exceed your wagering limitation. Please try a smaller amount or increase the limit.",
            display: true,
            action: "continue"
        }
    },
    authenticationFailedError: {
        status: 500,
        error: {
            code: "ERR005",
            message: "Player authentication failed.",
            display: true,
            action: "restart"
        }
    },
    unauthorizedRequestError: {
        status: 500,
        error: {
            code: "ERR006",
            message: "Unauthorized request.",
            display: false,
            action: "restart"
        }
    },
    unsupportedCurrencyError: {
        status: 500,
        error: {
            code: "ERR008",
            message: "Unsupported currency.",
            display: true,
            action: "restart"
        }
    },
    bonusBetMaxRestrictionError: {
        status: 500,
        error: {
            code: "ERR009",
            message: "Bonus bet max restriction.",
            display: true,
            action: "continue"
        }
    }
};


export const ONE_GAME_HUB_SESSION_PREFIX = 'onegh-'


export const ONE_GAME_HUB_CURRENCY_MAPPER = {
    SSC: 'SC',
    GOC: 'GC'
}