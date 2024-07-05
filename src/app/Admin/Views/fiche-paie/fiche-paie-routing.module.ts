import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FichePaieComponent } from './fiche-paie.component';

const routes: Routes = [{path: '', component: FichePaieComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FichePaieRoutingModule { }
