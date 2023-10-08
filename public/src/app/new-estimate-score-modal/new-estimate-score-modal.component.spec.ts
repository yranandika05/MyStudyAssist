import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEstimateScoreModalComponent } from './new-estimate-score-modal.component';

describe('NewEstimateScoreModalComponent', () => {
  let component: NewEstimateScoreModalComponent;
  let fixture: ComponentFixture<NewEstimateScoreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEstimateScoreModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEstimateScoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
