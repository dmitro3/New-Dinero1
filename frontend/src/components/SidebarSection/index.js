'use client';
import { toggleLogo } from '@/assets/svg';
import { useIsMobile } from '@/hooks/use-mobile';
import { useStateContext } from '@/store';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from '../ui/sidebar';
import MobileCloseButton from './components/mobile-closebtn';
import NavContent from './components/nev-contwent';
import { pixiApplicationInit } from '@/pixi-js-scripts/bridge';

export default function SidebarSection({ props }) {
  const { state } = useStateContext();
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };
  const isMobile = useIsMobile();
  useEffect(() => {
    pixiApplicationInit();
  }, []);
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-[hsl(var(--background))]"
      open={state.leftPanel}
    >
      <SidebarHeader className="shadow-xl hidden sm:block bg-[rgb(var(--header))] p-4">
        <SidebarTrigger
          className="ml-1 shiny-hover hover:border hover:border-white hover:bg-purple-900 group-data-[collapsible=icon]:ml-0"
          side="left"
          icon={
            <Image
              className="group-data-[collapsible=icon]:rotate-180 transition"
              src={toggleLogo}
              alt="logo"
              width={23}
              height={23}
            />
          }
          onClick={toggleSidebar}
        />
      </SidebarHeader>
      {isMobile && <MobileCloseButton />}
      <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollable-Content-Home">
        <SidebarContent className="py-2 px-4 group-data-[collapsible=icon]:px-2">
          <NavContent isSidebarOpen={isOpen} />
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
