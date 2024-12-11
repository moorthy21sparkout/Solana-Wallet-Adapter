import { TestBed } from '@angular/core/testing';

import { SolflareService } from './solflare.service';

describe('SolflareService', () => {
  let service: SolflareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolflareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
