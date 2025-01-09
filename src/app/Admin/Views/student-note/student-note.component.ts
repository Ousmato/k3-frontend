import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AddNoteDto, Notes } from '../../Models/Notes';
import { Inscription, InscriptionNoteDto, Student } from '../../Models/Students';
import { IconsService } from '../../../Services/icons.service';
import { EtudeService } from '../Etudiants/etude.service';
import { ActivatedRoute, NavigationExtras, NavigationStart, Router } from '@angular/router';
import { SemestreService } from '../../../Services/semestre.service';
import { Semestres } from '../../Models/Semestre';
import { Module } from '../../Models/Module';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Students_Module } from '../../Models/studends_modules';
import { SchoolService } from '../../../Services/school.service';
import { AnneeScolaire, SchoolInfo } from '../../Models/School-info';
import { Location } from '@angular/common';
import { AddNoteDtoPages, NotesPages, StudentPages } from '../../Models/Pagination-module';
import { SideBarService } from '../../../sidebar/side-bar.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { environment } from '../../../../environments/environment';
import { NoteService } from '../../../Services/note.service';
import { InscriptionService } from '../../../Services/inscription.service';
import { AdminUSER } from '../../Models/Auth';
import { StudentSharedMethods } from '../Etudiants/Utils/Student-shared-methode';
import { EventServiceService } from '../../../Services/event-service.service';
import { StudentSessionService } from '../../../Services/student-session.service';

@Component({
  selector: 'app-student-note',
  templateUrl: './student-note.component.html',
  styleUrl: './student-note.component.css'
})
export class StudentNoteComponent implements OnInit {
  searchTerm: string = '';
  inscrits: AddNoteDto[] = [];
  studentIds: number[] = [];
  annees!: AnneeScolaire
  notes: Notes[] = [];
  idModule!: number;
  idClasse!: number;
  idAnnee!: number;
  idSemestre!: number;
  module!: string
  classe!: string

  semestres!: string;
  // modules: Module[] = [];

  // moduleForm!: FormGroup;
  // update_note_form!: FormGroup;
  noteForm!: FormGroup;
  noteForms: { [key: string]: FormGroup } = {};
  // modules_of_student: Students_Module[] = [];
  // isShow_modal: boolean = true


  studentPages?: AddNoteDtoPages;
  page = 0;
  size = 100;
  filteredItems: AddNoteDto[] = [];
  pages: number[] = []

  constructor(public icons: IconsService, private fb: FormBuilder, private sessionService: StudentSessionService, private pageTitle: PageTitleService,
    private eventService: EventServiceService, public sharedMethod: StudentSharedMethods, private sideBarService: SideBarService,
    private route: ActivatedRoute, private noteService: NoteService, private location: Location) { }
  ngOnInit(): void {
    this.loadStudents();

    //  --------------------------------filter methode
    this.sideBarService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      console.log(term, "search");
      this.filterStudents();

    });
    
  }

  goBack() {
    this.location.back();
    this.eventService.emitEvent(this.idSemestre);
  }

  //get all module without notes
  loadStudents() {
    this.route.queryParams.subscribe(data => {
      this.idClasse = data['id'];
      this.idModule = data['idModule']
      this.idSemestre = data['idSemestre']
      this.idAnnee = data['idAnnee']
      this.noteService.getAllNotesInscriptionPagesByModule(this.idClasse, this.idAnnee, this.idSemestre, this.idModule, this.page, this.size).subscribe(data => {
        this.inscrits = data.content;
        console.log(data, "inscrit")
        this.inscrits.forEach((inscrit: any, i) => {
          this.semestres = inscrit.semestre
          this.module = inscrit.nomModule
          this.classe = inscrit.nomClasse
          this.annees = inscrit.anneeScolaire
          // this.noteForms[inscrit.idModule + '-' + i].get('classeNote')?.setValue(inscrit.classeNote)
          // this.noteForms[inscrit.idModule + '-' + i].get('examNote')?.setValue(inscrit.examNote)
        })

        this.load_form(this.inscrits);

        this.studentPages = data;
        // this.filteredItems = this.inscrits;
        this.pages = Array.from({ length: data.totalPages! }, (_, i) => i);
      });

    })

  }
  

  // method filter
  filterStudents() {
    if (!this.searchTerm) {
      return this.filteredItems = this.inscrits;
    } else {
      return this.filteredItems = this.inscrits.filter(i => i.inscriptions.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      i.inscriptions.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      i.validate.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    }
  }
  // load form add
  load_form(notes: AddNoteDto[]) {
    // console.log(notes, 'Notes reçues pour initialisation des formulaires');
    this.noteForms = {};
    notes.forEach((note, index) => {
      // Combiner l'index de l'étudiant et l'idModule comme clé unique
      const key = `${note.idModule}-${index}`;
      this.noteForms[key] = this.fb.group({
        examNote: [note.examNote, [ Validators.min(-1), Validators.max(20)]],
        classeNote: [note.classeNote, [ Validators.min(-1), Validators.max(20)]],
        idModule: [note.idModule],
        sessionNote: [note.sessionNote, [ Validators.min(-1), Validators.max(20)]]
      });
      // console.log(this.noteForms[key].value, `Formulaire généré pour clé ${key}`);
    });
  }


  //button pagination
  setPage(page: number): void {
    if (page >= 0 && page < this.studentPages!.totalPages!) {
      this.page = page;
      this.loadStudents();
    }
  }

  nextPage(): void {
    if (this.page < this.studentPages!.totalPages! - 1) {
      this.setPage(this.page + 1);
    }
  }


  // pages visibles
  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const totalPages = this.studentPages!.totalPages!;

    const startPage = Math.max(0, this.page - 1);
    const endPage = Math.min(totalPages - 1, this.page + 1);

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }
  previousPage(): void {
    if (this.page > 0) {
      this.setPage(this.page - 1);
    }
  }
  onSubmitSession(idModule: number, inscriptionId: number, formValue: any){
    console.log('Module:', idModule);
    console.log('Inscription ID:', inscriptionId);
    console.log('Valeurs:', formValue);
    const formData = formValue;
    
    const session: number = formData.sessionNote
    this.sessionService.addSessionNote(inscriptionId, this.idSemestre, idModule, session).subscribe({
      next: () => {
        // this.loadStudents()
      },
      error: (err) => {
        this.pageTitle.showErrorToast(err.error.message)
      }
      })
  }
  // sumit method
  onSubmit(idModule: number, inscriptionId: number, formValue: any) {
    console.log('Module:', idModule);
    console.log('Inscription ID:', inscriptionId);
    console.log('Valeurs:', formValue);
    const formData = formValue;
        const note = {
          examNote: formData.examNote,
          classeNote: formData.classeNote,
          idInscription: inscriptionId,
          idModule: formData.idModule!,
          idSemestre: this.idSemestre,
          idAdmin: AdminUSER()?.scolarite
        }
        console.log(note, "note")

        // return
        this.noteService.add_note(note).subscribe({
          next: (result) => {
            // this.inscrits.push(result);
            // this.filterStudents()
            console.log(result, "le retour");
          },
          error: (err) => {
            this.pageTitle.showErrorToast(err.error.message)
          }

        })
  }

  refresh(){
    this.loadStudents()
  }

  shorted(event: any){
    const value: keyof InscriptionNoteDto = event.target.value; // Obtenir la valeur de tri (nom ou prénom)
    console.log(value, "value");
    const filteredStudents = this.filterStudents();
  
    // Trier les étudiants filtrés en fonction du critère sélectionné
    this.inscrits = filteredStudents.sort((a, b) => {
      const valA = a.inscriptions[value]?.toString().toLowerCase() || ''; // Récupérer la valeur de a et la convertir en minuscule
      const valB = b.inscriptions[value]?.toString().toLowerCase() || ''; // Récupérer la valeur de b et la convertir en minuscule
      
      if (valA < valB) return -1; 
      if (valA > valB) return 1;
      return 0;
    });
  
  }
}
