import { Component, OnInit } from '@angular/core';
import { Paie } from '../../Models/paie';
import { EnseiService } from '../enseignant/ensei.service';
import { IconsService } from '../../../Services/icons.service';
import { Seances } from '../../Models/Seances';
import { Teacher } from '../../Models/Teachers';
import { SchoolService } from '../../../Services/school.service';
import { Paie_Pages } from '../../Models/Pagination-module';
import { SideBarService } from '../../../sidebar/side-bar.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-fiche-paie',
  templateUrl: './fiche-paie.component.html',
  styleUrl: './fiche-paie.component.css'
})
export class FichePaieComponent  implements OnInit{
  Enseignants: Teacher[] =[]
  seances : Seances [] =[];
  paies : Paie[] =[];

  searchTerm : string = "";

  paie_page!: Paie_Pages;
  page = 0;
  size = 10;
  filteredItems : Teacher[] = []
  pages: number[] = []


  constructor(private teacherService: EnseiService, private sideBareService: SideBarService, private router: Router,
    public icons: IconsService, private schoolService: SchoolService){}
  ngOnInit(): void {
      this.getAllPaie();

      this.sideBareService.currentSearchTerm.subscribe(term => {
        this.searchTerm = term;
        // this.filterTeachers();
      
      });
  }

  getAllPaie(){
    this.teacherService.getAllPaie(this.page, this.size).subscribe((data =>{
      this.paie_page = data;
      this.paies = data.content;
      
      this.pages = Array.from({ length: data.totalPages! }, (_, i) => i);
      this.paies.forEach((item: Paie) => {
        // this.filteredItems = item.idPresenceTeachers.idSeance.idTeacher
        item.idPresenceTeachers.idSeance.idTeacher.urlPhoto = `http://localhost/StudentImg/${item.idPresenceTeachers.idSeance.idTeacher.urlPhoto}`;
        
        const teacher = item.idPresenceTeachers.idSeance.idTeacher;
        
        if (teacher && !this.Enseignants.some(t => t.idEnseignant === teacher.idEnseignant)) {
          this.Enseignants.push(teacher);
      }
       
        const paie = item;
        const montant = paie.coutHeure * paie.nbreHeures;
        paie.montant = montant;
        this.paies.push(paie!);
          
           console.log(paie, "paie")
    
          this.seances.push(item.idPresenceTeachers.idSeance);
      });
    }))
   

  }
  // -------------------------------filter method
  filterTeachers() {
    if (!this.searchTerm) {
     return this.filteredItems = this.Enseignants;
    } else {
    return  this.filteredItems = this.Enseignants.filter(enseignant =>
        enseignant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        enseignant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        enseignant.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  // -----------------------------got to the fiche page
  toggle_to_fiche(idEnseignant : number){
    const navigationExtrat : NavigationExtras ={
      queryParams: {id: idEnseignant}
    }
    this.router.navigate(['/sidebar/fiche-enseignant'], navigationExtrat);
  }
  // -------------------------------------method to imprime
   
  // ----------------------------------get school information
 
   // ------------------------------next page
   setPage(page: number): void {
    if (page >= 0 && page < this.paie_page.totalPages!) {
      this.page = page;
      this.getAllPaie();
    }
  }

  nextPage(): void {
    if (this.page < this.paie_page.totalPages! - 1) {
      this.setPage(this.page + 1);
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.setPage(this.page - 1);
    }
  }
}
