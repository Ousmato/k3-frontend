import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RSSidebarComponent } from './r-s-sidebar.component';

describe('RSSidebarComponent', () => {
  let component: RSSidebarComponent;
  let fixture: ComponentFixture<RSSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RSSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RSSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
