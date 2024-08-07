import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModuleWifgetComponent } from './update-module-wifget.component';

describe('UpdateModuleWifgetComponent', () => {
  let component: UpdateModuleWifgetComponent;
  let fixture: ComponentFixture<UpdateModuleWifgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateModuleWifgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateModuleWifgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
