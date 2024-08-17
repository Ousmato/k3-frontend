import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgaArchivesComponent } from './dga-archives.component';

describe('DgaArchivesComponent', () => {
  let component: DgaArchivesComponent;
  let fixture: ComponentFixture<DgaArchivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DgaArchivesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgaArchivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
