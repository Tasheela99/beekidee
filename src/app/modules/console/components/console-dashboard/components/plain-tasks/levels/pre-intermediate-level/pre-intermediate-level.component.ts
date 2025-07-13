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
import { Auth, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import {MatButton} from "@angular/material/button";
import {AttentionService} from "../../../../../../../../services/attention.service";

@Component({
  selector: 'app-pre-intermediate-level',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    NgIf,
    NgClass,
    CdkDropListGroup,
    MatButton,
  ],
  templateUrl: './pre-intermediate-level.component.html',
  styleUrl: './pre-intermediate-level.component.scss'
})
export class PreIntermediateLevelComponent {
  items: string[] = [];
  videoId: string = '';
  basket: string[] = []; // This will always contain 0 or 1 item
  searchItem = '';
  itemFound = false;
  counter = 0;
  isStarted = false;
  isAnswerCorrect = false;
  showCamera = true;

  // Marking system properties
  totalMarks = 0;
  maxMarksPerQuestion = 10; // You can adjust this value
  currentUser$: Observable<any>;
  userUid: string | null = null;

  dialog = inject(MatDialog);
  private auth = inject(Auth);
  // private attentionService = inject(AttentionService);


  constructor() {
    // Get current user observable
    this.currentUser$ = user(this.auth);

    // Subscribe to user changes to get UID
    this.currentUser$.subscribe(user => {
      this.userUid = user ? user.uid : null;
      console.log('Current user UID:', this.userUid);
    });
  }

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

      // If dropping into basket, ensure only one item is allowed
      if (event.container.data === this.basket) {
        // Return any existing item in basket back to items list
        if (this.basket.length > 0) {
          this.items.push(...this.basket);
          this.basket = []; // Clear the basket
        }

        // Add the new item to basket (ensuring only one item)
        transferArrayItem(
          event.previousContainer.data,
          this.basket,
          event.previousIndex,
          0
        );

        // Double-check: ensure basket never has more than one item
        if (this.basket.length > 1) {
          // This shouldn't happen, but as a safety measure
          const latestItem = this.basket.pop()!;
          this.items.push(...this.basket);
          this.basket = [latestItem];
        }
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
      // Award marks for correct answer
      this.awardMarks();

      setTimeout(() => {
        this.moveToNext();
      }, 1000);
    }
  }

  private awardMarks(): void {
    this.totalMarks += this.maxMarksPerQuestion;

    // Log the marks with user UID
    console.log('=== CORRECT ANSWER LOGGED ===');
    console.log('User UID:', this.userUid);
    console.log('Question Number:', this.counter + 1);
    console.log('Correct Answer:', this.searchItem);
    console.log('Marks Awarded:', this.maxMarksPerQuestion);
    console.log('Total Marks:', this.totalMarks);
    console.log('Timestamp:', new Date().toISOString());
    console.log('=============================');

    // You can also store this data in an array or send it to Firebase
    this.logAnswerToFirebase();
  }

  private logAnswerToFirebase(): void {
    // Example of data structure you might want to store
    const answerLog = {
      userUid: this.userUid,
      questionNumber: this.counter + 1,
      correctAnswer: this.searchItem,
      marksAwarded: this.maxMarksPerQuestion,
      totalMarks: this.totalMarks,
      timestamp: new Date().toISOString(),
      gameType: 'pre-intermediate-level'
    };

    // Here you would typically save to Firestore
    // Example (you'll need to inject Firestore):
    // this.firestore.collection('user-answers').add(answerLog);

    console.log('Answer log ready for Firebase:', answerLog);
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




  // openAttentionCam() {
  //   this.attentionService.trackAttention().subscribe((attention) => {
  //     this.attentionService.getAttentionData().subscribe(attention => {
  //       console.log(attention);
  //     })
  //   })
  // }

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
    this.totalMarks = 0; // Reset marks when starting new game

    console.log('Game started by user:', this.userUid);
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
      this.logGameCompletion();
      this.reStartGame();
    }
  }

  private logGameCompletion(): void {
    console.log('=== GAME COMPLETED ===');
    console.log('User UID:', this.userUid);
    console.log('Final Total Marks:', this.totalMarks);
    console.log('Total Questions:', this.dataList.length);
    console.log('Max Possible Marks:', this.dataList.length * this.maxMarksPerQuestion);
    console.log('Percentage:', ((this.totalMarks / (this.dataList.length * this.maxMarksPerQuestion)) * 100).toFixed(2) + '%');
    console.log('Completion Time:', new Date().toISOString());
    console.log('=====================');

    // You can store the final game results here
    const gameResult = {
      userUid: this.userUid,
      totalMarks: this.totalMarks,
      maxPossibleMarks: this.dataList.length * this.maxMarksPerQuestion,
      percentage: ((this.totalMarks / (this.dataList.length * this.maxMarksPerQuestion)) * 100),
      totalQuestions: this.dataList.length,
      completionTime: new Date().toISOString(),
      gameType: 'pre-intermediate-level'
    };

    console.log('Game result ready for Firebase:', gameResult);
  }

  reset() {
    this.isAnswerCorrect = false;
    this.itemFound = false;
    this.basket = []; // Always ensure basket is empty on reset
  }

  reStartGame() {
    this.reset();
    this.counter = 0;
    this.isStarted = false;
    this.items = [];
    this.searchItem = '';
    this.totalMarks = 0; // Reset marks when restarting
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

  // Helper method to get the current selected answer (if any)
  get selectedAnswer(): string | null {
    return this.basket.length === 1 ? this.basket[0] : null;
  }

  // Helper method to check if an answer is selected
  get hasSelectedAnswer(): boolean {
    return this.basket.length === 1;
  }

  // Helper method to get current marks (for displaying in template if needed)
  get currentTotalMarks(): number {
    return this.totalMarks;
  }

  // Helper method to get max possible marks
  get maxPossibleMarks(): number {
    return this.dataList.length * this.maxMarksPerQuestion;
  }
}
