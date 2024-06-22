import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './users/home/home.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { DasboardComponent } from './Admin/Views/dasboard/dasboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EnseignantComponent } from './users/enseignant/enseignant.component';
import { EmploisSeanceComponent } from './Admin/Views/emplois-seance/emplois-seance.component';
import { EmploisDuTempsComponent } from './Admin/Views/emplois-du-temps/emplois-du-temps.component';

const routes: Routes = [
  {path:'',component: LoginComponent},

  {path:'enseignant',
    loadChildren: () => import('./users/enseignant/enseignant.module').then(m => m.EnseignantModule)
  },

  {path: "sidebar",
    loadChildren: () => import('./sidebar/sidebar.module').then(m =>m.SidebarModule)
  },

  // {path: "dashbord",
  //   loadChildren: () => import('./Admin/Views/dasboard/dasboard.module').then(m =>m.DasboardModule)
  // },

  {path: "singin",
    loadChildren: () => import('./singin/singin.module').then(m =>m.SinginModule)
  },

  {path: "student-dashboard",
    loadChildren: () => import('./student-dashboard/student-dashboard.module').then(m =>m.StudentDashboardModule),
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
