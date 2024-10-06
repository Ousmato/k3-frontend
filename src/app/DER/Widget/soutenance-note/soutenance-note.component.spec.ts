import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoutenanceNoteComponent } from './soutenance-note.component';

describe('SoutenanceNoteComponent', () => {
  let component: SoutenanceNoteComponent;
  let fixture: ComponentFixture<SoutenanceNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoutenanceNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoutenanceNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
