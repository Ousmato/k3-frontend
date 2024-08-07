import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgaMentionListComponent } from './dga-mention-list.component';

describe('DgaMentionListComponent', () => {
  let component: DgaMentionListComponent;
  let fixture: ComponentFixture<DgaMentionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DgaMentionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgaMentionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
