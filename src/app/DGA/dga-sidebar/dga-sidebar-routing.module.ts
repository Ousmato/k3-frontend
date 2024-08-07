import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DgaSidebarComponent } from './dga-sidebar.component';
import { DgaMentionListComponent } from '../dga-mention-list/dga-mention-list.component';
import { DgaHomeComponent } from '../dga-home/dga-home.component';
import { ClassStudentsComponent } from '../class-students/class-students.component';
import { DgaSettingComponent } from '../dga-setting/dga-setting.component';
import { SettingsComponent } from '../../Admin/Views/settings/settings.component';

const routes: Routes = [{path: '', component: DgaSidebarComponent,
  children: [
    {path: '', component: DgaHomeComponent},
    {path: 'mentions-liste', component: ClassStudentsComponent},
    {path: 'setting', component: SettingsComponent},
    

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DgaSidebarRoutingModule { }
