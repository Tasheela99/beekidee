import {Component, inject} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  async signInWithGoogle(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const result = await this.auth.signInWithGoogle();
      this.successMessage = 'Successfully signed in!';

      setTimeout(() => {
        this.router.navigate(['/console']);
      }, 1000);

    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred during sign-in';
      console.error('Sign-in error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
