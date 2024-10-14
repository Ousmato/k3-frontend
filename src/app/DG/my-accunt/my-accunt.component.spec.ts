import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAccuntComponent } from './my-accunt.component';

describe('MyAccuntComponent', () => {
  let component: MyAccuntComponent;
  let fixture: ComponentFixture<MyAccuntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyAccuntComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyAccuntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
