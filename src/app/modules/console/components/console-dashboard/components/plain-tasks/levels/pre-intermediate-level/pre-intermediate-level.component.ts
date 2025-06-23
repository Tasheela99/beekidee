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

@Component({
  selector: 'app-pre-intermediate-level',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    NgIf,
    NgClass,
    CdkDropListGroup,
  ],
  templateUrl: './pre-intermediate-level.component.html',
  styleUrl: './pre-intermediate-level.component.scss'
})
export class PreIntermediateLevelComponent {
  items = [''];
  videoId: string = '';
  basket: string[] = []; // Explicitly typed as string array
  searchItem = '';
  itemFound = false;
  counter = 0;
  isStarted = false;
  isAnswerCorrect = false;
  showCamera = true;

  dialog = inject(MatDialog);

  toggleCameraVisibility() {
    this.showCamera = !this.showCamera;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // If dropping into basket, clear it first to ensure only one item
      if (event.container.data === this.basket) {
        this.basket = [];
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
    // Validate the single item in basket against searchItem
    if (this.basket.length === 1 && this.basket[0] === this.searchItem) {
      this.itemFound = true;
    } else {
      this.itemFound = false;
    }
    this.setAlerts(this.itemFound);
  }

  setAlerts(answer: boolean) {
    if (answer) {
      console.log(`${this.searchItem} is the correct answer.`);
      this.isAnswerCorrect = true;
      this.openAnimationDialog(true, 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/emoji-animations%2Fhappy-start.webm?alt=media&token=f369ae30-66d3-4642-9c03-8405c18bf203');
      setTimeout(() => {
        this.moveToNext();
      }, 3000);
    } else {
      console.log(`${this.basket.length > 0 ? this.basket[0] : 'No item'} is not the correct answer.`);
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

  dataList: any = [
    {
      itemlist: ['5', '1', '3'],
      searchItem: '3',
      image: 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/tree.jpg?alt=media&token=d9538c92-a157-447d-9f9d-fb1881b1159d'
    },
    {
      itemlist: ['4', '5', '2'],
      searchItem: '4',
      image: 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/tree(4).png?alt=media&token=4c8faa42-c5c5-43b3-ae4f-bbc747029585'
    },
  ];

  start() {
    this.items = this.shuffleArray([...this.dataList[0].itemlist]);
    this.searchItem = this.dataList[0].searchItem;
    this.isStarted = true;
  }

  moveToNext() {
    this.counter += 1;
    this.reset();
    this.items = this.shuffleArray([...this.dataList[this.counter].itemlist]);
    this.searchItem = this.dataList[this.counter].searchItem;
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
        itemlist: ['5', '1', '3'],
        searchItem: '3',
        image: 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/tree.jpg?alt=media&token=d9538c92-a157-447d-9f9d-fb1881b1159d'
      },
      {
        itemlist: ['4', '5', '2'],
        searchItem: '4',
        image: 'https://firebasestorage.googleapis.com/v0/b/beekideeapp.appspot.com/o/tree(4).png?alt=media&token=4c8faa42-c5c5-43b3-ae4f-bbc747029585'
      },
    ];
  }

  extractVideoId(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const url = inputElement?.value || '';
    const videoIdMatch = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/);
    this.videoId = videoIdMatch ? videoIdMatch[1] : '';
  }

  private shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
