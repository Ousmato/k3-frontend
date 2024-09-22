import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUeComponent } from './add-ue.component';

describe('AddUeComponent', () => {
  let component: AddUeComponent;
  let fixture: ComponentFixture<AddUeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
