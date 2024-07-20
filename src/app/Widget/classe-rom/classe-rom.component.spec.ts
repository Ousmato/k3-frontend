import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasseRomComponent } from './classe-rom.component';

describe('ClasseRomComponent', () => {
  let component: ClasseRomComponent;
  let fixture: ComponentFixture<ClasseRomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClasseRomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClasseRomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
