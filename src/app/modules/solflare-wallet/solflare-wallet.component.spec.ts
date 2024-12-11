import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolflareWalletComponent } from './solflare-wallet.component';

describe('SolflareWalletComponent', () => {
  let component: SolflareWalletComponent;
  let fixture: ComponentFixture<SolflareWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolflareWalletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolflareWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
