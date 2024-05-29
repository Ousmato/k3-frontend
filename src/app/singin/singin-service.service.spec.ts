import { TestBed } from '@angular/core/testing';

import { SinginServiceService } from './singin-service.service';

describe('SinginServiceService', () => {
  let service: SinginServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SinginServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
