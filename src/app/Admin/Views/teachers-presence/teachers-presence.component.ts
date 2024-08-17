import { Component, Input, OnInit } from '@angular/core';
import { Teacher } from '../../Models/Teachers';
import { IconsService } from '../../../Services/icons.service';
import { EnseiService } from '../enseignant/ensei.service';
import { Teacher_presence } from '../../Models/objectPresence';
import { NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceService } from '../../../DER/emplois-du-temps/service.service';
import { DatePipe } from '@angular/common';
import { Emplois } from '../../Models/Emplois';
import { Teacher_presence_pages } from '../../Models/Pagination-module';
import { SideBarService } from '../../../sidebar/side-bar.service';

@Component({
  selector: 'app-teachers-presence',
  templateUrl: './teachers-presence.component.html',
  styleUrl: './teachers-presence.component.css'
})
export class TeachersPresenceComponent  implements OnInit {
  enseignants!: Teacher [];
teacher_info: Teacher_presence[] = [];
  detaille: Teacher_presence [] = [];
  datesWithDays: { day: string, date: string }[] = [];
emplois!: Emplois;

searchTerm : string = "";

teachers_page!: Teacher_presence_pages;
page = 0;
size = 10;
filteredItems : Teacher[] = []
pages: number[] = []
teacher!: Teacher


  constructor(private sideBareService: SideBarService, public icons: IconsService,private datePipe: DatePipe, private enseignantService: EnseiService, private route: Router) { }
  ngOnInit(): void {
    this.getAllTeacher();
    this.sideBareService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterTeachers();
    
    });
    
  }

  // -----------------------------------method filter
  filterTeachers() {
    if (!this.searchTerm) {
      // console.log(this.enseignants, "fil")
     return this.filteredItems = this.enseignants;
     
    } else {
    return  this.filteredItems = this.enseignants.filter(enseignant =>
        enseignant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        enseignant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        enseignant.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  // ------------------------method get all teacher 
  getAllTeacher(){
    this.enseignantService.getPage_teacher_HaveEmplois(this.page, this.size).subscribe(data =>{
      this.teachers_page = data;
      this.teacher_info = data.content
      this.enseignants = data.content.map(d =>d.teacher);
      console.log(this.enseignants, "--------------------------")

      this.filteredItems = this.enseignants;
      this.pages = Array.from({ length: data.totalPages! }, (_, i) => i);
      this.enseignants.forEach((presence, index) => {
        presence.numero = index + 1;
        presence.urlPhoto = `http://localhost/StudentImg/${presence.urlPhoto}`;
      });
      // console.log(this.enseignants, "ebbbbbbbbbbbbb")
    })
  }
  
  // --------------------------------------------------method go to detail teacher presence
  selectedTeacher(teachId: number): void {
     // this.detaille.push(teacherDetail)
     const navigationExtras: NavigationExtras = {
      queryParams: { id: teachId }
    };
      this.route.navigate(['/secretaire/archive'], navigationExtras);
    
  }
  // ---------------------go back button
  goBack(){
    window.history.back();
  }

  // ------------------------------next page
  setPage(page: number): void {
    if (page >= 0 && page < this.teachers_page.totalPages!) {
      this.page = page;
      this.getAllTeacher();
    }
  }

  nextPage(): void {
    if (this.page < this.teachers_page.totalPages! - 1) {
      this.setPage(this.page + 1);
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.setPage(this.page - 1);
    }
  }
}
