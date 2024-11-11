import {Component, OnInit} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {NgForOf, NgIf} from "@angular/common";
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
    MatExpansionPanelHeader
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

  extractVideoId(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const url = inputElement?.value || ''; // Ensure value is defined
    const videoIdMatch = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/);
    this.videoId = videoIdMatch ? videoIdMatch[1] : '';
  }




  todo = ['1', '2',  '3'];
  done = ['1', '2',  '3'];

  //done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];


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
  }

  protected readonly HTMLInputElement = HTMLInputElement;
}
