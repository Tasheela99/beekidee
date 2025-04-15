import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";

@Component({
  selector: 'app-plain-task-level-context',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatButton,
    MatCard,
    MatCardContent
  ],
  templateUrl: './plain-task-level-context.component.html',
  styleUrl: './plain-task-level-context.component.scss'
})
export class PlainTaskLevelContextComponent {

}
