import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecSidebarComponent } from './sec-sidebar.component';
import { SecHomeComponent } from '../sec-home/sec-home.component';
import { EtudiantsComponent } from '../../Admin/Views/Etudiants/etudiants.component';
import { FicheDePaieComponent } from '../../Admin/Component/fiche-de-paie/fiche-de-paie.component';
import { EnseignantFichePaieComponent } from '../../Admin/Component/enseignant-fiche-paie/enseignant-fiche-paie.component';
import { StudentViewComponent } from '../../Admin/Views/Etudiants/CRUD/student-view/student-view.component';
import { SecSurveillanceComponent } from '../sec-surveillance/sec-surveillance.component';
import { DerEmploiDuTempsComponent } from '../../DER/EDT/der-emploi-du-temps-list/der-emploi-du-temps.component';
import { EmploisSeanceComponent } from '../../DER/EDT/emplois-seance/emplois-seance.component';
import { SecAddSurveillanceComponent } from '../sec-add-surveillance/sec-add-surveillance.component';
import { DerEDTComponent } from '../../DER/EDT/der-e-d-t/der-e-d-t.component';
import { MyAccuntComponent } from '../../DG/my-accunt/my-accunt.component';

const routes: Routes = [{path: '', component: SecSidebarComponent,
  children: [
    {path: '', component: SecHomeComponent, data:{title: "ACCUEIL"}},
    {path: 'etudiant', component: EtudiantsComponent, data:{title: "Les etudiants"}},
    {path: 'fiche-de-paie-component', component: FicheDePaieComponent},
    {path: 'fiche-enseignant', component: EnseignantFichePaieComponent},
    {path: 'surveillance', component: SecSurveillanceComponent},
    {path: 'emplois-seances', component: EmploisSeanceComponent, data:{title: "SEANCES DE L'EMPLOI DU TEMPS"}},
    {path: 'ajouter-seance', component: SecAddSurveillanceComponent},
    {path: 'emplois-du-temps', component: DerEmploiDuTempsComponent, data:{title: "EMPLOI DU TEMPS EN COURS"}},
    {path: 'emplois-seances', component: EmploisSeanceComponent, data:{title: "EMPLOI DU TEMPS"}},
    {path: 'affect-t-d', component: DerEDTComponent , data:{title: "AJOUTER SEANCE"}},
    {path: 'my-accunt', component: MyAccuntComponent , data:{title: "Mon compte"}},
    // {path: 'add-surveillance', component: SecAddSurveillanceComponent , data:{title: "AJOUTER SURVEILLANCE"}},
    
    {path: 'student-view', component: StudentViewComponent, data:{title: "INFORMATIONS DE L'ETUDIANT"}},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecSidebarRoutingModule { }
