import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleWidgetComponent } from './module-widget.component';

describe('ModuleWidgetComponent', () => {
  let component: ModuleWidgetComponent;
  let fixture: ComponentFixture<ModuleWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModuleWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModuleWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
