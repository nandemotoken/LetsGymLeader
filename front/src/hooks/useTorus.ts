import { useState } from 'react';
import Torus from "@toruslabs/torus-embed";
import { ethers } from "ethers";

export const useTorus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const connect = async () => {
    try {
      const torus = new Torus({
        buttonPosition: "bottom-left"
      });

      await torus.init({
        showTorusButton: false,
        network: {
          host: "mainnet",
          chainId: 1,
          networkName: "Main Ethereum Network"
        }
      });

      const accounts = await torus.login({ verifier: "twitter" });
      const provider = new ethers.BrowserProvider(torus.provider);
      
      setAccount(accounts[0]);
      setIsConnected(true);
      
      return { account: accounts[0], provider };
    } catch (error) {
      console.error("Torus login error:", error);
      return null;
    }
  };

  return {
    isConnected,
    account,
    connect
  };
};