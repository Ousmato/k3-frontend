import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { ForgotPasswordComponent } from './Password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Password/reset-password/reset-password.component';
import { SetNewPasswordComponent } from './Password/set-new-password/set-new-password.component';

const routes: Routes = [
  {path:'',component: LoginComponent},

 
  {path: "sidebar",
    loadChildren: () => import('./sidebar/sidebar.module').then(m =>m.SidebarModule),
    canActivate: [authGuard]
  },
  {path: "r-scolarite",
    loadChildren: ()=> import('./R-SCOLARITE/r-s-sidebar/r-s-sidebar.module').then(m =>m.RSSidebarModule),
    canActivate: [authGuard]
  },

  {path: "der",
    loadChildren : () => import('./DER/der-sidebar/der-sidebar.module').then(m =>m.DerSidebarModule),
    canActivate: [authGuard]
  },

  {path: 'dga',
    loadChildren: () => import('./DGA/dga-sidebar/dga-sidebar.module').then(m => m.DgaSidebarModule),
    canActivate: [authGuard]
  },
  {path: 'comptable',
    loadChildren: () =>import('./COMPTABLE/compte-sidebar/compte-sidebar.module').then(m=>m.CompteSidebarModule),
  },
  {path: 'secretaire', 
    loadChildren: () => import('./SECRETAIRE/sec-sidebar/sec-sidebar.module').then(m=>m.SecSidebarModule),
    canActivate: [authGuard]
  },
  
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
    {path: 'set-new-password', component: SetNewPasswordComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
