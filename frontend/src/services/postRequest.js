import { postRequest } from './axios';
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`;

export const UserAuthSession = (data) =>
  postRequest(`${API_URL}/user/auth`, data);

export const addFav = (data) => postRequest(`${API_URL}/casino/favorite`, data);
export const setUserDefaultCurrency = (data) =>
  postRequest(`${API_URL}/user/set-default`, data);

export const claimYourBonus = (data) =>
  postRequest(`${API_URL}/user/avail-bonus`, data);

export const DepositPayment = (data) =>
  postRequest(`${API_URL}/payment/create-payment`, data);

export const WithdrawPayment = (data) =>
  postRequest(`${API_URL}/payment/withdraw-amount`, data);

export const userSignUp = (data) =>
  postRequest(`${API_URL}/user/sign-up`, data);

export const userLogin = (data) => postRequest(`${API_URL}/user/login`, data);

export const forgotPassword = (data) =>
  postRequest(`${API_URL}/user/forget-password`, data);

export const verifyForgotPassword = (data) =>
  postRequest(`${API_URL}/user/verify-forget-password`, data);

export const awailFaucet = (payload) =>
  postRequest(`${API_URL}/faucet`, payload);

export const createTicket = (payload) =>
  postRequest(`${API_URL}/ticket`, payload);

export const createTicketMessage = (payload) =>
  postRequest(`${API_URL}/ticket/message`, payload);

export const joinChatGroup = (payload) =>
  postRequest(`${API_URL}/live-chat/join-chat-group`, payload);

//spin wheel
export const getSpinWheelResultData = (payload) =>
  postRequest(`${API_URL}/spin-wheel-configuration/generate-index`, payload);

export const createChatRain = (payload) =>
  postRequest(`${API_URL}/live-chat/emit-chat-rain`, payload);

export const claimChatRain = (payload) =>
  postRequest(`${API_URL}/live-chat/claim-chat-rain`, payload);

export const createTip = (payload) =>
  postRequest(`${API_URL}/live-chat/send-tip`, payload);

export const claimBonusDrop = (payload) =>
  postRequest(`${API_URL}/bonus/claim-bonus-drop`, payload);

export const createPayment = (payload) =>
  postRequest(`${API_URL}/payment/create-payment`, payload);

export const cardPayment = (payload) =>
  postRequest('https://api-sandbox.coinflow.cash/api/tokenize', payload);

export const exchangePlaidToken = (payload) =>
  postRequest(`${API_URL}/payment/coin-flow/ach/plaid/public-token/exchange`, payload);

export const makeAchPayment = (payload) =>
  postRequest(`${API_URL}/payment/coin-flow/ach/payment`, payload);

export const googlePayCheckout = (payload) =>
  postRequest('https://api-sandbox.coinflow.cash/api/checkout/google-pay', payload);

export const cardPayments = (payload) =>
  postRequest(`${API_URL}/payment/coin-flow/card/new`, payload);

export const cardPaymentsExisting = (payload) =>
  postRequest(`${API_URL}/payment/coin-flow/card/existing`, payload);

export const WebHook = (payload) =>
  postRequest(`${API_URL}/payment/coin-flow/create-webhook-data`, payload);

export const getPlaidLinkToken = (payload) =>
  postRequest(`${API_URL}/payment/coin-flow/ach/plaid/link-token`, payload);

export const getConversion = (payload) =>
  postRequest(`${API_URL}/payment/get-conversion`, payload);

export const uploadDebitCardToken = (payload) => 
  postRequest(`${API_URL}/payment/coin-flow/withdrawal/cards`, payload);