import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardModule} from "@angular/material/card";
import {CarouselModule, OwlOptions} from "ngx-owl-carousel-o";
import {NgForOf, NgIf} from "@angular/common";


@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    CarouselModule,
    MatCardModule,
    MatCardHeader,
    NgForOf,
    NgIf
  ],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss'
})
export class LessonsComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    margin: 10,
    navSpeed: 700,
    responsive: {
      0: {items: 1},
      400: {items: 2},
      740: {items: 3},
      940: {items: 4}
    },
  };

  lessons: any[] = [];
  selectedLesson: any = null;

  ngOnInit(): void {
    this.fetchLessons();
  }

  fetchLessons(): void {
    this.lessons = [
      {
        title: 'Lesson 1',
        description: 'Introduction to basic grammar.',
        content: 'Detailed content about grammar.',
      },
      {
        title: 'Lesson 2',
        description: 'Sentence patterns explained.',
        content: 'Full explanation and examples of sentence patterns.',
      },
      {
        title: 'Lesson 3',
        description: 'Daily dialogues practice.',
        content: 'Common dialogues and conversation practice.',
      },
      {
        title: 'Lesson 4',
        description: 'Daily dialogues practice.',
        content: 'Common dialogues and conversation practice.',
      },
      {
        title: 'Lesson 5',
        description: 'Daily dialogues practice.',
        content: 'Common dialogues and conversation practice.',
      },
      {
        title: 'Lesson 6',
        description: 'Daily dialogues practice.',
        content: 'Common dialogues and conversation practice.',
      },
      {
        title: 'Lesson 7',
        description: 'Daily dialogues practice.',
        content: 'Common dialogues and conversation practice.',
      },
      {
        title: 'Lesson 8',
        description: 'Daily dialogues practice.',
        content: 'Common dialogues and conversation practice.',
      },
      {
        title: 'Lesson 9',
        description: 'Daily dialogues practice.',
        content: 'Common dialogues and conversation practice.',
      },
      {
        title: 'Lesson 10',
        description: 'Daily dialogues practice.',
        content: 'Common dialogues and conversation practice.',
      }
    ];
    this.selectedLesson = this.lessons[0];
  }

  selectLesson(lesson: any): void {
    this.selectedLesson = lesson;
  }

}
