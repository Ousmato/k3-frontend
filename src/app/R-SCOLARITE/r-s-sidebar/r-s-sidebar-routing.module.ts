import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RSSidebarComponent } from './r-s-sidebar.component';
import { RSHomeComponent } from '../r-s-home/r-s-home.component';
import { SinginComponent } from '../../Admin/Component/singin/singin.component';
import { EtudiantsComponent } from '../../Admin/Views/etudiants/etudiants.component';
import { StudentEditComponent } from '../../Admin/Component/student-edit/student-edit.component';
import { StudentViewComponent } from '../../Admin/Component/student-view/student-view.component';

const routes: Routes = [{path: '', component: RSSidebarComponent,
  children: [
    {path: '', component: RSHomeComponent},
    {path: 'inscription', component: SinginComponent, data:{title: "Formulaire d'Inscription"}},
    {path: 'etudiant', component: EtudiantsComponent},
    {path: 'student-edit', component: StudentEditComponent, data:{title: "Formulaire de Modification"}},
    {path: 'student-view', component: StudentViewComponent, data:{title: "Information de l'etudiant"}},
    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RSSidebarRoutingModule { }
