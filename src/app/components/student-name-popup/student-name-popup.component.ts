import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-name-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-name-popup.component.html',
  styleUrls: ['./student-name-popup.component.scss']
})
export class StudentNamePopupComponent {
  @Input() isVisible: boolean = false;
  @Output() onSubmit = new EventEmitter<{ name: string, round: number }>();
  @Output() onCancel = new EventEmitter<void>();

  studentName: string = '';
  roundNumber: number | null = null;

  submitDetails(): void {
    if (this.studentName.trim() && this.roundNumber !== null && this.roundNumber > 0) {
      this.onSubmit.emit({ name: this.studentName.trim(), round: this.roundNumber });
      this.studentName = '';
      this.roundNumber = null;
    }
  }

  cancel(): void {
    this.studentName = '';
    this.roundNumber = null;
    this.onCancel.emit();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submitDetails();
    }
  }
}
