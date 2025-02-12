import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtudiantsRoutingModule } from './etudiants-routing.module';
import { StatistiqueSudentsValuesComponent } from './statistique-sudents-values/statistique-sudents-values.component';


@NgModule({
 
  imports: [
    CommonModule,
    EtudiantsRoutingModule
  ],
 
 
})
export class EtudiantsModule { }
