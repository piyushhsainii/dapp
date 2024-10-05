import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'

const AirDrop = () => {
    const wallet = useWallet()
    const [publicKey, setpublicKey] = useState<any>("")
    const { connection } = useConnection()

    const sendTransaction = async () => {
        if (wallet.publicKey) {
            await connection.requestAirdrop(publicKey, 100000000)
        }
    }

    return (
        <div>
            <div>
                Your Wallet Public Key:  {wallet.publicKey?.toString()}
            </div>
            <div>
                AirDrop
            </div>
            <div className='flex justify-center gap-4 m-5'>
                <input type="text" value={publicKey} className='bg-white text-black' onChange={(e) => setpublicKey(e.target.value)} />
                {/* <button className='' onClick={sendTransaction} > SEND MONEY  </button> */}
            </div>
        </div>
    )
}

export default AirDrop