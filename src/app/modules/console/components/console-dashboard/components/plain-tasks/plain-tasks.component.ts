import {Component, OnInit} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {YOUTUBE_PLAYER_CONFIG, YouTubePlayer} from "@angular/youtube-player";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";

@Component({
  selector: 'app-plain-tasks',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    NgForOf,
    NgIf,
    MatButton,
    YouTubePlayer,
    MatInput,
    MatFormField,
    MatLabel,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    NgClass,
    CdkDropListGroup
  ],
  providers: [{
    provide: YOUTUBE_PLAYER_CONFIG,
    useValue: {
      loadApi: true
    }
  }],
  templateUrl: './plain-tasks.component.html',
  styleUrl: './plain-tasks.component.scss'
})
export class PlainTasksComponent{
  videoId: string = '';
  items = [''];

  basket = [''];

  searchItem = '';
  itemFound = false;

  counter = 0;
  isStarted = false;
  isAnswerCorrect = false;

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.checkAnswer()
  }

  checkAnswer(){
    for (let i = 0; i < this.basket.length; i++) {
      if (this.basket[i] === this.searchItem) {
        this.itemFound = true;
        this.setAlerts( this.itemFound)
        break;
      }
      else{
        this.setAlerts( this.itemFound)
      }
    }
  }

  setAlerts(answer:boolean){
    if (answer) {
      console.log(`${this.searchItem} is available in the items array.`);
      this.isAnswerCorrect = true;

      setTimeout(() => {
        this.moveToNext()
      }, 1000);

    } else {
      console.log(`${this.searchItem} is not available in the items array.`);
    }

  }


  dataList:any = [
    {
      itemlist:['Carrots', 'Tomatoes', 'Onions', 'Apples', 'Avocados','Bananas'],
      searchItem: 'Onions'
    },
    {
      itemlist:['Red', 'Green', 'Blue', 'Yellow', 'White','Black'],
      searchItem: 'Blue'
    },
    {
      itemlist:['1', '10', '20', '30', '50','60'],
      searchItem: '50'
    },
  ]

  start(){
    this.items = this.dataList[0].itemlist;
    this.searchItem= this.dataList[0].searchItem;
    this.isStarted = true;
  }

  moveToNext(){
    this.counter +=1;
    this.reset();

    this.items = this.dataList[this.counter].itemlist;
    this.searchItem= this.dataList[this.counter].searchItem;
  }

  reset(){
    this.isAnswerCorrect = false;
    this.itemFound = false;
    this.items = [];
    this.searchItem = '';
    this.basket = [];
  }
  reStartGame(){
    this.reset();
    this.counter = 0;
    this.isStarted= false;

    this.dataList = [
      {
        itemlist:['Carrots', 'Tomatoes', 'Onions', 'Apples', 'Avocados','Bananas'],
        searchItem: 'Onions'
      },
      {
        itemlist:['Red', 'Green', 'Blue', 'Yellow', 'White','Black'],
        searchItem: 'Blue'
      },
      {
        itemlist:['1', '10', '20', '30', '50','60'],
        searchItem: '50'
      },
    ]
  }

  extractVideoId(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const url = inputElement?.value || ''; // Ensure value is defined
    const videoIdMatch = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/);
    this.videoId = videoIdMatch ? videoIdMatch[1] : '';
  }
  protected readonly HTMLInputElement = HTMLInputElement;
}
