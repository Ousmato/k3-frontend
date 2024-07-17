import { Component, OnInit } from '@angular/core';
import { EtudeService } from './etude.service';
import { ClassStudentService } from '../class-students/class-student.service';
import { Student } from '../../Models/Students';
import { data } from 'jquery';
import { IconsService } from '../../../Services/icons.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dom } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-etudiants',
  templateUrl: './etudiants.component.html',
  styleUrl: './etudiants.component.css'
})
export class EtudiantsComponent implements OnInit {
  searchTerm: string = '';
  students: Student[] = [];
  update_student_form!: FormGroup
  student!: Student;
  fileName!: File
  photoSelect!: File
  urlImage! : string | ArrayBuffer
  
  constructor(private service: EtudeService,private fb: FormBuilder, 
    private classeService: ClassStudentService, public icons: IconsService) { }

  ngOnInit(): void {
    
    this.service.getAll().subscribe(data =>{
      data.forEach((item: any) => {
        item.urlPhoto = `http://localhost/StudentImg/${item.urlPhoto}`;
        // this.student = item
      });
      this.students = data;
    })
   
  
    this.load_student_form();
  }
// -----------------------------------------------load form update student
  load_student_form(){
    this.update_student_form = this.fb.group({
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
    })
  }
  // ----------------------------------------------------
  onPhotoSelected(event: any){
    
    console.log(this.fileName, "fill")
    this.photoSelect = event.target.files[0];
    // console.log(this.photoSelect, "photo select")
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.urlImage = e.target.result;
    };
    reader.readAsDataURL(this.photoSelect);
  }
  update_student(student: Student){}
  // ------------------------------------------------------------
  getStudent(student?: Student) {
console.log(student?.sexe, "student sexe")
    this.update_student_form.get('nom')?.setValue( student!.nom);
    this.update_student_form.get('prenom')?.setValue(student!.prenom);
    this.update_student_form.get('sexe')?.setValue(student!.sexe);
    this.update_student_form.get('email')?.setValue(student!.email);
    this.update_student_form.get('telephone')?.setValue(student!.telephone);
    this.update_student_form.get('lieuNaissance')?.setValue(student!.lieuNaissance);
    this.update_student_form.get('dateNaissance')?.setValue(student!.dateNaissance);
    this.update_student_form.get('matricule')?.setValue(student!.matricule);
    this.update_student_form.get('scolarite')?.setValue(student!.scolarite);


  }

  // ----------------------------------------------------------
  deleted_student(id: number) {
    this.service.desactiveStudent(id).subscribe(data => {
      alert("Desactivation avec success!!");
      window.location.reload();
      console.log(data, "ttttt--------")
    });
  }
  // ------------------------------filter methode
   filteredStudents() {
    if (!this.searchTerm) {
      return this.students;
    }
    return this.students.filter(student =>
      student.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.idClasse.idFiliere?.idFiliere?.nomFiliere.toLowerCase().includes(this.searchTerm.toLowerCase())
      // student.telephone.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
