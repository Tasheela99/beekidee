import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructivismTaskContextComponent } from './constructivism-task-context.component';

describe('ConstructivismTaskContextComponent', () => {
  let component: ConstructivismTaskContextComponent;
  let fixture: ComponentFixture<ConstructivismTaskContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructivismTaskContextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructivismTaskContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
