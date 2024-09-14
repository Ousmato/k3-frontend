import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiveauWidgetComponent } from './niveau-widget.component';

describe('NiveauWidgetComponent', () => {
  let component: NiveauWidgetComponent;
  let fixture: ComponentFixture<NiveauWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NiveauWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NiveauWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
