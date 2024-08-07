import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModuleWidgetComponent } from './add-module-widget.component';

describe('AddModuleWidgetComponent', () => {
  let component: AddModuleWidgetComponent;
  let fixture: ComponentFixture<AddModuleWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddModuleWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddModuleWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
