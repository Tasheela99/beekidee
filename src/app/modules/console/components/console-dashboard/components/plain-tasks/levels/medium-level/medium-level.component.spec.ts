import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumLevelComponent } from './medium-level.component';

describe('MediumLevelComponent', () => {
  let component: MediumLevelComponent;
  let fixture: ComponentFixture<MediumLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediumLevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediumLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
