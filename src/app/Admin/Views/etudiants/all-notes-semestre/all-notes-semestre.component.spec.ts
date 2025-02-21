import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllNotesSemestreComponent } from './all-notes-semestre.component';

describe('AllNotesSemestreComponent', () => {
  let component: AllNotesSemestreComponent;
  let fixture: ComponentFixture<AllNotesSemestreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllNotesSemestreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllNotesSemestreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
