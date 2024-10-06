import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecSidebarComponent } from './sec-sidebar.component';
import { SecHomeComponent } from '../sec-home/sec-home.component';
import { EtudiantsComponent } from '../../Admin/Views/etudiants/etudiants.component';
import { EnseignantPrDetailsComponent } from '../../Admin/Views/enseignant-pr-details/enseignant-pr-details.component';
import { FicheDePaieComponent } from '../../Admin/Component/fiche-de-paie/fiche-de-paie.component';
import { EnseignantFichePaieComponent } from '../../Admin/Component/enseignant-fiche-paie/enseignant-fiche-paie.component';
import { StudentViewComponent } from '../../Admin/Component/student-view/student-view.component';
import { SecSurveillanceComponent } from '../sec-surveillance/sec-surveillance.component';
import { DerEmploiDuTempsComponent } from '../../DER/der-emploi-du-temps-list/der-emploi-du-temps.component';
import { EmploisSeanceComponent } from '../../Admin/Views/emplois-seance/emplois-seance.component';
import { SecAddSurveillanceComponent } from '../sec-add-surveillance/sec-add-surveillance.component';
import { DerEDTComponent } from '../../DER/EDT/der-e-d-t/der-e-d-t.component';

const routes: Routes = [{path: '', component: SecSidebarComponent,
  children: [
    {path: '', component: SecHomeComponent},
    {path: 'etudiant', component: EtudiantsComponent},
    {path: 'enseignant-pre-detail', component: EnseignantPrDetailsComponent},
    {path: 'fiche-de-paie-component', component: FicheDePaieComponent},
    {path: 'fiche-enseignant', component: EnseignantFichePaieComponent},
    {path: 'surveillance', component: SecSurveillanceComponent},
    {path: 'emplois-seances', component: EmploisSeanceComponent},
    {path: 'ajouter-seance', component: SecAddSurveillanceComponent},
    {path: 'emplois-du-temps', component: DerEmploiDuTempsComponent, data:{title: "EMPLOI DU TEMPS EN COURS"}},
    {path: 'emplois-seances', component: EmploisSeanceComponent, data:{title: "EMPLOI DU TEMPS"}},
    {path: 'affect-t-d', component: DerEDTComponent , data:{title: "AJOUTER SEANCE"}},
    // {path: 'add-surveillance', component: SecAddSurveillanceComponent , data:{title: "AJOUTER SURVEILLANCE"}},
    
    {path: 'student-view', component: StudentViewComponent, data:{title: "Information de l'etudiant"}},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecSidebarRoutingModule { }
