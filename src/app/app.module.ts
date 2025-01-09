import { importProvidersFrom, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DasboardComponent } from './Admin/Views/dasboard/dasboard.component';
import { EtudiantsComponent } from './Admin/Views/Etudiants/etudiants.component';
import { LoginComponent } from './login/login.component';
import {  HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { SinginComponent } from './Admin/Views/Etudiants/CRUD/singin/singin.component';
import { ClassStudentsComponent } from './DGA/class-students/class-students.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SettingsComponent } from './Admin/Views/settings/settings.component';
import { EmploisDuTempsComponent } from './DER/EDT/emplois-du-temps/emplois-du-temps.component';
import { EmploisSeanceComponent } from './DER/EDT/emplois-seance/emplois-seance.component';
import { EnseignantComponent } from './Admin/Views/Enseignant/enseignant.component';
import { DatePipe, registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { }

import localeFr from '@angular/common/locales/fr';
import { EnseignantPrDetailsComponent } from './Admin/Views/Enseignant/enseignant-pr-details/enseignant-pr-details.component';
import { StudentNoteComponent } from './Admin/Views/student-note/student-note.component';
import { AllNotesSemestreComponent } from './Admin/Views/all-notes-semestre/all-notes-semestre.component';
import { EtudiantsDeLaClasseComponent } from './Admin/Views/Etudiants/etudiants-de-la-classe/etudiants-de-la-classe.component';
import { StudentEditComponent } from './Admin/Views/Etudiants/CRUD/student-edit/student-edit.component';
import { StudentViewComponent } from './Admin/Views/Etudiants/CRUD/student-view/student-view.component';
import { EmploisWidgetComponent } from './Widget/emplois-widget/emplois-widget.component';
import { TeachersSinginComponent } from './Admin/Views/Enseignant/CRUD/teachers-singin/teachers-singin.component';
import { TeachersEditComponent } from './Admin/Views/Enseignant/CRUD/teachers-edit/teachers-edit.component';
import { AddNoteWidgetComponent } from './Widget/add-note-widget/add-note-widget.component';
import { StudentBulletinComponent } from './Admin/Component/student-bulletin/student-bulletin.component';
import { FicheDePaieComponent } from './Admin/Component/fiche-de-paie/fiche-de-paie.component';
import { EnseignantFichePaieComponent } from './Admin/Component/enseignant-fiche-paie/enseignant-fiche-paie.component';
import { SchoolEditWidgetComponent } from './Widget/school-edit-widget/school-edit-widget.component';
import { AdminSettingWidgetComponent } from './Widget/admin-setting-widget/admin-setting-widget.component';
import { AddAdminComponent } from './Admin/Component/add-admin/add-admin.component';
import { DerSidebarComponent } from './DER/der-sidebar/der-sidebar.component';
import { DerHomeComponent } from './DER/der-home/der-home.component';
import { DerSallesComponent } from './DER/der-salles/der-salles.component';
import { DerSallesAddComponent } from './DER/Widget/der-salles-add/der-salles-add.component';
import { DgaSidebarComponent } from './DGA/dga-sidebar/dga-sidebar.component';
import { DerSeancesComponent } from './DER/der-seances/der-seances.component';
import { DerEmploiDuTempsComponent } from './DER/EDT/der-emploi-du-temps-list/der-emploi-du-temps.component';
import { DgaHomeComponent } from './DGA/dga-home/dga-home.component';
import { DerEditSeanceComponent } from './DER/Widget/der-edit-seance/der-edit-seance.component';
import { AddGroupStudentComponent } from './DER/Widget/add-group-student/add-group-student.component';
import { RSSidebarComponent } from './R-SCOLARITE/r-s-sidebar/r-s-sidebar.component';
import { RSHomeComponent } from './R-SCOLARITE/r-s-home/r-s-home.component';
import { CompteSidebarComponent } from './COMPTABLE/compte-sidebar/compte-sidebar.component';
import { CompteHomeComponent } from './COMPTABLE/compte-home/compte-home.component';
import { SecSidebarComponent } from './SECRETAIRE/sec-sidebar/sec-sidebar.component';
import { SecHomeComponent } from './SECRETAIRE/sec-home/sec-home.component';
import { StudentReInscriptionComponent } from './R-SCOLARITE/student-re-inscription/student-re-inscription.component';
import { RSReinscriptionComponent } from './R-SCOLARITE/r-s-reinscription/r-s-reinscription.component';
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
import { AddUeComponent } from './Widget/ue-widget/add-ue/add-ue.component';
import { ViewUeComponent } from './Widget/ue-widget/view-ue/view-ue.component';
import { AddClassPromotionComponent } from './Widget/classeroom-widget/add-class-promotion/add-class-promotion.component';
import { ClassArchiveComponent } from './DGA/class-students/class-archive/class-archive.component';
import { RSImportComponent } from './R-SCOLARITE/r-s-import/r-s-import.component';
import { SoutenanceNoteComponent } from './DER/Widget/soutenance-note/soutenance-note.component';
import { StudentGroupListComponent } from './DER/student-group-list/student-group-list.component';
import { AdminListComponent } from './DG/admin-list/admin-list.component';
import { MyAccuntComponent } from './DG/my-accunt/my-accunt.component';
import { ForgotPasswordComponent } from './Password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Password/reset-password/reset-password.component';
import { SetNewPasswordComponent } from './Password/set-new-password/set-new-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { loadingInterceptor } from './Services/interceptor/loading.interceptor';
import { SessionExpiredModalComponent } from './Widget/session-expired-modal/session-expired-modal.component';
import { EmptyWidgetComponent } from './Widget/empty-widget/empty-widget.component';
import { NotificationComponent } from './Admin/notification/notification.component';
import { RolesComponent } from './DG/roles/roles.component';
import { StudentSuivisComponent } from './Admin/Views/Etudiants/student-suivis/student-suivis.component';
import { StudentDetailsComponent } from './Admin/Views/Etudiants/student-details/student-details.component';
import { SpecialitesComponent } from './DER/specialites/specialites.component';
import { EditComponent } from './DER/specialites/CRUD/edit/edit.component';
import { AddTeacherSpecialitesComponent } from './DER/specialites/CRUD/add-teacher-specialites/add-teacher-specialites.component';
import { ImportEnseignantComponent } from './Admin/Views/Enseignant/import-enseignant/import-enseignant.component';
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
    DerSidebarComponent,
    DerHomeComponent,
    DerSallesComponent,
    DerSallesAddComponent,
    DgaSidebarComponent,
    DerSeancesComponent,
    DerEmploiDuTempsComponent,
    DgaHomeComponent,
    DerEditSeanceComponent,
    AddGroupStudentComponent,
    RSSidebarComponent,
    RSHomeComponent,
    CompteSidebarComponent,
    CompteHomeComponent,
    SecSidebarComponent,
    SecHomeComponent,
    StudentReInscriptionComponent,
    RSReinscriptionComponent,
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
    AddUeComponent,
    ViewUeComponent,
    AddClassPromotionComponent,
    ClassArchiveComponent,
    RSImportComponent,
    EmptyWidgetComponent,
    SoutenanceNoteComponent, StudentGroupListComponent, AdminListComponent, MyAccuntComponent, ForgotPasswordComponent, ResetPasswordComponent, SetNewPasswordComponent, SessionExpiredModalComponent, NotificationComponent, RolesComponent, StudentSuivisComponent, StudentDetailsComponent, SpecialitesComponent, EditComponent, AddTeacherSpecialitesComponent, ImportEnseignantComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),

  ],
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'fr' },
   provideHttpClient(withInterceptors([loadingInterceptor])),
   importProvidersFrom(BrowserAnimationsModule),
  //  provide
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
