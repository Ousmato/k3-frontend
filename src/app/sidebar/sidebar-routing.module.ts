import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { DasboardComponent } from '../Admin/Views/dasboard/dasboard.component';
import { ClassStudentsComponent } from '../Admin/Views/class-students/class-students.component';
import { SettingsComponent } from '../Admin/Views/settings/settings.component';
import { EtudiantsComponent } from '../Admin/Views/etudiants/etudiants.component';
import { SinginComponent } from '../Admin/Component/singin/singin.component';
import { EmploisDuTempsComponent } from '../Admin/Views/emplois-du-temps/emplois-du-temps.component';
import { EmploisSeanceComponent } from '../Admin/Views/emplois-seance/emplois-seance.component';
import { EnseignantComponent } from '../Admin/Views/enseignant/enseignant.component';
import { TeachersPresenceComponent } from '../Admin/Views/teachers-presence/teachers-presence.component';
import { EnseignantPrDetailsComponent } from '../Admin/Views/enseignant-pr-details/enseignant-pr-details.component';
import { ArchivesComponent } from '../Admin/Views/archives/archives.component';
import { FichePaieComponent } from '../Admin/Views/fiche-paie/fiche-paie.component';
import { StudentNoteComponent } from '../Admin/Views/student-note/student-note.component';
import { AllNotesSemestreComponent } from '../Admin/Views/all-notes-semestre/all-notes-semestre.component';
import { EtudiantsDeLaClasseComponent } from '../Admin/Views/etudiants-de-la-classe/etudiants-de-la-classe.component';
import { StudentEditComponent } from '../Admin/Component/student-edit/student-edit.component';
import { StudentViewComponent } from '../Admin/Component/student-view/student-view.component';
import { TeachersSinginComponent } from '../Admin/Component/teachers-singin/teachers-singin.component';
import { TeachersEditComponent } from '../Admin/Component/teachers-edit/teachers-edit.component';

const routes: Routes = [{path: "", component: SidebarComponent,
    children: [
      { path: '', component: DasboardComponent },
      { path: 'classe', component: ClassStudentsComponent },
      {path: 'etudiant', component: EtudiantsComponent},
      {path: 'enseignants', component: EnseignantComponent},
      {path: 'list-presence', component: TeachersPresenceComponent},
      {path: 'archive', component: ArchivesComponent},
      {path: 'fiche-paie', component: FichePaieComponent},
      {path: 'student-notes', component: StudentNoteComponent},
      {path: 'etudiant-de-la-classe', component : EtudiantsDeLaClasseComponent},
      {path: 'setting', component: SettingsComponent},
      {path: 'parametre', component: SettingsComponent},
      {path: 't-singin', component: TeachersSinginComponent},
      {path: 't-edit', component: TeachersEditComponent},

      {path: 'inscription', component: SinginComponent, data:{title: "Formulaire d'inscription"}},
      {path: 'emplois', component: EmploisDuTempsComponent, data:{title: "Creation d'emploi du temps"}},
      {path: 'seance', component: EmploisSeanceComponent, data:{title: "Ajout des seances"}},
      {path: 'enseignant-pre-detail', component: EnseignantPrDetailsComponent},
      {path: 'all-notes', component: AllNotesSemestreComponent},
      {path: 'student-edit', component: StudentEditComponent, data:{title: "Formulaire de Modification"}},
      {path: 'student-view', component: StudentViewComponent, data:{title: "Information de l'etudiant"}},
      
     
    ]

  },
  
  
  
 
]
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SidebarRoutingModule { }
