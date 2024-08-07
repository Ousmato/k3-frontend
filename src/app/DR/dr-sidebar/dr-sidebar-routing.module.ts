import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrSidebarComponent } from './dr-sidebar.component';

const routes: Routes = [{path: '', component: DrSidebarComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrSidebarRoutingModule { }
