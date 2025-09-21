import { Icon } from "@iconify/react";

export const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Icon
        className="text-red-400 w-20"
        icon="line-md:loading-loop"
        width="70"
        height="70"
      />
    </div>
  );
};
