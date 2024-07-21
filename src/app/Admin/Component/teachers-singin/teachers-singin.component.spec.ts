import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersSinginComponent } from './teachers-singin.component';

describe('TeachersSinginComponent', () => {
  let component: TeachersSinginComponent;
  let fixture: ComponentFixture<TeachersSinginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeachersSinginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeachersSinginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
