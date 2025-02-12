import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../../../../Services/icons.service';
import { ClassRoom } from '../../../../Models/Classe';
import { ActivatedRoute, Router } from '@angular/router';
import { EtudeService } from '../../etude.service';
import { ClassStudentService } from '../../../../../DGA/class-students/class-student.service';
import { Inscription, Student } from '../../../../Models/Students';
import { PageTitleService } from '../../../../../Services/page-title.service';
import { Location } from '@angular/common';
import { SchoolService } from '../../../../../Services/school.service';
import { AnneeScolaire } from '../../../../Models/School-info';
import { environment } from '../../../../../../environments/environment';
import { InscriptionService } from '../../../../../Services/inscription.service';
import { Admin } from '../../../../Models/Admin';
import { AdminUSER } from '../../../../Models/Auth';
import { Class_shared } from '../../../../../DGA/class-students/Utils/Class-shared-methods';
import { Student_Enum_Options } from '../../Utils/Student-enum-options';
import { StudentSharedMethods } from '../../Utils/Student-shared-methode';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrl: './student-edit.component.css'
})
export class StudentEditComponent implements OnInit {

  imageUrl!: string | ArrayBuffer | null
  studentForm!: FormGroup
  filename!: File
  photoSelect!: File
  classRoom: ClassRoom[] = []
  passwordVisible: boolean = false
  isEdit: boolean = false
  isUpdate: boolean = false
  idStudent!: number
  accademiesOptions: {key: string, value: string}[] = []
  statusOptions: {key: string, value: string}[] = []
  quartierOptions: {key: string, value: string}[] = []
  diblomeOptions: {key: string, value: string}[] = []
  serieOptions: {key: string, value: string}[] = []
  admin!: Admin 
  urlImage!: string | ArrayBuffer
  anneeScolaire: AnneeScolaire[] = []

  @Input() inscrit!: Inscription
  @Output() event = new EventEmitter();


  constructor(private formBuilder: FormBuilder, private infoSchool: SchoolService, private inscriptionService: InscriptionService,
    private studentService: EtudeService, public enum_options: Student_Enum_Options, public studen_shared_methods: StudentSharedMethods,
    public shared_method: Class_shared, private root: Router, public icons: IconsService, private pageTitle: PageTitleService, private location: Location) { }

  ngOnInit(): void {
    this.imageUrl = this.inscrit?.idEtudiant?.urlPhoto || 'assets/business-professional-icon.svg';
    this.accademiesOptions = this.enum_options.getAccademiesOptions();
    this.statusOptions = this.enum_options.getStatusOptions();
    this.quartierOptions = this.enum_options.getQuartierOptions();
    this.diblomeOptions = this.enum_options.getDiplomesOptions();
    this.serieOptions = this.enum_options.getSeriesOptions();
    this.load_form();
    // this.load_student();
    this.admin = AdminUSER()?.scolarite
  }
  goBack() {
    this.location.back();
  }

  // ---------------------------load update
  load_form() {
    this.studentForm = this.formBuilder.group({
      id: [this.inscrit.id, Validators.required],
      nom: [this.inscrit.idEtudiant.nom, Validators.required],
      prenom: [this.inscrit.idEtudiant.prenom, Validators.required],
      sexe: [this.inscrit.idEtudiant.sexe, Validators.required],
      email: [this.inscrit.idEtudiant.email, [ Validators.email]],
      telephone: [this.inscrit.idEtudiant.telephone, Validators.required],
      // password: [''],
      urlPhoto: [''],
      matricule: [this.inscrit.idEtudiant.matricule],
      // scolarite: ['', Validators.required],
      idClasse: [''],
      lieuNaissance: [this.inscrit.idEtudiant.lieuNaissance, Validators.required],
      dateNaissance: [this.inscrit.idEtudiant.dateNaissance, Validators.required],
      numeroPlace: [this.inscrit.idEtudiant.numeroPlace],
      lastNameFather: [this.inscrit.idEtudiant.lastNameFather],
      anneeObtention: [this.inscrit.idEtudiant.anneeObtention],
      motherName: [this.inscrit.idEtudiant.motherName],
      commNaissance: [this.inscrit.idEtudiant.commNaissance],
      cercleNaissance: [this.inscrit.idEtudiant.cercleNaissance],
      nationalite: [this.inscrit.idEtudiant.nationalite, Validators.required],
      residenceParent: [this.inscrit.idEtudiant.residenceParent],
      diplome: [this.inscrit.idEtudiant.diplome],
      status: [this.inscrit.idEtudiant.status],
      academies: [this.inscrit.idEtudiant.academies],
      series: [this.inscrit.idEtudiant.series],
      quartier: [this.inscrit.idEtudiant.quartier],
      // admin: [''] 
    });
  }

  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/business-professional-icon.svg';
  }
  // ----------------------select file
  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imageUrl = e.target?.result!; // Met à jour l'image affichée
      };
      reader.readAsDataURL(file);
    this.filename = event.target.files[0];
  }
}

  
  update() {
    const formData = this.studentForm.value
    console.log(formData, "formdata")
    const {scolarite,idClasse, id, ...studens} = formData
    const student: Student = {
      ...studens,
      // idClasse: this.classRoom.find(cl => cl.id === +formData.idClasse)!
    }
    const inscrit : Inscription ={
      id: formData.id,
      idEtudiant: student,
      idClasse: this.classRoom.find(cl => cl.id === +formData.idClasse)!,
      idAdmin: this.admin
    }
    console.log(inscrit, "student")
    // return
    if (this.studentForm.valid) {
      if (this.isUpdate) {
        console.log("consoler")
        this.studentService.updateStudent(inscrit, this.filename).subscribe({
          next: (response) => {
            this.pageTitle.showSuccessToast(response.message)
            this.event.emit()
          },
          error: (erreur) => {
            this.pageTitle.showErrorToast(erreur.error.message)
          }
        })
      }

    }else{
      console.log("invalid :", this.studentForm.value)
    }
  }
  // ----------------------------
  toggle_toChageEdit() {
    this.isEdit = !this.isEdit
  }

  sunmit() {
    this.isUpdate = true;
    this.update();
  }
}
