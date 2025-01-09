import { Component, OnInit } from '@angular/core';
import { Paie } from '../../Models/paie';
import { EnseiService } from '../../Views/Enseignant/ensei.service';
import { SchoolService } from '../../../Services/school.service';
import { ActivatedRoute } from '@angular/router';

import jspdf, { jsPDF } from 'jspdf';  
import html2canvas from 'html2canvas';
import { SchoolInfo } from '../../Models/School-info';
import { Teacher } from '../../Models/Teachers';
import { IconsService } from '../../../Services/icons.service';

@Component({
  selector: 'app-enseignant-fiche-paie',
  templateUrl: './enseignant-fiche-paie.component.html',
  styleUrl: './enseignant-fiche-paie.component.css'
})
export class EnseignantFichePaieComponent implements OnInit{
  idEnseignant!: number;
  schoolInfo?: SchoolInfo;
  enseignant!: Teacher;
  moment!: string;
  sum_montant: string = ""
  montant_total: number = 0


  paie: Paie[] =[]
  constructor(private enseignantService: EnseiService, public icons: IconsService,
    private root: ActivatedRoute,
     private schoolService: SchoolService){}
  ngOnInit(): void {
      this.getPaieByEnseignant();
      this.getSchoolInfo();
  }

    getPaieByEnseignant(){
      this.root.queryParams.subscribe(param =>{
        this.idEnseignant = param['id'];
      })
      this.enseignantService.getPaieBy_Enseignant_id(this.idEnseignant).subscribe(data =>{
        this.paie = data;

        this.paie.forEach(p =>{
          p.montant = p.coutHeure * p.nbreHeures;

          const formatter = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF', 
        });
          p.coutHeureFormatter = formatter.format(p.coutHeure)
          p.montantFormatter = formatter.format(p.montant)
          this.sum_montant = formatter.format(this.paie.reduce((a, p) => a + p.montant!, 0));

          // this.enseignant = p.seanceConfig.idSeance!.idTeacher

          const heureFin = p.journee!.heureFin;
          // this.datePipe.transform(heureDebut)
          const date = new Date();
          // Créer une date de référence (aujourd'hui par exemple)
          const dateReference = new Date();

          // Créer une date pour l'heure de début en utilisant la date de référence
          const heureFinDate = new Date(dateReference.toDateString() + ' ' + heureFin);

          // Convertir les heures en millisecondes pour les comparer
          const h_m = new Date(date.setHours(12, 0, 0, 0)).getTime(); 

          if(heureFinDate.getHours() <= h_m){
            this.moment = "Matin/Soir"
          }else if(heureFinDate.getHours() < h_m){
            this.moment = 'Matin'
            }else{
              this.moment = "Soir"
          }
       
        })
       
        
      })
  }
  getSchoolInfo(){
    this.schoolService.getSchools().subscribe(data => {
      // console.log(data, "school info")
      this.schoolInfo = data;
      this.schoolInfo.urlPhoto = 'http://localhost/StudentImg/'+this.schoolInfo.urlPhoto;
    })
  }
  // ------------------go back button
  goBack(){
    window.history.back();
  }
  imprimer(name: string)  
  {  
   
   const button  = document.querySelector('.btn-content') as HTMLElement
   button.style.display = "none"

    var data = document.getElementById('main-content') as HTMLElement;
    html2canvas(data!,{scale: 2}).then(canvas => { 
      
      // Few necessary setting options  
      let imgWidth = 208;     
      let imgHeight = (canvas.height * imgWidth) / canvas.width;  

      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      let position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save(`fiche_paie ${name}.pdf`);
      button.style.display = "block"
    });  
  } 
  
  
  
}
