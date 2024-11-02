import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainTasksPlusConstructivismPlusAttentionMonitoringAndReallocatingComponent } from './plain-tasks-plus-constructivism-plus-attention-monitoring-and-reallocating.component';

describe('PlainTasksPlusConstructivismPlusAttentionMonitoringAndReallocatingComponent', () => {
  let component: PlainTasksPlusConstructivismPlusAttentionMonitoringAndReallocatingComponent;
  let fixture: ComponentFixture<PlainTasksPlusConstructivismPlusAttentionMonitoringAndReallocatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlainTasksPlusConstructivismPlusAttentionMonitoringAndReallocatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlainTasksPlusConstructivismPlusAttentionMonitoringAndReallocatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
