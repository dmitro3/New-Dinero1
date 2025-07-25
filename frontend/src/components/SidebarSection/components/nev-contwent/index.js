'use client';
import React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';
import { chevronDown, chevronRight } from '@/assets/svg';
import Link from 'next/link';
import useSidebar from '../../hooks/useSidebar';
import DialogComponentsMapping from '../../common/dialog-components';
import { useStateContext } from '@/store';
import styles from '../style.module.scss';

const NavContent = () => {
  const {
    isOpen,
    handleClick,
    activeUrl,
    openDropdown,
    toggleDropdown,
    handleRedirect,
    updateSidebarData,
    t,
  } = useSidebar();
  const { dispatch } = useStateContext();

  const buttonComponents = ({ url, id, icon, title }) => {
    return (
      <SidebarMenuItem key={`${id}-${url}`} className="list-none">
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton
                onClick={() => handleClick(url)}
                className="px-3 py-[23px] shiny-hover hover:border hover:border-white hover:bg-blue-900 group-data-[collapsible=icon]:!w-[3rem] group-data-[collapsible=icon]:m-auto group-data-[collapsible=icon]:!h-[3rem] group-data-[collapsible=icon]:!px-[1rem]"
              >
                <Image src={icon} alt={title} width={18} height={18} />
                <span className="text-white text-sm/[17px] font-semibold group-data-[collapsible=icon]:invisible">
                  {title}
                </span>
              </SidebarMenuButton>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              {title}
            </TooltipContent>
          </Tooltip>
      </SidebarMenuItem>
    );
  };

  return (
    <>
      {updateSidebarData?.map(({ id, icon, title, type, options = [] }) => {
        if (type === 'dropdown') {
          return (
            <Collapsible
              key={`${id}-${title}`}
              open={openDropdown === id }
              onOpenChange={() => {
                toggleDropdown(id);
              }}
              defaultOpen={false}
              className="group/collapsible rounded mt-3"
            >
              <SidebarGroup className="p-0">
                <SidebarGroupLabel
                  asChild
                  className="px-3 py-[23px] group-data-[collapsible=icon]:px-[8px]"
                >
                        <CollapsibleTrigger
                          aria-label={`Toggle ${title}`}
                          className="hover:bg-blue-900 shiny-hover hover:border hover:border-white group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:m-auto !bg-[rgb(var(--header))]"
                        >
                          <Image
                            className="mr-2 ml-0 group-data-[collapsible=icon]:mr-0 group-data-[collapsible=icon]:ml-[11px]"
                            src={icon}
                            alt="title"
                            width={18}
                            height={18}
                          />
                          <span className="text-white text-sm/[17px] group-data-[collapsible=icon]:hidden">
                            {t(title)}
                          </span>
                          <Image
                            className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:hidden"
                            src={chevronDown}
                            alt="down-icon"
                            width={18}
                            height={18}
                          />
                          <Image
                            className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:ml-0 hidden group-data-[collapsible=icon]:block"
                            src={chevronRight}
                            alt="down-icon"
                            width={16}
                            height={16}
                          />
                        </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent
                  className={`group-data-[collapsible=icon]:fixed group-data-[collapsible=icon]:left-[5rem] group-data-[collapsible=icon]:top-[7rem] group-data-[collapsible=icon]:bg-[hsl(var(--side-bar-card))] group-data-[collapsible=icon]:overflow-y-auto group-data-[collapsible=icon]:max-h-[60vh] ${styles.customScrollbar} !bg-[rgb(var(--secondary-btn-color))] `}
                >
                  {options?.map(({ url, title, icon, button }) => {
                    if (!title) return null;
                    return (
                      <Link
                        href={`${button ? '' : url}`}
                        onClick={() => {
                          if (button) {
                            handleClick(url);
                          } else {
                            toggleDropdown(id);
                            dispatch({ type: 'SET_LEFT_PANEL', payload: false });
                          }
                        }}
                        key={`${id}-${url}`}
                      >
                        <SidebarMenuButton className="flex px-3 py-[23px] hover:bg-bg-blue-900 group-data-[collapsible=icon]:!p-[1.4rem] group-data-[collapsible=icon]:!w-[10rem]">
                          {icon && (
                            <Image className="mr-2" src={icon} alt={title} width={18} height={18} />
                          )}
                          <span className="text-white text-sm/[17px] font-semibold">
                            {t(title)}
                          </span>
                        </SidebarMenuButton>
                      </Link>
                    );
                  })}
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        }

        return (
          <div key={`${id}-${title}`} className="bg-[rgb(var(--header))] rounded mt-3">
            {options?.map(({ url, icon, title, button = false }) => {
              if (button) {
                return buttonComponents({ url, id, icon, title });
              } else {
                return (
                  <SidebarMenuItem key={`${id}-${url}`} className="list-none">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            onClick={() => handleRedirect(url)}
                            className="px-3 py-[23px] shiny-hover hover:border hover:border-white hover:bg-blue-900 group-data-[collapsible=icon]:!w-[3rem] group-data-[collapsible=icon]:m-auto group-data-[collapsible=icon]:!h-[3rem] group-data-[collapsible=icon]:!px-[1rem]"
                          >
                            <div className="flex">
                              <Image className="mr-2" src={icon} alt={title} width={18} height={18} />
                              <span className="text-white text-sm/[17px] font-semibold group-data-[collapsible=icon]:invisible">
                                {t(title)}
                              </span>
                            </div>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                          {t(title)}
                        </TooltipContent>
                      </Tooltip>
                  </SidebarMenuItem>
                );
              }
            })}
          </div>
        );
      })}
      <DialogComponentsMapping
        isOpen={isOpen}
        handleClick={handleClick}
        activeUrl={activeUrl}
      />
    </>
  );
};

export default NavContent;
