import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeachersSinginComponent } from './teachers-singin.component';

const routes: Routes = [{path: '', component: TeachersSinginComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeachersSinginRoutingModule { }
