import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerPaiListComponent } from './der-pai-list.component';

describe('DerPaiListComponent', () => {
  let component: DerPaiListComponent;
  let fixture: ComponentFixture<DerPaiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DerPaiListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DerPaiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
