import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiliereWidgetComponent } from './filiere-widget.component';

describe('FiliereWidgetComponent', () => {
  let component: FiliereWidgetComponent;
  let fixture: ComponentFixture<FiliereWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiliereWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiliereWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
