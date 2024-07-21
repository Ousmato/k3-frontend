import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  {path:'',component: LoginComponent},

 
  {path: "sidebar",
    loadChildren: () => import('./sidebar/sidebar.module').then(m =>m.SidebarModule)
  },

  // {path: "dashbord",
  //   loadChildren: () => import('./Admin/Views/dasboard/dasboard.module').then(m =>m.DasboardModule)
  // },

  {path: "singin",
    loadChildren: () => import('./Admin/Component/singin/singin.module').then(m =>m.SinginModule)
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
