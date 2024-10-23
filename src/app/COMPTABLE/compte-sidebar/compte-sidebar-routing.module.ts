import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompteSidebarComponent } from './compte-sidebar.component';
import { EtudiantsComponent } from '../../Admin/Views/etudiants/etudiants.component';
import { StudentEditComponent } from '../../Admin/Component/student-edit/student-edit.component';
import { StudentViewComponent } from '../../Admin/Component/student-view/student-view.component';
import { CompteHomeComponent } from '../compte-home/compte-home.component';
import { MyAccuntComponent } from '../../DG/my-accunt/my-accunt.component';

const routes: Routes = [{path: '', component: CompteSidebarComponent,
  children: [
    {path: 'etudiant', component: EtudiantsComponent, data:{title: "Les Etudiants"}},
    {path: '', component: CompteHomeComponent, data:{title: "Accueil"}},
    {path: 'student-edit', component: StudentEditComponent, data:{title: "Formulaire de Modification"}},
    {path: 'student-view', component: StudentViewComponent, data:{title: "Information de l'etudiant"}},
    {path: 'my-accunt', component: MyAccuntComponent, data:{title: "Mon compte"}},
    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompteSidebarRoutingModule { }
