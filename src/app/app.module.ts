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
import { SinginComponent } from './singin/singin.component';
import { StudentSidebarComponent } from './student-sidebar/student-sidebar.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { ClassStudentsComponent } from './Admin/Views/class-students/class-students.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SettingsComponent } from './Admin/Views/settings/settings.component';
import { EmploisDuTempsComponent } from './Admin/Views/emplois-du-temps/emplois-du-temps.component';
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
    StudentDashboardComponent,
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
    EtudiantsDeLaClasseComponent
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
        timeOut: 9000,
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
