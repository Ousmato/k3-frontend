import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../../Services/icons.service';
import { EtudeService } from '../Etudiants/etude.service';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { EnseiService } from '../Enseignant/ensei.service';
import { ServiceService } from '../../../DER/EDT/Services/service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../../Services/notification.service';
import { Admin } from '../../../administrations/shared/models/Admin';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { getUser } from '../../../administrations/shared/models/auth';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrl: './dasboard.component.css'
})
export class DasboardComponent implements OnInit {

  urlAsset = environment.urlAssetsImage
  admin!: Admin

  constructor(private teacherService: EnseiService, private ruter: Router,
    private notifiService: NotificationService, private emploisService: ServiceService, private fb: FormBuilder,
    public icons: IconsService, private etudiantService: EtudeService, private classeService: ClassStudentService) { }
  ngOnInit(): void {
    this.admin =  getUser()
  
    // this.searchBooks("henry")
  }
  
  // ------------------------------get book 
  toggle_toPostes() {
    this.ruter.navigate(['/sidebar/admin-list'])
  }

  toggle_toRoles() {
    this.ruter.navigate(['/sidebar/roles'])
  }



}
