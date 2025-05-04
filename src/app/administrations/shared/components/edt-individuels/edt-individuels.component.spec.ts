import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EDTIndividuelsComponent } from './edt-individuels.component';

describe('EDTIndividuelsComponent', () => {
  let component: EDTIndividuelsComponent;
  let fixture: ComponentFixture<EDTIndividuelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EDTIndividuelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EDTIndividuelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
