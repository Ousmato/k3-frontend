import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassStudentsRoutingModule } from './class-students-routing.module';
import { ClassArchiveComponent } from './class-archive/class-archive.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ClassStudentsRoutingModule
  ]
})
export class ClassStudentsModule { }
