import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RSImportComponent } from './r-s-import.component';

describe('RSImportComponent', () => {
  let component: RSImportComponent;
  let fixture: ComponentFixture<RSImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RSImportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RSImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
