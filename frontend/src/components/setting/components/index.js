'use client';
import PanelTabs from '@/common/components/panel-table';
import style from './style.module.scss';
import { TAB_CONTROLS } from '../constant';
import { useState } from 'react';
import Profile from './profile';
import Email from './email';
import Password from './password';
import BonusDrop from './bonus-drop';
import TwoFactor from './two-factor';
import Avatar from './avatar';
import IgnoredUsers from './ignored-users';
import ResponsibleGambling from './responsible-gambling';
import Verify from './verify';
import Preferences from './preferences';
import CustomSelect from '@/common/components/custom-select';
import { useRouter, useSearchParams } from 'next/navigation';
import useGetUserDetail from '@/common/hook/useGetUserDeatil';
const COMPONENT_MAPPING = {
    profile: Profile,
    email: Email,
    password: Password,
    bonusDrop: BonusDrop,
    twoFactor: TwoFactor,
    avatar: Avatar,
    ignoredUsers: IgnoredUsers,
    responsibleGambling: ResponsibleGambling,
    verify: Verify,
    preferences: Preferences
};
const Setting = () => {
    const { userData, userLoading } = useGetUserDetail();

    const router = useRouter();
    const searchParams = useSearchParams();
    const active = searchParams.get('active');
    const [activeTab, setActiveTab] = useState(active || TAB_CONTROLS[0].value);
    const COMPONENT = COMPONENT_MAPPING[activeTab] || null;
    const onClose = () => {
        router.push('/');
    };

    const onTabChange = (value) => {
        router.push(`/setting?active=${value}`);
        setActiveTab(value);
    };

    return <div className={`${style.wrapContainer} bg-[hsl(var(--main-background))] `}>
        <section>
            <div className="flex justify-between mb-4">
                <div className="text-white box-border font-montserrat text-[20px] font-extrabold">Setting</div>
                <div className="text-white cursor-pointer" onClick={onClose}>X</div>
            </div>
            <div className="block xl:hidden mb-2">
                <CustomSelect options={TAB_CONTROLS} selectedValue={activeTab} onValueChange={onTabChange} />
            </div>
            <div className="flex gap-5 xl:grid-flow-col items-start ">
                <div className="hidden xl:block">
                    <PanelTabs
                        activeTab={activeTab}
                        setActiveTab={onTabChange}
                        tabControls={TAB_CONTROLS}
                    />
                </div>
                <div className="bg-[hsl(var(--background))] p-6 xl:tw-p-6  rounded overflow-hidden w-full">
                    {/* <Email /> */}
                    {COMPONENT ? <COMPONENT userData={userData} userLoading={userLoading} setActiveTab={setActiveTab} /> : null}
                    {/* <BonusDeop /> */}
                </div>
            </div>

        </section>
    </div>;
};
export default Setting;