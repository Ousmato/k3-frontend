import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSuivisComponent } from './student-suivis.component';

describe('StudentSuivisComponent', () => {
  let component: StudentSuivisComponent;
  let fixture: ComponentFixture<StudentSuivisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentSuivisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSuivisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
