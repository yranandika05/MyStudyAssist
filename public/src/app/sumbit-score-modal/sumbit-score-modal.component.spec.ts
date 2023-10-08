import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SumbitScoreModalComponent } from './sumbit-score-modal.component';

describe('SumbitScoreModalComponent', () => {
  let component: SumbitScoreModalComponent;
  let fixture: ComponentFixture<SumbitScoreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SumbitScoreModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SumbitScoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
