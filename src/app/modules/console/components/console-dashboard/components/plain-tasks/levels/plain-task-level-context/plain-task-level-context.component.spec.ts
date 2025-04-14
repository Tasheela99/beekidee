import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainTaskLevelContextComponent } from './plain-task-level-context.component';

describe('PlainTaskLevelContextComponent', () => {
  let component: PlainTaskLevelContextComponent;
  let fixture: ComponentFixture<PlainTaskLevelContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlainTaskLevelContextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlainTaskLevelContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
