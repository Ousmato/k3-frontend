import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './student-dashboard.component';
import { ClassStudentsComponent } from '../DGA/class-students/class-students.component';

const routes: Routes = [{path: "", component: StudentDashboardComponent,
  children : [
    { path: 'classe', component: ClassStudentsComponent, data:{title: "Les Classes de Formation"} },
    
  ]
}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentDashboardRoutingModule { }
