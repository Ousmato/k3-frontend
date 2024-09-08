import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerDocComponent } from './der-doc.component';

describe('DerDocComponent', () => {
  let component: DerDocComponent;
  let fixture: ComponentFixture<DerDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DerDocComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DerDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
