import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentNoteComponent } from './student-note.component';

const routes: Routes = [{path: '', component: StudentNoteComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentNoteRoutingModule { }
