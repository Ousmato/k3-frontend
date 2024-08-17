import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReInscriptionWidgetComponent } from './re-inscription-widget.component';

describe('ReInscriptionWidgetComponent', () => {
  let component: ReInscriptionWidgetComponent;
  let fixture: ComponentFixture<ReInscriptionWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReInscriptionWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReInscriptionWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
