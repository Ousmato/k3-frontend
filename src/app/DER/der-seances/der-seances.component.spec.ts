import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerSeancesComponent } from './der-seances.component';

describe('DerSeancesComponent', () => {
  let component: DerSeancesComponent;
  let fixture: ComponentFixture<DerSeancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DerSeancesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DerSeancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
