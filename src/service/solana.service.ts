import { Injectable } from '@angular/core';
import { Web3Provider } from '@ethersproject/providers';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolanaService {
  private walletAddress: string | null = null;
  private isMetaMaskConnected: boolean = false;
  private isPhantomConnected: boolean = false;
  public walletAddress$ = new BehaviorSubject<string | null>(null);
  private currentNetwork: string = 'testnet'; // Default to testnet
  public network$ = new BehaviorSubject<string>('testnet'); 

  constructor() { 
    const savedWalletAddress = localStorage.getItem('walletAddress');
    if (savedWalletAddress) {
      this.walletAddress = savedWalletAddress;
      this.isPhantomConnected = true;
      this.walletAddress$.next(this.walletAddress);
    }
   }
  // Connect to Phantom wallet (Solana)
  public async connectPhantom(): Promise<void> {
    try {
      if (!window.solana || !window.solana.isPhantom) {
        throw new Error('Phantom wallet is not installed.');
      }
      console.log("window.solana",window.solana)
      const response = await window.solana.connect();
      console.log("response",response.publicKey.toString())
      this.walletAddress = response.publicKey.toString();
      localStorage.setItem('phantomWalletAddress', this.walletAddress ?? '');
      console.log("walletAddress",this.walletAddress)
      this.isPhantomConnected = true;
      this.walletAddress$.next(this.walletAddress);
    } catch (err) {
      console.error('Phantom wallet connection error:', err);
    }
  }


  // Disconnect Phantom wallet
  public async disconnectPhantom(): Promise<void> {
    try {
      if (!window.solana || !window.solana.isPhantom) {
        throw new Error('Phantom wallet is not installed.');
      }

      await window.solana.disconnect();
      this.walletAddress = null;
      this.isPhantomConnected = false;
      this.walletAddress$.next(null);
      localStorage.removeItem('phantomWalletAddress');
    } catch (err) {
      console.error('Phantom wallet disconnect error:', err);
    }
  }

  // Get the current wallet address
  public getWalletAddress(): string | null {
    return this.walletAddress;
  }


  // Check if Phantom wallet is connected
  public isPhantomConnectedStatus(): boolean {
    return this.isPhantomConnected;
  }
}
