import {Component, inject} from '@angular/core';
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInput,
    MatSelect,
    MatOption,
    MatDatepickerInput,
    ReactiveFormsModule,
    MatDatepickerToggle,
    MatDatepicker,
    MatButton,
    MatCardContent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatDivider,
    MatIcon,
    RouterLink
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../security.module.style.scss']
})
export class SignUpComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  form = new FormGroup({
    displayName: new FormControl(''),
    email: new FormControl(''),
    phoneNumber: new FormControl(''),
    password: new FormControl(''),
  })

  onSubmit() {
    const displayName = this.form.get('displayName')?.value;
    const email = this.form.get('email')?.value;
    const phoneNumber = this.form.get('phoneNumber')?.value;
    const password = this.form.get('password')?.value;

    this.authService.signUp(email, password, displayName, phoneNumber)
      .then(() => {
        this.router.navigateByUrl('/security/kids-details');
      })
      .catch(error => {
        console.error('Sign-up failed:', error);
      });
  }

}
