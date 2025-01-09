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


@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html',
  styleUrl: './singin.component.css'
})
export class SinginComponent implements OnInit {
  // adminConnect: 

  studentStatusOptions: { key: string, value: string }[] = [];
  studentDiplomesOptions: { key: string, value: string }[] = [];
  studentAccademieOptions: { key: string, value: string }[] = [];
  studentSeriesOptions: { key: string, value: string }[] = [];
  studentQuartierOptions: { key: string, value: string }[] = [];

  @Output() titleEvent = new EventEmitter<string>();
  studentForm!: FormGroup;
  imageUrl: string | ArrayBuffer | null = null;
  classRoom: ClassRoom[] = [];
  niveaux: Niveau[] = [];
  filieres: Filiere[] = [];
  fileName!: File;
  admin!: Admin;
  annees : any [] = [];
  anneeScolaire: AnneeScolaire[] = []
  promotion!: number
  passwordVisible: boolean = false

  constructor(private formBuilder: FormBuilder, private pageTitle: PageTitleService, private niveauService: NiveauService,
    private inscriptionService: InscriptionService, public icons: IconsService, private infoSchool: SchoolService, private filiereService: FiliereService,
    private classeService: ClassStudentService) { }
  ngOnInit(): void {
    this.get_all_niveau();
    this.get_all_filiere();

    this.studentStatusOptions = this.getStatusOptions();
    this.studentDiplomesOptions = this.getDiplomesOptions();
    this.studentAccademieOptions = this.getAccademiesOptions();
    this.studentSeriesOptions = this.getSeriesOptions();
    this.studentQuartierOptions = this.getQuartierOptions();
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
    const date = new Date();
    const currentYear = date.getFullYear();
    const fiveYearsAgo = currentYear - 5;
    
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
  // get status options
  getStatusOptions(): { key: string, value: string }[] {
    return Object.keys(Type_status).map(key => ({
      key: key,
      value: Type_status[key as keyof typeof Type_status]
    }));
  }
  // get series options
  getSeriesOptions(): { key: string, value: string }[] {
    return Object.keys(seriesType).map(key => ({
      key: key,
      value: seriesType[key as keyof typeof seriesType]
    }));
  }
  // get accademies options
  getAccademiesOptions(): { key: string, value: string }[] {
    return Object.keys(Accademies).map(key => ({
      key: key,
      value: Accademies[key as keyof typeof Accademies]
    }));
  }
  // get diplomes options
  getDiplomesOptions(): { key: string, value: string }[] {
    return Object.keys(Diplome).map(key => ({
      key: key,
      value: Diplome[key as keyof typeof Diplome]
    }));
  }
  // get quartier options
  getQuartierOptions(): { key: string, value: string }[] {
    return Object.keys(Quartier).map(key => ({
      key: key,
      value: Quartier[key as keyof typeof Quartier]
    }));
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
  // --------------------------back button
  goBack() {
    window.history.back();
  }

  onError(event: Event) {
    this.imageUrl = 'assets/default-image.png';
    // const target = event.target as HTMLImageElement;
    // target.src = 'assets/business-professional-icon.svg';
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector<HTMLInputElement>('#inputPhoto');
    if (fileInput) {
      fileInput.click(); // Déclencher un clic programmatique
    }
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

