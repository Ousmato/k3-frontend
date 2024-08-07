import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassRoomWidgetComponent } from './class-room-widget.component';

describe('ClassRoomWidgetComponent', () => {
  let component: ClassRoomWidgetComponent;
  let fixture: ComponentFixture<ClassRoomWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClassRoomWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassRoomWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
