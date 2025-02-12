import { Component, OnDestroy, OnInit } from '@angular/core';
import { GetNoteDto, NoteDto, NoteModuleDto, Notes, StudentMoyenne, StudentsNotesDto } from '../../Models/Notes';
import { EtudeService } from '../Etudiants/etude.service';
import { ActivatedRoute } from '@angular/router';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { Ue } from '../../Models/UE';
import { ClassRoom } from '../../Models/Classe';
import { SchoolService } from '../../../Services/school.service';
import { SchoolInfo } from '../../Models/School-info';
import { SemestreService } from '../../../Services/semestre.service';
import { Semestres } from '../../Models/Semestre';
import { IconsService } from '../../../Services/icons.service';
import { NotesPages, StudentPages } from '../../Models/Pagination-module';
import { SideBarService } from '../../../sidebar/side-bar.service';
import { Module } from '../../Models/Module';
import { NoteService } from '../../../Services/note.service';

import jspdf, { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PageTitleService } from '../../../Services/page-title.service';
import { EventServiceService } from '../../../Services/event-service.service';
import { Class_shared } from '../../../DGA/class-students/Utils/Class-shared-methods';

@Component({
  selector: 'app-all-notes-semestre',
  templateUrl: './all-notes-semestre.component.html',
  styleUrl: './all-notes-semestre.component.css'
})
export class AllNotesSemestreComponent implements OnInit, OnDestroy {
  notes: GetNoteDto[] = []
  idClasse!: number
  idNivFiliere!: number
  idAnnee!: number
  idSemestre!: number
  ueListe: Ue[] = []
  modules: Module[] = []
  moyenne: StudentMoyenne[] = []
  students: StudentsNotesDto[] = []
  classe?: ClassRoom
  school?: SchoolInfo
  semestres: Semestres[] = []

  studentspage?: NotesPages;
  searchTerm: string = '';
  page = 0;
  size = 100;
  anneeScolaire!: any
  semestreSelect?: Semestres
  filteredItems: StudentsNotesDto[] = []
  pages: number[] = []

  constructor(private pageTitle: PageTitleService, public icons: IconsService, private eventService: EventServiceService,
    private semestreService: SemestreService, private clasService: ClassStudentService, private noteService: NoteService,
    private route: ActivatedRoute, public share_methode: Class_shared, private sideBarService: SideBarService) { }
  ngOnInit(): void {
    this.load_semestre();
    this.getClasse();


    this.sideBarService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterStudents();

    });
    
  }

  ngOnDestroy(): void {
    this.eventService.emitEvent(this.idAnnee);
  }

  load_semestre() {
    this.route.queryParams.subscribe(param => {
      this.idClasse = param['id'];
      this.idNivFiliere = param['idNivFiliere'];
      this.idAnnee = param['idAnnee'];
    })
    this.semestreService.getCurrentSemestresByIdNivFiliere(this.idClasse).subscribe(result => {
      result.forEach(res => {
        if (!this.semestres.some(sem => sem.id == res.id)) {
          this.semestres.push(res)
        }
      })
      this.idSemestre = this.semestres[0].id!
      this.getNotes_classe();
      // console.log(this.semestres, "semestre")

    })

  }
  // -------------------------------------------get classe
  getClasse() {
    this.clasService.getClassById(this.idClasse).subscribe(data => {
      this.classe = data;
    })
  }
  // -------------------------------------button got back
  goBack() {
    window.history.back();
  }
  // -----------------------------method filter
  filterStudents() {
    if (!this.searchTerm) {
      return this.filteredItems = this.students;
    } else {
      return this.filteredItems = this.students.filter(student =>
        student.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())

      );
    }
  }
  // ----------------------button pagination
  setPage(page: number): void {
    if (page >= 0 && page < this.studentspage!.totalPages!) {
      this.page = page;
      this.getNotes_classe();
    }
  }

  nextPage(): void {
    if (this.page < this.studentspage!.totalPages! - 1) {
      this.setPage(this.page + 1);
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.setPage(this.page - 1);
    }
  }

  // ------------------------select semestre
  onSelect(idSemestre: number) {
    this.idSemestre = idSemestre
    this.semestreSelect = this.semestres.find(sem => sem.id === this.idSemestre)!;
    this.getNotes_classe();

  }

  getNotes_classe() {
    this.noteService.getAllNoteByClasse(this.page, this.size, this.idClasse, this.idSemestre).subscribe(data => {
      this.studentspage = data;
      this.students = this.studentspage.content;
      console.log(this.students, "students notes")

      this.modules = []; // Initialise pour accumuler les modules
      this.notes = []; // Initialise pour accumuler les notes

      this.studentspage.content.forEach(stm => {
        if (stm.noteDTO && stm.noteDTO.length > 0) {
          this.notes = stm.noteDTO;
          stm.noteDTO.forEach(nt => {
            
            this.modules = nt.ues.modules;
          });
          console.log(this.modules, "modules");
          // console.log(this.notes, "notes");
        } else {
          // console.log(`Pas de modules pour ${stm.nom} ${stm.prenom}`);
        }
      });
    this.getMoyenne(this.students);

      // console.log(this.studentspage, "student note page");
    });
  }


  // sort students
  onSort(event: any) {
    const value: keyof StudentsNotesDto = event.target.value;
   
    this.students = [...this.students].sort((a, b) => {
    
      const valA = a[value]?.toString().toLowerCase() || '';
      const valB = b[value]?.toString().toLowerCase() || '';
      
      if (valA < valB) return -1; // a avant b
      if (valA > valB) return 1;  // a après b
      return 0; // a égal à b
    });
  }
  // downlod to pdf
  downloadToPdf() {
    const button = document.getElementById('head-header') as HTMLElement;
    const head = document.getElementById('head') as HTMLElement;
    const data = document.getElementById('bulletin__content')!;

    // Cacher les éléments qui ne doivent pas apparaître dans le PDF
    button.style.display = "none";
    head.style.display = "flex";

    const doc = new jsPDF()
    html2canvas(data, { scale: 2 }).then(canvas => {
        const imgWidth = 297; // Largeur de la page A4 en paysage
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Adapter la hauteur
        const contentDataURL = canvas.toDataURL('image/png');

        const pdf = new jsPDF('l', 'mm', 'a4'); // Orientation paysage

        // Ajouter l'image du contenu principal
        pdf.addImage(contentDataURL, 'PNG', 0, 10, imgWidth, imgHeight);

        // Préparer les en-têtes du tableau
        const tableHeaders = [
            'N°',
            'Nom et Prénom',
            'Date et lieu de naissance',
            ...this.notes.flatMap(note => note.ues.modules.map(module => module.nomModule)), // Noms des modules
            ...this.notes.map(note => note.ues.nomUE), // Noms des UEs
            'Moyenne',
            'Observation'
        ];

        // Préparer les données du tableau
        const tableData: any[] = [];
        this.filterStudents().forEach((student, index) => {
            const row = [
                index + 1, // Numérotation
                `${student.nom} ${student.prenom}`, // Nom et prénom
                `${student.date_naissance}, ${student.lieuNaissance}` // Date et lieu de naissance
            ];

            // Ajouter les notes des modules pour chaque UE
            this.notes.forEach(note => {
                note.ues.modules.forEach(module => {
                    row.push('');
                });

                // Ajouter la moyenne de l'UE
                const ueNote = student.noteDTO
                    ?.find(n => n.ues.nomUE === note.ues.nomUE)?.moyenUe || '';
                row.push(ueNote);
            });

            // Ajouter la moyenne générale et l'observation
            row.push(student.moyenGeneral || '');
            const observation = student.moyenGeneral >= 10 && student.moyenGeneral <= 20
                ? 'Admis'
                : student.moyenGeneral >= 3 && student.moyenGeneral < 10
                ? 'Ajourné'
                : '--';
            row.push(observation);

            tableData.push(row);
        });

        button.style.display = "block";
        head.style.display = "none";
    });
}

// calculer moyene
calculate(){
  this.noteService.calculateNote(this.idClasse, this.idSemestre).subscribe({
    next: (data) => {
     this.getNotes_classe()
    },
    error: (error) => {
      this.pageTitle.showErrorToast(error.error.message);
    }
  })
}

// get all modules have session
// getModulesSession(idClasse: number, idSemestre: number){
//   this.noteService.getModulesSession(idClasse, idSemestre).subscribe({})
// }

// get moyenne of class
getMoyenne(students: StudentsNotesDto[]){
  this.noteService.getAllMoyenneByIdClassAndSemestre(this.idClasse, this.idSemestre).subscribe(moyenne =>{
    this.moyenne = moyenne
    students.forEach(st =>{
      st.moyenGeneral = moyenne.find(m => m.idInscription.id! == st.id!)!.moyenGenerale
    })
    console.log("moyenne", students)
  })
}

// close modal reinscription

}


