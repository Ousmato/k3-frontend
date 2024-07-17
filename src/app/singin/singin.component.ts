import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SinginServiceService } from './singin-service.service';
import { ClassStudentService } from '../Admin/Views/class-students/class-student.service';
import { ClassRoom } from '../Admin/Models/Classe';
import { Student } from '../Admin/Models/Students';
import { Admin } from '../Admin/Models/Admin';
import { IconsService } from '../Services/icons.service';
import { PageTitleService } from '../Services/page-title.service';

@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html',
  styleUrl: './singin.component.css'
})
export class SinginComponent implements OnInit {
// adminConnect: 

title = 'Sign In';

@Output() titleEvent = new EventEmitter<string>();
  studentForm!: FormGroup;
  classRoom: ClassRoom [] = [];
  fileName!: File;
  admin!: Admin;

  passwordVisible : boolean = false

  constructor(private formBuilder: FormBuilder, private pageTitle: PageTitleService,
    private service: SinginServiceService, public icons: IconsService,
    private classeService: ClassStudentService){}
  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      sexe: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      password: ['', Validators.required],
      urlPhoto: ['',Validators.required],
      matricule: ['', Validators.required],
      scolarite: ['',Validators.required],
      idClasse: ['', Validators.required],
      lieuNaissance: ['',Validators.required],
      dateNaissance: ['',Validators.required],
      // admin: [''] 
    });
    // ----------------------------------------------------------------------
    
    this.classeService.getAll().subscribe(data =>{
      this.classRoom = data;
      console.log(this.classRoom);
    });

    this.sendTitle();
  }
  // -------------------------------------------
 

  sendTitle() {
    this.titleEvent.emit(this.title);
  }
   // Méthode pour basculer l'état du mot de passe
   togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
}

  
 onFileSelected(event: any)  {
    this.fileName = event.target.files[0];
  }
  singin() {
    
      const formData = this.studentForm.value;
      const adminData = localStorage.getItem("admin");
      console.log("fom", formData);
      
      if (adminData) {
        // Convertir les données JSON en objet JavaScript
       this.admin = JSON.parse(adminData);
      
      } else {
        console.log("Aucune donnée d'administrateur trouvée dans le localStorage.");
      }
      // console.log(this.classRoom.find(c => c.id === formData.idClasse));
      const classe: ClassRoom = this.classRoom.find(c => c.id === +formData.idClasse)!;
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
      if (this.studentForm.valid) {
        this.service.singIn(student, this.fileName).subscribe(
          {
            next:(response) =>{
              this.pageTitle.showSuccessToast(response.message);
              this.studentForm.reset();

            },
            error: (erreur) =>{
              this.pageTitle.showErrorToast(erreur.error.message);
            }

        })
    }else{
      this.studentForm.markAllAsTouched();
      console.log("Veuillez remplir tous les champs correctement!");
    }
  }
  
 
}
  
    
      
