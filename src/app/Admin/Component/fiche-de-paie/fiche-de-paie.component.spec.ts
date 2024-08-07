import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheDePaieComponent } from './fiche-de-paie.component';

describe('FicheDePaieComponent', () => {
  let component: FicheDePaieComponent;
  let fixture: ComponentFixture<FicheDePaieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FicheDePaieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FicheDePaieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
