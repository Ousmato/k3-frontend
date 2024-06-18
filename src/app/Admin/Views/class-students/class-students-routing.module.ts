import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassStudentsComponent } from './class-students.component';

const routes: Routes = [{path: "", component: ClassStudentsComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassStudentsRoutingModule { }
