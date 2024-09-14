import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UeWidgetComponent } from './ue-widget.component';

describe('UeWidgetComponent', () => {
  let component: UeWidgetComponent;
  let fixture: ComponentFixture<UeWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UeWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UeWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
