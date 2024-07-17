import { Component, OnInit } from '@angular/core';
import { Paie } from '../../Models/paie';
import { EnseiService } from '../enseignant/ensei.service';
import { IconsService } from '../../../Services/icons.service';
import { Seances } from '../../Models/Seances';
import { Teacher } from '../../Models/Teachers';
import jspdf from 'jspdf';  
import html2canvas from 'html2canvas';
import { SchoolService } from '../../../Services/school.service';
import { SchoolInfo } from '../../Models/School-info';

@Component({
  selector: 'app-fiche-paie',
  templateUrl: './fiche-paie.component.html',
  styleUrl: './fiche-paie.component.css'
})
export class FichePaieComponent  implements OnInit{
  Enseignants: Teacher[] =[]
  dtOptions: any = {}
  seances : Seances [] =[];
  paies : Paie[] =[];
  schoolInfo!: SchoolInfo

  constructor(private teacherService: EnseiService, public icons: IconsService, private schoolService: SchoolService){}
  ngOnInit(): void {
      this.getAllPaie();
      this.getSchoolInfo();
  }

  getAllPaie(){
    this.teacherService.getAllPaie().subscribe((data =>{
      data.forEach((item: Paie) => {

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
      this.teacherService.getAllPresence().subscribe(data =>{

      })
      // this.Enseignants = data;
       
      console.log(this.Enseignants, "---enseignant------")
      // this.load_diff(this.Enseignants);
    }))
   

  }
  // -------------------------------------method to imprime
   imprimer(id: string, name: string)  
  {  
    const bordercard =  document.querySelector('.card') as HTMLElement
  //  console.log(bordercard., "6457689")
   bordercard.classList.remove('card');
   const borderModal = document.querySelector('.modal-body') as HTMLElement
   borderModal.style.border = "none"
   const button  = document.querySelector('.btn-content') as HTMLElement
   button.style.display = "none"

    var data = document.getElementById(id);
      //Id of the table
    html2canvas(data!,{scale: 2}).then(canvas => { 
      
      // Few necessary setting options  
      let imgWidth = 208;     
      let imgHeight = (canvas.height * imgWidth) / canvas.width;  

      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      let position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save(`fiche_paie ${name}.pdf`);
      bordercard.classList.add('card'); 
       button.style.display = "block"
    });  
  }  
  // ----------------------------------get school information
  getSchoolInfo(){
    this.schoolService.getSchools().subscribe(data => {
      console.log(data, "school info")
      this.schoolInfo = data;
    })
  }
}
