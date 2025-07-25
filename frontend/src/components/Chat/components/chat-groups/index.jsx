import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import useChatGroups from '../../hooks/useChatGroups';

const ChatGroups = () => {
  const { handleJoin, chatGroupData } = useChatGroups();
  return (
    <div className="p-3">
      <h1 className="text-white font-bold text-xl p-2">Channels</h1>
      {chatGroupData?.map((group) => (
        <div
          key={group?.id}
          className="flex items-center border border-purple-500/80 m-2 p-2 bg-[rgb(var(--lb-purple-600))]/30 rounded-md shadow-sm shadow-amber-400/40 hover:bg-[rgb(var(--lb-purple-600))]/60 transition-colors"
        >
          <Avatar className="w-11 h-11 m-3">
            <AvatarImage src={group?.src} alt="group icon" />
            <AvatarFallback>{'fallback'}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <h1 className="text-md font-semibold text-white">{group?.name}</h1>
            <p className="text-slate-300">{group?.description}</p>
          </div>
          <Button
            type="button"
            onClick={() => handleJoin(group?.id)}
            className="bg-green-500/90 py-2 px-4 hover:bg-green-400/90 text-white font-bold rounded-2xl ml-4"
          >
            Join
          </Button>
        </div>
      ))}
      <div></div>
    </div>
  );
};

export default ChatGroups;
