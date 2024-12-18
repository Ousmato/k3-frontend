import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SinginServiceService } from './singin-service.service';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { ClassRoom } from '../../Models/Classe';
import { Inscription, Student, Type_status } from '../../Models/Students';
import { Admin } from '../../Models/Admin';
import { IconsService } from '../../../Services/icons.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AnneeScolaire } from '../../Models/School-info';
import { SchoolService } from '../../../Services/school.service';
import { AdminUSER } from '../../Models/Auth';


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
  classRoom: ClassRoom[] = [];
  fileName!: File;
  admin!: Admin;
  anneeScolaire: AnneeScolaire[] = []
  promotion!: number
  passwordVisible: boolean = false

  constructor(private formBuilder: FormBuilder, private pageTitle: PageTitleService,
    private service: SinginServiceService, public icons: IconsService, private infoSchool: SchoolService,
    private classeService: ClassStudentService) { }
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
      urlPhoto: ['', Validators.required],
      matricule: ['', Validators.required],
      status: ['', Validators.required],
      idClasse: ['', Validators.required],
      lieuNaissance: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      // idAnneeScolaire: ['', Validators.required] 
    });
    // ----------------------------------------------------------------------

    this.classeService.getAllCurrentClassOfYear().subscribe(data => {
      this.classRoom = data;
      console.log(this.classRoom);
    });

    this.load_all_annee();
  }

  // Méthode pour basculer l'état du mot de passe
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  // --------------get all annee
  load_all_annee() {
    this.infoSchool.getAll_annee().subscribe(data => {
      this.anneeScolaire = data;
      this.anneeScolaire.forEach(ans => {


        const annee = new Date(ans.debutAnnee)
        const debutAnnee = annee.getFullYear()
        ans.ans = debutAnnee
      })
    })
  }

  onFileSelected(event: any) {
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
    console.log("fom", formData);

    this.admin = AdminUSER()?.scolarite
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
      matricule: formData.matricule,
      lieuNaissance: formData.lieuNaissance,
      dateNaissance: formData.dateNaissance,
    };
    const inscription : Inscription ={
      idEtudiant: student,
      idClasse: classe,
      idAdmin: this.admin,
    }

    console.log(inscription, "student");
    // return;
    if (this.studentForm.valid) {
      this.service.singIn(inscription, this.fileName).subscribe(
        {
          next: (response) => {
            this.pageTitle.showSuccessToast(response.message);
            this.studentForm.reset();

          },
          error: (erreur) => {
            this.pageTitle.showErrorToast(erreur.error.message);
          }

        })
    } else {
      this.studentForm.markAllAsTouched();
      console.log("Veuillez remplir tous les champs correctement!");
    }
  }
  // --------------------------back button
  goBack() {
    window.history.back();
  }

  // abrevigate filiere name
  abreviateFiliereName(filiereName: string) : string{
    const words = filiereName.split(' ');
    // Garder uniquement les mots de plus de 3 lettres pour l'abréviation
    const abbreviation = words.filter(word => word.length > 3)
     .map(word => word[0].toUpperCase())
     .join('');
     if(abbreviation.includes('EEER')){
      return '3ER'
     }
    return abbreviation;
  }

}

