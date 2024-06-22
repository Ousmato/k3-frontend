import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmploisDuTempsComponent } from './emplois-du-temps.component';

const routes: Routes = [{path:'', component: EmploisDuTempsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmploisDuTempsRoutingModule { }
