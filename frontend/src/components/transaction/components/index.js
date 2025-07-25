'use client';
import { transactions } from '@/assets/svg';
import CustomSelect from '@/common/components/custom-select';
import PanelTabs from '@/common/components/panel-table';
import Image from 'next/image';
import { useEffect } from 'react';
import { options } from '../constants';
import useTransactionColList from '../hooks/useTransactionColList';
import Bonuses from './bonuses';
import Buy from './buy';
import Casino from './Casino';
import Rains from './rains';
import Redeem from './redeem';
import Tips from './tips';

const COMPONENT_MAPPING = {
  buy: Buy,
  redeem: Redeem,
  rains: Rains,
  tips: Tips,
  // vault: Vault,
  // rakeback: Rakeback,
  bonus: Bonuses,
  // reload: Reload,
  casino: Casino,
  // others: Others,
};
const Transactions = () => {
  const {
    loading,
    casinoData,
    data,
    getTransactionData,
    getCasinoTransactionData,
    limit,
    pageNo,
    setLimit,
    setPageNo,
    totalCount,
    casinoPageNo,
    setCasinoPageNo,
    activeTab,
    onClose,
    setActiveTab,
  } = useTransactionColList();

  useEffect(() => {
    switch (activeTab) {
      case 'buy':
        getTransactionData({ purpose: 'purchase' });
        break;
      case 'redeem':
        getTransactionData({ purpose: 'redeem' });
        break;
      case 'rains':
        getTransactionData({ purpose: 'claim_chatrain,emit_chatrain' });
        break;
      case 'tips':
        getTransactionData({ purpose: 'send_tip,receive_tip' });
        break;
      case 'bonus':
        getTransactionData({ purpose: 'bonus_rackback,welcome_bonus,bonus_deposit,bonus_tier,bonus_referral,bonus_drop' });
        break;
      case 'casino':
        getCasinoTransactionData();
        break;
      // case 'redeem_refund':
      //   setPurpose('redeem_refund');
      //   break;
      // case 'bonus_cash':
      //   setPurpose('bonus_cash');
      //   break;
      // case 'bonus_deposit':
      //   setPurpose('bonus_deposit');
      //   break;
      // case 'bonus_referral':
      //   setPurpose('bonus_referral');
      //   break;
      // case 'bonus_to_cash':
      //   setPurpose('bonus_to_cash');
      //   break;
      // case 'bonus_forfeit':
      //   setPurpose('bonus_forfeit');
      //   break;
      // case 'bonus_win':
      //   setPurpose('bonus_win');
      //   break;
      // case 'faucet_awail':
      //   setPurpose('faucet_awail');
      //   break;
      // default:
      //   setPurpose('purchase');
      //   break;
    }
  }, [activeTab]);

  const Components = COMPONENT_MAPPING?.[activeTab];

  return (
    <div className="bg-[hsl(var(--main-background))] w-[100%] mt-2">
      <section>
        <div className="flex justify-between mb-4">
          <div className="text-white box-border font-montserrat text-[20px] font-extrabold flex gap-2">
            <Image src={transactions} alt="faq-icon" width={20} height={20} />{' '}
            <span>Transactions</span>
          </div>
          <div className="text-white cursor-pointer" onClick={onClose}>
            X
          </div>
        </div>
        <div className="block xl:hidden mb-2">
          <CustomSelect
            options={options}
            selectedValue={activeTab}
            onValueChange={setActiveTab}
          />
        </div>
        <div className="flex gap-5 xl:grid-flow-col items-start ">
          <div className="hidden xl:block sticky top-[5rem]">
            <PanelTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabControls={options}
            />
          </div>
          <div className="bg-[rgb(var(--lb-blue-900))]  p-1 sm:p-3 md:p-5 xl:tw-p-6  rounded overflow-hidden w-full">
            <Components
              limit={limit}
              loading={loading}
              casinoData={casinoData}
              data={data}
              pageNo={pageNo}
              setLimit={setLimit}
              setPageNo={setPageNo}
              totalCount={totalCount}
              casinoPageNo={casinoPageNo}
              setCasinoPageNo={setCasinoPageNo}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Transactions;
