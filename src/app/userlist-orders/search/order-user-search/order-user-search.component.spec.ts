import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderUserSearchComponent } from './order-user-search.component';

describe('OrderUserSearchComponent', () => {
  let component: OrderUserSearchComponent;
  let fixture: ComponentFixture<OrderUserSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderUserSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderUserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
