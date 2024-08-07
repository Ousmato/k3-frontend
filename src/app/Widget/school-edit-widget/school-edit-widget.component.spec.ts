import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolEditWidgetComponent } from './school-edit-widget.component';

describe('SchoolEditWidgetComponent', () => {
  let component: SchoolEditWidgetComponent;
  let fixture: ComponentFixture<SchoolEditWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchoolEditWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchoolEditWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
