import { Injectable } from '@angular/core';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { BaseMessageSignerWalletAdapter, SupportedTransactionVersions, TransactionOrVersionedTransaction, WalletAdapterNetwork, WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import { BehaviorSubject } from 'rxjs';
import { Connection, PublicKey } from '@solana/web3.js';
import { clusterApiUrl } from '@solana/web3.js';  // Solana's API for RPC URLs
import Solflare from '@solflare-wallet/sdk';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class SolflareService extends BaseMessageSignerWalletAdapter {
  override signMessage(message: Uint8Array): Promise<Uint8Array> {
    throw new Error('Method not implemented.');
  }

  override signTransaction<T extends TransactionOrVersionedTransaction<this['supportedTransactionVersions']>>(transaction: T): Promise<T> {
    throw new Error('Method not implemented.');
  }
  override name!: WalletName<string>;
  override url!: string;
  override icon!: string;
  override readyState!: WalletReadyState;
  override publicKey!: PublicKey | null;
  override connecting!: boolean;
  override supportedTransactionVersions?: SupportedTransactionVersions;
  override connect(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  override disconnect(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  private _wallet: SolflareWalletAdapter | null  = null;
  private connection!: Connection;
  private walletAdapter: SolflareWalletAdapter | null = null;
  private currentNetwork: WalletAdapterNetwork = WalletAdapterNetwork.Testnet; // Default network is Testnet
  public walletAddress$ = new BehaviorSubject<string | null>(null);

  private networkUrls: { [key: string]: string } = {
    bnb: 'https://bsc-dataseed.binance.org/', // BNB Chain RPC URL
    holesky: 'https://api.holesky.solana.com/', // Solana Holesky RPC URL
  };
  constructor( private toastr: ToastrService) {
    super();
    this.initializeWalletAdapter();
    this.connection = new Connection('https://api.testnet.solana.com');  // Default to testnet
    const solflareWallet = localStorage.getItem('SolflarewalletAddress');
    if (solflareWallet) {
      this.walletAddress$.next(solflareWallet);
    }
  }

  private initializeWalletAdapter(): void {
    this.walletAdapter = new SolflareWalletAdapter({
      network: this.currentNetwork, // Use the current network
    });
  }
  
  async connectWallet(): Promise<void> {
    try {
      if (this.walletAdapter && !this.walletAdapter.connected) {
        await this.walletAdapter.connect();
        this.wallet();
        console.log('wallet',this.walletAdapter);
        console.log('Wallet connected:', this.walletAdapter.publicKey?.toBase58());
        localStorage.setItem('SolflarewalletAddress', this.walletAdapter.publicKey?.toBase58() ?? '');
        this.walletAddress$.next(this.walletAdapter.publicKey?.toBase58() ?? null);
      }
    } catch (error: any) {
      console.log('Error connecting wallet:', error);
    }
  }

   wallet(): SolflareWalletAdapter | null {
    const data: any = this.walletAdapter;
    localStorage.setItem('network',data._wallet._network);
    console.log("wallet network",data._wallet._network)
    return this.walletAdapter;
  }

  async disconnectWallet(): Promise<void> {
    console.log('disconnectWallet');
    try {
      if (this.walletAdapter && this.walletAdapter.connected) {
        await this.walletAdapter.disconnect();
        console.log('Wallet disconnected');
        this.walletAddress$.next(null);
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }

  async getCurrentWalletAddress(): Promise<string | null> {
    if (this.walletAdapter?.publicKey) {
      return this.walletAdapter.publicKey.toBase58();
    }
    return null;
  }
}

