import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DerHomeComponent } from './der-home.component';

const routes: Routes = [{path: '', component: DerHomeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DerHomeRoutingModule { }
