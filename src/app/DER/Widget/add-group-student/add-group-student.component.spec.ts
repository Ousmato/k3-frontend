import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupStudentComponent } from './add-group-student.component';

describe('AddGroupStudentComponent', () => {
  let component: AddGroupStudentComponent;
  let fixture: ComponentFixture<AddGroupStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddGroupStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddGroupStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
