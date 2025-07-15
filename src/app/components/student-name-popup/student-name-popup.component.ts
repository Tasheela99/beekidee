import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AttentionService } from "../../services/attention.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AttentionLostPopupComponent } from "../attention-lost-popup/attention-lost-popup.component";
import { Router } from '@angular/router';

interface AttentionData {
  student_id: string;
  interval_data: {
    interval_start: number;
    overall_attention: number;
  }[];
}

@Component({
  selector: 'app-student-name-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './student-name-popup.component.html',
  styleUrls: ['./student-name-popup.component.scss']
})
export class StudentNamePopupComponent {
  @Input() isVisible: boolean = false;
  @Output() onSubmit = new EventEmitter<{ name: string, round: number }>();
  @Output() onCancel = new EventEmitter<void>();
  isDialogOpen = false;

  readonly dialogRef = inject(MatDialogRef<StudentNamePopupComponent>);
  data = inject(MAT_DIALOG_DATA);

  private attentionService = inject(AttentionService);
  private router = inject(Router);  // Inject Router service

  popupForm = new FormGroup({
    studentName: new FormControl(),
    roundNumber: new FormControl(),
  });
  private dialog = inject(MatDialog);

  submitDetails(): void {
    this.attentionService.trackAttention(
      this.popupForm.get('studentName')?.value,
      this.popupForm.get('roundNumber')?.value,
    ).subscribe(response => {
      const studentName = this.popupForm.get('studentName')?.value;
      let intervalIndex = 0;

      const intervalId = setInterval(() => {
        this.attentionService.getStudentAttentionLevel(studentName).subscribe((response: any) => {
          const overallData = response?.data.overall ?? [];

          if (overallData.length > 0) {
            const currentOverallAttention = overallData[intervalIndex];
            console.log(`Overall Attention: ${currentOverallAttention}`);

            // Check if we are on the specific route
            if (this.router.url === '/console/admin/dashboard/constructivism-plus-attention/pre-intermediate') {
              if (currentOverallAttention < 70 && !this.isDialogOpen) {
                console.log("You lost your attention");
                this.openDialog();  // Open the dialog if route matches
              }

              if (currentOverallAttention >= 70 && this.isDialogOpen) {
                console.log("Your attention is back");
                this.closeDialog();  // Close the dialog if route matches
              }
            }

            intervalIndex++;

            if (intervalIndex >= overallData.length) {
              clearInterval(intervalId);  // Stop the interval when all data is processed
            }
          } else {
            console.error("No overall data found or array is empty.");
            clearInterval(intervalId);
          }
        });
      }, 10000);
      this.dialogRef.close();
    });
  }

  // Open the dialog and set the dialog open state to true
  openDialog(): void {
    this.dialog.open(AttentionLostPopupComponent);
    this.isDialogOpen = true;
  }

  // Close the dialog and set the dialog open state to false
  closeDialog(): void {
    this.dialog.closeAll();  // Close all open dialogs
    this.isDialogOpen = false;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submitDetails();
    }
  }
}
