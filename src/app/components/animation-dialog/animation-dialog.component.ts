import {Component, Inject, OnInit} from '@angular/core';
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface DialogData {
  isCorrect: boolean;
  animationUrl: string;
}

@Component({
  selector: 'app-animation-dialog',
  standalone: true,
  imports: [
    MatIconButton,
    MatIcon
  ],
  templateUrl: './animation-dialog.component.html',
  styleUrl: './animation-dialog.component.scss'
})
export class AnimationDialogComponent implements OnInit{

  safeAnimationUrl: SafeResourceUrl;

  constructor(
    public dialogRef: MatDialogRef<AnimationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private sanitizer: DomSanitizer
  ) {
    this.safeAnimationUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.animationUrl);
  }

  ngOnInit() {
    setTimeout(() => {
      this.closeDialog();
    }, 3000);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onVideoEnded(): void {
    this.closeDialog();
  }

}
