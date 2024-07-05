import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Notes } from '../../Models/Notes';
import { Student } from '../../Models/Students';
import { IconsService } from '../../../Services/icons.service';
import { EtudeService } from '../etudiants/etude.service';
import { ActivatedRoute } from '@angular/router';
import { data } from 'jquery';
import { SemestreService } from '../../../Services/semestre.service';
import { Semestres } from '../../Models/Semestre';
import { ClassStudentService } from '../class-students/class-student.service';
import { Module } from '../../Models/Module';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Students_Module } from '../../Models/studends_modules';
import { StudenModules_classe } from '../../Classes/Module_classe';

@Component({
  selector: 'app-student-note',
  templateUrl: './student-note.component.html',
  styleUrl: './student-note.component.css'
})
export class StudentNoteComponent implements OnInit {
  students: Student [] = [];
  notes: Notes[] = [];
  dtOptions: any = {};
  idUrl! : number;
  semestres: Semestres[] = [];
  modules: Module[] = [];
  moduleForm!: FormGroup;
  student!: Student;
  showFormId: number | null = null;
  modules_of_student: Students_Module[] = [];
  isShow_button: boolean = false
  moyenneGenerale: number = 0
  mention: string = "";
  
   ClassModule_classe = new StudenModules_classe()
  

  constructor(public icons: IconsService, private fb: FormBuilder,
    private studentService: EtudeService, 
    private route: ActivatedRoute, private semestreService: SemestreService, private classeService: ClassStudentService) {}
  ngOnInit(): void {
    this.loadStudent();
    this.loadSemestre();
    // this.desable_button();
    
   // Initialisation du formulaire
   this.moduleForm = this.fb.group({
    // idStudents: [this.student.idEtudiant, Validators.required],
      classeNote: [''],
      examNote: [''],
      idModule: ['', Validators.required],
      idSemestre: ['', Validators.required]
    });
   
  }

  // ----------------------------------get all semestre 
  loadSemestre(){
    this.semestreService.getAllSemestre().subscribe(data =>{
      this.semestres = data;
    })
  }
  // ---------------------------------get all module without notes
 
  loadStudent(){

    this.route.queryParams.subscribe(data =>{
     this.idUrl = data['id'];

     
     this.studentService.getStudentByIdClasse(this.idUrl).subscribe(data =>{
       data.forEach((item: Student) => {
         item.urlPhoto = `http://localhost/StudentImg/${item.urlPhoto}`;
         this.student = item;
        //  stud = item;
        //  this.modules_of_student.push(item);
         
       });
      //  this.load_student_module(stud, this.modules);
       this.students = data;
     })
     this.dtOptions = {
       pagingType: 'full_numbers',
       pageLength: 10,
       // processing: true,
       // serverSide: true,
       columnDefs: [
         { orderable: false, targets: '_all' }
       ],
       language: {
         info: 'Affichage de _START_ à _END_ sur _TOTAL_ entrées',
         infoEmpty: 'Affichage de 0 à 0 sur 0 entrée',
         infoFiltered: '(filtré à partir de _MAX_ entrées au total)',
         lengthMenu: '_MENU_ Entrées par page',
         search: 'Recherche :'
       }
       // Ajoutez d'autres options au besoin
     };
   })
  
}
 
  // ----------------------------

  onSubmit(student: Student, module: Module) {
    // Ajouter une nouvelle note pour le module et l'étudiant
        const formData = this.moduleForm.value;
        
      const semestre =   this.semestres.find(s => s.id === +formData.idSemestre)
      // console.log(semestre, "s")
        const note : Notes = {
          idStudents: student,
          classeNote: this.moduleForm.value.classeNote,
          examNote: this.moduleForm.value.examNote,
          idModule: module,
          idSemestre: semestre!
        }
        
        this.studentService.add_note(note).subscribe(data =>{
          alert("Ajout effectuee avec success");
          this.moduleForm.reset();
         
          window.location.reload();
        })
      
      }
        
    
// -----------------------------------show form
    show_form(id: number) {
      if (this.showFormId === id) {
        this.showFormId = null; // Cliquez à nouveau sur le même label pour fermer le formulaire
      } else {
        this.showFormId = id; // Afficher le formulaire pour le module avec l'ID spécifié
      }
    }

    // ---------------------------------get module without not of student
    load_module_without_note(idStudent: number){
      this.studentService.getAllModulesWithoutNoteFilter(idStudent,this.idUrl).subscribe((module: Module[]) =>{
        this.modules = module;
       this.desable_button(this.modules);
          //  this.load_student_module(student, module)
        } )
    }
    // ---------------------------desable or aviable button
     desable_button(modules: Module[]){
       console.log(modules, "module isb")
       if(this.modules.length < 0){
       
         this.isShow_button = false;
       }else{
         this.isShow_button = true;
       }
     }

    //  -------------------------------load bulletin
    load_bulletin(idStudent: number){
       this.semestreService.getCurentSemestre().subscribe(semestre =>{
        const idSemestre = semestre
        this.studentService.getAllNoteByIdStudent(idStudent, idSemestre.id!).subscribe(note =>{
          

          // ---------------------------calculate moyen ponderer
          let totalCoefficient = 0;
          let totalPonderedScore = 0;
          let noteCoef = 0
      
          // Parcourir chaque note pour calculer les sommes
          note.forEach(n => {
              const coefficient = n.idModule.coefficient;
              
              noteCoef = ((n.classeNote + n.examNote)/2) * coefficient
              totalCoefficient += coefficient;
              totalPonderedScore += noteCoef; 
          });
      
          const average = totalPonderedScore / totalCoefficient;
          // Calculer la moyenne générale en divisant la somme des notes pondérées par la somme des coefficients
          
         this.moyenneGenerale = +average.toFixed(2);
          if (this.moyenneGenerale < 10) {
            this.mention = 'Insuffisant';
          } else if (this.moyenneGenerale >= 10 && this.moyenneGenerale < 12) {
            this.mention = 'Passable';
          } else if (this.moyenneGenerale >= 12 && this.moyenneGenerale < 14) {
            this.mention = 'Assez bien';
          } else if (this.moyenneGenerale >= 14 && this.moyenneGenerale < 16) {
            this.mention = 'Bien';
          } else {
            this.mention = 'Très bien';
          }
          
          this.notes = note;
        });
        
      })
    }

}
