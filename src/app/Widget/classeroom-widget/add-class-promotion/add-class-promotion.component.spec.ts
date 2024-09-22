import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClassPromotionComponent } from './add-class-promotion.component';

describe('AddClassPromotionComponent', () => {
  let component: AddClassPromotionComponent;
  let fixture: ComponentFixture<AddClassPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddClassPromotionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddClassPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
