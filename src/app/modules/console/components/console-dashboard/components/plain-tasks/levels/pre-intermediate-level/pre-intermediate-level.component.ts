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
  items: string[] = [];
  videoId: string = '';
  basket: string[] = [];
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
    console.log('Drop event triggered', event);
    console.log('Previous container data:', event.previousContainer.data);
    console.log('Current container data:', event.container.data);
    console.log('Item being moved:', event.previousContainer.data[event.previousIndex]);

    if (event.previousContainer === event.container) {
      // Reordering within the same container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moving between containers
      const itemBeingMoved = event.previousContainer.data[event.previousIndex];

      // If dropping into basket, clear it first to ensure only one item
      if (event.container.data === this.basket) {
        // Return any existing item in basket back to items list
        if (this.basket.length > 0) {
          this.items.push(...this.basket);
        }
        this.basket = [];

        // Now add the new item to basket
        transferArrayItem(
          event.previousContainer.data,
          this.basket,
          event.previousIndex,
          0
        );
      } else {
        // Moving from basket back to items
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }

    console.log('Items after drop:', this.items);
    console.log('Basket after drop:', this.basket);

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
    this.isAnswerCorrect = answer;
    if (answer) {
      setTimeout(() => {
        this.moveToNext();
      }, 1000);
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
    this.basket = []; // Ensure basket is empty when starting
  }

  moveToNext() {
    if (this.counter + 1 < this.dataList.length) {
      this.counter += 1;
      this.reset();
      this.items = this.shuffleArray([...this.dataList[this.counter].itemlist]);
      this.searchItem = this.dataList[this.counter].searchItem;
    } else {
      // Game completed
      console.log('Game completed!');
      this.reStartGame();
    }
  }

  reset() {
    this.isAnswerCorrect = false;
    this.itemFound = false;
    this.basket = [];
  }

  reStartGame() {
    this.reset();
    this.counter = 0;
    this.isStarted = false;
    this.items = [];
    this.searchItem = '';
  }

  extractVideoId(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const url = inputElement?.value || '';
    const videoIdMatch = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/);
    this.videoId = videoIdMatch ? videoIdMatch[1] : '';
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
