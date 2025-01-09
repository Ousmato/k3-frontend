import { TestBed } from '@angular/core/testing';

import { SeancService } from './seanc.service';

describe('SeancService', () => {
  let service: SeancService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeancService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
