import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IconsService } from '../../Services/icons.service';
import { EtudeService } from '../../Admin/Views/etudiants/etude.service';
import { Docum, StudentDoc } from '../../Admin/Models/doc';
import { AnneeScolaire } from '../../Admin/Models/School-info';
import { SchoolService } from '../../Services/school.service';
import { Doc_Pages } from '../../Admin/Models/Pagination-module';
import { Student } from '../../Admin/Models/Students';
import { PageTitleService } from '../../Services/page-title.service';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-der-doc',
  templateUrl: './der-doc.component.html',
  styleUrl: './der-doc.component.css'
})
export class DerDocComponent implements OnInit {

  show_add_note: boolean = false
  overlay: boolean = false
  doc!: Docum
  isConfirm: boolean = false
  annees: AnneeScolaire[] = []
  docs: StudentDoc[] = []
  currentYear!: number
  students: Student[] = []
  page = 0;
  size = 10;
  docPage?: Doc_Pages
  pages: number[] = []
  idDocSelect !: number | null


  constructor(private router: Router, public icons: IconsService, private pageTitle: PageTitleService,
    private infoSchool: SchoolService,
    private studentService: EtudeService) { }
  ngOnInit(): void {
    this.getDocsOfYear();
    this.get_annees();
    this.currentYear = new Date().getFullYear()
  }

  // ------------
  toggle_form_add() {
    this.router.navigate(['/der/add-doc'])
  }
  toggle_toView() {
    this.router.navigate(['/der/programme-view'])
  }


  onDocsReceived(docs: StudentDoc[]): void {
    this.docs = docs;
    console.log('Documents received:', docs);
    // Vous pouvez maintenant utiliser la liste des documents reçus dans le parent
  }

  // ----------------------get current docs of year
  getDocsOfYear() {
    this.studentService.getCurrentYearDoc(this.page, this.size).subscribe(result => {
      this.docPage = result;
      // this.docs = result.content;
      result.content.forEach(res => {
        this.students = res.idEtudiant
        if (!this.docs.some(d => d.idDocument.id == res.idDocument.id)) {
          this.docs.push(res);
          // this.extractUniqueStudents(this.docs)
        }
      })
      console.log(this.docs, "docs");

      this.pages = Array.from({ length: result.totalPages! }, (_, i) => i);
      // this.docs = 
      // this.extractUniqueStudents(this.docs)
    })
  }

  get_annees() {
    this.infoSchool.getAll_annee().subscribe(data => {
      this.annees = data;
      this.annees.forEach(ans => {
        const annee = new Date(ans.debutAnnee)
        const debutAnnee = annee.getFullYear()
        ans.ans = debutAnnee
      })
    })
  }

  // ---------------------
  onChange(event: any) {
    const idAnnee = event.target.value
    console.log(idAnnee, "idAnnee")
    this.studentService.getAnneeByIdClasseAndAnnee(this.page, this.size, idAnnee).subscribe(result => {
      this.docs = []
      console.log(result, "result")
      this.docPage = result;
      this.docs = result.content;

      this.pages = Array.from({ length: result.totalPages! }, (_, i) => i);
      // this.docs = 
      // this.extractUniqueStudents(this.docs)

    })
  }

  setPage(page: number): void {
    if (page >= 0 && page < this.docPage!.totalPages!) {
      this.page = page;
      // this.loadStudents();
    }
  }

  nextPage(): void {
    if (this.page < this.docPage!.totalPages! - 1) {
      this.setPage(this.page + 1);
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.setPage(this.page - 1);
    }
  }

  // private extractUniqueStudents(notes: StudentDoc[]): StudentDoc[] {
  //   const uniqueStudents = new Set<number>(); // Utilise un Set pour stocker les idEtudiant uniques
  //   const result: StudentDoc[] = [];
  //   const students: Student[] = [];

  //   this.docs.forEach(item => {
  //     if (!uniqueStudents.has(item.id!)) { // Vérifie si l'idEtudiant n'est pas déjà dans le Set
  //       uniqueStudents.add(item.id!);
  //       result.push(item); // Ajoute l'étudiant au tableau résultant des étudiants uniques
  //     }
  //   });
  //   students.forEach((student, index) => {
  //     student.numero = index + 1; // Ajoute 1 pour commencer à partir de 1 (si nécessaire)
  //   });

  //   return result;
  // }
  // ------------------programer
  programer(idDoc: number) {
    const navigationExtrat: NavigationExtras = {
      queryParams: { id: idDoc }
    }
    this.router.navigate(['/der/programmer'], navigationExtrat)

  }
  // ------------------close modal

  confirm(idDoc: number) {
    console.log(idDoc, "idDoc")
    this.studentService.annulerProgramme(idDoc).subscribe(result => {
      if (result) {
        this.pageTitle.showSuccessToast("Succes!!!")
        this.isConfirm = false
        this.ngOnInit();
      }
      else {
        this.pageTitle.showErrorToast("Erreur!!!")
      }
    })
  }
  show_cofirm(idDoc: number) {
    this.idDocSelect = idDoc
    this.isConfirm = true;
    console.log("show")
  }
  // exitconfirm
  exitconfirm() {
    this.isConfirm = false;
  }

  // note
  show_note(doc: Docum) {
    this.doc = doc
    this.show_add_note = true;
    this.overlay = true;
  }

  // close
  close_note() {
    this.show_add_note = false;
    this.overlay = false;
  }
}
