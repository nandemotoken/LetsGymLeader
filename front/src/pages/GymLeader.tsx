import React, { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import {
  parseAbi, PublicClient, WalletClient, createPublicClient, createWalletClient, custom, getContract, http
,isAddress } from 'viem'
import { optimism } from 'viem/chains'
import { badges, Badge  } from "./../common/Badge"

function useViemClients() {
  const { wallets } = useWallets();
  const [clients, setClients] = useState<{
    walletClient: WalletClient | null;
    //viem型定義のほうがおかしいかも
    publicClient: any;
  }>({
    walletClient: null,
    publicClient: null
  });

  useEffect(() => {
    async function setupClients() {
      const wallet = wallets[0];
      if (!wallet) return;

      try {
        await wallet.switchChain(optimism.id);
        const provider = await wallet.getEthereumProvider();

        const walletClient = createWalletClient({
          chain: optimism,
          transport: custom(provider),
        });

        const publicClient = createPublicClient({
          chain: optimism,
          transport: http()
        });

        setClients({ walletClient, publicClient });
      } catch (error) {
        console.error('Failed to setup viem clients:', error);
        setClients({ walletClient: null, publicClient: null });
      }
    }

    setupClients();
  }, [wallets]);

  return clients;
}


function GymLeader() {
  const { login, logout, authenticated, user } = usePrivy();
  const [address, setAddress] = useState<string>('');
  const { walletClient, publicClient: publicClient } = useViemClients();
  const { wallets } = useWallets();
  const [walletAddress, setWalletAddress] = useState('')

  const handleSubmit = async () => {
    console.log(walletAddress)

    if (!walletClient || !publicClient) {
      console.log("no client")
      return
    };

    if (!isAddress(walletAddress)) {
      throw("invalid address")
    }

    const accounts = await walletClient.getAddresses()
    const account = accounts[0]
    console.dir(`account:${account}`)

    const badge = badges.find(badge => 
      badge.GymLeaderAddress.includes(account)
    )

    const contractAddress = badge?.contractAddress;
    console.log(`contractAddress:${contractAddress}`)

    if (!contractAddress || !isAddress(contractAddress)) {
      throw("invalid gymLeader")      
    }

    console.log(`trainer address ${walletAddress}`)

    await walletClient.writeContract({
      address: contractAddress,
      abi: parseAbi(["function sendBadge(address _trainer) public", "function name() public view returns (string)"]),
      functionName: 'sendBadge',
      args: [walletAddress],
      account: account,
      chain: optimism
    })

  }


  useEffect(() => {
    async function fetchContractData() {
      if (!walletClient || !publicClient) {
        console.log("no client")
        return
      };

      try {
        const name = await publicClient.readContract({
          address: '0x3bC4930D0192439De245bC2C94dE04c768306b27',
          abi: parseAbi(["function sendBadge(address _trainer) public", "function name() public view returns (string)"]),
          functionName: 'name'
        })

        console.log(name)



      } catch (error) {
        console.error('Contract read error:', error);
      }
    }

    fetchContractData();
  }, [walletClient, publicClient]);


  // privyの標準機能を使ったユーザ情報の取得(コントラクト接続なし)
  const connectWallet = async () => {
    try {
      if (wallets && wallets.length > 0) {
        const wallet = wallets[0];
        await wallet.switchChain(optimism.id);
        const provider = await wallet.getEthersProvider();
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
        console.log(user?.discord?.username);
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  }

  // 認証状態が変更されたら自動的にウォレット接続を実行
  useEffect(() => {
    if (authenticated && wallets.length > 0) {
      connectWallet();
    }
  }, [authenticated, wallets]);

  return (
    <>
      <h1>ジムリーダー専用画面</h1>

      {authenticated ? (
        <div>
          {address && <p>Wallet Address: {address}</p>}

          <div>
            <input type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="trainer address (check discord)"
            />
            <button onClick={handleSubmit}>
              バッジ発行
            </button>
          </div>

          <button onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <button onClick={() => login({ loginMethods: ['discord'] })}>
          Login with discord
        </button>
      )}
    </>
  )
}

export default GymLeader