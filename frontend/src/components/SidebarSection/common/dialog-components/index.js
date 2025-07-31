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
import { useState, useEffect } from 'react';
// import SpinWheel from '@/components/SpinWheel/components'; // Dynamic import to avoid SSR issues
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
  // spinWheel: SpinWheel, // Dynamic import handled below
};

const DialogComponentsMapping = ({ isOpen, handleClick, activeUrl }) => {
  const [SpinWheelComponent, setSpinWheelComponent] = useState(null);

  // Dynamically import SpinWheel component only when needed
  useEffect(() => {
    if (activeUrl === 'spinWheel' && !SpinWheelComponent) {
      import('@/components/SpinWheel/components').then((module) => {
        setSpinWheelComponent(() => module.default);
      });
    }
  }, [activeUrl, SpinWheelComponent]);

  let COMPONENT = COMPONENT_MAPPING?.[activeUrl];
  
  // Handle dynamic SpinWheel component
  if (activeUrl === 'spinWheel') {
    COMPONENT = SpinWheelComponent;
  }

  return COMPONENT ? (
    <COMPONENT
      isOpen={isOpen}
      handleClick={handleClick}
      buttonType={activeUrl}
    />
  ) : null;
};

export default DialogComponentsMapping;
