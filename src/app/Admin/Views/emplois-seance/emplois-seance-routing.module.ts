import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmploisSeanceComponent } from './emplois-seance.component';

const routes: Routes = [{path: '', component: EmploisSeanceComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmploisSeanceRoutingModule { }
