import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as faceapi from 'face-api.js';
import {FaceDetectionComponent} from "./test/face-detection/face-detection.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FaceDetectionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'beekidee';

  async loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
    // Load other models as needed (e.g., faceExpressionNet)
  }
}
