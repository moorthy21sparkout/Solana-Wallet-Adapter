import { Component, OnInit } from '@angular/core';
import { SolanaService } from '../../../service/solana.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { initFlowbite } from 'flowbite';
import { Router } from '@angular/router';
import { WalletFormatPipe } from "../../pipes/wallet-format.pipe";
import { Clipboard } from '@angular/cdk/clipboard';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'; // Add Solana-specific imports
import { Buffer } from 'buffer';
window.Buffer = Buffer;
@Component({
  selector: 'app-wallet-integration',
  standalone: true,
  imports: [CommonModule, WalletFormatPipe],
  templateUrl: './wallet-integration.component.html',
  styleUrls: ['./wallet-integration.component.css']
})
export class WalletIntegrationComponent implements OnInit {

  walletAddress: string | null = null;
  isMetaMaskConnected: boolean = false;
  isSolanaConnected: boolean = false;
  currentNetwork: string = 'testnet';
  showSwitchNetworkButton: boolean = false;  // Track if we should show the switch button
  connection: Connection = new Connection('https://api.devnet.solana.com'); // Use Solana devnet for example
  phantomWalletAddress: string | null = null;
  constructor(
    private solanaService: SolanaService,
    private toastr: ToastrService,
    private router: Router,
    private clipboard: Clipboard
  ) {}

  ngOnInit() {
    initFlowbite();
    this.phantomWalletAddress = localStorage.getItem('phantomWalletAddress');
    this.solanaService.walletAddress$.subscribe(walletAddress => {
      this.walletAddress = walletAddress;
      this.isSolanaConnected = this.solanaService.isPhantomConnectedStatus();
    });
  }

  // Connect to Phantom (Solana)
  connectPhantom(): void {
    this.solanaService.connectPhantom();
  }

  // Disconnect Phantom (Solana)
  disconnectPhantom(): void {
    this.solanaService.disconnectPhantom();
    this.isSolanaConnected = false;
    this.toastr.info('Phantom wallet disconnected!');
    this.router.navigate(['/']);
  }

  // Copy address to clipboard
  copyToClipboard(address: string) {
    this.clipboard.copy(address);
    this.toastr.info('Address copied to clipboard!');
  }

  // Send transaction using Phantom wallet
  async sendTransaction() {
    try {
      const { solana } = window as any;

      // Ensure Phantom wallet is installed and accessible
      if (!solana || !solana.isPhantom) {
        console.log('Phantom wallet is not installed');
        alert('Phantom wallet is not installed');
        return;
      }

      // If Phantom wallet is not connected, prompt the user to connect
      if (!solana.isConnected) {
        try {
          await solana.connect();  // This will open Phantom for connection
          console.log('Phantom wallet is now connected');
        } catch (error) {
          console.error('Failed to connect to Phantom wallet:', error);
          alert('Failed to connect to Phantom wallet.');
          return;
        }
      }

      // If wallet is connected, proceed with the transaction
      const publicKey = solana.publicKey;
      console.log('Connected wallet address:', publicKey.toString());

      // Fetch the latest blockhash from the Solana network
      const { blockhash } = await this.connection.getLatestBlockhash();
      console.log('Fetched latest blockhash:', blockhash);

      // Define the transaction details
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey, // Set the fee payer to the sender's public key
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey:this.phantomWalletAddress as any, // Use the walletAddress passed into the component
          lamports: 0.000001 * 1000000000, // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
        })
      );

      // Request Phantom wallet to sign and send the transaction
      const { signature } = await solana.signAndSendTransaction(transaction);

      // Confirm the transaction
      const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');
      if (confirmation.value.err) {
        console.log('Transaction failed');
        this.toastr.error('Transaction failed');
        return;
      }

      console.log('Transaction successful! Signature:', signature);
      this.toastr.success('Transaction sent successfully!');
    } catch (error: any) {
      console.log('Error sending transaction:', error);
      this.toastr.error(error?.message || 'Failed to send transaction');
    }
  }
}
