'use client';
import { cross, vip } from '@/assets/svg';
import Tabs from '@/common/components/custom-tab';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useVip from '@/components/vip/hook/useVip';
import Image from 'next/image';
import { options } from '../constants';
import ProgressSection from './progress';
// import Bonus from './bonus';
// import Rakeback from './rakeback';
const COMPONENT_MAPPING = {
  progress: ProgressSection,
  // bonus: Bonus,
  // rakeback: Rakeback,
};
const Vip = ({ isOpen, handleClick }) => {
  const { active, setActive, t } = useVip();
  const Components = COMPONENT_MAPPING?.[active];
  return (
    <Dialog open={isOpen} onOpenChange={handleClick} className="border-none">
      <DialogContent className="max-w-lg  mx-auto mb-6 rounded-lg bg-[hsl(var(--main-background))] shadow-lg border-none">
        <DialogHeader className="flex flex-row justify-between">
          <div className="flex justify-center items-center space-x-2">
            <Image src={vip} alt="sotre image" />
            <DialogTitle className="text-white">{t('vip')}</DialogTitle>
          </div>
          <div className="flex">
            <Image
              src={cross}
              alt="close icon"
              onClick={handleClick}
              className="invert hover:bg-gray-500 rounded-xl"
            />
          </div>
        </DialogHeader>
        <div
          style={{
            maxHeight: '24rem',
            overflowY: 'auto',
          }}
          className="scrollable-Content"
        >
          <div className="flex justify-center items-center flex-col w-full">
            <Tabs options={options} setActive={setActive} active={active} />
          </div>
          <Components handleDialogClose={handleClick} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Vip;
