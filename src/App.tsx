import './App.css'
// import { TokenLaunchpad } from './components/TokenLaunchpad'

// wallet adapter imports
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { TokenForm } from './components/token-form';

function App() {
  const wallet = useWallet()
  return (
    <div className='bg-gray-900 '>
      <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 20
            }} className='' >

              <div className='w-full flex justify-between m-auto gap-4 mx-4'>
                <div>
                  <h2 className="text-2xl font-extrabold text-center text-white ">Solana Token Launchpad</h2>
                </div>
                <div className='flex gap-4'>
                  <div>
                    <WalletMultiButton />
                  </div>
                  <div>
                    <WalletDisconnectButton />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <TokenForm />
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}

export default App