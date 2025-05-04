import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchVeiwsComponent } from './search-veiws.component';

describe('SearchVeiwsComponent', () => {
  let component: SearchVeiwsComponent;
  let fixture: ComponentFixture<SearchVeiwsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchVeiwsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchVeiwsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
