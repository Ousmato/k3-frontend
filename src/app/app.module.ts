import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EnseignantComponent } from './users/enseignant/enseignant.component';
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
import { DataTablesModule } from "angular-datatables";


@NgModule({
  declarations: [
    AppComponent,
    EnseignantComponent,
    SidebarComponent,
    DasboardComponent,
    EtudiantsComponent,
    LoginComponent,
    SinginComponent,
    StudentSidebarComponent,
    StudentDashboardComponent,
    ClassStudentsComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DataTablesModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
