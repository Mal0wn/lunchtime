import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyMealComponent } from './modify-meal.component';

describe('ModifyMealComponent', () => {
  let component: ModifyMealComponent;
  let fixture: ComponentFixture<ModifyMealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyMealComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
