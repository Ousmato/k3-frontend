import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IconsService } from '../../Services/icons.service';
import { EtudeService } from '../../Admin/Views/Etudiants/etude.service';
import { Docum, StudentDoc } from '../../Admin/Models/doc';
import { AnneeScolaire } from '../../Admin/Models/School-info';
import { SchoolService } from '../../Services/school.service';
import { Doc_Pages } from '../../Admin/Models/Pagination-module';
import { Inscription, Student } from '../../Admin/Models/Students';
import { PageTitleService } from '../../Services/page-title.service';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { SideBarService } from '../../sidebar/side-bar.service';

@Component({
  selector: 'app-der-doc',
  templateUrl: './der-doc.component.html',
  styleUrl: './der-doc.component.css'
})
export class DerDocComponent implements OnInit {

  searchTerm: string =""
  show_add_note: boolean = false
  overlay: boolean = false
  doc!: Docum
  isConfirm: boolean = false
  annees: AnneeScolaire[] = []
  docs: StudentDoc[] = []
  filteredItem: StudentDoc[] = []
  currentYear!: number
  inscriptions: Inscription[] = []
  page = 0;
  size = 20;
  docPage?: Doc_Pages
  pages: number[] = []
  idDocSelect !: number | null


  constructor(private router: Router, public icons: IconsService, private pageTitle: PageTitleService,
    private infoSchool: SchoolService, private sideBarService: SideBarService,
    private studentService: EtudeService) { }
  ngOnInit(): void {
    this.getDocsOfYear();
    this.get_annees();
    this.currentYear = new Date().getFullYear()

    this.sideBarService.currentSearchTerm.subscribe(term =>{
      this.searchTerm = term;
      this.filterDocs();
    })
    
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

  // get current docs of year
  getDocsOfYear() {
    this.studentService.getCurrentYearDoc(this.page, this.size).subscribe(result => {
      this.docPage = result;
      // this.docs = result.content;
      result.content.forEach(res => {
        this.inscriptions = res.idInscription
        
        if (!this.docs.some(d => d.idDocument.id == res.idDocument.id)) {
          this.docs.push(res);
        }
      })
      console.log(this.docs, "docs");

      this.pages = Array.from({ length: result.totalPages! }, (_, i) => i);
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
      result.content.forEach(res => {
        this.inscriptions = res.idInscription
        if (!this.docs.some(d => d.idDocument.id == res.idDocument.id)) {
          this.docs.push(res);
        }
      })

      this.pages = Array.from({ length: result.totalPages! }, (_, i) => i);

    })
  }

  // filter docs
  filterDocs(){
    if(!this.searchTerm){
      return this.filteredItem = this.docs
    }
    return this.filteredItem = this.docs.filter(d =>d.idInscription.some(i =>i.idEtudiant.nom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
    d.idInscription.some(i =>i.idEtudiant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
   this.abrevigateFiliereName(d.filiere!).toLowerCase().includes(this.searchTerm.toLowerCase()))
  }
  // set page
  setPage(page: number): void {
    if (page >= 0 && page < this.docPage!.totalPages!) {
      this.page = page;
      this.getDocsOfYear();
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
 // pages visibles
 getVisiblePages(): number[] {
  const visiblePages: number[] = [];
  const totalPages = this.docPage!.totalPages!;

  const startPage = Math.max(0, this.page - 1); 
  const endPage = Math.min(totalPages - 1, this.page + 1); 

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return visiblePages;
}
  // programer
  programer(idStudentDoc: number) {
    const navigationExtrat: NavigationExtras = {
      queryParams: { id: idStudentDoc }
    }
    this.router.navigate(['/der/programmer'], navigationExtrat)

  }
  // confirm modal

  confirm(idDoc: number) {
    console.log(idDoc, "idDoc")
    this.studentService.annulerProgramme(idDoc).subscribe(result => {
      if (result) {
        this.pageTitle.showSuccessToast("Succes!!!")
        this.isConfirm = false
        this.overlay = false
        this.getDocsOfYear();
      }
      else {
        this.pageTitle.showErrorToast("Erreur!!!")
      }
    })
  }
  // show confirm modal for annuler programme
  show_cofirm(idDoc: number) {
    this.idDocSelect = idDoc
    this.overlay = true
    this.isConfirm = true;
    console.log("show")
  }
  // exitconfirm
  exitconfirm() {
    this.overlay = false
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
  // abrevigate filiere name
  abrevigateFiliereName(filiere: string) {
    const name = filiere.split(" ");
    return name.filter(word =>word.length >3).map(word =>word[0].toUpperCase()).join('')
  }

  // get full year in the date
  getFullYear(date: Date) {
    return new Date(date).getFullYear()
  }
}
