import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerEditSeanceComponent } from './der-edit-seance.component';

describe('DerEditSeanceComponent', () => {
  let component: DerEditSeanceComponent;
  let fixture: ComponentFixture<DerEditSeanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DerEditSeanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DerEditSeanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
