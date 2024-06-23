import { TestBed } from '@angular/core/testing';

import { EnseiService } from './ensei.service';

describe('EnseiService', () => {
  let service: EnseiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnseiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
