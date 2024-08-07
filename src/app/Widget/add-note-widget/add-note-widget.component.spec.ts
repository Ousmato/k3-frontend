import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNoteWidgetComponent } from './add-note-widget.component';

describe('AddNoteWidgetComponent', () => {
  let component: AddNoteWidgetComponent;
  let fixture: ComponentFixture<AddNoteWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNoteWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNoteWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
