import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassRoomEditWidgetComponent } from './class-room-edit-widget.component';

describe('ClassRoomEditWidgetComponent', () => {
  let component: ClassRoomEditWidgetComponent;
  let fixture: ComponentFixture<ClassRoomEditWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClassRoomEditWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassRoomEditWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
