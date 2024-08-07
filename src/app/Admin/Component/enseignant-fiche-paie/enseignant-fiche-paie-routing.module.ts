import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnseignantFichePaieComponent } from './enseignant-fiche-paie.component';

const routes: Routes = [{path: '', component: EnseignantFichePaieComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnseignantFichePaieRoutingModule { }
