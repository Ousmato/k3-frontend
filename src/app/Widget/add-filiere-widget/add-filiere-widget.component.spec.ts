import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFiliereWidgetComponent } from './add-filiere-widget.component';

describe('AddFiliereWidgetComponent', () => {
  let component: AddFiliereWidgetComponent;
  let fixture: ComponentFixture<AddFiliereWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFiliereWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFiliereWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
