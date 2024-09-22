import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUeComponent } from './view-ue.component';

describe('ViewUeComponent', () => {
  let component: ViewUeComponent;
  let fixture: ComponentFixture<ViewUeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewUeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewUeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
