import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DerSidebarComponent } from './der-sidebar.component';
import { DerHomeComponent } from '../der-home/der-home.component';
import { DerSallesComponent } from '../der-salles/der-salles.component';
import { EnseignantComponent } from '../../Admin/Views/Enseignant/enseignant.component';
import { TeachersSinginComponent } from '../../Admin/Views/Enseignant/CRUD/teachers-singin/teachers-singin.component';
import { TeachersEditComponent } from '../../Admin/Views/Enseignant/CRUD/teachers-edit/teachers-edit.component';
import { DerSeancesComponent } from '../der-seances/der-seances.component';
import { DerEmploiDuTempsComponent } from '../EDT/der-emploi-du-temps-list/der-emploi-du-temps.component';
import { EmploisDuTempsComponent } from '../EDT/emplois-du-temps/emplois-du-temps.component';
import { EmploisSeanceComponent } from '../EDT/emplois-seance/emplois-seance.component';
import { DerEditSeanceComponent } from '../Widget/der-edit-seance/der-edit-seance.component';
import { AddGroupStudentComponent } from '../Widget/add-group-student/add-group-student.component';
import { EnseignantFichePaieComponent } from '../../Admin/Component/enseignant-fiche-paie/enseignant-fiche-paie.component';
import { DerPaiListComponent } from '../der-pai-list/der-pai-list.component';
import { DerEDTComponent } from '../EDT/der-e-d-t/der-e-d-t.component';
import { DerDocComponent } from '../der-doc/der-doc.component';
import { AddDocComponent } from '../Widget/add-doc/add-doc.component';
import { ProgramSoutenanceComponent } from '../Widget/program-soutenance/program-soutenance.component';
import { ViewSoutenanceComponent } from '../Widget/view-soutenance/view-soutenance.component';
import { StudentGroupListComponent } from '../student-group-list/student-group-list.component';
import { MyAccuntComponent } from '../../DG/my-accunt/my-accunt.component';
import { NotificationComponent } from '../../Admin/notification/notification.component';
import { SpecialitesComponent } from '../specialites/specialites.component';
import { ClassStudentsComponent } from '../../DGA/class-students/class-students.component';
import { ImportEnseignantComponent } from '../../Admin/Views/Enseignant/import-enseignant/import-enseignant.component';
import { ViewUeComponent } from '../../Widget/ue-widget/view-ue/view-ue.component';

const routes: Routes = [{path: '', component: DerSidebarComponent,
  children: [
    {path: '', component: DerHomeComponent, data:{title: "ACCUEIL"}},
    {path: 'salles', component: DerSallesComponent, data:{title: "Les salles"}},
    {path: 'paiement', component: DerPaiListComponent, data:{title: "Heures effectuees"}},
    {path: 'enseignants', component: EnseignantComponent, data:{title: "Les enseignants"}},
    {path: 't-singin', component: TeachersSinginComponent, data:{title: "AJOUTER ENSEIGNANT"}},
    {path: 'doc', component: DerDocComponent, data:{title: "RAPPORTS ET MEMOIRES"}},
    {path: 'add-doc', component: AddDocComponent, data:{title: "Deposer documment"}},
    {path: 't-edit', component: TeachersEditComponent, data:{title: "INFORMATIONS DE L'ENSEIGNANT"}},
    {path: 'fiche-enseignant', component: EnseignantFichePaieComponent},
    {path: 'ajouter-seance', component: DerSeancesComponent},
    {path: 'emplois-du-temps', component: DerEmploiDuTempsComponent, data:{title: "EMPLOI DU TEMPS EN COURS"}},
    {path: 'emplois-seances', component: EmploisSeanceComponent, data:{title: "EMPLOI DU TEMPS"}},
    {path: 'edit-seance', component: DerEditSeanceComponent},
    {path: 'group-student', component: AddGroupStudentComponent, data:{title: "Creer groupes"}},
    {path: 'affect-t-d', component: DerEDTComponent , data:{title: "AJOUTER SEANCE"}},
    {path: 'programmer', component: ProgramSoutenanceComponent, data:{title: "Programmer soutenance"}},
    {path: 'programme-view', component: ViewSoutenanceComponent, data:{title: "SOutenances programmer"}},
    {path: 'liste-groupe', component: StudentGroupListComponent, data:{title: "Liste Groupes"}},
    {path: 'my-accunt', component: MyAccuntComponent, data:{title: "Mon compte"} },
    {path: 'notifications', component: NotificationComponent, data:{title: "Notifications"}},
    {path: 'specialites', component: SpecialitesComponent, data:{title: "Les Specialites"}},
    {path: 'import', component: ImportEnseignantComponent, data:{title: "IMporter Enseignant"}},
    {path: 'view-ues', component: ViewUeComponent, data:{title: "LES UNITES D'ENSEIGNEMENT"}},

    
    { path: 'students-class', component: ClassStudentsComponent, data:{title: "Les Classes de Formation"} },
    {path: 'ajouter-emplois', component: EmploisDuTempsComponent, data:{title: "CREATION DE L'EMPLOI DU TEMPS"}},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DerSidebarRoutingModule { }
