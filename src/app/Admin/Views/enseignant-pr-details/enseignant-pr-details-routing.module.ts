import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnseignantPrDetailsComponent } from './enseignant-pr-details.component';

const routes: Routes = [{path: '', component: EnseignantPrDetailsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnseignantPrDetailsRoutingModule { }
