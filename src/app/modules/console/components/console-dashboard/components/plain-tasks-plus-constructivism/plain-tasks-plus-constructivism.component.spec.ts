import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainTasksPlusConstructivismComponent } from './plain-tasks-plus-constructivism.component';

describe('PlainTasksPlusConstructivismComponent', () => {
  let component: PlainTasksPlusConstructivismComponent;
  let fixture: ComponentFixture<PlainTasksPlusConstructivismComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlainTasksPlusConstructivismComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlainTasksPlusConstructivismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
