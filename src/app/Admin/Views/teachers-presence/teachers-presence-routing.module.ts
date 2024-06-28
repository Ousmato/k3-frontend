import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeachersPresenceComponent } from './teachers-presence.component';

const routes: Routes = [{path: '', component: TeachersPresenceComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeachersPresenceRoutingModule { }
