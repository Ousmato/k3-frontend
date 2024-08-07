import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerEmploiDuTempsComponent } from './der-emploi-du-temps.component';

describe('DerEmploiDuTempsComponent', () => {
  let component: DerEmploiDuTempsComponent;
  let fixture: ComponentFixture<DerEmploiDuTempsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DerEmploiDuTempsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DerEmploiDuTempsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
