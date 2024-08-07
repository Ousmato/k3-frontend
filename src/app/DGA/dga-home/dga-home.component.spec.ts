import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgaHomeComponent } from './dga-home.component';

describe('DgaHomeComponent', () => {
  let component: DgaHomeComponent;
  let fixture: ComponentFixture<DgaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DgaHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
