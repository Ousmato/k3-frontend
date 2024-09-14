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
import { ClassStudentsComponent } from './DGA/class-students/class-students.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SettingsComponent } from './Admin/Views/settings/settings.component';
import { EmploisDuTempsComponent } from './DER/emplois-du-temps/emplois-du-temps.component';
import { EmploisSeanceComponent } from './Admin/Views/emplois-seance/emplois-seance.component';
import { EnseignantComponent } from './Admin/Views/enseignant/enseignant.component';
import { DatePipe, registerLocaleData } from '@angular/common';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { }

import localeFr from '@angular/common/locales/fr';
import { EnseignantPrDetailsComponent } from './Admin/Views/enseignant-pr-details/enseignant-pr-details.component';
import { StudentNoteComponent } from './Admin/Views/student-note/student-note.component';
import { AllNotesSemestreComponent } from './Admin/Views/all-notes-semestre/all-notes-semestre.component';
import { EtudiantsDeLaClasseComponent } from './Admin/Views/etudiants-de-la-classe/etudiants-de-la-classe.component';
import { StudentEditComponent } from './Admin/Component/student-edit/student-edit.component';
import { StudentViewComponent } from './Admin/Component/student-view/student-view.component';
import { MatieresComponent } from './Widget/matieres/matieres.component';
import { EmploisWidgetComponent } from './Widget/emplois-widget/emplois-widget.component';
import { TeachersSinginComponent } from './Admin/Component/teachers-singin/teachers-singin.component';
import { TeachersEditComponent } from './Admin/Component/teachers-edit/teachers-edit.component';
import { AddNoteWidgetComponent } from './Widget/add-note-widget/add-note-widget.component';
import { StudentBulletinComponent } from './Admin/Component/student-bulletin/student-bulletin.component';
import { FicheDePaieComponent } from './Admin/Component/fiche-de-paie/fiche-de-paie.component';
import { EnseignantFichePaieComponent } from './Admin/Component/enseignant-fiche-paie/enseignant-fiche-paie.component';
import { SchoolEditWidgetComponent } from './Widget/school-edit-widget/school-edit-widget.component';
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
import { DerEditSeanceComponent } from './DER/Widget/der-edit-seance/der-edit-seance.component';
import { ConfigureSeanceComponent } from './DER/Widget/configure-seance/configure-seance.component';
import { AddGroupStudentComponent } from './DER/Widget/add-group-student/add-group-student.component';
import { RSSidebarComponent } from './R-SCOLARITE/r-s-sidebar/r-s-sidebar.component';
import { RSHomeComponent } from './R-SCOLARITE/r-s-home/r-s-home.component';
import { CompteSidebarComponent } from './COMPTABLE/compte-sidebar/compte-sidebar.component';
import { CompteHomeComponent } from './COMPTABLE/compte-home/compte-home.component';
import { SecSidebarComponent } from './SECRETAIRE/sec-sidebar/sec-sidebar.component';
import { SecHomeComponent } from './SECRETAIRE/sec-home/sec-home.component';
import { StudentReInscriptionComponent } from './R-SCOLARITE/student-re-inscription/student-re-inscription.component';
import { RSReinscriptionComponent } from './R-SCOLARITE/r-s-reinscription/r-s-reinscription.component';
import { ReInscriptionWidgetComponent } from './R-SCOLARITE/Widget/re-inscription-widget/re-inscription-widget.component';
import { DgaArchivesComponent } from './DGA/dga-archives/dga-archives.component';
import { SecSurveillanceComponent } from './SECRETAIRE/sec-surveillance/sec-surveillance.component';
import { SecAddSurveillanceComponent } from './SECRETAIRE/sec-add-surveillance/sec-add-surveillance.component';
import { DerPaiListComponent } from './DER/der-pai-list/der-pai-list.component';
import { DerEDTComponent } from './DER/EDT/der-e-d-t/der-e-d-t.component';
import { DerTDComponentComponent } from './DER/EDT/der-t-d-component/der-t-d-component.component';
import { DerDocComponent } from './DER/der-doc/der-doc.component';
import { AddDocComponent } from './DER/Widget/add-doc/add-doc.component';
import { ProgramSoutenanceComponent } from './DER/Widget/program-soutenance/program-soutenance.component';
import { ViewSoutenanceComponent } from './DER/Widget/view-soutenance/view-soutenance.component';
import { NiveauWidgetComponent } from './Widget/niveau-widget/niveau-widget.component';
import { FiliereWidgetComponent } from './Widget/filiere-widget/filiere-widget.component';
import { ClasseroomWidgetComponent } from './Widget/classeroom-widget/classeroom-widget.component';
import { PromotionWidgetComponent } from './Widget/promotion-widget/promotion-widget.component';
import { ModuleWidgetComponent } from './Widget/module-widget/module-widget.component';
import { UeWidgetComponent } from './Widget/ue-widget/ue-widget.component';
import { SemestreWidgetComponent } from './Widget/semestre-widget/semestre-widget.component';

registerLocaleData(localeFr);
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DasboardComponent,
    EtudiantsComponent,
    LoginComponent,
    SinginComponent,
    ClassStudentsComponent,
    SettingsComponent,
    EmploisDuTempsComponent,
    EmploisSeanceComponent,
    EnseignantComponent,
    EnseignantPrDetailsComponent,
    StudentNoteComponent,
    AllNotesSemestreComponent,
    EtudiantsDeLaClasseComponent,
    StudentEditComponent,
    StudentViewComponent,
    MatieresComponent,
    EmploisWidgetComponent,
    TeachersSinginComponent,
    TeachersEditComponent,
    AddNoteWidgetComponent,
    StudentBulletinComponent,
    FicheDePaieComponent,
    EnseignantFichePaieComponent,
    SchoolEditWidgetComponent,
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
    DerEditSeanceComponent,
    ConfigureSeanceComponent,
    AddGroupStudentComponent,
    RSSidebarComponent,
    RSHomeComponent,
    CompteSidebarComponent,
    CompteHomeComponent,
    SecSidebarComponent,
    SecHomeComponent,
    StudentReInscriptionComponent,
    RSReinscriptionComponent,
    ReInscriptionWidgetComponent,
    DgaArchivesComponent,
    SecSurveillanceComponent,
    SecAddSurveillanceComponent,
    DerPaiListComponent,
    DerEDTComponent,
    DerTDComponentComponent,
    DerDocComponent,
    AddDocComponent,
    ProgramSoutenanceComponent,
    ViewSoutenanceComponent,
    NiveauWidgetComponent,
    FiliereWidgetComponent,
    ClasseroomWidgetComponent,
    PromotionWidgetComponent,
    ModuleWidgetComponent,
    UeWidgetComponent,
    SemestreWidgetComponent,
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
