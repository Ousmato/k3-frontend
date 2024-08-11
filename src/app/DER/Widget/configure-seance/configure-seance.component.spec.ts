import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureSeanceComponent } from './configure-seance.component';

describe('ConfigureSeanceComponent', () => {
  let component: ConfigureSeanceComponent;
  let fixture: ComponentFixture<ConfigureSeanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigureSeanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigureSeanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
