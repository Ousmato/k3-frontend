import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEDTComponent } from './add-edt.component';

describe('AddEDTComponent', () => {
  let component: AddEDTComponent;
  let fixture: ComponentFixture<AddEDTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEDTComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEDTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
