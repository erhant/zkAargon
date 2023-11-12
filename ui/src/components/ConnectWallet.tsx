import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
// import {LoginWithEmail} from "./LoginWithEmail";
// import { RiArrowDropDownLine } from "react-icons/ri";

interface IConnectWallet {
  setMinaObj: (val: any) => void;
  address: string;
  setAddress: (val: string) => void;
}

let accounts;
let mina: any;

const ConnectWallet: React.FC<IConnectWallet> = ({
  setMinaObj,
  address,
  setAddress,
}) => {
  // const { data: walletClient } = useWalletClient();
  // Accounts is an array of string Mina addresses.
  const [isSignedIn, setIsSignedIn] = useState(false);

  //   console.log("🚀 ~ file: Navbar.tsx:26 ~ address:", address);

  const connectApp = async () => {
    try {
      if (mina == null) {
        toast(
          <div className="tracking-tighter text-lg">
            Please download Auro Wallet
          </div>
        );
        return;
      }
      accounts = await mina.requestAccounts();
      const display = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
      console.log("ascc", accounts[0]);
      setMinaObj(mina);
      setAddress(display);
      setIsSignedIn(true);
      console.log(
        "🚀 ~ file: ConnectWallet.tsx:32 ~ connectApp ~ display:",
        display,
        mina
      );
    } catch (error) {}
  };

  useEffect(() => {
    mina = (window as any).mina;
  }, []);

  useEffect(() => {
    if (mina) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts) {
          setAddress(accounts[0]!);

          connectApp();
        }
      };

      //   const handleDisconnect = () => {
      //     disconnect()
      //   }

      mina.on("accountsChanged", handleAccountsChanged);

      //   mina.on("disconnect", handleDisconnect)

      //   mina.on("chainChanged", handleNetworkSwitch)

      return () => {
        if (mina.removeListener) {
          mina.removeListener("accountsChanged", handleAccountsChanged);

          //   provider.removeListener("disconnect", handleDisconnect)

          //   provider.removeListener("chainChanged", handleNetworkSwitch)
        }
      };
    }
  }, []);

  return (
    <>
      <Toaster />
      {isSignedIn ? (
        // <button
        //   className="px-4 hover:scale-105 transition duration-200 text-lg rounded-xl font-semibold tracking-tighter bg-[#0e76fd] text-white py-1.5"
        //   onClick={() => setIsWalletModal(true)}
        // >
        //   Logout
        // </button>

        <button
          onClick={() => {
            setIsSignedIn(false);
            setAddress("");
          }}
          className="fixed right-8 top-6 flex bg-white justify-center items-center  rounded-xl shadow-lg drop-shadow-md   px-4 gap-2 hover:scale-105 transition duration-200 py-2.5"
        >
          <h1 className="font-bold tracking-lighter text-[#25292e] text-xl ">
            {/* {truncatedAddress} */}
            {address}
          </h1>
          {/* <RiArrowDropDownLine className="-ml-2 w-8 h-8" /> */}
        </button>
      ) : (
        <button
          className="px-4 fixed right-8 top-6  hover:scale-105 transition duration-200 text-xl  rounded-xl font-bold tracking-tighter bg-[#0e76fd] text-white py-2.5"
          onClick={connectApp}
        >
          Connect
        </button>
      )}
    </>
  );
};
export default ConnectWallet;
