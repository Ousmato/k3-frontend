import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecAddSurveillanceComponent } from './sec-add-surveillance.component';

describe('SecAddSurveillanceComponent', () => {
  let component: SecAddSurveillanceComponent;
  let fixture: ComponentFixture<SecAddSurveillanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecAddSurveillanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecAddSurveillanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
