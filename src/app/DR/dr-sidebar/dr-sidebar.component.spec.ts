import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrSidebarComponent } from './dr-sidebar.component';

describe('DrSidebarComponent', () => {
  let component: DrSidebarComponent;
  let fixture: ComponentFixture<DrSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DrSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
