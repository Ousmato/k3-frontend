import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../../Services/icons.service';
import { ClassRoom } from '../../Models/Classe';
import { ActivatedRoute, Router } from '@angular/router';
import { EtudeService } from '../../Views/etudiants/etude.service';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { Student } from '../../Models/Students';
import { PageTitleService } from '../../../Services/page-title.service';
import { Location } from '@angular/common';
import { SchoolService } from '../../../Services/school.service';
import { AnneeScolaire } from '../../Models/School-info';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrl: './student-edit.component.css'
})
export class StudentEditComponent implements OnInit{

  studentForm! : FormGroup
  filename!: File 
  photoSelect!: File
  classRoom: ClassRoom [] = []
  passwordVisible: boolean = false
  idStudent!: number
  student?: Student
  urlImage! : string | ArrayBuffer
  anneeScolaire: AnneeScolaire [] = []


  constructor( private formBuilder: FormBuilder, private infoSchool: SchoolService,
    private studentService: EtudeService, private classeService: ClassStudentService,
    private router: ActivatedRoute, private root: Router, public icons: IconsService, private pageTitle: PageTitleService, private location: Location){}

  ngOnInit(): void {
      this.load_class_rooms();
      this.load_form();
      this.load_student();
      this.load_all_annee()
      
  }
goBack(){
  this.location.back();
}
// --------------get all annee
load_all_annee(){
  this.infoSchool.getAll_annee().subscribe(data=>{
    this.anneeScolaire = data;
  })
}
  togglePasswordVisibility(){
    this.passwordVisible =! this.passwordVisible
  }
// ---------------------------load update
  load_form(){
    this.studentForm = this.formBuilder.group({
      idEtudiant: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      sexe: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      password: ['', Validators.required],
      matricule: ['', Validators.required],
      scolarite: ['',Validators.required],
      idClasse: ['', Validators.required],
      lieuNaissance: ['',Validators.required],
      dateNaissance: ['',Validators.required],
      // admin: [''] 
    });
  }
  // ----------------------select file
  onFileSelected(event: any){
    this.filename = event.target.files[0];
  }

  onPhotoSelected(event: any){
    
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
  load_class_rooms(){
    this.classeService.getAllCurrentClassOfYear().subscribe((data: ClassRoom[]) => {
      this.classRoom = data;
    })
  }
  load_student(){
    this.router.queryParams.subscribe(param =>{
      this.idStudent = param['id']
    })
    this.studentService.getStudent_by_id(this.idStudent).subscribe(data =>{
      this.student = data;
      // this.studentForm.get('urlPhoto')?.setValue(this.student!.urlPhoto);
      this.student.urlPhoto = 'http://localhost/StudentImg/'+this.student.urlPhoto
      
      this.studentForm.get('idEtudiant')?.setValue( this.student!.idEtudiant);
      this.studentForm.get('nom')?.setValue( this.student!.nom);
      this.studentForm.get('prenom')?.setValue(this.student!.prenom);
      this.studentForm.get('sexe')?.setValue(this.student!.sexe);
      this.studentForm.get('email')?.setValue(this.student!.email);
      this.studentForm.get('password')?.setValue(this.student!.password);
      this.studentForm.get('telephone')?.setValue(this.student!.telephone);
      this.studentForm.get('lieuNaissance')?.setValue(this.student!.lieuNaissance);
      this.studentForm.get('dateNaissance')?.setValue(this.student!.dateNaissance);
      this.studentForm.get('matricule')?.setValue(this.student!.matricule);
      this.studentForm.get('scolarite')?.setValue(this.student!.scolarite);
      this.studentForm.get('idClasse')?.setValue(this.student!.idClasse.id);

    })
  }
    update(){
      const formData = this.studentForm.value
      console.log(formData, "formdata")
      if(this.studentForm.valid){
        const student: Student = {
         ...formData,
          idClasse: this.classRoom.find(cl => cl.id === +formData.idClasse)!
        }
        console.log(student, "student")
        
        this.studentService.updateStudent(student, this.filename).subscribe({
          next :(response) =>{
            this.pageTitle.showSuccessToast(response.message)
            this.root.navigate(['/sidebar/etudiant']);
          },
          error: (erreur) =>{
            this.pageTitle.showErrorToast(erreur.error.message)
          }
        })
      }
    }
}
