import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AttentionService} from "../../services/attention.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

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
    studentName:new FormControl(),
    roundNumber:new FormControl(),
  })

  submitDetails(): void {
    this.attentionService.trackAttention(
      this.popupForm.get('studentName')?.value,
      this.popupForm.get('roundNumber')?.value,
    ).subscribe(response => {
      console.log(response);
    })
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
