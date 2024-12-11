import { Component, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SolflareService } from '../../../service/solflare.service';
import { Router } from '@angular/router';
import { SolanaService } from '../../../service/solana.service';
import { initFlowbite } from 'flowbite';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
 walletAddress: string | null = null
 isSolflareConnection = signal(false);
 isPhantomConnection = signal(false);


constructor( private solflareService: SolflareService, private toastr: ToastrService, 
  private router: Router,private solanaService: SolanaService
){}

ngOnInit(): void {
  initFlowbite();
}
async connectSolflare() {
  this.isSolflareConnection.set(true);
  try {
    await this.solflareService.connectWallet();
    this.walletAddress = await this.solflareService.getCurrentWalletAddress();
    if (this.walletAddress) {
      this.toastr.info('Solflare wallet connected!');
      console.log('Navigating to /solflare-wallet');
      this.isSolflareConnection.set(true);
      this.router.navigate(['/solflare-wallet']);
    }
  } catch (error: any) {
    console.error('Error connecting to Solflare:', error);
    this.toastr.error('Error connecting to Solflare wallet: ' + (error?.message || 'Unknown error'));
    this.isSolflareConnection.set(false);
  }
}

async connectPhantom(): Promise<void> {
  this.isPhantomConnection.set(true);
  try {
    await this.solanaService.connectPhantom();
    this.router.navigate(['/phantom-wallet']);
    this.toastr.info('Phantom wallet connected!');
  } catch (error) {
    this.isPhantomConnection.set(false);
    this.toastr.error('Failed to connect wallet.');
  }
}
}
