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
import {KidsService} from "../../../services/kids.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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
  private authService = inject(AuthService);
  private kidsService = inject(KidsService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  loginForm: FormGroup;
  private firebaseAuth = inject(Auth);

  async signInWithGoogle(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const result = await this.authService.signInWithGoogle();
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
      this.authService.signIn(email, password).then(
        (userCredential) => {
          console.log('Login successful!', userCredential);

          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          this.kidsService.getKidsByParentEmail(email).subscribe((kids) => {
            if (kids && kids.length > 0) {
              setTimeout(() => {
                this.router.navigateByUrl('/console');
              }, 1000);
            } else {
              this.snackBar.open('No kids data found. Please add your child\'s details.', 'Add Now', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });

              setTimeout(() => {
                this.router.navigateByUrl('/security/kids-details');
              }, 1000);
            }
          });
        },
        (error) => {
          this.snackBar.open(`Login failed:`, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      );
    } else {
      this.snackBar.open('Please fill out the form correctly before submitting.', 'Got it', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      console.log('Form is invalid');
    }
  }


}
