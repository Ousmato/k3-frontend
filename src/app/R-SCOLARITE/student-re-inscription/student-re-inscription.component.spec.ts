import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentReInscriptionComponent } from './student-re-inscription.component';

describe('StudentReInscriptionComponent', () => {
  let component: StudentReInscriptionComponent;
  let fixture: ComponentFixture<StudentReInscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentReInscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentReInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
