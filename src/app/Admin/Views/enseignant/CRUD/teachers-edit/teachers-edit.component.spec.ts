import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersEditComponent } from './teachers-edit.component';

describe('TeachersEditComponent', () => {
  let component: TeachersEditComponent;
  let fixture: ComponentFixture<TeachersEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeachersEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeachersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
