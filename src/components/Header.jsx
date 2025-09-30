import { Icon } from "@iconify/react";
import { HamburgerMenu } from "./HamburgerMenu";

export const Header = () => {
  return (
    <header className=" h-15  bg-gradient-to-r from-orange-500 to-orange-400 px-2 flex items-center justify-start gap-6 fixed w-full top-0  ">
      <HamburgerMenu />
      <div className="flex text-white  ">
        <Icon icon="tdesign:shop-filled" width="24" height="24" />
        <h1>MyEccommerce</h1>
      </div>
    </header>
  );
};
