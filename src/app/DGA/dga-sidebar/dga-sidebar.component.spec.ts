import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgaSidebarComponent } from './dga-sidebar.component';

describe('DgaSidebarComponent', () => {
  let component: DgaSidebarComponent;
  let fixture: ComponentFixture<DgaSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DgaSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgaSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
