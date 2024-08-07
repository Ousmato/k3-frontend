import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiliereEditWidgetComponent } from './filiere-edit-widget.component';

describe('FiliereEditWidgetComponent', () => {
  let component: FiliereEditWidgetComponent;
  let fixture: ComponentFixture<FiliereEditWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiliereEditWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiliereEditWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
