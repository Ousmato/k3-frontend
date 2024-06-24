import { Component, OnInit } from '@angular/core';
import { Teacher, TeachersStatus } from '../../Models/Teachers';
import { IconsService } from '../../../Services/icons.service';
import { EnseiService } from './ensei.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-enseignant',
  templateUrl: './enseignant.component.html',
  styleUrl: './enseignant.component.css'
})
export class EnseignantComponent implements OnInit {
  enseignants: Teacher [] =[];
  dtOptions: any = {};
  teacher_form!: FormGroup;
  current_enseignat_create!: Teacher;
  fileName!: File;
  teacherStatusOptions!: string[];

  constructor(public icons: IconsService, private enseignantService: EnseiService, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.teacherStatusOptions = Object.values(TeachersStatus);
    this.teacher_form = this.fb.group({
      nom: [''],
      prenom: [''],
      email: [''],
      sexe: [""],
      password: [''],
      telephone: [''],
      urlPhoto: [''],
      // isDeleted: [''],
      status: ['']
    })

    this.load_enseignants();
  }

  load_enseignants(){
    this.enseignantService.getAll().subscribe(data =>{
      data.forEach((item: any) => {
        item.urlPhoto = `http://localhost/StudentImg/${item.urlPhoto}`;
      });
      this.enseignants = data;
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
  // ------------------------------add enseignant form
  
  onFileSelected(event: any)  {
    this.fileName = event.target.files[0];
  }
  add_teacher(){
   const formData = this.teacher_form.value;
   const teacher: Teacher = {
     nom: formData.nom,
     prenom: formData.prenom,
     email: formData.email,
     password:  formData.password,
     telephone: formData.telephone,
     sexe: formData.sexe,
    //  urlPhoto: formData.urlPhoto,
     // isDeleted: formData.isDeleted,
     status: formData.status
   }
   console.log(teacher, "teacher")
  //  return
   this.enseignantService.create(teacher, this.fileName!).subscribe(data => {
    this.current_enseignat_create = data;
    alert("Ajout effectuee avec succees!")
    this.teacher_form.reset();
    // reload this page
    window.location.reload();
   })
  }
}
