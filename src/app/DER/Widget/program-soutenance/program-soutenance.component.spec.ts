import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramSoutenanceComponent } from './program-soutenance.component';

describe('ProgramSoutenanceComponent', () => {
  let component: ProgramSoutenanceComponent;
  let fixture: ComponentFixture<ProgramSoutenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgramSoutenanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgramSoutenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
