import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
        path: '',
        loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent), 
     },
    { 
        path: 'solflare-wallet', 
        loadComponent: () => import('./modules/solflare-wallet/solflare-wallet.component').then(m => m.SolflareWalletComponent) 
    },
    {
        path:'phantom-wallet',
        loadComponent: () => import('./modules/wallet-integration/wallet-integration.component').then(m => m.WalletIntegrationComponent)

    }
      ];
