const CustomCircularloading = () => {
  return (
    <div className="flex items-center justify-center h-[19rem]">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-gray-400 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default CustomCircularloading;
