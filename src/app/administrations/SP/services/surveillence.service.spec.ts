import { TestBed } from '@angular/core/testing';

import { SurveillenceService } from './surveillence.service';

describe('SurveillenceService', () => {
  let service: SurveillenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveillenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
