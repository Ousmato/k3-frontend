import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosteAdminUsersComponent } from './poste-admin-users.component';

describe('PosteAdminUsersComponent', () => {
  let component: PosteAdminUsersComponent;
  let fixture: ComponentFixture<PosteAdminUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PosteAdminUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosteAdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
