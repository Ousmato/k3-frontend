import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploisWidgetComponent } from './emplois-widget.component';

describe('EmploisWidgetComponent', () => {
  let component: EmploisWidgetComponent;
  let fixture: ComponentFixture<EmploisWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmploisWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmploisWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
