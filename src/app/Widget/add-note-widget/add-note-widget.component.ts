import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../Services/icons.service';
import { SemestreService } from '../../Services/semestre.service';
import { Semestres } from '../../Admin/Models/Semestre';
import { EtudeService } from '../../Admin/Views/Etudiants/etude.service';
import { Ecue, Module } from '../../Admin/Models/Module';
import { Inscription, Student } from '../../Admin/Models/Students';
import { AddNoteDto, Notes } from '../../Admin/Models/Notes';
import { PageTitleService } from '../../Services/page-title.service';
import { ActivatedRoute } from '@angular/router';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { AddUeDto } from '../../Admin/Models/UE';
import { InscriptionService } from '../../Services/inscription.service';
import { environment } from '../../../environments/environment';
import { Admin } from '../../Admin/Models/Admin';
import { AdminUSER } from '../../Admin/Models/Auth';
import { NoteService } from '../../Services/note.service';

@Component({
  selector: 'app-add-note-widget',
  templateUrl: './add-note-widget.component.html',
  styleUrl: './add-note-widget.component.css'
})
export class AddNoteWidgetComponent implements OnInit {
  idClasse!: number;
  idAnnee!: number;
  inscrit?: Inscription;
  searchTerm: string = ""
  ues: AddUeDto[] = []
  uesWithoutEmploi: AddUeDto[] = []
  studentIds: number[] = []
  modules: Ecue[] = []
  modulesWithoutEmplois: Ecue[] = []
  empty: number[] = [1, 2, 3]
  uesWithNote: AddNoteDto[] = []
  uesWithNoteAndEmploi: AddNoteDto[] = []
  // @Output() closeAddNoteModal = new EventEmitter<any>();

  noteForm!: FormGroup;
  noteForms: { [key: number]: FormGroup } = {};
  semestres: Semestres[] = [];
  semestreSelect!: Semestres
  admin!: Admin;

  idInscription!: number;
  idSemestre!: number;

  constructor(private fb: FormBuilder, private studentService: EtudeService, private inscriptionService: InscriptionService,
    private pageTitle: PageTitleService, private root: ActivatedRoute, private classService: ClassStudentService,
    public icons: IconsService, private semestreService: SemestreService, private noteService: NoteService) { }
  ngOnInit(): void {
    // this.load_form();
    this.loadSemestre();
    // this.loadInscription();
   
    this.admin = AdminUSER()?.scolarite;

  }

  // load form add
  load_form(notes: AddNoteDto[]) {
    // console.log(notes, "ues dans form")

    this.noteForms = {};
    notes.forEach((note) => {
      this.noteForms[note.idModule] = this.fb.group({
        examNote: [note.examNote, [Validators.required, Validators.min(0), Validators.max(20)]],
        classeNote: [note.classeNote, [Validators.required, Validators.min(0), Validators.max(20)]],
        idModule: [note.idModule]

      });
      // console.log(this.noteForms[note.idModule].value, "value form");
    })

  }

  // sumit method
  onSubmit(id: any) {
    console.log(id, "index - foi")
    const formData = this.noteForms[id].value;
    const module = this.modules.find(m => m.id == id);
    this.semestreSelect = this.semestres.find(sem => sem.id == this.idSemestre)!;

    if (formData) {
      // console.log(formData, "note dans le console");
      const note: Notes = {
        examNote: formData.examNote,
        classeNote: formData.classeNote,
        idInscription: this.inscrit!,
        idModule: module!,
        idSemestre: this.semestreSelect,
        idAdmin: this.admin
      }
      console.log(note, "note")
// return
      // if (this.noteForms[id].valid) {
      //   this.studentService.add_note(note).subscribe({
      //     next: () => {
      //       this.get_ues_to_add_note(this.idSemestre)
      //     },
      //     error: (err) => {
      //       this.pageTitle.showErrorToast(err.error.message)
      //     }

      //   })

      // } else {
      //   this.noteForms[id].markAllAsTouched();
      //   console.log(this.noteForms[id].value, "form invalide")
      // }
    } else {
      console.error('Form not found for module ID:', id);
    }
    return
  }

  // get inscription by id
  loadInscription() {
    this.root.queryParams.subscribe(param => {
      this.idInscription = param['id'];
    })
    this.inscriptionService.getInscriptionById(this.idInscription).subscribe(result => {
      this.inscrit = result;
      this.inscrit.idEtudiant.urlPhoto = `${environment.urlPhoto}${this.inscrit.idEtudiant.urlPhoto}`
      // console.log(this.inscrit, "inscrit")
      // this.get_all_ids_students_with_notes(this.idClasseNivFil,this.idSemestre, this.inscrit.idClasse.id!)

    })
  }
  loadSemestre() {
    this.root.queryParams.subscribe(param => {
      this.idClasse = param['idClasse'];
      this.semestreService.getCurrentSemestresByIdNivFiliere(this.idClasse).subscribe(result => {
        result.forEach(res => {
          if (!this.semestres.some(sem => sem.id == res.id)) {
            this.semestres.push(res)
          }
        })
        console.log(this.semestres, "semestre")
      })

      this.loadInscription();

    })

  }
  // load all semestre oc classe

  onSelect(event: any) {
    this.ues = []
    this.idSemestre = event.target.value;

    this.get_ues_to_add_note(this.idSemestre);


  }
  // load all modules withou
  getModulesWithoutEmplois(){
    this.classService.getModulesWithoutEmploi(this.inscrit?.idClasse.idFiliere?.id!, this.idSemestre).subscribe(
      result => {
        this.uesWithNoteAndEmploi = result;

        console.log(this.modulesWithoutEmplois, "modules without emplois");
        console.log(this.ues, "ues");


      }
    )
  }

  // get all ues to add note
  get_ues_to_add_note(idSemestre: number) {
    this.classService.getAll_ue_toAddNote(this.idClasse, idSemestre, this.idInscription).subscribe(result => {
      this.uesWithNote = result;
      console.log(result, "result---------")
      this.load_form(this.uesWithNote);
      
      
      // this.get_all_ids_students_with_notes(this.idClasseNivFil,this.idSemestre, this.inscrit!.idClasse.id!)
    // this.getModulesWithoutEmplois();

  });
  

  }

  calculate(){
    this.noteService.calculateNote(this.idInscription, this.idSemestre).subscribe({
      next: (data) => {
        this.pageTitle.showSuccessToast(data.message);
      },
      error: (error) => {
        this.pageTitle.showErrorToast(error.error.message);
      }
    })
  }

  goBack(){
    window.history.back()
  }

  // get all ids of all students have notes for all modules
  get_all_ids_students_with_notes(idClasseNivFil: number, idSemestre: number, idClasse: number) {
    this.noteService.getAllStudentIdsBySemestre(idSemestre, idClasseNivFil, idClasse).subscribe(result =>{
      this.studentIds = result;
      console.log(this.studentIds, "studentIds")
      // if(this.studentIds.includes(this.inscrit?.id!)){

      // }
    })
  }

}
