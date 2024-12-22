import React, { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { badges, Badge } from '../common/Badge';
import { createWalletClient, custom, getContract } from 'viem'

function GymLeader() {
  const [count, setCount] = useState(0)
  const { login, logout, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [address, setAddress] = useState<string>('');

  // ウォレットの接続とアドレス取得
  const connectWallet = async () => {
    try {
      if (wallets && wallets.length > 0) {
        const wallet = wallets[0];
        await wallet.switchChain(11155111); // Sepoliaテストネット
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