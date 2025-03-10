import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceDetectionComponent } from './face-detection.component';

describe('FaceDetectionComponent', () => {
  let component: FaceDetectionComponent;
  let fixture: ComponentFixture<FaceDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaceDetectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaceDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
