import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'',loadComponent:()=>import('../security/security-context/security-context.component').then(c=>c.SecurityContextComponent),children:[
      {path:'',redirectTo:'sign-in',pathMatch:'full'},
      {path:'sign-in',loadComponent:()=>import('../security/sign-in/sign-in.component').then(c=>c.SignInComponent)},
      {path:'sign-up',loadComponent:()=>import('../security/sign-up/sign-up.component').then(c=>c.SignUpComponent)},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
