import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RSHomeComponent } from './r-s-home.component';

const routes: Routes = [{path: '', component: RSHomeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RSHomeRoutingModule { }
