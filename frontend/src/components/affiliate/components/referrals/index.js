'use strict';
import { TABLE_CONTROLS } from '../../constant';
import useAffiliate from '../../hook/useAffiliate';
import RefTable from '../table';
const Referrals = () => {
  const { refUsers, activeTab, setActiveTab } = useAffiliate();

  return (
    <section className="border border-[rgb(var(--lb-blue-300))] rounded">
      <RefTable
        controls={TABLE_CONTROLS}
        data={refUsers}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </section>
  );
};
export default Referrals;
