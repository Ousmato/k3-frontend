import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeachersEditComponent } from './teachers-edit.component';

const routes: Routes = [{path: '', component: TeachersEditComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeachersEditRoutingModule { }
