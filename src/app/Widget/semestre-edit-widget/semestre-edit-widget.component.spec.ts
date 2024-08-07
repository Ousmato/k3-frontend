import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemestreEditWidgetComponent } from './semestre-edit-widget.component';

describe('SemestreEditWidgetComponent', () => {
  let component: SemestreEditWidgetComponent;
  let fixture: ComponentFixture<SemestreEditWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SemestreEditWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SemestreEditWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
