import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreIntermediateLevelComponent } from './pre-intermediate-level.component';

describe('PreIntermediateLevelComponent', () => {
  let component: PreIntermediateLevelComponent;
  let fixture: ComponentFixture<PreIntermediateLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreIntermediateLevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreIntermediateLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
