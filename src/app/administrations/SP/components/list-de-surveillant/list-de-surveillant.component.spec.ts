import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDeSurveillantComponent } from './list-de-surveillant.component';

describe('ListDeSurveillantComponent', () => {
  let component: ListDeSurveillantComponent;
  let fixture: ComponentFixture<ListDeSurveillantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListDeSurveillantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDeSurveillantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
