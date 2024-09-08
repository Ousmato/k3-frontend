import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerEDTComponent } from './der-e-d-t.component';

describe('DerEDTComponent', () => {
  let component: DerEDTComponent;
  let fixture: ComponentFixture<DerEDTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DerEDTComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DerEDTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
