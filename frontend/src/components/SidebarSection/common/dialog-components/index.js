import Notice from '@/components/notice/components';
import UserInfo from '@/components/UserInfo/components';
import Logout from '@/components/logout/components';
import Transactions from '@/components/transaction/components';
import Share from '@/components/share/components';
import Seed from '@/components/Seed/components';
import TaskList from '@/components/TaskList/components';
import Vip from '@/components/vip/components';
import Faucet from '@/components/faucet/components';
import LiveSupport from '@/components/live-support/component';
import BuyReedem from '@/components/Buy-Reedem/components';
import SpinWheel from '@/components/SpinWheel/components';
const COMPONENT_MAPPING = {
  tasklist: TaskList,
  notice: Notice,
  myAccount: UserInfo,
  logout: Logout,
  transactions: Transactions,
  share: Share,
  seed: Seed,
  vip: Vip,
  faucet: Faucet,
  livesupport: LiveSupport,
  buy: BuyReedem,
  redeem: BuyReedem,
  spinWheel: SpinWheel,
};
const DialogComponentsMapping = ({ isOpen, handleClick, activeUrl }) => {
  const COMPONENT = COMPONENT_MAPPING?.[activeUrl];

  return COMPONENT ? (
    <COMPONENT
      isOpen={isOpen}
      handleClick={handleClick}
      buttonType={activeUrl}
    />
  ) : null;
};

export default DialogComponentsMapping;
