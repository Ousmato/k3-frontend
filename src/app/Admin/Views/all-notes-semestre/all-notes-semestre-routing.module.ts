import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllNotesSemestreComponent } from './all-notes-semestre.component';

const routes: Routes = [{path: '', component: AllNotesSemestreComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllNotesSemestreRoutingModule { }
