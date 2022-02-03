import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickNumberComponent } from './pick-number.component';

describe('PickNumberComponent', () => {
  let component: PickNumberComponent;
  let fixture: ComponentFixture<PickNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
