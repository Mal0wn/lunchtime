import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlistOrdersComponent } from './userlist-orders.component';

describe('UserlistOrdersComponent', () => {
  let component: UserlistOrdersComponent;
  let fixture: ComponentFixture<UserlistOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserlistOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserlistOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
