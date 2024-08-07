import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerSallesComponent } from './der-salles.component';

describe('DerSallesComponent', () => {
  let component: DerSallesComponent;
  let fixture: ComponentFixture<DerSallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DerSallesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DerSallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
