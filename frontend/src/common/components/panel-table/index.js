'use client';
import { useRouter } from 'next/navigation';

const PanelTabs = ({ activeTab = '', setActiveTab = () => { }, tabControls = [] }) => {
    const router = useRouter(); // Use the Next.js router

    const handleTabClick = (value) => {
        if (value) {
            setActiveTab(value); 
        } else {
            router.push('/setting?active=responsibleGambling'); 
        }
    };
    
    return (
        <div className="xl:block sticky top-2 min-w-[180px] max-w-max">
            <ul className="bg-[rgb(var(--header))] rounded py-2">
                {tabControls.map((tab) => (
                    <li
                        onClick={() => handleTabClick(tab?.value)}
                        key={tab?.value}
                        className={`h-8 pt-5 pb-5 hover:bg-[rgb(var(--lb-blue-400))] text-[14px] cursor-pointer ${activeTab === tab.value
                            ? 'bg-[hsl(var(--background))] border-[rgb(var(--lb-silver))] border-l-2'
                            : ''
                            }`}
                    >
                        <div
                            className="flex items-center h-full text-white indent-4"
                        >
                            {tab?.label}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PanelTabs;
