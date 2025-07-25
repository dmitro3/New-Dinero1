'use client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import Image from 'next/image';
import { chevronDown, profile } from '@/assets/svg';
import { PROFILE_ITEMS } from '../constant';
import useProfile from '../hooks/useProfile';
import DialogComponentsMapping from '@/components/SidebarSection/common/dialog-components';

function ProfileSection() {
  const { handleProfileSection, t, isOpen, handleClick, activeUrl } = useProfile();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center hover:bg-[rgb(var(--header))] sm:mr-10">
        <Image src={profile} alt="profile" width={15}
          height={15} />
        <Image
          width={15}
          height={15}
          src={chevronDown}
          style={{ color: '#fff' }}
          alt="down"
          className="ml-1 transition-transform transform"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-[rgb(var(--secondary-btn-color))] border-none mt-5 mr-2 shadow-lg">
        {PROFILE_ITEMS.map((item) => {
          return (
            <DropdownMenuItem
              className="text-white cursor-pointer"
              onClick={() => handleProfileSection(item.value, item?.button)}
              key={item.value}
            >
              <Image width={15} height={15} src={item?.icon} alt={item?.value} />
              {t(item?.label)}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
      <DialogComponentsMapping isOpen={isOpen} handleClick={handleClick} activeUrl={activeUrl} />
    </DropdownMenu>
  );
}

export default ProfileSection;
