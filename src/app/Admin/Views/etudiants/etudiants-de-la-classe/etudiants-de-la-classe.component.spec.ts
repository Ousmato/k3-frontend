import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantsDeLaClasseComponent } from './etudiants-de-la-classe.component';

describe('EtudiantsDeLaClasseComponent', () => {
  let component: EtudiantsDeLaClasseComponent;
  let fixture: ComponentFixture<EtudiantsDeLaClasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtudiantsDeLaClasseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EtudiantsDeLaClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
