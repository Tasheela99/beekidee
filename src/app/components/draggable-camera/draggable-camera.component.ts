import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {CdkDrag, CdkDragHandle} from '@angular/cdk/drag-drop';
import {MatButton, MatIconButton} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-draggable-camera',
  standalone: true,
  imports: [
    CdkDrag,
    MatButton,
    MatIcon,
    NgIf,
    CdkDragHandle,
    MatIconButton
  ],
  templateUrl: './draggable-camera.component.html',
  styleUrls: ['./draggable-camera.component.scss']
})
export class DraggableCameraComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  isActive = false;
  showCamera = true;
  private stream: MediaStream | null = null;

  ngOnInit() {
    this.requestCameraPermission();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  async requestCameraPermission() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = this.stream;
      this.videoElement.nativeElement.play();
      this.isActive = true;
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  }

  toggleCamera() {
    if (this.isActive) {
      this.stopCamera();
    } else {
      this.requestCameraPermission();
    }
    this.isActive = !this.isActive;
  }

  closeCamera() {
    this.showCamera = false;
    this.stopCamera();
  }

  private stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}
