import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FicheDePaieComponent } from './fiche-de-paie.component';

const routes: Routes = [{path: '', component: FicheDePaieComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FicheDePaieRoutingModule { }
