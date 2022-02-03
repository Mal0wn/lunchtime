import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeInformationsComponent } from './change-informations.component';

describe('ChangeInformationsComponent', () => {
  let component: ChangeInformationsComponent;
  let fixture: ComponentFixture<ChangeInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeInformationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
