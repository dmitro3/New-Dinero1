import { avatar1, chatRainGrab } from '@/assets/png';
import { message, verified } from '@/assets/svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { isEmpty } from '@/lib/utils';
import Image from 'next/image';
import useGroupChats from '../../hooks/useGroupChats';
import { Skeleton } from '@/components/ui/skeleton';
import useChatUserInfo from '../../hooks/useChatUserInfo';
import UserInfo from '@/components/UserInfo/components';

const ChatConversation = ({ webSocketChat, webSocketRainChat }) => {
  const {
    formatTime,
    groupChatsData,
    messagesEndRef,
    loading,
    handleClick,
    // error,
    userIdForDisable,
  } = useGroupChats({
    webSocketChat,
    webSocketRainChat,
  });
  const {
    handleOpenUserInfo = () => {},
    chatUserData,
    isOpen,
    setIsOpen,
    chatUserLoading,
  } = useChatUserInfo();

  const renderNoData = () => {
    return (
      <div className="flex justify-center items-center flex-col h-full font-bold gap-3 my-auto text-white">
        <Image
          src={message}
          alt="message"
          width={100}
          height={100}
          className="mt-[10%]"
        />
        <h1 className="font-bold text-2xl">No Message</h1>
      </div>
    );
  };
  const renderLoading = () => {
    return (
      <div>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 space-y-7">
            <Skeleton className="h-12 w-12 rounded-full  bg-[rgb(var(--lb-blue-500))]" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-[250px]  bg-[rgb(var(--lb-blue-500))]" />
              <Skeleton className="h-8 w-[250px]  bg-[rgb(var(--lb-blue-500))]" />
            </div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="flex-1 overflow-y-auto space-y-2 p-3">
      {loading
        ? renderLoading()
        : isEmpty(groupChatsData)
          ? renderNoData()
          : groupChatsData?.map((chat) => {
              const {
                messageId,
                // username,
                createdAt,
                user,
                isBot = false,
                isVip = false,
                mentionedUser,
                message,
                messageType,
                ChatRain,
                userId,
                tip,
                username,
                isContainOffensiveWord,
              } = chat;
              const { isEmailVerified, userDetails } = user || {};
              const { VipTier } = userDetails || {};
              const { vipTierId, level } = VipTier || {};
              const image = isEmpty(user?.profileImage)
                ? avatar1.src
                : user?.profileImage;
              const { isClosed, isUserClaimed } = ChatRain || {};
              const recepientUser =
                tip?.recipient?.username || chat?.tipUser || '';

              return (
                <div key={messageId} className="flex gap-4">
                  <div className="relative">
                    <Button
                      onClick={() => handleOpenUserInfo(userId)}
                      className="bg-transparent shadow-none p-0 h-auto hover:bg-transparent"
                    >
                      <Avatar className="w-11 h-11">
                        <AvatarImage src={image} alt={user?.username} />
                        <AvatarFallback>{user?.username}</AvatarFallback>
                      </Avatar>

                      <Badge
                        variant="outline"
                        className={
                          'text-white font-thin border-none shadow-xl bg-[rgb(var(--lb-blue-600))] rounded-full absolute top-9'
                        }
                      >
                        {`Lv${level}`}
                      </Badge>
                      {!isVip && (
                        <div className="hexagon absolute top-5 right-0 left-7	">
                          <span>{`V${vipTierId}`}</span>
                        </div>
                      )}
                    </Button>
                  </div>
                  <div>
                    <div className="flex gap-2 items-center">
                      {isEmailVerified && !isBot && (
                        <Image
                          width={20}
                          height={20}
                          src={verified}
                          alt="chat"
                        />
                      )}
                      {isBot && (
                        <span className="bg-green-600 text-white text-xs rounded-lg uppercase px-2">
                          bot
                        </span>
                      )}
                      <Button
                        onClick={() => handleOpenUserInfo(userId)}
                        className="bg-transparent shadow-none text-[hsl(var(--chat-user-text))]  hover:text-white text-sm font-semibold p-0 h-auto hover:bg-transparent"
                      >
                        {user?.username || username}
                      </Button>
                      <span className="text-[hsl(var(--chat-user-text))] text-sm font-thin">
                        {formatTime(createdAt)}
                      </span>
                    </div>

                    {messageType === 'CHAT_RAIN' ? (
                      <div className="flex flex-col  w-60 rounded-r-lg rounded-bl-lg mt-2.5 p-2  bg-[rgb(var(--lb-blue-600))] ">
                        <p className="text-white break-words">{message}</p>
                        <div className="relative h-[115px] w-full mt-1">
                          <Image
                            src={chatRainGrab}
                            alt="chat rain"
                            fill
                            // width={225}
                            // height={120}
                            className="rounded-md pb-1 h-[120px] w-full"
                          />
                          <h6 className="absolute top-[12px] left-[8px] font-sans text-[#ffffffde] text-[22px] font-extrabold">
                            Coin Drops
                          </h6>
                          <Button
                            onClick={
                              !isClosed &&
                              !isUserClaimed &&
                              parseInt(userId) !== userIdForDisable
                                ? () => handleClick(chat?.ChatRain?.id)
                                : undefined
                            }
                            className={`absolute left-1  mx-auto w-auto px-2 bottom-[18px] ${isClosed || isUserClaimed ? 'bg-[rgb(var(--lb-blue-100))] !cursor-not-allowed hover:bg-[rgb(var(--lb-blue-100))]' : 'bg-yellow-300 hover:scale-105 hover:bg-yellow-400'} shadow-inner shadow-black/80 text-black font-extrabold rounded-lg text-center py-1 cursor-pointer  ${parseInt(userId) === userIdForDisable && '!cursor-not-allowed'}`}
                          >
                            {isClosed ? 'Completed' : isUserClaimed ? 'Claimed' : 'Grab'}
                          </Button>
                        </div>
                      </div>
                    ) : messageType === 'GIF' ? (
                      <div className="flex flex-col  max-w-60 rounded-r-lg rounded-bl-lg mt-2.5 p-2  bg-[rgb(var(--lb-blue-600))] ">
                        {/* <p className="text-white break-words">{message}</p> */}
                        <div className="h-auto mt-1">
                          <Image
                            src={message}
                            alt="chat rain"
                            width={225}
                            height={120}
                            className="rounded-md pb-1 max-h-[180px] h-auto w-auto object-contain"
                          />
                        </div>
                      </div>
                    ) : messageType === 'TIP' ? (
                      <div className="flex flex-col rounded-r-lg rounded-bl-lg mt-2.5 p-2 bg-[rgb(var(--lb-blue-600))]">
                        <div className="relative w-full">
                          <span className="text-yellow-400 font-bold rounded-full py-1 px-2">
                            Tipped 💰
                          </span>
                          <p className="text-white  break-words">
                            {message}
                            <span className="text-gray-200 font-bold">
                              @${recepientUser}
                            </span>
                            {}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`rounded-r-lg rounded-bl-lg mt-2.5 p-2 w-auto  bg-[rgb(var(--lb-blue-600))] ${
                          isContainOffensiveWord
                            ? 'bg-red-100/10 border-2 border-orange-500 text-orange-500'
                            : 'bg-[rgb(var(--lb-blue-600))] text-white'
                        }`}
                      >
                        <p className=" text-pretty break-all break-words">
                          {mentionedUser && (
                            <>
                              <Button className="bg-transparent shadow-none text-blue-400 font-normal p-0 h-auto hover:bg-transparent">
                                {`@${mentionedUser}`}
                              </Button>
                              <span className="mr-1">:</span>
                            </>
                          )}
                          {message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
      <div ref={messagesEndRef} />
      {isOpen && (
        <UserInfo
          isOpen={isOpen}
          handleClick={() => setIsOpen(!isOpen)}
          chatUserData={chatUserData}
          chatUserLoading={chatUserLoading}
        />
      )}
    </div>
  );
};

export default ChatConversation;
