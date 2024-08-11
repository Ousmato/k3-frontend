import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RSHomeComponent } from './r-s-home.component';

describe('RSHomeComponent', () => {
  let component: RSHomeComponent;
  let fixture: ComponentFixture<RSHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RSHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RSHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
