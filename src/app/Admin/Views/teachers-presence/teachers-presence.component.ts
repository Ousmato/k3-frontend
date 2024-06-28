import { Component, Input, OnInit } from '@angular/core';
import { Teacher } from '../../Models/Teachers';
import { IconsService } from '../../../Services/icons.service';
import { EnseiService } from '../enseignant/ensei.service';
import { Teacher_presence } from '../../Models/objectPresence';
import { NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceService } from '../emplois-du-temps/service.service';
import { DatePipe } from '@angular/common';
import { Emplois } from '../../Models/Emplois';
import { data } from 'jquery';

@Component({
  selector: 'app-teachers-presence',
  templateUrl: './teachers-presence.component.html',
  styleUrl: './teachers-presence.component.css'
})
export class TeachersPresenceComponent  implements OnInit {
  enseignants!: Teacher [];
teacher_info: Teacher_presence[] = [];
  detaille: Teacher_presence [] = [];
  dtOptions: any = {};

  datesWithDays: { day: string, date: string }[] = [];
emplois!: Emplois;


  constructor(private emploisService: ServiceService, public icons: IconsService,private datePipe: DatePipe, private enseignantService: EnseiService, private route: Router) { }
  ngOnInit(): void {
    this.getAllTeacher();
    this.loadEmploisByClass();
    
  }

  // ------------------------method get all teacher 
  getAllTeacher(){
    this.enseignantService.getAllHaveEmplois().subscribe((data: Teacher_presence[])=> {
      this.teacher_info = data;
      console.log("data:", this.teacher_info);
      
      this.enseignants = data.map(d =>d.teacher);
      
      // Itérer sur chaque objet Teacher_presence dans le tableau enseignants
      this.enseignants.forEach(presence => {
        // Accéder et modifier la propriété urlPhoto de l'objet Teacher
        presence.urlPhoto = `http://localhost/StudentImg/${presence.urlPhoto}`;
      });
      console.log(this.enseignants)
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      // processing: true,
      // serverSide: true,
      columnDefs: [
        { orderable: false, targets: '_all' }
      ],
      language: {
        info: 'Affichage de _START_ à _END_ sur _TOTAL_ entrées',
        infoEmpty: 'Affichage de 0 à 0 sur 0 entrée',
        infoFiltered: '(filtré à partir de _MAX_ entrées au total)',
        lengthMenu: '_MENU_ Entrées par page',
        search: 'Recherche :'
      }
      // Ajoutez d'autres options au besoin
    };
  }
  // --------------------------------------------------method go to detail teacher presence
  selectedTeacher(teachId: number): void {
     // this.detaille.push(teacherDetail)
     const navigationExtras: NavigationExtras = {
      queryParams: { id: teachId }
    };
      this.route.navigate(['/sidebar/enseignant-pre-detail'], navigationExtras);
    
  }

  // --------------------------------method get emplois by class
  loadEmploisByClass(){
   
}
}
