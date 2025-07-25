'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';
// import { Button } from '@/components/ui/button';
import { closeIconWhite } from '@/assets/svg';
import { usicon } from '@/assets/png';
import BuyReedem from '@/components/Buy-Reedem/components';
import TaskList from '@/components/TaskList/components';
import Notice from '@/components/notice/components';
import { useIsMobile } from '@/hooks/use-mobile';
import { useStateContext } from '@/store';
import { chatNavBtnData } from '../../constants';
import useChatNav from '../../hooks/useChatNav';
import useTaskList from '@/components/TaskList/hooks/useTaskList';
import { isEmpty } from '@/lib/utils';
import ChatRule from '@/components/chat-rule/components';
const COMPONENT_MAPPING = {
  Task: TaskList,
  Notice: Notice,
  Rain: BuyReedem,
  Tip: BuyReedem,
  ChatRule: ChatRule,
};
const ChatNav = () => {
  const { state, dispatch } = useStateContext();
  const { activeTaskList } = useTaskList();
  const activeTask = isEmpty(activeTaskList) ? 0 : activeTaskList?.length;
  const isMobile = useIsMobile();
  const { handleClick, active, isOpen, buttonType } = useChatNav();
  const COMPONENT = COMPONENT_MAPPING?.[active];
  return (
    <div className="flex justify-between">
      <div className="flex gap-4 items-center">
        <Image width={20} height={20} src={usicon} alt="enFlag" />
        <span className="text-white text-sm">USA</span>
      </div>
      <div className="flex gap-2">
        {chatNavBtnData?.map(
          ({
            id,
            icon,
            tooltip,
            // newNotification = false,
            value,
            buttonType,
          }) => (
            <Tooltip key={id}>
              <TooltipTrigger className="hover:bg-transparent">
                <div className="relative bg-transparent shadow-none text-white p-2 hover:bg-transparent">
                  {
                    <>
                      <Image
                        width={20}
                        height={20}
                        src={icon}
                        alt={tooltip}
                        onClick={() => handleClick(tooltip, buttonType)}
                      />
                      {/* {newNotification && (
                        <span className="bg-red-400 p-1 rounded-full absolute top-0 right-1"></span>
                      )} */}
                      {value && (
                        <span className="text-xs bg-red-400 px-1.5 rounded-full absolute top-0 right-0">
                          {activeTask || 0}
                        </span>
                      )}
                    </>
                  }
                </div>
              </TooltipTrigger>
              <TooltipContent className="z-[999999]" sideOffset={8}>
                {tooltip}
              </TooltipContent>
            </Tooltip>
          )
        )}
        {isMobile && (
          <Tooltip>
            <TooltipTrigger className="hover:bg-transparent">
              <div
                className="relative bg-transparent shadow-none text-white p-2 hover:bg-transparent"
                onClick={() =>
                  dispatch({
                    type: 'SET_RIGHT_PANEL',
                    payload: !state.rightPanel,
                  })
                }
              >
                {
                  <>
                    <Image
                      width={20}
                      height={20}
                      src={closeIconWhite}
                      alt="close-icon"
                    />
                  </>
                }
              </div>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>Close</TooltipContent>
          </Tooltip>
        )}
      </div>
      {isOpen && (
        <COMPONENT
          isOpen={isOpen}
          handleClick={handleClick}
          buttonType={buttonType}
        />
      )}
    </div>
  );
};

export default ChatNav;
