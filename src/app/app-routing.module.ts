import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  {path:'',component: LoginComponent},

 
  {path: "sidebar",
    loadChildren: () => import('./sidebar/sidebar.module').then(m =>m.SidebarModule),
    canActivate: [authGuard]
  },

  // {path : "finance",
  //   loadChildren: () =>import('./student-dashboard/student-dashboard.module').then(m =>m.StudentDashboardModule),
  //   canActivate: [authGuard]
  // },

  {path: "der",
    loadChildren : () => import('./DER/der-sidebar/der-sidebar.module').then(m =>m.DerSidebarModule),
    canActivate: [authGuard]
  },

  {path: 'dga',
    loadChildren: () => import('./DGA/dga-sidebar/dga-sidebar.module').then(m => m.DgaSidebarModule),
    canActivate: [authGuard]
  }
  // {path: "dashbord",
  //   loadChildren: () => import('./Admin/Views/dasboard/dasboard.module').then(m =>m.DasboardModule)
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
