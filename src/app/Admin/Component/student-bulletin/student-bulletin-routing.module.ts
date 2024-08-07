import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentBulletinComponent } from './student-bulletin.component';

const routes: Routes = [{path: '', component: StudentBulletinComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentBulletinRoutingModule { }
