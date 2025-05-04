import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecSidebarComponent } from './sec-sidebar.component';
import { EtudiantsComponent } from '../../../../Admin/Views/Etudiants/etudiants.component';
import { StudentViewComponent } from '../../../../Admin/Views/Etudiants/CRUD/student-view/student-view.component';
import { DerEmploiDuTempsComponent } from '../../../DER/components/der-emploi-du-temps-list/der-emploi-du-temps.component';
import { EmploisSeanceComponent } from '../../../../DER/EDT/emplois-seance/emplois-seance.component';
import { SecAddSurveillanceComponent } from '../sec-add-surveillance/sec-add-surveillance.component';
import { DerEDTComponent } from '../../../../DER/EDT/der-e-d-t/der-e-d-t.component';
import { MyAccuntComponent } from '../../../../DG/my-accunt/my-accunt.component';
import { DerSallesComponent } from '../../../../DER/der-salles/der-salles.component';
import { AddDocComponent } from '../../../../DER/Widget/add-doc/add-doc.component';
import { DerDocComponent } from '../../../../DER/der-doc/der-doc.component';
import { ListDeSurveillantComponent } from '../list-de-surveillant/list-de-surveillant.component';
import { SecHomeComponent } from '../sec-home/sec-home.component';

const routes: Routes = [{path: '', component: SecSidebarComponent,
  children: [
    {path: '', component: SecHomeComponent, data:{title: "Les emplois du temps "}},
    {path: 'etudiant', component: EtudiantsComponent, data:{title: "Les etudiants"}},
    {path: 'emploi-du-temp', component: DerEmploiDuTempsComponent, data:{title: "EMPLOI DU TEMPS"}},
    {path: 'add-doc', component: AddDocComponent, data:{title: "Deposer documment"}},
    {path: 'doc', component: DerDocComponent, data:{title: "RAPPORTS ET MEMOIRES"}},
    
    {path: 'ajouter-seance', component: SecAddSurveillanceComponent},
    {path: 'emplois-seances', component: EmploisSeanceComponent, data:{title: "EMPLOI DU TEMPS"}},
    {path: 'affect-t-d', component: DerEDTComponent , data:{title: "AJOUTER SEANCE"}},
    {path: 'my-accunt', component: MyAccuntComponent , data:{title: "Mon compte"}},
    {path: 'list-surveillants', component: ListDeSurveillantComponent , data:{title: "Les Surveillants"}},
    // {path: 'add-surveillance', component: SecAddSurveillanceComponent , data:{title: "AJOUTER SURVEILLANCE"}},
    
    {path: 'salles', component: DerSallesComponent, data:{title: "Les Salles"}},
    {path: 'student-view', component: StudentViewComponent, data:{title: "INFORMATIONS DE L'ETUDIANT"}},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecSidebarRoutingModule { }
