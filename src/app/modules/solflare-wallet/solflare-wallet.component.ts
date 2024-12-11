import { Component } from '@angular/core';
import { SolflareService } from '../../../service/solflare.service';
import { CommonModule } from '@angular/common';
import Solflare from '@solflare-wallet/sdk';
import { initFlowbite } from 'flowbite';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { APP_NETWORK } from '../../../environment/enviroment';
import { WalletFormatPipe } from "../../pipes/wallet-format.pipe";
import { ToastrService } from 'ngx-toastr';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { Connection, Transaction, clusterApiUrl, SystemProgram } from '@solana/web3.js';
import { Buffer } from 'buffer'; // Polyfill Buffer for browser
window.Buffer = Buffer; 
@Component({
  selector: 'app-solflare-wallet',
  standalone: true,
  imports: [CommonModule, WalletFormatPipe],
  templateUrl: './solflare-wallet.component.html',
  styleUrls: ['./solflare-wallet.component.css']
})
export class SolflareWalletComponent {
  walletAddress: string | null = null;
  networkEnv = APP_NETWORK; 
  isConnected: boolean = false; 
  currentNetwork:any;
  network!: SolflareWalletAdapter;
  image!: string;
  private connection!: Connection;

  constructor(private solflareService: SolflareService, private toastr: ToastrService,
    private router: Router, private clipboard: Clipboard) {
    this.connection = new Connection('https://api.testnet.solana.com', 'confirmed');
}
  async ngOnInit(): Promise<void> {
    initFlowbite();
    this.currentNetwork = localStorage.getItem('network'); 
    const storedAddress = localStorage.getItem('SolflarewalletAddress');
    if (storedAddress) {
      this.walletAddress = storedAddress;
      this.isConnected = true; 
      this.image = new SolflareWalletAdapter().icon;
      console.log('Wallet address restored from storage:', storedAddress);
    }
  }

  async disconnectWallet() {
    await this.solflareService.disconnectWallet();
    localStorage.removeItem('SolflarewalletAddress');
    sessionStorage.clear();
    this.toastr.info('Solflare wallet disconnected!');
    this.walletAddress = null;
    this.isConnected = false;
    this.router.navigate(['/']);
  }

  copyToClipboard(address: string) {
    this.clipboard.copy(address);
    this.toastr.info('Address copied to clipboard!');
  }

  // async sendTransaction() {
  //   try {
  //     const { solana } = window as any;
    
  //     if (!solana) {
  //       console.log('Solflare wallet is not installed');
  //     }
    
  //     if (!solana.isConnected) {
  //       await solana.connect();
  //       console.log('Solflare wallet is connected');
  //     }
    
  //     const publicKey = solana.publicKey;
  //     console.log('Connected wallet address:', publicKey.toString());
    
  //     const { blockhash } = await this.connection.getLatestBlockhash();
  //     console.log('Fetched latest blockhash:', blockhash);
    
  //     const transaction = new Transaction({
  //       recentBlockhash: blockhash,
  //       feePayer: publicKey,
  //     }).add(
  //       SystemProgram.transfer({
  //         fromPubkey: publicKey,
  //         toPubkey: this.walletAddress as any,
  //         lamports: 0.000001 * 1000000000, // Convert SOL to lamports
  //       })
  //     );
    
  //     const { signature } = await solana.signAndSendTransaction(transaction);
  //     const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');
  //     if (confirmation.value.err) {
  //       console.log('Transaction failed');
  //       this.toastr.error('Transaction failed');
  //     }
    
  //     console.log('Transaction successful! Signature:', signature);
  //     this.toastr.success('Transaction sent successfully!');
  //   } catch (error: any) {
  //     console.error('Error sending transaction:', error);
  //     this.toastr.error(error.message || 'Failed to send transaction.');
  //   }
    
  // }
  async sendTransaction() {
    try {
      // Check if Solflare wallet is available
      const { solflare } = window as any;
  
      if (!solflare) {
        console.log('Solflare wallet is not installed');
        this.toastr.error('Solflare wallet is not installed.');
        return;
      }
  
      // Ensure the wallet is connected
      if (!solflare.isConnected) {
        await solflare.connect();
        console.log('Solflare wallet is connected');
      }
  
      const publicKey = solflare.publicKey;
      if (!publicKey) {
        throw new Error('No public key found. Please connect your wallet.');
      }
  
      console.log('Connected wallet address:', publicKey.toString());
  
      // Fetch the latest blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      console.log('Fetched latest blockhash:', blockhash);
      console.log('publicKey',publicKey);
      // Prepare the transaction
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey,  // Ensure the fee payer is set to the connected wallet's public key
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: this.walletAddress as any,
          lamports: 0.000001 * 1000000000, // Convert SOL to lamports
        })
      );
  
      // Sign and send the transaction
      const { signature } = await solflare.signAndSendTransaction(transaction);
      const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');
      if (confirmation.value.err) {
        console.log('Transaction failed');
        this.toastr.error('Transaction failed');
      }
  
      console.log('Transaction successful! Signature:', signature);
      this.toastr.success('Transaction sent successfully!');
    } catch (error: any) {
      console.error('Error sending transaction:', error);
      this.toastr.error(error.message || 'Failed to send transaction.');
    }
  }
  
  
  
  
}
