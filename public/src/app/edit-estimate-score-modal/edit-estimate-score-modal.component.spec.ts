import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEstimateScoreModalComponent } from './edit-estimate-score-modal.component';

describe('EditEstimateScoreModalComponent', () => {
  let component: EditEstimateScoreModalComponent;
  let fixture: ComponentFixture<EditEstimateScoreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEstimateScoreModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEstimateScoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
