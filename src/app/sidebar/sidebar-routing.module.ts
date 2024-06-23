import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { DasboardComponent } from '../Admin/Views/dasboard/dasboard.component';
import { ClassStudentsComponent } from '../Admin/Views/class-students/class-students.component';
import { SettingsComponent } from '../Admin/Views/settings/settings.component';
import { EtudiantsComponent } from '../Admin/Views/etudiants/etudiants.component';
import { SinginComponent } from '../singin/singin.component';
import { EmploisDuTempsComponent } from '../Admin/Views/emplois-du-temps/emplois-du-temps.component';
import { EmploisSeanceComponent } from '../Admin/Views/emplois-seance/emplois-seance.component';
import { EnseignantComponent } from '../Admin/Views/enseignant/enseignant.component';

const routes: Routes = [{path: "", component: SidebarComponent,
    children: [
      { path: '', component: DasboardComponent },
      { path: 'classe', component: ClassStudentsComponent },
      {path: 'setting', component: SettingsComponent},
      {path: 'etudiant', component: EtudiantsComponent},
      {path: 'ensignant', component: EnseignantComponent}
      
     
    ]

  },
  {path: 'inscription', component: SinginComponent},
  {path: 'emplois', component: EmploisDuTempsComponent},
  {path: 'seance', component: EmploisSeanceComponent}
]
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SidebarRoutingModule { }
