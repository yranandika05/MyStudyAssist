import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditScoreModalComponent } from './edit-score-modal.component';

describe('EditScoreModalComponent', () => {
  let component: EditScoreModalComponent;
  let fixture: ComponentFixture<EditScoreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditScoreModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditScoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
