import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerSidebarComponent } from './der-sidebar.component';

describe('DerSidebarComponent', () => {
  let component: DerSidebarComponent;
  let fixture: ComponentFixture<DerSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DerSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
