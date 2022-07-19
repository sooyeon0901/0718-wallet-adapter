
/* eslint-disable @typescript-eslint/no-unused-vars */
import { WalletAdapterNetwork, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
//import { Button } from '@solana/wallet-adapter-react-ui/lib/types/Button';
//import { getMint } from "@solana/spl-token";
import '../src/css/bootstrap.css'
import {
    GlowWalletAdapter,
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,

} from '@solana/wallet-adapter-wallets';
//import { CherryWalletAdapter } from 'cherry-adapter-test/src/component/cherryAdapter';
import CherryWalletAdapter from 'cherry-adapter-simple/src/context/CherryWalletAdapter';
//import fs from "fs";

import { clusterApiUrl,Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import React, { FC, ReactNode, useMemo, useCallback, useState } from 'react';

import { Connection} from '@metaplex/js'; 



require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');
//require('cherry-adapter-simple/src/context/CherryWalletAdapter');
let thelamports = 0;
let theWallet = "121212";
// function getWallet(){
// }

const App: FC = () => {
    return (
        <Context>
            <Content />
        </Context>
    );
};


export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
  // Context 가 모든 지갑들을 생성.
    const network = WalletAdapterNetwork.Mainnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [
            new LedgerWalletAdapter(),
            new PhantomWalletAdapter(),
            new GlowWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolletExtensionWalletAdapter(), 
            new SolletWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
            //new CherryWalletAdapter()
        ],
        [network]
    );
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};


const Content: FC = () => {
    let [lamports, setLamports] = useState(0);
    let [wallet, setWallet] = useState("121212");
    // const { connection } = useConnection();
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback( async () => {
      
        if (!publicKey) throw new WalletNotConnectedError();
        connection.getBalance(publicKey).then((bal) => {
            console.log(bal/LAMPORTS_PER_SOL);

        });

        let lamportsI = LAMPORTS_PER_SOL*lamports;
        console.log("송신 주소: {}", publicKey.toBase58());
        console.log("lamports sending: {}", thelamports);
        console.log("수신 주소: {}", theWallet);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: new PublicKey(theWallet),
                lamports: lamportsI,
            })
        );
        const signature = await sendTransaction(transaction, connection);

        await connection.confirmTransaction(signature, 'processed');
      
    }, [publicKey, connection, lamports, sendTransaction]);

    
    function setTheLamports(e: any)
    {
        console.log(Number(e.target.value));
        setLamports(Number(e.target.value));
        lamports = e.target.value;
        thelamports = lamports;
    }
    function setTheWallet(e: any){
        setWallet(e.target.value)
        theWallet = e.target.value;
    }

    // nft

    return (
        <div className="App">
          <div className="navbar">
            <div className="navbar-inner ">
              <a id="title" className="brand" href="#">Brand</a>
              <ul className="nav"></ul>
              <ul className="nav pull-right">
                <li><a href="#">White Paper</a></li>
                <li className="divider-vertical"></li>
                <li><WalletMultiButton /></li>
              </ul>
            </div>
          </div>
          <input placeholder='wallet' type="text" onChange={(e) => setTheWallet(e)}></input>
          <input placeholder='lamports' type="number" onChange={(e) => setTheLamports(e)}></input>
            <br></br>
          <button className='btn' onClick={onClick}>Send Sol </button>
        </div>
    );
};



// function setTheWallet() {
//   throw new Error('Function not implemented.');
// }
