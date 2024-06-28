import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnseignantPrDetailsComponent } from './enseignant-pr-details.component';

describe('EnseignantPrDetailsComponent', () => {
  let component: EnseignantPrDetailsComponent;
  let fixture: ComponentFixture<EnseignantPrDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnseignantPrDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnseignantPrDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
