import { Button } from '@/components/ui/button';
import useBonus from '../../hook/useBonus';
import CustomToast from '@/common/components/custom-toaster';

const Bonus = () => {
  const {
    data,
    loading,
    onsubmit,
    message,
    setShowToast,
    showToast,
    status,
    submitLoading,
  } = useBonus();
  if (loading) {
    return (
      <div class="flex items-center justify-center h-[22rem]">
        <div class="relative w-10 h-10">
          <div class="absolute inset-0 rounded-full border-2 border-gray-400 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 rounded-lg">
      <div className="flex justify-between text-gray-400 font-semibold pb-4">
        <span>Title</span>
        <span>Operation</span>
      </div>
      <div className="">
        {data.map((bonus) => (
          <div
            key={bonus?.id}
            className="flex justify-between items-center rounded-lg text-sm py-2 text-white transition"
          >
            <span>{bonus?.promotionTitle}</span>
            <Button
              disabled={submitLoading}
              loading={submitLoading}
              className="px-4 py-1 rounded-md text-white bg-[rgb(var(--lb-purple-600))]"
              onClick={() => onsubmit(bonus?.id)}
            >
              Claim
            </Button>
          </div>
        ))}
      </div>
      <CustomToast
        showToast={showToast}
        setShowToast={setShowToast}
        message={message}
        status={status}
      />
    </div>
  );
};

export default Bonus;
