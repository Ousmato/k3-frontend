import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RSSidebarComponent } from './r-s-sidebar.component';
import { RSHomeComponent } from '../r-s-home/r-s-home.component';
import { SinginComponent } from '../../Admin/Views/Etudiants/CRUD/singin/singin.component';
import { EtudiantsComponent } from '../../Admin/Views/Etudiants/etudiants.component';
import { StudentEditComponent } from '../../Admin/Views/Etudiants/CRUD/student-edit/student-edit.component';
import { ClassStudentsComponent } from '../../DGA/class-students/class-students.component';
import { StudentNoteComponent } from '../../Admin/Views/student-note/student-note.component';
import { EtudiantsDeLaClasseComponent } from '../../Admin/Views/Etudiants/etudiants-de-la-classe/etudiants-de-la-classe.component';
import { StudentBulletinComponent } from '../../Admin/Component/student-bulletin/student-bulletin.component';
import { RSReinscriptionComponent } from '../r-s-reinscription/r-s-reinscription.component';
import { ViewUeComponent } from '../../Widget/ue-widget/view-ue/view-ue.component';
import { RSImportComponent } from '../r-s-import/r-s-import.component';
import { MyAccuntComponent } from '../../DG/my-accunt/my-accunt.component';
import { AddNoteWidgetComponent } from '../../Widget/add-note-widget/add-note-widget.component';
import { NotificationComponent } from '../../Admin/notification/notification.component';
import { StudentDetailsComponent } from '../../Admin/Views/Etudiants/student-details/student-details.component';
import { SemestreMoyennesComponent } from '../../Admin/Views/semestre-moyennes/semestre-moyennes.component';
import { StudentPaiementRapportComponent } from '../../Admin/Views/Etudiants/student-paiement-rapport/student-paiement-rapport.component';
import { StatistiqueSudentsValuesComponent } from '../../Admin/Views/Etudiants/statistique-sudents-values/statistique-sudents-values.component';
import { AllNotesSemestreComponent } from '../../Admin/Views/Etudiants/all-notes-semestre/all-notes-semestre.component';

const routes: Routes = [{path: '', component: RSSidebarComponent,
  children: [
    {path: '', component: RSHomeComponent, data:{title: "Accueil"}},
    {path: 'inscription', component: SinginComponent, data:{title: "INSCRIPTION"}},
    {path: 'etudiant', component: EtudiantsComponent, data:{title: "Les Etudiants"}},
    {path: 'student-notes', component: StudentNoteComponent, data:{title: "NOTES DES ETUDIANS"}},
    {path: 're-inscription-list', component: RSReinscriptionComponent, data:{title: "REINCRIPTION"}},
    {path: 'import', component: RSImportComponent, data:{title: "IMPORTER ETUDIANTS"}},
    {path: 'my-accunt', component: MyAccuntComponent, data:{title: "Compte"}},
    {path: 'add-note-student', component: AddNoteWidgetComponent, data:{title: "AJout des notes"}},
    {path: 'notifications', component: NotificationComponent, data:{title: "Notifications"}},
    {path: 'semestre-moyenne', component: SemestreMoyennesComponent, data:{title: "Moyennes des semestres"}},
    {path: 'rapport-paiement', component: StudentPaiementRapportComponent, data:{title: "Rapport de paiement"}},
    {path: 'filiere-student', component: StatistiqueSudentsValuesComponent, data:{title: "Etudiants des statistiques par Filiere"}},
    {path: 'status-student', component: StatistiqueSudentsValuesComponent, data:{title: "Etudiants des statistiques par Status"}},
    
    {path: 'student-bulletin', component: StudentBulletinComponent, data:{title: "RELEVER DE NOTES"}},
    {path: 'all-notes', component: AllNotesSemestreComponent, data:{title: "NOTES DU SEMESTRE"}},
    {path: 'etudiant-de-la-classe', component : EtudiantsDeLaClasseComponent, data:{title: "Etudiants de la classe"}},
    { path: 'classe', component: ClassStudentsComponent, data:{title: "LES Classes"} },
    {path: 'student-edit', component: StudentEditComponent, data:{title: "MODIFIER INFORMATIONS"}},
    {path: 'student-view', component: StudentDetailsComponent, data:{title: "DETAILS DE L'ETUDIANT"}},
    {path: 'view-ues', component: ViewUeComponent, data:{title: "LES UNITES D'ENSEIGNEMENT"}},
    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RSSidebarRoutingModule { }
