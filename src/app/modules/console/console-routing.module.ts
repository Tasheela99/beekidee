import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "@angular/fire/auth-guard";
// import {authGuard} from "../../guards/auth.guard";

const routes: Routes = [
  {path:'',redirectTo:'console-context',pathMatch:'full'},
  {path:'console-context',loadComponent:()=>import('./components/console-context/console-context.component').then(c => c.ConsoleContextComponent),canActivate:[AuthGuard],children:[
      {path:'',redirectTo:'dashboard',pathMatch:'full'},
      {path:'dashboard',loadComponent:()=>import('./components/console-dashboard/console-dashboard.component').then(c => c.ConsoleDashboardComponent),children:[
          {path:'',redirectTo:'plain-task',pathMatch:'full'},
          {path:'plain-task',loadComponent:()=>import('./components/console-dashboard/components/plain-tasks/plain-tasks.component').then(c => c.PlainTasksComponent)},
          {path:'plain-task-plus-constructivism',loadComponent:()=>import('./components/console-dashboard/components/plain-tasks-plus-constructivism/plain-tasks-plus-constructivism.component').then(c => c.PlainTasksPlusConstructivismComponent)},
          {path:'plain-task-plus-constructivism-plus-attention',loadComponent:()=>import('./components/console-dashboard/components/attention-reallocation/attention-reallocation.component').then(c => c.AttentionReallocationComponent)},
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsoleRoutingModule { }
