import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasseroomWidgetComponent } from './classeroom-widget.component';

describe('ClasseroomWidgetComponent', () => {
  let component: ClasseroomWidgetComponent;
  let fixture: ComponentFixture<ClasseroomWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClasseroomWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClasseroomWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
