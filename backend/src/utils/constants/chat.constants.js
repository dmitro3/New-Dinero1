export const MESSAGE_STATUS = {
    ACTIVE: 'ACTIVE',
    EDITED: 'EDITED',
    DELETED: 'DELETED'
}
export const MESSAGE_TYPE = {
    MESSAGE: 'MESSAGE',
    GIF: 'GIF',
    SHARED_EVENT: 'EVENT',
    TIP: 'TIP',
    CHAT_RAIN: 'CHAT_RAIN'
}
export const DEFAULT_CHAT_THEME = {
    dark: true,
    colors: {
        primary: '#ffe81a',
        error: '#FF5252',
        primaryLight: '#ffeb38',
        highlightColor: '#ffe81a',
        gradientColor1: '#ffe81a',
        gradientColor2: '#ff8719',
        foreground: '#1b1c27',
        inputBorderColor: '#252633',
        modalBackground: '#1f2330',
        chatBackground: '#1a1d29',
        inputColor: '#161721',
        iconColor: '#8a90a2',
        white: '#ffffff',
        black: '#000000'
    },
    variables: {
        headerHeight: '4.375rem',
        footerHeight: '7.25rem',
        messageFontSize: '0.875rem',
        fontFamily: 'Rubik',
        primaryBoxShadow: 'rgba(255, 176, 25, 0.4) 0px 0px 10px, rgba(255, 255, 255, 0.2) 0px 1px 0px inset, rgba(0, 0, 0, 0.15) 0px -3px 0px inset, rgb(255, 135, 25) 0px 0px 15px inset'
    }
}
export const DELETED_MESSAGE = 'Deleted because of offensive content.'
export const GLOBAL_GROUP_ID = 1
export const GLOBAL_GROUP = 'GLOBAL'
export const MAX_CHAT_CHARACTERS = 200
export const URL_CHAT_MESSAGE = 'Heads up! This message was removed due to external link.'
export const CLAIM_MESSAGE = 'Chatrain claimed'
export const TIP_SEND = 'Tip send to the user'