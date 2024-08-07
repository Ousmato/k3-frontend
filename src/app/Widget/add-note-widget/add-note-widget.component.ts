import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../Services/icons.service';
import { SemestreService } from '../../Services/semestre.service';
import { Semestres } from '../../Admin/Models/Semestre';
import { EtudeService } from '../../Admin/Views/etudiants/etude.service';
import { Module } from '../../Admin/Models/Module';
import { Student } from '../../Admin/Models/Students';
import { Notes } from '../../Admin/Models/Notes';
import { max } from 'rxjs';
import { PageTitleService } from '../../Services/page-title.service';

@Component({
  selector: 'app-add-note-widget',
  templateUrl: './add-note-widget.component.html',
  styleUrl: './add-note-widget.component.css'
})
export class AddNoteWidgetComponent  implements OnInit{
  @Input() idClasse!: number;
  @Input() student!: Student;
  @Input() modules : Module [] = []
  @Output() closeAddNoteModal = new EventEmitter<any>();

  moduleForm!: FormGroup;
  semestres! : Semestres;
  
  showFormId: number | null = null;
  isShow_add_note: boolean =true
  isOverlay: boolean =true

  constructor(private fb: FormBuilder, private studentService: EtudeService, private pageTitle: PageTitleService,
    public icons: IconsService, private semestreService: SemestreService){}
  ngOnInit(): void {
    this.load_form();
    this.load_module();
    this.loadSemestre();
      
  }
 
  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('ngOnChanges called', changes);
  //   if (changes['student'] && changes['student'].currentValue !== changes['student'].previousValue) {
  //     this.load_module();
  //   }
  // }
  // ---------------------load semestre
  loadSemestre(){
    this.semestreService.get_by_classe(this.idClasse).subscribe(data =>{
      this.semestres = data;
      this.moduleForm.get('idSemestre')?.setValue(this.semestres.nomSemetre);
    })
  }
  // ------------------------------load form add
  load_form(){
    this.moduleForm = this.fb.group({
      // idStudents: [this.student.idEtudiant, Validators.required],
        examNote: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
        classeNote: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
        // idModule: [''],
        idSemestre: ['', Validators.required]
      });
  }
  // -------------------------------load module
  load_module(){
    console.log(this.student, "student select")
    this.studentService.getAllModulesWithoutNoteFilter(this.student.idEtudiant!,this.student.idClasse.id!).subscribe(
      data => {
         this.modules = data
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
  // maxValueValidator(max: number) {
  //   console.log(max, "max")
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     return control.value > max ? { 'maxValue': { value: control.value } } : null;
  //   };
  // }
  // ----------------------sumit method
  onSubmit(student: Student, module: Module) {
    // Ajouter une nouvelle note pour le module et l'étudiant
        const formData = this.moduleForm.value;
        
      const semestre =   this.semestres;
        const note : Notes = {
          idStudents: student,
          classeNote: this.moduleForm.value.classeNote,
          examNote: this.moduleForm.value.examNote,
          idModule: module,
          idSemestre: semestre!
        }
        console.log(note, "notes-----------")
        if(this.moduleForm.valid){
          this.studentService.add_note(note).subscribe({
            next: (reponse) =>{
              this.pageTitle.showSuccessToast(reponse.message);
              this.moduleForm.reset();
              this.load_module();
            },
            error: (erreur) =>{
              this.pageTitle.showErrorToast(erreur.error.message);
            }
          
        })
      
        }else{
          this.moduleForm.markAllAsTouched();
          console.log(this.moduleForm.value, "form invalide")
        }
        
      }
      // ----------------------close modal
      close_modal() {
        this.closeAddNoteModal.emit();
        this.isShow_add_note = false;
        this.isOverlay = false;
      }
}
