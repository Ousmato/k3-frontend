import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DerSidebarComponent } from './der-sidebar.component';
import { DerHomeComponent } from '../der-home/der-home.component';
import { DerSallesComponent } from '../der-salles/der-salles.component';
import { EnseignantComponent } from '../../Admin/Views/enseignant/enseignant.component';
import { TeachersSinginComponent } from '../../Admin/Component/teachers-singin/teachers-singin.component';
import { TeachersEditComponent } from '../../Admin/Component/teachers-edit/teachers-edit.component';
import { DerSeancesComponent } from '../der-seances/der-seances.component';
import { DerEmploiDuTempsComponent } from '../der-emploi-du-temps-list/der-emploi-du-temps.component';
import { EmploisDuTempsComponent } from '../emplois-du-temps/emplois-du-temps.component';
import { EmploisSeanceComponent } from '../../Admin/Views/emplois-seance/emplois-seance.component';
import { DerEditSeanceComponent } from '../Widget/der-edit-seance/der-edit-seance.component';

const routes: Routes = [{path: '', component: DerSidebarComponent,
  children: [
    {path: '', component: DerHomeComponent},
    {path: 'salles', component: DerSallesComponent},
    {path: 'enseignants', component: EnseignantComponent},
    {path: 't-singin', component: TeachersSinginComponent},
    {path: 't-edit', component: TeachersEditComponent},
    {path: 'ajouter-seance', component: DerSeancesComponent},
    {path: 'emplois-du-temps', component: DerEmploiDuTempsComponent},
    {path: 'emplois-seances', component: EmploisSeanceComponent},
    {path: 'edit-seance', component: DerEditSeanceComponent},

    
    // { path: 'classe-student', component: ClassStudentsComponent, data:{title: "Les Classes de Formation"} },
    {path: 'ajouter-emplois', component: EmploisDuTempsComponent, data:{title: "Création d'Emploi du Temps"}},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DerSidebarRoutingModule { }
