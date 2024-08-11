import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteSidebarComponent } from './compte-sidebar.component';

describe('CompteSidebarComponent', () => {
  let component: CompteSidebarComponent;
  let fixture: ComponentFixture<CompteSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompteSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompteSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
