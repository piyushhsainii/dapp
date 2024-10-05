'use client'
import { useState } from 'react'
import { Coins, Zap, DollarSign } from 'lucide-react'
import { CubeIcon } from '@radix-ui/react-icons'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { createInitializeInstruction, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, getMinimumBalanceForRentExemptAccount, MINT_SIZE, TOKEN_PROGRAM_ID } from '@solana/spl-token'

export function TokenForm() {

  const [ImageMode, setImageMode] = useState(false)
  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    initialSupply: '',
    decimals: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  // using connection and wallet hooks
  const { connection } = useConnection()
  const wallet = useWallet()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // fetching minimum rent for the mint account
    const minLamPorts = await getMinimumBalanceForRentExemptAccount(connection)
    // generating new keypairs for the mint account
    const newAccount = Keypair.generate()
    // 
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey!,
        newAccountPubkey: newAccount.publicKey,
        lamports: minLamPorts,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID

      }),
      createInitializeMetadataPointerInstruction(newAccount.publicKey, wallet.publicKey, newAccount.publicKey, TOKEN_PROGRAM_ID),
      createInitializeMintInstruction(newAccount.publicKey, 9, wallet.publicKey!, wallet.publicKey, TOKEN_PROGRAM_ID),
      // attaching metadata 
      createInitializeInstruction({
        name: formData.tokenName,
        symbol: formData.tokenSymbol,
        metadata: newAccount.publicKey,
        mint: newAccount.publicKey,
        programId: TOKEN_PROGRAM_ID,
        uri: formData.tokenSymbol,
        mintAuthority: wallet.publicKey!,
        updateAuthority: wallet.publicKey!
      })
    )
    console.log("checkpoint")
    // pay fees
    transaction.feePayer = wallet.publicKey!
    // set recent block hash
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    // partailly sign the message
    transaction.partialSign(newAccount)
    await wallet.sendTransaction(transaction, connection)
    console.log(`Token mint created at ${newAccount.publicKey.toBase58()}`);
  }



  return (
    <div className="h-[90vh] md:min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-blue-800 to-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] z-10"></div>
        <div className="relative z-20">
          <h2 className="text-3xl font-extrabold text-center text-white mb-6">Solana Token Launchpad</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="tokenName" className="text-sm font-medium text-gray-300 flex items-center">
                <CubeIcon className="w-4 h-4 mr-2" />
                Token Name
              </label>
              <Input
                id="tokenName"
                name="tokenName"
                value={formData.tokenName}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                placeholder="Token Name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tokenSymbol" className="text-sm font-medium text-gray-300 flex items-center">
                <Coins className="w-4 h-4 mr-2" />
                Token Symbol
              </label>
              <Input
                id="tokenSymbol"
                name="tokenSymbol"
                value={formData.tokenSymbol}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                placeholder="e.g. ETH"
              />
            </div>
            <div className="space-y-2">
              <div className='flex justify-between'>
                <label htmlFor="initialSupply" className="text-sm font-medium text-gray-300 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Image URL
                </label>
                <div className='text-sm text-gray-400 underline cursor-pointer'>
                  Don't have hosted img? Click me
                </div>
              </div>

              <div className='flex justify-between items-center'>
                <Input
                  id="initialSupply"
                  name="initialSupply"
                  value={formData.initialSupply}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 "
                  placeholder="Image URL"
                />

              </div>
              {

                ImageMode &&
                <>
                  {
                    ImageMode &&
                    <div className='flex justify-between items-center'>
                      <Input
                        id="initialSupply"
                        name="initialSupply"
                        value={formData.initialSupply}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        placeholder="Image URL"
                      />
                      <button className='py-[0.350rem] text-base text-white  bg-gradient-to-r from-blue-500 to-purple-600  font-bold'
                      >
                        Upload
                      </button>
                    </div>
                  }
                  <div className='font-medium font-sans text-gray-300 '>
                    https:localhost:3000
                  </div>
                </>
              }
            </div>
            <div className="space-y-2">
              <label htmlFor="decimals" className="text-sm font-medium text-gray-300 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Initial Supply
              </label>
              <Input
                id="decimals"
                name="decimals"
                type="number"
                value={formData.decimals}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                placeholder="e.g. 500 tokens"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
              Create Token
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}