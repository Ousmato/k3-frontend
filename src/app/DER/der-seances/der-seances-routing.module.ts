import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DerSeancesComponent } from './der-seances.component';

const routes: Routes = [{path: "", component: DerSeancesComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DerSeancesRoutingModule { }
