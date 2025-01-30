import { Component, OnInit } from '@angular/core';
import { EnseiService } from '../../Admin/Views/Enseignant/ensei.service';
import { PaieDTO } from '../../Admin/Models/paie';
import { IconsService } from '../../Services/icons.service';
import { SideBarService } from '../../sidebar/side-bar.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { animate, style, transition, trigger } from '@angular/animations';
import { SchoolService } from '../../Services/school.service';
import { AnneeScolaire } from '../../Admin/Models/School-info';
import { ActivatedRoute } from '@angular/router';
import { TeacherEmplois } from '../../Admin/Models/Emplois';
import { Class_shared } from '../../DGA/class-students/Utils/Class-shared-methods';
import { TeacherDto } from '../../Admin/Models/Teachers';
import { Admin } from '../../Admin/Models/Admin';
import { AdminUSER } from '../../Admin/Models/Auth';

@Component({
  selector: 'app-der-pai-list',
  templateUrl: './der-pai-list.component.html',
  styleUrl: './der-pai-list.component.css',
  animations: [
    trigger('zoom', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DerPaiListComponent implements OnInit {

  searchTerm: string = ''
  currentYear!: number
  idTeacher!: number
  admin!: Admin
  annee_check!: AnneeScolaire
  filteredIteme: TeacherEmplois[] = []
  teacherEmploi: TeacherEmplois[] = []
  paies: PaieDTO[] = [];
  annees: AnneeScolaire[] = []
  emploisDto!: TeacherDto


  constructor(private teacherService: EnseiService, public sharedMethod: Class_shared,
    private schoolService: SchoolService, private root: ActivatedRoute,
    public icons: IconsService, private sideBarService: SideBarService) { }

  ngOnInit(): void {
    this.admin = AdminUSER()?.der
    this.root.queryParams.subscribe(params => {
      this.idTeacher = params['id'];
      this.getAllEmploiByIdTeacherAndCurrentYear();
    })
    this.getAllAnneeScolaire()

    if(this.teacherEmploi != null && this.teacherEmploi.length){
      this.sideBarService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filteredEmplois();

    });
    }
    
    const date = new Date();
    this.currentYear = date.getFullYear();

  }
  
  //filter method
  filteredEmplois() {
    if (!this.searchTerm && this.emploisDto.teacherEmploiList.length) {
      return this.filteredIteme = this.emploisDto.teacherEmploiList
    }
    return this.filteredIteme = this.emploisDto.teacherEmploiList.filter(p => p.nomModule.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.filiere.toLowerCase().includes(this.searchTerm.toLowerCase()))
  }
  goBack() {
    this.searchTerm = ''
    window.history.back();

  }
  //imprime button
  imprimer() {
    // const buttonContent = document.getElementById('button') as HTMLElement;
    // buttonContent.style.display = "none";
    var data = document.getElementById('idTable') as HTMLElement;
    if (data) {
      data.style.padding = '50px';
      // data.style.fontSize = "14px"  
    }

    // Id of the table
    html2canvas(data!, { scale: 2 }).then(canvas => {
      // Few necessary setting options
      let imgWidth = 297; // A4 landscape width in mm
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('programme-de-soutenace.pdf');
      // buttonContent.style.display = "block";
      data.style.padding = '0px'
      // data.style.fontSize = '16px'
    });
  }
  //get all month
  checkYear(event: any) {
    
    const idAnnee = event.target.value
    this.annee_check = this.annees.find(annee => annee.id == idAnnee)!;
    this.teacherService.getAllEmploiOfTeacherByIdYear(idAnnee, this.idTeacher).subscribe(result => {
        this.emploisDto = result;
        this.teacherEmploi = this.emploisDto.teacherEmploiList
      })
   
  }

  getAllAnneeScolaire() {
    this.schoolService.getAnneeScolaireOfTeacherHaveEmploi(this.idTeacher).subscribe(annees => {
      
      annees.forEach(an => {
        if(!this.annees.some(anne => anne.id === an.id)){
          this.annees.push(an);
        }
      })
      
    })
    // console.log(this.months, " months")
  }
  getAllEmploiByIdTeacherAndCurrentYear(){
    this.teacherService.getAllEmploiOfTeacherOfCurrentYear(this.idTeacher).subscribe(result => {
      
      if(result.teacherEmploiList != null) {
      this.teacherEmploi = result.teacherEmploiList

      }else{
        result.teacherEmploiList = []
      }
      this.emploisDto = result;
      console.log(this.emploisDto, "emploisDto")
    })
  }

  // ---------------------get current date
  getCurrentDate() : string{
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long',  year: 'numeric'};
    
    // console.log(Intl.DateTimeFormat('fr-FR', options).format(date))
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  }
 
 
}
