import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportEnseignantComponent } from './import-enseignant.component';

describe('ImportEnseignantComponent', () => {
  let component: ImportEnseignantComponent;
  let fixture: ComponentFixture<ImportEnseignantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportEnseignantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportEnseignantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
