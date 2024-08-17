import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecSurveillanceComponent } from './sec-surveillance.component';

describe('SecSurveillanceComponent', () => {
  let component: SecSurveillanceComponent;
  let fixture: ComponentFixture<SecSurveillanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecSurveillanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecSurveillanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
