import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersPresenceComponent } from './teachers-presence.component';

describe('TeachersPresenceComponent', () => {
  let component: TeachersPresenceComponent;
  let fixture: ComponentFixture<TeachersPresenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeachersPresenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeachersPresenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
