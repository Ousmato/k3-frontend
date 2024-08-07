import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgaSettingComponent } from './dga-setting.component';

describe('DgaSettingComponent', () => {
  let component: DgaSettingComponent;
  let fixture: ComponentFixture<DgaSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DgaSettingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgaSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
