import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RSReinscriptionComponent } from './r-s-reinscription.component';

describe('RSReinscriptionComponent', () => {
  let component: RSReinscriptionComponent;
  let fixture: ComponentFixture<RSReinscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RSReinscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RSReinscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
