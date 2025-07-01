// intermediate-level.component.ts
import {Component, inject} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {AnimationDialogComponent} from "../../../../../../../../components/animation-dialog/animation-dialog.component";
import {NgClass, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

const IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/intermediate1.png?alt=media&token=f3e4f182-9d1f-47a0-824f-3e6731099b92';

@Component({
  selector: 'app-intermediate-level',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    NgIf,
    NgClass,
    CdkDropListGroup,
    FormsModule
  ],
  templateUrl: './intermediate-level.component.html',
  styleUrl: './intermediate-level.component.scss'
})
export class IntermediateLevelComponent {
  items: string[] = [];
  basket: string[] = [];
  searchItem = '';
  itemFound = false;
  counter = 0;
  isStarted = false;
  isAnswerCorrect = false;
  errorMessage: string = '';
  currentQuestion: string = '';

  dialog = inject(MatDialog);

  dataList: any[] = [
    {
      image: IMAGE_URL,
      question: 'red A',
      correctCount: 6
    },
    {
      image: IMAGE_URL,
      question: 'blue B',
      correctCount: 5
    },
    {
      image: IMAGE_URL,
      question: 'purple C',
      correctCount: 4
    },
  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.container.data === this.basket) {
        if (this.basket.length > 0) {
          this.items.push(...this.basket);
          this.basket = [];
        }

        const itemToMove = event.previousContainer.data[event.previousIndex];
        event.previousContainer.data.splice(event.previousIndex, 1);
        this.basket.push(itemToMove);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }

    setTimeout(() => {
      this.checkAnswer();
    }, 0);
  }

  checkAnswer() {
    const correctCount = this.dataList[this.counter].correctCount;

    if (this.basket.length === 1) {
      const userAnswer = parseInt(this.basket[0], 10); // Added radix parameter
      if (!isNaN(userAnswer)) { // Added check for valid number
        this.itemFound = userAnswer === correctCount;
      } else {
        this.itemFound = false;
      }
    } else {
      this.itemFound = false;
    }

    this.setAlerts(this.itemFound);
  }

  setAlerts(answer: boolean) {
    if (answer) {
      this.isAnswerCorrect = true;
      this.openAnimationDialog(true, 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/emoji-animations%2Fhappy-start.webm?alt=media&token=f369ae30-66d3-4642-9c03-8405c18bf203');
      setTimeout(() => {
        this.moveToNext();
      }, 3000);
    } else {
      this.isAnswerCorrect = false;
      // Only show incorrect animation if there's actually an answer in the basket
      if (this.basket.length > 0) {
        this.openAnimationDialog(false, 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/emoji-animations%2Fnot-correct.webm?alt=media&token=fc447df6-587a-4429-a56e-9f178fe12073');
      }
    }
  }

  private openAnimationDialog(isCorrect: boolean, animationUrl: string): void {
    const dialogRef = this.dialog.open(AnimationDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100vh',
      width: '100vw',
      panelClass: 'fullscreen-dialog',
      data: {isCorrect, animationUrl}
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Animation dialog closed');
    });
  }

  start() {
    this.items = this.shuffleArray(['1', '4', '5', '6']);
    this.currentQuestion = this.dataList[0].question;
    this.isStarted = true;
    this.basket = [];
    this.errorMessage = '';
    this.isAnswerCorrect = false;
  }

  moveToNext() {
    if (this.counter + 1 < this.dataList.length) {
      this.counter += 1;
      this.reset();
      this.items = this.shuffleArray(['1', '4', '5', '6']);
      this.currentQuestion = this.dataList[this.counter].question;
    } else {
      this.reStartGame();
    }
  }

  reset() {
    this.isAnswerCorrect = false;
    this.itemFound = false;
    this.basket = [];
    this.errorMessage = '';
  }

  reStartGame() {
    this.reset();
    this.counter = 0;
    this.isStarted = false;
    this.items = [];
    this.currentQuestion = '';
  }

  onImageError(event: Event) {
    this.errorMessage = 'Error loading image. Please check the URL or try again later.';
    console.error('Image loading error:', event);
  }

  private shuffleArray(array: string[]): string[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
