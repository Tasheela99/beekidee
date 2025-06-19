import { Component } from '@angular/core';
import * as faceapi from 'face-api.js';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'beekidee';

  async loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/assets/models');
    // Load other models as needed (e.g., faceExpressionNet)
  }
}
