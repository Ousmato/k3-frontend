import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../Services/icons.service';
import { SemestreService } from '../../Services/semestre.service';
import { Semestres } from '../../Admin/Models/Semestre';
import { EtudeService } from '../../Admin/Views/etudiants/etude.service';
import { Module } from '../../Admin/Models/Module';
import { Inscription, Student } from '../../Admin/Models/Students';
import { Notes } from '../../Admin/Models/Notes';
import { max } from 'rxjs';
import { PageTitleService } from '../../Services/page-title.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-note-widget',
  templateUrl: './add-note-widget.component.html',
  styleUrl: './add-note-widget.component.css'
})
export class AddNoteWidgetComponent implements OnInit {
  idClasse!: number;
   inscrit!: Inscription;
   modules: Module[] = []
  // @Output() closeAddNoteModal = new EventEmitter<any>();

  moduleForm!: FormGroup;
  semestres: Semestres[] = [];
  semestreSelect!: Semestres

  showFormId: number | null = null;
  isShow_add_note: boolean = true
  isOverlay: boolean = true

  constructor(private fb: FormBuilder, private studentService: EtudeService, 
    private pageTitle: PageTitleService, private root: ActivatedRoute,
    public icons: IconsService, private semestreService: SemestreService) { }
  ngOnInit(): void {
    this.load_form();
    // this.load_module();
    this.getStudent();
    this.loadSemestre();

  }

  // ---------------------load semestre
  loadSemestre() {
    this.semestreService.getCurrentSemestresByIdNivFiliere(this.inscrit.idClasse.idFiliere?.id!).subscribe(data => {
      data.forEach(sem => {
        if (!this.semestres.some(s => s.id == sem.id)) {
          this.semestres.push(sem);
        }
      });

      // this.moduleForm.get('idSemestre')?.setValue(this.semestres.nomSemetre);
    })
  }
  // ------------------------------load form add
  load_form() {
    this.moduleForm = this.fb.group({
      // idStudents: [this.student.idEtudiant, Validators.required],
      examNote: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      classeNote: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      // idModule: [''],
      // idSemestre: ['', Validators.required]
    });
  }
  // -------------------------------load module
  load_module() {
    console.log(this.inscrit, "student select")
    this.modules =[]
    this.studentService.getAllModulesWithoutNoteFilter(this.inscrit.idEtudiant.idEtudiant!, this.inscrit.idClasse.idFiliere?.id!, this.semestreSelect.id!).subscribe(
      data => {
        this.modules = data
        console.log(this.modules, "modules")
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
// --------------------sumit method
  onSubmit(student: Student, module: Module) {
    // Ajouter une nouvelle note pour le module et l'étudiant
    const {numero,...studentSelect} = student
    const note: Notes = {
      idStudents: studentSelect,
      classeNote: this.moduleForm.value.classeNote,
      examNote: this.moduleForm.value.examNote,
      idModule: module,
      idSemestre: this.semestreSelect!
    }
    console.log(note, "notes-----------")
    if (this.moduleForm.valid) {
      this.studentService.add_note(note).subscribe({
        next: (reponse) => {
          this.pageTitle.showSuccessToast(reponse.message);
          this.moduleForm.reset();
          this.load_module();
        },
        error: (erreur) => {
          this.pageTitle.showErrorToast(erreur.error.message);
        }

      })

    } else {
      this.moduleForm.markAllAsTouched();
      console.log(this.moduleForm.value, "form invalide")
    }

  }
  // ----------------------close modal
  close_modal() {
    // this.closeAddNoteModal.emit();
    this.isShow_add_note = false;
    this.isOverlay = false;
  }
  onSelect(event: any){
    const idSemestre = event.target.value;
    this.semestreSelect = this.semestres.find(sem => sem.id == idSemestre)!;

    this.load_module();
  }

  // ----------------get student by id
  getStudent(){
    this.root.queryParams.subscribe(param =>{
      const id = +param['id'];
      this.studentService.getInscriptionById(id).subscribe(data => {
        this.inscrit = data;
        // this.load_module();
      })
    })
  }
  
}
