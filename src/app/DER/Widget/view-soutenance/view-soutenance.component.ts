import { Component, OnInit } from '@angular/core';
import { Jury, Soutenance } from '../../../Admin/Models/doc';
import { IconsService } from '../../../Services/icons.service';
import { EtudeService } from '../../../Admin/Views/Etudiants/etude.service';
import { SchoolService } from '../../../Services/school.service';
import { SchoolInfo } from '../../../Admin/Models/School-info';
import { Salles } from '../../../Admin/Models/Salles';
import { Admin } from '../../../Admin/Models/Admin';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AdminUSER } from '../../../Admin/Models/Auth';


@Component({
  selector: 'app-view-soutenance',
  templateUrl: './view-soutenance.component.html',
  styleUrl: './view-soutenance.component.css'
})
export class ViewSoutenanceComponent implements OnInit {


  soutenance: Soutenance[] = [];
  date!: any
  school? : SchoolInfo
  jurys: Jury[] =[]
  salle?: Salles
  admin?: Admin 

  constructor(public icons: IconsService, private studentService: EtudeService, private schoolService: SchoolService){}

 ngOnInit(): void {
     this.load_soutenanceActif();
     this.load_school();
     this.admin = AdminUSER()?.der
 }

 load_soutenanceActif(){
  this.studentService.getAllSoutenanceActif().subscribe(result =>{
    result.forEach(res =>{
      this.salle = res.idSalle
      this.date = res.date
      res.heureDebut = res.heureDebut.slice(0, 5).toString();
      res.heureFin = res.heureFin.slice(0, 5)
      res.idJury?.forEach(jrs => {
        if(!this.jurys.some(jr => jr.id == jrs.id)){
        this.jurys.push(jrs);
      }
      })
      
    })
   
    this.soutenance = result;
    console.log(this.soutenance, "soutenance")
  })
 }

//  ----------------------------load school
load_school(){
  this.schoolService.getSchools().subscribe(result => {
    this.school = result;
    // this.school.urlPhoto = "http://localhost/StudentImg/"+ this.school.urlPhoto;
  })
}
 goBack(){
  window.history.back();
 }

 getCurrentDate() : string{
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long',  year: 'numeric'};
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
 }

  // --------------------------------------button to imprime
  imprimer() { 
    const buttonContent = document.getElementById('button') as HTMLElement;
    const data = document.getElementById('idTable') as HTMLElement;
  
    if (buttonContent && data) {
      // Temporarily hide the print button
      buttonContent.style.display = "none";
  
      // Save current styles to restore them later
      const originalPadding = data.style.padding;
      const originalHeight = data.style.height;
      const originalOverflow = data.style.overflow;
  
      // Temporarily set styles to capture the entire scrollable area
      data.style.padding = '50px'; 
      data.style.height = 'auto';
      data.style.overflow = 'visible';
  
      // Capture the element with html2canvas
      html2canvas(data, { scale: 2 }).then(canvas => {
        let imgWidth = 297; // A4 landscape width in mm
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
        let position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('programme-de-soutenace.pdf');
        
        // Restore original styles
        buttonContent.style.display = "block";
        buttonContent.style.justifyContent = "end" 
        data.style.padding = originalPadding;
        data.style.height = originalHeight;
        data.style.overflow = originalOverflow;
      });
    }
  }
  
}
