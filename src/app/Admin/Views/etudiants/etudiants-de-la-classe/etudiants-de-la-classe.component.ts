import { Component, OnInit } from '@angular/core';
import { EtudeService } from '../etude.service';
import { ClassStudentService } from '../../../../DGA/class-students/class-student.service';
import { IconsService } from '../../../../Services/icons.service';
import { Inscription, Student } from '../../../Models/Students';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { StudentPages } from '../../../Models/Pagination-module';
import { SideBarService } from '../../../../sidebar/side-bar.service';
import { environment } from '../../../../../environments/environment';
import { Admin } from '../../../Models/Admin';
import { AdminUSER } from '../../../Models/Auth';

@Component({
  selector: 'app-etudiants-de-la-classe',
  templateUrl: './etudiants-de-la-classe.component.html',
  styleUrl: './etudiants-de-la-classe.component.css'
})
export class EtudiantsDeLaClasseComponent implements OnInit{
  
  searchTerm: string = '';
  inscrits: Inscription[] = [];
  // students!: Student [];
  student!: Student;
  idClasse !: number

  adminDga!: Admin
  studentspage?: StudentPages;
  page = 0;
  size = 100;
  filteredItems : Inscription[] = []
  pages: number[] = []
  permission : boolean =false
  
  constructor(private service: EtudeService, private route: ActivatedRoute, private router: Router,
    private sideBarService: SideBarService, public icons: IconsService) { }

  ngOnInit(): void {
    this.loadStudents();

    this.adminDga = AdminUSER()?.dga;
    this.sideBarService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterStudents();
    
    });
  }

  // ------------------------------------------load student by class id
  loadStudents(): void {
    this.route.queryParams.subscribe(param =>{
      // if(param[''])
          this.idClasse = param['id']
        })
    this.service.getStudent_ByIdClasse(this.page, this.size, this.idClasse).subscribe(data => {
      this.inscrits = data.content;
      // console.log(this.students, "student of classe")
      this.inscrits.forEach((item : Inscription) => {
        item.idEtudiant.urlPhoto = `${environment.urlPhoto}${item.idEtudiant.urlPhoto}`;
      })
      this.studentspage = data;
      this.filteredItems = this.inscrits;
      this.pages = Array.from({ length: data.totalPages! }, (_, i) => i);

      // console.log(this.students, "pagenation teachers")
    });
  }

  // --------------------------filter methode
  filterStudents() {
    if (!this.searchTerm) {
     return this.filteredItems = this.inscrits;
    } else {
    return  this.filteredItems = this.inscrits.filter(inst =>
        inst.idEtudiant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inst.idEtudiant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inst.idEtudiant.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  // ------------------------go back to previous page
  goBack() {
    window.history.back();
  }
  
    //  -------------------------------load bulletin
    load_bulletin(idStudent: number){
      const navigationExtrat: NavigationExtras = {
        queryParams: {
          id: idStudent
        }

      }
      
      
      if(AdminUSER()?.dg){
      this.router.navigate(['/sidebar/student-bulletin'], navigationExtrat);

      }else{
      this.router.navigate(['/r-scolarite/student-bulletin'], navigationExtrat);

      }

   
    }
  // --------------------------------buttons pagination
  setPage(page: number): void {
    if (page >= 0 && page < this.studentspage!.totalPages!) {
      this.page = page;
      this.loadStudents();
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

  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const totalPages = this.studentspage!.totalPages!;

    const startPage = Math.max(0, this.page - 1); // Une page avant la courante
    const endPage = Math.min(totalPages - 1, this.page + 1); // Une page après la courante

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }
  // -------------abrevigate name filiere
  abrevigateFiliereName(name: string): string{
    const nameSplit = name.split(' ');
    return nameSplit.filter(word =>word.length > 3).map(w =>w[0].toUpperCase()).join('');
  }
}
