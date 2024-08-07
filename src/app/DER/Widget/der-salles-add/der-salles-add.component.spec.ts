import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerSallesAddComponent } from './der-salles-add.component';

describe('DerSallesAddComponent', () => {
  let component: DerSallesAddComponent;
  let fixture: ComponentFixture<DerSallesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DerSallesAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DerSallesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
