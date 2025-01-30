import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrl: './student-edit.component.css'
})
export class StudentEditComponent implements OnInit {

  imageUrl: string = ''
  studentForm!: FormGroup
  filename!: File
  photoSelect!: File
  classRoom: ClassRoom[] = []
  passwordVisible: boolean = false
  isEdit: boolean = false
  isUpdate: boolean = false
  idStudent!: number
  inscrit?: Inscription
  admin!: Admin 
  urlImage!: string | ArrayBuffer
  anneeScolaire: AnneeScolaire[] = []


  constructor(private formBuilder: FormBuilder, private infoSchool: SchoolService, private inscriptionService: InscriptionService,
    private studentService: EtudeService, private classeService: ClassStudentService,
    private router: ActivatedRoute, private root: Router, public icons: IconsService, private pageTitle: PageTitleService, private location: Location) { }

  ngOnInit(): void {
    this.imageUrl = this.inscrit?.idEtudiant?.urlPhoto || 'assets/business-professional-icon.svg';
    this.load_class_rooms();
    this.load_form();
    this.load_student();
    this.load_all_annee()
    this.admin = AdminUSER()?.scolarite
  }
  goBack() {
    this.location.back();
  }
  // --------------get all annee
  load_all_annee() {
    this.infoSchool.getAll_annee().subscribe(data => {
      this.anneeScolaire = data;
    })
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible
  }
  // ---------------------------load update
  load_form() {
    this.studentForm = this.formBuilder.group({
      id: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      sexe: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      password: [''],
      matricule: ['', Validators.required],
      // scolarite: ['', Validators.required],
      idClasse: ['', Validators.required],
      lieuNaissance: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      // admin: [''] 
    });
  }

  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/business-professional-icon.svg';
  }
  // ----------------------select file
  onFileSelected(event: any) {
    this.filename = event.target.files[0];
  }

  onPhotoSelected(event: any) {

    console.log(this.filename, "fill")
    this.photoSelect = event.target.files[0];
    // console.log(this.photoSelect, "photo select")
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.urlImage = e.target.result;
    };
    reader.readAsDataURL(this.photoSelect);
  }
  // -----------------------load classRom
  load_class_rooms() {
    this.classeService.getAllCurrentClassOfYear(this.admin.idAdministra!).subscribe((data: ClassRoom[]) => {
      this.classRoom = data;
    })
  }
  load_student() {
    this.router.queryParams.subscribe(param => {
      this.idStudent = param['id']
    })
    this.inscriptionService.getInscriptionById(this.idStudent).subscribe(data => {
      this.inscrit = data;
      // this.studentForm.get('urlPhoto')?.setValue(this.student!.urlPhoto);
      this.inscrit.idEtudiant.urlPhoto = `${environment.urlPhoto}${this.inscrit.idEtudiant.urlPhoto}`

      // console.log(this.inscrit.password, "ppppppp");
      this.studentForm.get('id')?.setValue(this.inscrit.id!);
      this.studentForm.get('nom')?.setValue(this.inscrit!.idEtudiant.nom);
      this.studentForm.get('prenom')?.setValue(this.inscrit!.idEtudiant.prenom);
      this.studentForm.get('sexe')?.setValue(this.inscrit!.idEtudiant.sexe);
      this.studentForm.get('email')?.setValue(this.inscrit!.idEtudiant.email);
      this.studentForm.get('password')?.setValue(this.inscrit!.idEtudiant.password);
      this.studentForm.get('telephone')?.setValue(this.inscrit!.idEtudiant.telephone);
      this.studentForm.get('lieuNaissance')?.setValue(this.inscrit!.idEtudiant.lieuNaissance);
      this.studentForm.get('dateNaissance')?.setValue(this.inscrit!.idEtudiant.dateNaissance);
      this.studentForm.get('matricule')?.setValue(this.inscrit!.idEtudiant.matricule);
      // this.studentForm.get('scolarite')?.setValue(this.inscrit!.scolarite);
      this.studentForm.get('idClasse')?.setValue(this.inscrit!.idClasse?.id);

    })
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

    if (this.studentForm.valid) {
      if (this.isUpdate) {
        console.log("consoler")
        this.studentService.updateStudent(inscrit, this.filename).subscribe({
          next: (response) => {
            this.pageTitle.showSuccessToast(response.message)
            this.load_student();
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
