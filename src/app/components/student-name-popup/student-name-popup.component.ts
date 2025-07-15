import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AttentionService} from "../../services/attention.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

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

  readonly dialogRef = inject(MatDialogRef<StudentNamePopupComponent>);
  data = inject(MAT_DIALOG_DATA);

  private attentionService = inject(AttentionService);

  popupForm = new FormGroup({
    studentName: new FormControl(),
    roundNumber: new FormControl(),
  })
  submitDetails(): void {
    this.attentionService.trackAttention(
      this.popupForm.get('studentName')?.value,
      this.popupForm.get('roundNumber')?.value,
    ).subscribe(response => {
      console.log(response);

      const studentName = this.popupForm.get('studentName')?.value;
      let intervalIndex = 0;

      const intervalId = setInterval(() => {
        this.attentionService.getStudentAttentionLevel(studentName).subscribe((response: any) => {
          const overallData = response?.data.overall ?? [];

          if (overallData.length > 0) {
            const currentOverallAttention = overallData[intervalIndex];
            console.log(`Overall Attention: ${currentOverallAttention}`);

            if (currentOverallAttention < 65) {
              console.log("you lost your attention");
            }

            intervalIndex++;

            if (intervalIndex >= overallData.length) {
              clearInterval(intervalId);
            }
          } else {
            console.error("No overall data found or array is empty.");
            clearInterval(intervalId);
          }
        });
      }, 10000);
    });
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
