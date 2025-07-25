'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Components
import CustomListSkeleton from '@/common/components/custom-list-skeleton';
import TaskList from '@/components/TaskList/components';
import UserInfo from '@/components/UserInfo/components';
import Faucet from '@/components/faucet/components';
import Transactions from '@/components/transaction/components';

// Hooks
import useCms from '../../hooks/useCms';
import useSocial from '../../hooks/useSocial';

// Map slugs to components for dialog-type rendering
const COMPONENT_MAPPING = {
  tasklist: TaskList,
  myAccount: UserInfo,
  transactions: Transactions,
  faucet: Faucet,
};

const CmsLink = () => {
  const { cmsData, cmsLoading, handleOnClick } = useCms();
  const { socialLinks } = useSocial();

  const [isOpen, setIsOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState('');

  const handleClick = (value) => {
    setIsOpen(!isOpen);
    setActiveUrl(value);
  };

  const COMPONENT = COMPONENT_MAPPING?.[activeUrl];
  if (COMPONENT) {
    return <COMPONENT isOpen={isOpen} handleClick={handleClick} />;
  }

  const DEFAULT_LOCALE = 'EN';

  const cmsContent = [
    {
      heading: 'My Account',
      components: [
        { name: 'My Info', slug: 'myAccount', type: 'dialog' },
        { name: 'Setting', slug: '/setting', type: 'page' },
        { name: 'Faucet', slug: 'faucet', type: 'dialog' },
        { name: 'Transaction', slug: '/transactions', type: 'page' },
      ],
    },
    {
      heading: 'Features',
      components: [
        { name: 'Task List', slug: 'tasklist', type: 'dialog' },
        { name: 'Tickets', slug: '/tickets', type: 'page' },
      ],
    },
    ...(socialLinks?.rows?.length
      ? [
          {
            heading: 'Community',
            components: socialLinks.rows.map((row) => ({
              name: row.platform,
              slug: row.url,
              type: 'external',
              icon:
                row.icon?.startsWith('http') || row.icon?.startsWith('/')
                  ? row.icon
                  : `/assets/icons/${row.icon}.png`,
            })),
          },
        ]
      : []),
  ];

  const handleComponentClick = (component) => {
    if (component.type === 'dialog') {
      handleClick(component.slug);
    }
  };

  return (
    <div className="container mx-auto px-4 text-white font-bold mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cmsContent.map((section, index) => (
          <div key={index} className="flex flex-col">
            <h3 className="text-base mb-4">{section.heading}</h3>
            <ul>
              {section.components.map((component, ind) => (
                <li
                  key={ind}
                  className="mb-2 text-slate-500 text-sm cursor-pointer hover:text-white"
                >
                  {component.type === 'page' ? (
                    <Link href={component.slug}>{component.name}</Link>
                  ) : component.type === 'dialog' ? (
                    <span onClick={() => handleComponentClick(component)}>
                      {component.name}
                    </span>
                  ) : (
                    <a
                      href={component.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 bg-[rgb(var(--lb-blue-300))]/70 hover:bg-[rgb(var(--lb-blue-300))] rounded-2xl px-[10px] py-2 w-[70%] text-white"
                    >
                      {component.icon && (
                        <Image
                          src={component.icon}
                          alt={`${component.name} icon`}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      )}
                      {component.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Support section powered by CMS */}
        <div className="flex flex-col">
          <h3 className="text-base mb-4">Support</h3>
          {cmsLoading ? (
            <CustomListSkeleton rows={5} />
          ) : (
            <div>
              {cmsData?.map(({ cmsPageId, slug, title = {} }) => (
                <div
                  key={cmsPageId}
                  onClick={() => handleOnClick(slug)}
                  className="block mb-2 text-slate-500 text-sm cursor-pointer hover:text-white"
                >
                  {title[DEFAULT_LOCALE] || title?.EN}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CmsLink;
