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

const routes: Routes = [{path: '', component: RSSidebarComponent,
  children: [
    {path: '', component: RSHomeComponent},
    {path: 'inscription', component: SinginComponent, data:{title: "Formulaire d'Inscription"}},
    {path: 'etudiant', component: EtudiantsComponent},
    {path: 'student-notes', component: StudentNoteComponent},
    {path: 're-inscription-list', component: RSReinscriptionComponent},
    {path: 're-inscription', component: StudentReInscriptionComponent},
    {path: 'student-re-inscription-add', component: StudentReInscriptionComponent},
    
    {path: 'student-bulletin', component: StudentBulletinComponent},
    {path: 'all-notes', component: AllNotesSemestreComponent, data:{title: "Notes du Semestre"}},
    {path: 'etudiant-de-la-classe', component : EtudiantsDeLaClasseComponent},
    { path: 'classe', component: ClassStudentsComponent, data:{title: "Les Classes de Formation"} },
    {path: 'student-edit', component: StudentEditComponent, data:{title: "Formulaire de Modification"}},
    {path: 'student-view', component: StudentViewComponent, data:{title: "Information de l'etudiant"}},
    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RSSidebarRoutingModule { }
