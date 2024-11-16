import { Component } from '@angular/core';
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {ReactiveFormsModule} from "@angular/forms";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";

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
  styleUrls: ['./sign-up.component.scss','../security.module.style.scss']
})
export class SignUpComponent {

}
