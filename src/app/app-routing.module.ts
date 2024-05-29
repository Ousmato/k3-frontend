import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './users/home/home.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path:'',component: LoginComponent},

  {path:'enseignant',
    loadChildren: () => import('./users/enseignant/enseignant.module').then(m => m.EnseignantModule)
  },

  {path: "sidebar",
    loadChildren: () => import('./sidebar/sidebar.module').then(m =>m.SidebarModule)
  },

  {path: "login",
    loadChildren: () => import('./login/login.module').then(m =>m.LoginModule)
  },

  {path: "singin",
    loadChildren: () => import('./singin/singin.module').then(m =>m.SinginModule)
  },
  
  {path: "dasboard",
    loadChildren: () => import('./Admin/Views/dasboard/dasboard.module').then(m =>m.DasboardModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
