import { Component, OnInit } from '@angular/core';
import { EtudeService } from './etude.service';
import { ClassStudentService } from '../class-students/class-student.service';
import { Student } from '../../Models/Students';
import { data } from 'jquery';
import { IconsService } from '../../../Services/icons.service';

@Component({
  selector: 'app-etudiants',
  templateUrl: './etudiants.component.html',
  styleUrl: './etudiants.component.css'
})
export class EtudiantsComponent implements OnInit {
  students!: Student [];
  
  constructor(private service: EtudeService,private classeService: ClassStudentService, public icons: IconsService) { }

  dtOptions: any = {};
  ngOnInit(): void {
    
    this.service.getAll().subscribe(data =>{
      data.forEach((item: any) => {
        item.urlPhoto = `http://localhost/StudentImg/${item.urlPhoto}`;
      });
      this.students = data;
    })
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

}
