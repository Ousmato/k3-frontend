import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DgaSidebarComponent } from './dga-sidebar.component';
import { DgaHomeComponent } from '../dga-home/dga-home.component';
import { ClassStudentsComponent } from '../class-students/class-students.component';
import { SettingsComponent } from '../../Admin/Views/settings/settings.component';
import { EtudiantsComponent } from '../../Admin/Views/etudiants/etudiants.component';
import { DerEmploiDuTempsComponent } from '../../DER/der-emploi-du-temps-list/der-emploi-du-temps.component';
import { EmploisSeanceComponent } from '../../Admin/Views/emplois-seance/emplois-seance.component';
import { StudentNoteComponent } from '../../Admin/Views/student-note/student-note.component';
import { AllNotesSemestreComponent } from '../../Admin/Views/all-notes-semestre/all-notes-semestre.component';
import { EtudiantsDeLaClasseComponent } from '../../Admin/Views/etudiants-de-la-classe/etudiants-de-la-classe.component';
import { StudentBulletinComponent } from '../../Admin/Component/student-bulletin/student-bulletin.component';
import { DgaArchivesComponent } from '../dga-archives/dga-archives.component';
import { SchoolEditWidgetComponent } from '../../Widget/school-edit-widget/school-edit-widget.component';

const routes: Routes = [{path: '', component: DgaSidebarComponent,
  children: [
    {path: '', component: DgaHomeComponent},
    {path: 'mentions-liste', component: ClassStudentsComponent},
    {path: 'setting', component: SettingsComponent},
    {path: 'etudiant', component: EtudiantsComponent},
    {path: 'student-notes', component: StudentNoteComponent},
    {path: 'archive-scolaire', component: DgaArchivesComponent},
    {path: 'all-notes', component: AllNotesSemestreComponent, data:{title: "Notes du Semestre"}},
    {path: 'etudiant-de-la-classe', component : EtudiantsDeLaClasseComponent},
    {path: 'student-bulletin', component: StudentBulletinComponent},
    {path: 'update-school', component: SchoolEditWidgetComponent, data:{title: "Information de l'Etablissement"}},

    
    {path: 'emplois-seances', component: EmploisSeanceComponent},
    {path: 'emplois-du-temps', component: DerEmploiDuTempsComponent},
    

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DgaSidebarRoutingModule { }
