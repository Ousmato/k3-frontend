import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerTDComponentComponent } from './der-t-d-component.component';

describe('DerTDComponentComponent', () => {
  let component: DerTDComponentComponent;
  let fixture: ComponentFixture<DerTDComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DerTDComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DerTDComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
