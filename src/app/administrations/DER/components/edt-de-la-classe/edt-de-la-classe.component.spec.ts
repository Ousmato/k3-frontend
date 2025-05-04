import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EDTDeLaClasseComponent } from './edt-de-la-classe.component';

describe('EDTDeLaClasseComponent', () => {
  let component: EDTDeLaClasseComponent;
  let fixture: ComponentFixture<EDTDeLaClasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EDTDeLaClasseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EDTDeLaClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
