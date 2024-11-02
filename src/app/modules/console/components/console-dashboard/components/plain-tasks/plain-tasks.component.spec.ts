import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainTasksComponent } from './plain-tasks.component';

describe('PlainTasksComponent', () => {
  let component: PlainTasksComponent;
  let fixture: ComponentFixture<PlainTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlainTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlainTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
