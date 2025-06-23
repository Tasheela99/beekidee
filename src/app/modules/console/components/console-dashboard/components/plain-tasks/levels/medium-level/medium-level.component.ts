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

@Component({
  selector: 'app-medium-level',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    NgIf,
    NgClass,
    FormsModule
  ],
  templateUrl: './medium-level.component.html',
  styleUrl: './medium-level.component.scss'
})
export class MediumLevelComponent {
  items: string[] = [];
  basket: string[] = [];
  searchItem = '';
  itemFound = false;
  counter = 0;
  isStarted = false;
  isAnswerCorrect = false;
  errorMessage: string = '';

  dialog = inject(MatDialog);

  dataList: any = [
    {
      image: 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/medium1.png?alt=media&token=24c8b829-1cd7-488c-9c63-0df1105a1c20',
      searchItem: 'A',
      correctCount: 7 // Count of 'A' in the image
    },
    {
      image: 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/medium1.png?alt=media&token=24c8b829-1cd7-488c-9c63-0df1105a1c20',
      searchItem: 'B',
      correctCount: 5 // Count of 'B' in the image
    },
    {
      image: 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/medium1.png?alt=media&token=24c8b829-1cd7-488c-9c63-0df1105a1c20',
      searchItem: 'C',
      correctCount: 4 // Count of 'C' in the image
    },
  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.container.data === this.basket) {
        this.basket = []; // Clear basket to allow only one number
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.checkAnswer();
  }

  checkAnswer() {
    const correctCount = this.dataList[this.counter].correctCount;
    if (this.basket.length === 1 && parseInt(this.basket[0]) === correctCount) {
      this.itemFound = true;
    } else {
      this.itemFound = false;
    }
    this.setAlerts(this.itemFound);
  }

  setAlerts(answer: boolean) {
    if (answer) {
      console.log(`${this.searchItem} with count ${this.basket[0]} is correct.`);
      this.isAnswerCorrect = true;
      this.openAnimationDialog(true, 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/emoji-animations%2Fhappy-start.webm?alt=media&token=f369ae30-66d3-4642-9c03-8405c18bf203');
      setTimeout(() => {
        this.moveToNext();
      }, 3000);
    } else {
      console.log(`${this.basket.length > 0 ? this.basket[0] : 'No item'} is incorrect.`);
      this.isAnswerCorrect = false;
      this.openAnimationDialog(false, 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/emoji-animations%2Fnot-correct.webm?alt=media&token=fc447df6-587a-4429-a56e-9f178fe12073');
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
    this.items = this.shuffleArray(['1', '4', '5', '7']); // Numbers under 10, including 7
    this.searchItem = this.dataList[0].searchItem;
    this.isStarted = true;
    this.errorMessage = ''; // Clear any previous error
  }

  moveToNext() {
    this.counter += 1;
    if (this.counter >= this.dataList.length) {
      this.reset();
    } else {
      this.reset();
      this.items = this.shuffleArray(['1', '4', '5', '7']);
      this.searchItem = this.dataList[this.counter].searchItem;
    }
  }

  reset() {
    this.isAnswerCorrect = false;
    this.itemFound = false;
    this.items = [];
    this.searchItem = '';
    this.basket = [];
  }

  reStartGame() {
    this.reset();
    this.counter = 0;
    this.isStarted = false;
    this.dataList = [
      {
        image: 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/medium1.png?alt=media&token=24c8b829-1cd7-488c-9c63-0df1105a1c20',
        searchItem: 'A',
        correctCount: 7
      },
      {
        image: 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/medium1.png?alt=media&token=24c8b829-1cd7-488c-9c63-0df1105a1c20',
        searchItem: 'B',
        correctCount: 5
      },
      {
        image: 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/medium1.png?alt=media&token=24c8b829-1cd7-488c-9c63-0df1105a1c20',
        searchItem: 'C',
        correctCount: 4
      },
    ];
  }

  onImageError(event: Event) {
    this.errorMessage = 'Error loading image. Please check the URL or try again later.';
  }

  private shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
