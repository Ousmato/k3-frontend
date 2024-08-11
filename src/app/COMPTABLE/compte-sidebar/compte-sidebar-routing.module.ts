import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompteSidebarComponent } from './compte-sidebar.component';
import { EtudiantsComponent } from '../../Admin/Views/etudiants/etudiants.component';

const routes: Routes = [{path: '', component: CompteSidebarComponent,
  children: [
    {path: 'etudiant', component: EtudiantsComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompteSidebarRoutingModule { }
