import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletIntegrationComponent } from './wallet-integration.component';

describe('WalletIntegrationComponent', () => {
  let component: WalletIntegrationComponent;
  let fixture: ComponentFixture<WalletIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletIntegrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
