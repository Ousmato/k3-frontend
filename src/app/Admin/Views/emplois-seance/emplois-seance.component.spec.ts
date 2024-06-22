import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploisSeanceComponent } from './emplois-seance.component';

describe('EmploisSeanceComponent', () => {
  let component: EmploisSeanceComponent;
  let fixture: ComponentFixture<EmploisSeanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmploisSeanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmploisSeanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
