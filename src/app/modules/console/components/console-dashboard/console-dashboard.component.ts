import {Component, inject} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {AuthService} from "../../../../services/auth.service";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {MatList, MatListItem} from "@angular/material/list";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-console-dashboard',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatButton,
    MatDrawerContainer,
    MatDrawer,
    MatList,
    MatListItem,
    RouterOutlet,
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './console-dashboard.component.html',
  styleUrl: './console-dashboard.component.scss'
})
export class ConsoleDashboardComponent {

  private auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.signOut().then(()=>{
      this.router.navigateByUrl('/security/sign-in');
    })
  }
}
