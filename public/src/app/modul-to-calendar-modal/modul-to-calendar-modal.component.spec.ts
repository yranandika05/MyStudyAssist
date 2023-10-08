import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulToCalendarModalComponent } from './modul-to-calendar-modal.component';

describe('ModulToCalendarModalComponent', () => {
  let component: ModulToCalendarModalComponent;
  let fixture: ComponentFixture<ModulToCalendarModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModulToCalendarModalComponent]
    });
    fixture = TestBed.createComponent(ModulToCalendarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
