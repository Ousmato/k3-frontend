import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClassStudentService } from '../../../../../DGA/class-students/class-student.service';
import { ClassRoom } from '../../../../Models/Classe';
import { Accademies, Diplome, Inscription, Quartier, seriesType, Student, Type_status } from '../../../../Models/Students';
import { Admin } from '../../../../Models/Admin';
import { IconsService } from '../../../../../Services/icons.service';
import { PageTitleService } from '../../../../../Services/page-title.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AnneeScolaire } from '../../../../Models/School-info';
import { SchoolService } from '../../../../../Services/school.service';
import { AdminUSER } from '../../../../Models/Auth';
import { NiveauService } from '../../../../../Services/niveau.service';
import { Niveau } from '../../../../Models/Niveau';
import { Filiere } from '../../../../Models/Filieres';
import { FiliereService } from '../../../../../Services/filiere.service';
import { InscriptionService } from '../../../../../Services/inscription.service';
import { Student_Enum_Options } from '../../Utils/Student-enum-options';
import { StudentSharedMethods } from '../../Utils/Student-shared-methode';
import { Class_shared } from '../../../../../DGA/class-students/Utils/Class-shared-methods';


@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html',
  styleUrl: './singin.component.css'
})
export class SinginComponent implements OnInit {

  @Output() titleEvent = new EventEmitter<string>();
  studentForm!: FormGroup;
  imageUrl: string | ArrayBuffer | null = null;
  classRoom: ClassRoom[] = [];
  niveaux: Niveau[] = [];
  filieres: Filiere[] = [];
  fileName!: File;
  admin!: Admin;
  accademiesOptions: {key: string, value: string}[] = []
  statusOptions: {key: string, value: string}[] = []
  quartierOptions: {key: string, value: string}[] = []
  diblomeOptions: {key: string, value: string}[] = []
  serieOptions: {key: string, value: string}[] = []
  annees : any [] = [];
  anneeScolaire: AnneeScolaire[] = []
  promotion!: number
  passwordVisible: boolean = false

  constructor(private formBuilder: FormBuilder, private pageTitle: PageTitleService, private niveauService: NiveauService,
    private inscriptionService: InscriptionService, public icons: IconsService, public enum_options: Student_Enum_Options, 
    private filiereService: FiliereService, public studen_shared_methods: StudentSharedMethods, public class_shared: Class_shared,
    private classeService: ClassStudentService) { }
  ngOnInit(): void {

    this.accademiesOptions = this.enum_options.getAccademiesOptions();
    this.statusOptions = this.enum_options.getStatusOptions();
    this.quartierOptions = this.enum_options.getQuartierOptions();
    this.diblomeOptions = this.enum_options.getDiplomesOptions();
    this.serieOptions = this.enum_options.getSeriesOptions();

    this.get_all_niveau();
    this.get_all_filiere();
    this.admin = AdminUSER()?.scolarite
    // this.studentStatusOptions = Object.keys(Type_status);
    this.studentForm = this.formBuilder.group({
      nom: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(30)]],
      prenom: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(30)]],
      sexe: ['', Validators.required],
      email: ['',[Validators.email]],
      telephone: ['', Validators.required],
      // password: ['', Validators.required],
      urlPhoto: [''],
      matricule: [''],
      status: ['', Validators.required],
      lieuNaissance: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(30)]],
      dateNaissance: ['', Validators.required],

      motherName: ['',[Validators.maxLength(30)]],
      lastNameFather: ['',[Validators.maxLength(30)]],
      commNaissance: ['',[Validators.maxLength(30)]], 
      cercleNaissance: ['',[Validators.maxLength(30)]], 
      nationalite: ['',[Validators.maxLength(30)]], 
      residenceParent: ['',[Validators.maxLength(30)]],
  
      diplome: ['',[Validators.required]],
      academies: [],
      series: [], 
      quartier: [], 
  
      numeroPlace: [''],
      anneeObtention: [''],
      idFiliere: ['', Validators.required],
      idNivau: ['', Validators.required] 
    });
    // ----------------------------------------------------------------------

    this.classeService.getAllCurrentClassOfYear(this.admin.idAdministra!).subscribe(data => {
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
    const date = new Date();
    const currentYear = date.getFullYear();
    // Create an array to hold the last 5 years
    const years = [];
    
    for (let i = 0; i < 5; i++) {
        years.push(currentYear - i);  // Add the current year, then go back 1 year at a time
    }
    
    // Now `years` contains the last 5 years
    this.annees = years;
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imageUrl = e.target?.result!; // Met à jour l'image affichée
      };
      reader.readAsDataURL(file);
    this.fileName = event.target.files[0];
  }
}

  // get all niveau
  get_all_niveau() {
    this.niveauService.getAll().subscribe(niveau =>{
      this.niveaux = niveau;
      console.log("niveau", niveau)
    })
  }


  // get all filiere
  get_all_filiere() {
    this.filiereService.getAll_filiere().subscribe(filiere =>{
      this.filieres = filiere;
      console.log("filiere", filiere)
    })
  }
 
  singin() {

    const formData = this.studentForm.value;
    console.log("fom", formData);

    this.admin = AdminUSER()?.scolarite
    // console.log(this.classRoom.find(c => c.id === formData.idClasse));
    const classe: ClassRoom = this.classRoom.find(c => c.idFiliere?.idNiveau.id === +formData.idNivau && c.idFiliere.idFiliere.id == +formData.idFiliere)!;
    console.log(classe, "classe------------")


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
      motherName: formData.motherName,
      
      commNaissance: formData.commNaissance,
      cercleNaissance: formData.cercleNaissance,
      nationalite: formData.nationalite,
      residenceParent: formData.residenceParent,
      diplome: formData.diplome,
      academies: formData.academies,
      series: formData.series,
      quartier: formData.quartier,
      numeroPlace: formData.numeroPlace,
      lastNameFather: formData.lastNameFather,
      anneeObtention: formData.anneeObtention,
      

    };
    const inscription : Inscription ={
      idEtudiant: student,
      idClasse: classe,
      idAdmin: this.admin,
    }

    console.log(inscription, "student");
    // return;
    if (this.studentForm.valid) {
      this.inscriptionService.singIn(inscription, this.fileName).subscribe(
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
  
  //back button
  goBack() {
    window.history.back();
  }

  onError(event: Event) {
    this.imageUrl = 'assets/default-image.png';
    // const target = event.target as HTMLImageElement;
    // target.src = 'assets/business-professional-icon.svg';
  }

}

