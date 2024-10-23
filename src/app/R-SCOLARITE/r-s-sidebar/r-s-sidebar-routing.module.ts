import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RSSidebarComponent } from './r-s-sidebar.component';
import { RSHomeComponent } from '../r-s-home/r-s-home.component';
import { SinginComponent } from '../../Admin/Component/singin/singin.component';
import { EtudiantsComponent } from '../../Admin/Views/etudiants/etudiants.component';
import { StudentEditComponent } from '../../Admin/Component/student-edit/student-edit.component';
import { StudentViewComponent } from '../../Admin/Component/student-view/student-view.component';
import { ClassStudentsComponent } from '../../DGA/class-students/class-students.component';
import { StudentNoteComponent } from '../../Admin/Views/student-note/student-note.component';
import { EtudiantsDeLaClasseComponent } from '../../Admin/Views/etudiants-de-la-classe/etudiants-de-la-classe.component';
import { AllNotesSemestreComponent } from '../../Admin/Views/all-notes-semestre/all-notes-semestre.component';
import { StudentBulletinComponent } from '../../Admin/Component/student-bulletin/student-bulletin.component';
import { RSReinscriptionComponent } from '../r-s-reinscription/r-s-reinscription.component';
import { StudentReInscriptionComponent } from '../student-re-inscription/student-re-inscription.component';
import { ViewUeComponent } from '../../Widget/ue-widget/view-ue/view-ue.component';
import { ClassArchiveComponent } from '../../DGA/class-students/class-archive/class-archive.component';
import { RSImportComponent } from '../r-s-import/r-s-import.component';
import { MyAccuntComponent } from '../../DG/my-accunt/my-accunt.component';
import { AddNoteWidgetComponent } from '../../Widget/add-note-widget/add-note-widget.component';

const routes: Routes = [{path: '', component: RSSidebarComponent,
  children: [
    {path: '', component: RSHomeComponent, data:{title: "Accueil"}},
    {path: 'inscription', component: SinginComponent, data:{title: "INSCRIPTION"}},
    {path: 'etudiant', component: EtudiantsComponent, data:{title: "Les Etudiants"}},
    {path: 'student-notes', component: StudentNoteComponent, data:{title: "NOTES DES ETUDIANS"}},
    {path: 're-inscription-list', component: RSReinscriptionComponent, data:{title: "REINCRIPTION"}},
    {path: 're-inscription', component: StudentReInscriptionComponent, data:{title: "REINCRIPTION"}},
    {path: 'class-archives', component: ClassArchiveComponent, data:{title: "Archives"}},
    {path: 'import', component: RSImportComponent, data:{title: "IMPORTER ETUDIANTS"}},
    {path: 'my-accunt', component: MyAccuntComponent, data:{title: "Compte"}},
    {path: 'add-note-student', component: AddNoteWidgetComponent, data:{title: "AJout des notes"}},
    
    {path: 'student-bulletin', component: StudentBulletinComponent, data:{title: "RELEVER DE NOTES"}},
    {path: 'all-notes', component: AllNotesSemestreComponent, data:{title: "NOTES DU SEMESTRE"}},
    {path: 'etudiant-de-la-classe', component : EtudiantsDeLaClasseComponent},
    { path: 'classe', component: ClassStudentsComponent, data:{title: "LES MENTIONS"} },
    {path: 'student-edit', component: StudentEditComponent, data:{title: "MODIFIER INFORMATIONS"}},
    {path: 'student-view', component: StudentViewComponent, data:{title: "DETAILS DE L'ETUDIANT"}},
    {path: 'view-ues', component: ViewUeComponent, data:{title: "LES UNITES D'ENSEIGNEMENT"}},
    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RSSidebarRoutingModule { }
