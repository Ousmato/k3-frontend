import { TestBed } from '@angular/core/testing';

import { ClassStudentService } from './class-student.service';

describe('ClassStudentService', () => {
  let service: ClassStudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassStudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
