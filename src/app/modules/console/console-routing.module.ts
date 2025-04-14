import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "@angular/fire/auth-guard";
import * as path from "node:path";
// import {authGuard} from "../../guards/auth.guard";

const routes: Routes = [
  {path: '', redirectTo: 'admin', pathMatch: 'full'},
  {
    path: 'admin',
    loadComponent: () => import('./components/console-context/console-context.component').then(c => c.ConsoleContextComponent),
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {
        path: 'dashboard',
        loadComponent: () => import('./components/console-dashboard/console-dashboard.component').then(c => c.ConsoleDashboardComponent),
        children: [
          {path: '', redirectTo: 'overview', pathMatch: 'full'},
          {
            path: 'overview',
            loadComponent: () => import('./components/console-dashboard/components/dashboard/dashboard.component').then(c => c.DashboardComponent)
          },
          {
            path: 'plain-task',
            loadComponent: () => import('./components/console-dashboard/components/plain-tasks/plain-tasks.component').then(c => c.PlainTasksComponent),
            children: [
              {
                path: '',
                loadComponent: () => import('./components/console-dashboard/components/plain-tasks/levels/plain-task-level-context/plain-task-level-context.component').then(c => c.PlainTaskLevelContextComponent),
                children: [
                  {path: '', redirectTo: 'pre-intermediate', pathMatch: 'full'},
                  {
                    path: 'pre-intermediate',
                    loadComponent: () => import('./components/console-dashboard/components/plain-tasks/levels/pre-intermediate-level/pre-intermediate-level.component').then(c => c.PreIntermediateLevelComponent)
                  },
                  {
                    path: 'medium',
                    loadComponent: () => import('./components/console-dashboard/components/plain-tasks/levels/medium-level/medium-level.component').then(c => c.MediumLevelComponent)
                  },
                  {
                    path: 'intermediate',
                    loadComponent: () => import('./components/console-dashboard/components/plain-tasks/levels/intermediate-level/intermediate-level.component').then(c => c.IntermediateLevelComponent)
                  },
                ]
              },
            ]
          },
          {
            path: 'plain-task-plus-constructivism',
            loadComponent: () => import('./components/console-dashboard/components/plain-tasks-plus-constructivism/plain-tasks-plus-constructivism.component').then(c => c.PlainTasksPlusConstructivismComponent)
          },
          {
            path: 'plain-task-plus-constructivism-plus-attention',
            loadComponent: () => import('./components/console-dashboard/components/attention-reallocation/attention-reallocation.component').then(c => c.AttentionReallocationComponent)
          },
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsoleRoutingModule {
}
