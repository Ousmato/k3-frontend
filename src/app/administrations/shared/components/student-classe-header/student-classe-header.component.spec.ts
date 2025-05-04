import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentClasseHeaderComponent } from './student-classe-header.component';

describe('StudentClasseHeaderComponent', () => {
  let component: StudentClasseHeaderComponent;
  let fixture: ComponentFixture<StudentClasseHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentClasseHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentClasseHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
