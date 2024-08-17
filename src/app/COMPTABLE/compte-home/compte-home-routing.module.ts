import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompteHomeComponent } from './compte-home.component';

const routes: Routes = [{path: '', component: CompteHomeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompteHomeRoutingModule { }
