import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerHomeComponent } from './der-home.component';

describe('DerHomeComponent', () => {
  let component: DerHomeComponent;
  let fixture: ComponentFixture<DerHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DerHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
