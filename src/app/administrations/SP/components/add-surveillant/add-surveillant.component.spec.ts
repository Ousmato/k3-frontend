import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSurveillantComponent } from './add-surveillant.component';

describe('AddSurveillantComponent', () => {
  let component: AddSurveillantComponent;
  let fixture: ComponentFixture<AddSurveillantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSurveillantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSurveillantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
