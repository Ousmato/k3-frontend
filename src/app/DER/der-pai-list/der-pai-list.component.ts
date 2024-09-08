import { Component, OnInit } from '@angular/core';
import { Paie_Pages } from '../../Admin/Models/Pagination-module';
import { Teacher } from '../../Admin/Models/Teachers';
import { EnseiService } from '../../Admin/Views/enseignant/ensei.service';
import { Paie } from '../../Admin/Models/paie';
import { Seances } from '../../Admin/Models/Seances';
import { IconsService } from '../../Services/icons.service';

@Component({
  selector: 'app-der-pai-list',
  templateUrl: './der-pai-list.component.html',
  styleUrl: './der-pai-list.component.css'
})
export class DerPaiListComponent implements OnInit{
  paie_page!: Paie_Pages;
  page = 0;
  size = 10;
  filteredItems : Teacher[] = []
  pages: number[] = []
  Enseignants: Teacher[] =[]
  seances : Seances [] =[];
  paies : Paie[] =[];
  constructor(private teacherService: EnseiService, public icons: IconsService){}

  ngOnInit(): void {
    this.getAllPaie();
  }

  // load all paie in month
  getAllPaie(){
    this.teacherService.getAllPaie().subscribe(result=>{
      // this.paies = result;
      console.log(result, "uoooooipkiunh");
      console.log(result, "paieee")
      let nbreHeures: number[] = [];
      let totalHeure: number = 0;
      
      result.forEach(rlt => {
        if (rlt && !this.paies.some(p => p.journee?.idTeacher.idEnseignant === rlt.journee?.idTeacher.idEnseignant)) {
          this.paies.push(rlt);
        }
        nbreHeures.push(rlt.nbreHeures);
        rlt.nbreHeures = totalHeure;
        
      });
      // Calculer la somme totale des heures
        totalHeure = nbreHeures.reduce((acc, heures) => acc + heures, 0);
        this.paies.forEach(p => {
          p.nbreHeures = totalHeure;
          const montant = p.coutHeure * p.nbreHeures;
          p.montant = montant;
        })
        console.log(totalHeure, "total");
    })
      
  
  }
 goBack(){
    window.history.back();
   }
}
