import { Component } from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {LessonsContextComponent} from "./components/lessons-context/lessons-context.component";

@Component({
  selector: 'app-kids-dashboard',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
    LessonsContextComponent
  ],
  templateUrl: './kids-dashboard.component.html',
  styleUrl: './kids-dashboard.component.scss'
})
export class KidsDashboardComponent {

}
