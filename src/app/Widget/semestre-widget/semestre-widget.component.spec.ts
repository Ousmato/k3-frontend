import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemestreWidgetComponent } from './semestre-widget.component';

describe('SemestreWidgetComponent', () => {
  let component: SemestreWidgetComponent;
  let fixture: ComponentFixture<SemestreWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SemestreWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SemestreWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
