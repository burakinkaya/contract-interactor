import ConnectButton from "../ConnectButton";

const Header = () => {
  return (
    <header className="items-end top-0 z-30 flex w-full flex-col max-[540px]:fixed 2xl:mb-16">
      <ConnectButton />
    </header>
  );
};

export default Header;
