import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionsListeComponent } from './promotions-liste.component';

describe('PromotionsListeComponent', () => {
  let component: PromotionsListeComponent;
  let fixture: ComponentFixture<PromotionsListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PromotionsListeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionsListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
