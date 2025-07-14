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
  @Output() onSubmit = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<void>();

  studentName: string = '';

  submitName(): void {
    if (this.studentName.trim()) {
      this.onSubmit.emit(this.studentName.trim());
      this.studentName = '';
    }
  }

  cancel(): void {
    this.studentName = '';
    this.onCancel.emit();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submitName();
    }
  }
}
