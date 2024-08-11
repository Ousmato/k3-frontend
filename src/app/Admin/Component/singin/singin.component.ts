import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SinginServiceService } from './singin-service.service';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { ClassRoom } from '../../Models/Classe';
import { Student, Type_status } from '../../Models/Students';
import { Admin } from '../../Models/Admin';
import { IconsService } from '../../../Services/icons.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html',
  styleUrl: './singin.component.css'
})
export class SinginComponent implements OnInit {
// adminConnect: 

studentStatusOptions: { key: string, value: string }[] = [];

@Output() titleEvent = new EventEmitter<string>();
  studentForm!: FormGroup;
  classRoom: ClassRoom [] = [];
  fileName!: File;
  admin!: Admin;

  passwordVisible : boolean = false

  constructor(private formBuilder: FormBuilder, private pageTitle: PageTitleService,
    private service: SinginServiceService, public icons: IconsService, private activatedRoute: ActivatedRoute, private router: Router,
    private classeService: ClassStudentService){}
  ngOnInit(): void {
    this.studentStatusOptions = this.getStatusOptions();
    // this.studentStatusOptions = Object.keys(Type_status);
    this.studentForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      sexe: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      password: ['', Validators.required],
      urlPhoto: ['',Validators.required],
      matricule: ['', Validators.required],
      status: ['',Validators.required],
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
  }
  
   // Méthode pour basculer l'état du mot de passe
   togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
}

  
 onFileSelected(event: any)  {
    this.fileName = event.target.files[0];
  }

  getStatusOptions(): { key: string, value: string }[] {
    return Object.keys(Type_status).map(key => ({
      key: key,
      value: Type_status[key as keyof typeof Type_status] 
    }));
  }
  singin() {
    
      const formData = this.studentForm.value;
      const adminData = sessionStorage.getItem("scolarite");
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
        status: formData.status,
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
  // --------------------------back button
  goBack(){
    window.history.back();
  }
   
 }

