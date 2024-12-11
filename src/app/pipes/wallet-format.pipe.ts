import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'walletFormat',
  standalone: true
})
export class WalletFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value || value.length < 10) {
      return value; // Return as is if the address is too short
    }
    const firstFour = value.slice(0, 4);
    const lastFour = value.slice(-4);
    return `${firstFour}...${lastFour}`;
  }

}
