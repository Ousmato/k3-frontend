import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DasboardComponent } from './Admin/Views/dasboard/dasboard.component';
import { EtudiantsComponent } from './Admin/Views/etudiants/etudiants.component';
import { LoginComponent } from './login/login.component';
import {  provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SinginComponent } from './Admin/Component/singin/singin.component';
import { StudentSidebarComponent } from './student-sidebar/student-sidebar.component';
import { ClassStudentsComponent } from './DGA/class-students/class-students.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SettingsComponent } from './Admin/Views/settings/settings.component';
import { EmploisDuTempsComponent } from './DER/emplois-du-temps/emplois-du-temps.component';
import { EmploisSeanceComponent } from './Admin/Views/emplois-seance/emplois-seance.component';
import { EnseignantComponent } from './Admin/Views/enseignant/enseignant.component';
import { DatePipe, registerLocaleData } from '@angular/common';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import localeFr from '@angular/common/locales/fr';
import { TeachersPresenceComponent } from './Admin/Views/teachers-presence/teachers-presence.component';
import { EnseignantPrDetailsComponent } from './Admin/Views/enseignant-pr-details/enseignant-pr-details.component';
import { ArchivesComponent } from './Admin/Views/archives/archives.component';
import { FichePaieComponent } from './Admin/Views/fiche-paie/fiche-paie.component';
import { StudentNoteComponent } from './Admin/Views/student-note/student-note.component';
import { AllNotesSemestreComponent } from './Admin/Views/all-notes-semestre/all-notes-semestre.component';
import { EtudiantsDeLaClasseComponent } from './Admin/Views/etudiants-de-la-classe/etudiants-de-la-classe.component';
import { StudentEditComponent } from './Admin/Component/student-edit/student-edit.component';
import { StudentViewComponent } from './Admin/Component/student-view/student-view.component';
import { SemestreComponent } from './Widget/semestre/semestre.component';
import { MatieresComponent } from './Widget/matieres/matieres.component';
import { EmploisWidgetComponent } from './Widget/emplois-widget/emplois-widget.component';
import { TeachersSinginComponent } from './Admin/Component/teachers-singin/teachers-singin.component';
import { TeachersEditComponent } from './Admin/Component/teachers-edit/teachers-edit.component';
import { AddNoteWidgetComponent } from './Widget/add-note-widget/add-note-widget.component';
import { StudentBulletinComponent } from './Admin/Component/student-bulletin/student-bulletin.component';
import { AddModuleWidgetComponent } from './Widget/add-module-widget/add-module-widget.component';
import { FicheDePaieComponent } from './Admin/Component/fiche-de-paie/fiche-de-paie.component';
import { EnseignantFichePaieComponent } from './Admin/Component/enseignant-fiche-paie/enseignant-fiche-paie.component';
import { UpdateModuleWifgetComponent } from './Widget/update-module-wifget/update-module-wifget.component';
import { ClassRoomWidgetComponent } from './DGA/Widget/class-room-widget/class-room-widget.component';
import { ClassRoomEditWidgetComponent } from './Widget/class-room-edit-widget/class-room-edit-widget.component';
import { AddFiliereWidgetComponent } from './Widget/add-filiere-widget/add-filiere-widget.component';
import { FiliereEditWidgetComponent } from './Widget/filiere-edit-widget/filiere-edit-widget.component';
import { SchoolEditWidgetComponent } from './Widget/school-edit-widget/school-edit-widget.component';
import { SemestreEditWidgetComponent } from './Widget/semestre-edit-widget/semestre-edit-widget.component';
import { AdminSettingWidgetComponent } from './Widget/admin-setting-widget/admin-setting-widget.component';
import { AddAdminComponent } from './Admin/Component/add-admin/add-admin.component';
import { DashboardComponent } from './DR/dashboard/dashboard.component';
import { DrSidebarComponent } from './DR/dr-sidebar/dr-sidebar.component';
import { DerSidebarComponent } from './DER/der-sidebar/der-sidebar.component';
import { DerHomeComponent } from './DER/der-home/der-home.component';
import { DerSallesComponent } from './DER/der-salles/der-salles.component';
import { DerSallesAddComponent } from './DER/Widget/der-salles-add/der-salles-add.component';
import { DgaSidebarComponent } from './DGA/dga-sidebar/dga-sidebar.component';
import { DerSeancesComponent } from './DER/der-seances/der-seances.component';
import { DerEmploiDuTempsComponent } from './DER/der-emploi-du-temps-list/der-emploi-du-temps.component';
import { DgaMentionListComponent } from './DGA/dga-mention-list/dga-mention-list.component';
import { DgaHomeComponent } from './DGA/dga-home/dga-home.component';
import { DgaSettingComponent } from './DGA/dga-setting/dga-setting.component';
import { DerEditSeanceComponent } from './DER/Widget/der-edit-seance/der-edit-seance.component';
import { ConfigureSeanceComponent } from './DER/Widget/configure-seance/configure-seance.component';
import { AddGroupStudentComponent } from './DER/Widget/add-group-student/add-group-student.component';
import { RSSidebarComponent } from './R-SCOLARITE/r-s-sidebar/r-s-sidebar.component';
import { RSHomeComponent } from './R-SCOLARITE/r-s-home/r-s-home.component';
import { CompteSidebarComponent } from './COMPTABLE/compte-sidebar/compte-sidebar.component';

registerLocaleData(localeFr);
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DasboardComponent,
    EtudiantsComponent,
    LoginComponent,
    SinginComponent,
    StudentSidebarComponent,
    ClassStudentsComponent,
    SettingsComponent,
    EmploisDuTempsComponent,
    EmploisSeanceComponent,
    EnseignantComponent,
    TeachersPresenceComponent,
    EnseignantPrDetailsComponent,
    ArchivesComponent,
    FichePaieComponent,
    StudentNoteComponent,
    AllNotesSemestreComponent,
    EtudiantsDeLaClasseComponent,
    StudentEditComponent,
    StudentViewComponent,
    SemestreComponent,
    MatieresComponent,
    EmploisWidgetComponent,
    TeachersSinginComponent,
    TeachersEditComponent,
    AddNoteWidgetComponent,
    StudentBulletinComponent,
    AddModuleWidgetComponent,
    FicheDePaieComponent,
    EnseignantFichePaieComponent,
    UpdateModuleWifgetComponent,
    ClassRoomWidgetComponent,
    ClassRoomEditWidgetComponent,
    AddFiliereWidgetComponent,
    FiliereEditWidgetComponent,
    SchoolEditWidgetComponent,
    SemestreEditWidgetComponent,
    AdminSettingWidgetComponent,
    AddAdminComponent,
    DashboardComponent,
    DrSidebarComponent,
    DerSidebarComponent,
    DerHomeComponent,
    DerSallesComponent,
    DerSallesAddComponent,
    DgaSidebarComponent,
    DerSeancesComponent,
    DerEmploiDuTempsComponent,
    DgaMentionListComponent,
    DgaHomeComponent,
    DgaSettingComponent,
    DerEditSeanceComponent,
    ConfigureSeanceComponent,
    AddGroupStudentComponent,
    RSSidebarComponent,
    RSHomeComponent,
    CompteSidebarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [provideHttpClient(),
    DatePipe,
    { provide: LOCALE_ID, useValue: 'fr' },
   
    provideToastr(
      {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: "decreasing",
        positionClass: "toast-top-right",
        preventDuplicates: true,
        newestOnTop: true,
        closeButton: true,
      }
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  sidebarTitle = '';

  receiveTitle(event: string) {
    this.sidebarTitle = event;
  }
 }
