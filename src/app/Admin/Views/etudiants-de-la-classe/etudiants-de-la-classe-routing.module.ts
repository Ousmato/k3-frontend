import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EtudiantsDeLaClasseComponent } from './etudiants-de-la-classe.component';

const routes: Routes = [{path: '', component: EtudiantsDeLaClasseComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtudiantsDeLaClasseRoutingModule { }
