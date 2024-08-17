import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecSidebarComponent } from './sec-sidebar.component';

describe('SecSidebarComponent', () => {
  let component: SecSidebarComponent;
  let fixture: ComponentFixture<SecSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
