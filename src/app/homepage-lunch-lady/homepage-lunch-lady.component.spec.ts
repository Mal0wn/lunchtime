import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageLunchLadyComponent } from './homepage-lunch-lady.component';

describe('HomepageLunchLadyComponent', () => {
  let component: HomepageLunchLadyComponent;
  let fixture: ComponentFixture<HomepageLunchLadyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomepageLunchLadyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageLunchLadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
