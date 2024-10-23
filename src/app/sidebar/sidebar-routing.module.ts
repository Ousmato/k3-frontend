import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { DasboardComponent } from '../Admin/Views/dasboard/dasboard.component';
import { ClassStudentsComponent } from '../DGA/class-students/class-students.component';
import { SettingsComponent } from '../Admin/Views/settings/settings.component';
import { EtudiantsComponent } from '../Admin/Views/etudiants/etudiants.component';
import { SinginComponent } from '../Admin/Component/singin/singin.component';
import { EmploisSeanceComponent } from '../Admin/Views/emplois-seance/emplois-seance.component';
import { EnseignantComponent } from '../Admin/Views/enseignant/enseignant.component';
import { EnseignantPrDetailsComponent } from '../Admin/Views/enseignant-pr-details/enseignant-pr-details.component';
import { StudentNoteComponent } from '../Admin/Views/student-note/student-note.component';
import { AllNotesSemestreComponent } from '../Admin/Views/all-notes-semestre/all-notes-semestre.component';
import { EtudiantsDeLaClasseComponent } from '../Admin/Views/etudiants-de-la-classe/etudiants-de-la-classe.component';
import { StudentEditComponent } from '../Admin/Component/student-edit/student-edit.component';
import { StudentViewComponent } from '../Admin/Component/student-view/student-view.component';
import { TeachersSinginComponent } from '../Admin/Component/teachers-singin/teachers-singin.component';
import { TeachersEditComponent } from '../Admin/Component/teachers-edit/teachers-edit.component';
import { StudentBulletinComponent } from '../Admin/Component/student-bulletin/student-bulletin.component';
import { FicheDePaieComponent } from '../Admin/Component/fiche-de-paie/fiche-de-paie.component';
import { EnseignantFichePaieComponent } from '../Admin/Component/enseignant-fiche-paie/enseignant-fiche-paie.component';
import { SchoolEditWidgetComponent } from '../Widget/school-edit-widget/school-edit-widget.component';
import { AddAdminComponent } from '../Admin/Component/add-admin/add-admin.component';
import { DerPaiListComponent } from '../DER/der-pai-list/der-pai-list.component';
import { AdminListComponent } from '../DG/admin-list/admin-list.component';
import { MyAccuntComponent } from '../DG/my-accunt/my-accunt.component';
import { ForgotPasswordComponent } from '../Password/forgot-password/forgot-password.component';

const routes: Routes = [{path: "", component: SidebarComponent,
    
    children: [
      { path: '', component: DasboardComponent, data:{title: "ACCUEIL"} },
      { path: 'classe', component: ClassStudentsComponent, data:{title: "Les Classes"} },
      {path: 'etudiant', component: EtudiantsComponent},
      {path: 'paiement', component: DerPaiListComponent},

      {path: 'enseignants', component: EnseignantComponent},
      {path: 'student-notes', component: StudentNoteComponent},
      {path: 'etudiant-de-la-classe', component : EtudiantsDeLaClasseComponent},
      {path: 'setting', component: SettingsComponent},
      {path: 'parametre', component: SettingsComponent, data:{title: "Paramettre et Confidentialité"}},
      {path: 'admin-list', component: AdminListComponent, data:{title: "Les Administrateurs"}},
      // {path: 't-edit', component: TeachersEditComponent},
      {path: 'student-bulletin', component: StudentBulletinComponent},
      {path: 'fiche-de-paie-component', component: FicheDePaieComponent},
      {path: 'fiche-enseignant', component: EnseignantFichePaieComponent},
      {path: 'add-admin', component: AddAdminComponent},
      {path: 'update-school', component: SchoolEditWidgetComponent, data:{title: "Information de l'Etablissement"}},

      {path: 'inscription', component: SinginComponent, data:{title: "Formulaire d'Inscription"}},
      {path: 'my-accunt', component: MyAccuntComponent, data:{title: "informations du compte"}},
      {path: 'emplois-seance', component: EmploisSeanceComponent, data:{title: "L'emploi du temps"}},
      {path: 'enseignant-pre-detail', component: EnseignantPrDetailsComponent},
      {path: 'all-notes', component: AllNotesSemestreComponent, data:{title: "Notes du Semestre"}},
     
     
    ]


  },

 
]
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SidebarRoutingModule { }
