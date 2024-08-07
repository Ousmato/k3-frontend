import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnseignantFichePaieComponent } from './enseignant-fiche-paie.component';

describe('EnseignantFichePaieComponent', () => {
  let component: EnseignantFichePaieComponent;
  let fixture: ComponentFixture<EnseignantFichePaieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnseignantFichePaieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnseignantFichePaieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
