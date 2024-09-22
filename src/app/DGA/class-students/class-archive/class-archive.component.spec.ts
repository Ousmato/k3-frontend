import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassArchiveComponent } from './class-archive.component';

describe('ClassArchiveComponent', () => {
  let component: ClassArchiveComponent;
  let fixture: ComponentFixture<ClassArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClassArchiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
