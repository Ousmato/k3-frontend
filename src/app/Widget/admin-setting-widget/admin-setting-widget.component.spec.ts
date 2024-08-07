import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettingWidgetComponent } from './admin-setting-widget.component';

describe('AdminSettingWidgetComponent', () => {
  let component: AdminSettingWidgetComponent;
  let fixture: ComponentFixture<AdminSettingWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSettingWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminSettingWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
