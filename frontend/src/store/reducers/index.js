// Define the initial state
export const initialState = {
  leftPanel: false,
  rightPanel: false,
  user: null,
  userLoading: false,
  userError: null,
  selectedCoin: 'gold',
  wheelConfig: null,
  spinWheelData:null,
  spinWheelResult: {
    showResult: false,
    gc: '',
    sc: '',
    index: '',
    bonusActivated: false,
  },
};

// Define a reducer function
export function reducer(state, action) {
  switch (action.type) {
    case 'SET_LEFT_PANEL':
      return { ...state, leftPanel: action.payload };
    case 'SET_RIGHT_PANEL':
      return { ...state, rightPanel: action.payload };
    // Add other actions as needed
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_USER_LOADING':
      return { ...state, userLoading: action.payload };
    case 'SET_USER_ERROR':
      return { ...state, userError: action.payload };
    case 'SET_SELECTED_COIN':
      return { ...state, selectedCoin: action.payload };
    case 'SET_USER_DATA':
      return { ...state, userData: action.payload };
    // socket updates
    case 'UPDATE_SOCKET_WALLET': {
      return {
        ...state,
        user: {
          ...state.user,
          userWallet: state.user?.userWallet?.map((wallet) =>
            wallet.currencyCode === action.payload.currencyCode
              ? { ...wallet, balance: `${action.payload.balance}` }
              : wallet
          ),
        },
      };
    }
    // spin wheel states
    case 'SET_SPIN_WHEEL_DATA':
      return {
        ...state,
        wheelConfig: action.payload,
      };
    case 'SET_SPIN_LIST':
      return{
      ...state,
      spinWheelData:action.payload,
    };
    case 'SET_SPIN_WHEEL_RESULT':
      return {
        ...state,
        spinWheelResult: action.payload,
      };
    default:
      return state;
  }
}
