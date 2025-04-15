import {Component, inject} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router, RouterLink} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Auth} from "@angular/fire/auth";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIcon,
    RouterLink,
    ReactiveFormsModule,
    NgIf,
    MatError
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss', '../security.module.style.scss']
})
export class SignInComponent {

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  private auth = inject(AuthService);
  private router = inject(Router);
  loginForm: FormGroup;
  private firebaseAuth = inject(Auth);

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

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const {email, password} = this.loginForm.value;
      this.auth.signIn(email, password).then(
        (userCredential) => {
          console.log('Login successful!', userCredential);
          setTimeout(() => {
            this.router.navigateByUrl('/console');
          }, 1000);
        },
        (error) => {
          console.error('Login failed', error);
          this.errorMessage = error.message; // Display error message
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
