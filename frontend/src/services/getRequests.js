'use client';
import { getRequest } from './axios';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`;

export const getAllGames = (payload) =>
  getRequest(`${API_URL}/casino/all-games`, payload);

export const gamesByCategory = (payload) =>
  getRequest(`${API_URL}/casino/games`, payload);

export const getAllReferredUsers = (payload) =>
  getRequest(`${API_URL}/user/referred-users`, payload);

export const getProviderList = (payload) =>
  getRequest(`${API_URL}/casino/game-provider`, payload);

export const getCategoryList = (payload) =>
  getRequest(`${API_URL}/casino/game-category`, payload);

export const getFavGameList = (payload) =>
  getRequest(`${API_URL}/casino/favorite`, payload);

export const getSocial = (payload) =>
  getRequest(`${API_URL}/social-media-links`, payload);

export const getCmsPageList = (payload) =>
  getRequest(`${API_URL}/get-cms-info`, payload);

export const getCmsPageDetail = (payload) =>
  getRequest(`${API_URL}/cms-page`, payload);

export const getBannersService = (payload) =>
  getRequest(`${API_URL}/banners`, payload);

export const getAllTransaction = (payload) =>
  getRequest(`${API_URL}/user/transactions`, payload);

export const getSiteDetails = (payload) =>
  getRequest(`${API_URL}/site-detail`, payload);

export const getAllCasinoTransaction = (payload) =>
  getRequest(`${API_URL}/casino/transactions`, payload);

export const getBonusService = (payload) =>
  getRequest(`${API_URL}/user/get-all-bonus`, payload);
export const getBonusHistoryService = (payload) =>
  getRequest(`${API_URL}/user/user-bonus`, payload);
export const getGamePlay = (payload) =>
  getRequest(`${API_URL}/casino/play-game`, payload);

export const getUserDetails = (payload) =>
  getRequest(`${API_URL}/user`, payload);

export const getAllPackage = (payload) =>
  getRequest(`${API_URL}/package`, payload);

export const getOtp = (payload) =>
  getRequest(`${API_URL}/user/get-otp`, payload);

export const getAllWithdarwTransaction = (payload) =>
  getRequest(`${API_URL}/user/withdraw-request`, payload);

export const getFaucetService = (payload) =>
  getRequest(`${API_URL}/faucet`, payload);

export const getTickets = (payload) => getRequest(`${API_URL}/ticket`, payload);

export const getTicketsMessage = (payload) =>
  getRequest(`${API_URL}/ticket/message`, payload);

export const getVipService = (payload) =>
  getRequest(`${API_URL}/vip-tier`, payload);

export const getChatGroup = (payload) =>
  getRequest(`${API_URL}/live-chat/get-chat-group`, payload);

export const getGroupChat = (payload) =>
  getRequest(`${API_URL}/live-chat/get-chat`, payload);

// spin wheel APIS
export const getSpinWheelData = (payload) =>
  getRequest(`${API_URL}/spin-wheel-configuration/get-list`, payload);

export const getNotificationsData = (payload) =>
  getRequest(`${API_URL}/notification`, payload);

export const getChatUserInfo = (payload) =>
  getRequest(`${API_URL}/live-chat/user-info`, payload);

export const getBets = (payload) =>
  getRequest(`${API_URL}/leader-board/transactions`, payload);

export const getTopThreePlayers = (payload) =>
  getRequest(`${API_URL}/leader-board/top-winners`, payload);

export const getRecentBigWin = (payload) =>
  getRequest(`${API_URL}/leader-board/recent-big-win`, payload);

export const getStates = (payload) => getRequest(`${API_URL}/states`, payload);

export const getBannerDownload = (payload) =>
  getRequest(`${API_URL}/banner/banner-download`, payload);

export const getChatRule = (payload) =>
  getRequest(`${API_URL}/live-chat/get-chat-rule`, payload);

export const getPromotions = (payload) =>
  getRequest(`${API_URL}/banner/get-promotions`, payload);

export const KYCVerify = (payload) =>
  getRequest(`${API_URL}/user/init-veriff-kyc`, payload);

export const getAccount = (payload) =>
  getRequest(`${API_URL}/payment/coin-flow/user/token`, payload);

export const getsessionkey = (payload) =>
  getRequest(`${API_URL}/payment/coin-flow/get-session-key` , payload);

export const getWithdrawlAccounts = (payload) => 
  getRequest(`${API_URL}/payment/coin-flow/withdrawal/accounts`, payload);

export const getAccountsAdd = (payload) => 
  getRequest(`${API_URL}/payment/coin-flow/bank-auth-url`, payload);

export const getDebitCardToken = (payload) => 
  getRequest(`${API_URL}/payment/coin-flow/withdrawal/cards`, payload);