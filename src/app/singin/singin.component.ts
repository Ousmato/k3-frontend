import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SinginServiceService } from './singin-service.service';
import { ClassStudentService } from '../Admin/Views/class-students/class-student.service';
import { ClassRoom } from '../Admin/Models/Classe';
import { data } from 'jquery';
import { Student } from '../Admin/Models/Students';
import { Admin } from '../Admin/Models/Admin';

@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html',
  styleUrl: './singin.component.css'
})
export class SinginComponent implements OnInit {
// adminConnect: 
  studentForm!: FormGroup;
  classRoom: ClassRoom [] = [];
  fileName!: File;
  admin!: Admin;
  // classe!: ClassRoom [];
  constructor(private formBuilder: FormBuilder, 
    private service: SinginServiceService, 
    private classeService: ClassStudentService){}
  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      // id: [null], 
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      sexe: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      password: ['', Validators.required],
      urlPhoto: ['',Validators.required],
      matricule: ['', Validators.required],
      scolarite: ['', Validators.required],
      // date: [''],
      idClasse: [],
      lieuNaissance: ['',Validators.required],
      dateNaissance: ['',Validators.required],
      active: [false],
      admin: [] 
    });
    // ----------------------------------------------------------------------
    
    this.classeService.getAll().subscribe(data =>{
      this.classRoom = data;
      console.log(this.classRoom);
    });
  }
  // -------------------------------------------
 
  

  
 onFileSelected(event: any)  {
    this.fileName = event.target.files[0];
  }
  singin() {
    if (this.studentForm.valid) {
      const formData = this.studentForm.value;
      const adminData = localStorage.getItem("admin");
      
      if (adminData) {
        // Convertir les données JSON en objet JavaScript
       this.admin = JSON.parse(adminData);
      
        // Utiliser les données comme nécessaire
        console.log("Données de l'administrateur:", this.admin);
      } else {
        console.log("Aucune donnée d'administrateur trouvée dans le localStorage.");
      }
      console.log(this.classRoom.find(c => c.id === formData.idClasse));
      const classe: ClassRoom = this.classRoom.find(c => c.id === formData.idClasse)!;
      const student: Student = {
        nom: formData.nom,
        prenom: formData.prenom,
        sexe: formData.sexe,
        email: formData.email,
        scolarite: formData.scolarite,
        telephone: formData.telephone,
        password: formData.password,
        // urlPhoto: formData.urlPhoto,
        matricule: formData.matricule,
        // date: formData.date,
        lieuNaissance: formData.lieuNaissance,
        dateNaissance: formData.dateNaissance,
        idClasse: classe, // Utilisation de this.classe au lieu de classe
        idAdmin: this.admin // Vous devez probablement remplir cette valeur avec l'administrateur approprié
      };
      console.log(student,"student");
      // return;
      this.service.singIn(student, this.fileName).subscribe(
        (response) => {
          console.log('Student signed in successfully:', response);
          alert("Inscription effectuee avec sucees!");
          this.studentForm.reset();
          // Handle success, like navigating to another page
        },
        (error) => {
          console.error('Error signing in:', error);
          // Handle error
        }
      );
    }
  }
  
 
}
  
    
      
