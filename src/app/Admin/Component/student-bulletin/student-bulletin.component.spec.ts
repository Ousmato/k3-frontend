import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBulletinComponent } from './student-bulletin.component';

describe('StudentBulletinComponent', () => {
  let component: StudentBulletinComponent;
  let fixture: ComponentFixture<StudentBulletinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentBulletinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentBulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
