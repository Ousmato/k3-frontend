import { Component, OnInit } from '@angular/core';
import { Emplois } from '../../Models/Emplois';
import { ServiceService } from '../emplois-du-temps/service.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { data, param } from 'jquery';
import { ClassStudentService } from '../class-students/class-student.service';
import { Module } from '../../Models/Module';

@Component({
  selector: 'app-emplois-seance',
  templateUrl: './emplois-seance.component.html',
  styleUrl: './emplois-seance.component.css'
})
export class EmploisSeanceComponent  implements OnInit{
    idUrl!: number;
    emplois!: Emplois;
    modules: Module[] = [];
    datesWithDays: { day: string, date: string }[] = [];
    constructor(private emploisService: ServiceService, 
      private fb: FormBuilder,private route: ActivatedRoute, private classService: ClassStudentService ) { }
    ngOnInit(): void {
      // ------------------------------get id in url path
      this.loadEmploisByClass();
      this.loadModulesByClass();

    }
// ----------------------get id in url path
    loadEmploisByClass() : void{
      this.route.queryParams.subscribe(param =>{
        // console.log(param["id"],"param")
        this.idUrl = +param['id'];
        // console.log(this.idUrl,"id");
        this.emploisService.getEmploisByClasse2(this.idUrl).subscribe(data  =>{
          this.emplois = data;
          const dateDebut = this.emplois.dateDebut;
          const dateFin = this.emplois.dateFin;
          // console.log(this.emplois, "emplois trouver");
          this.datesWithDays = this.emploisService.getDaysBetweenDates(dateDebut, dateFin)
          // console.log(this.datesWithDays, "list date");
        })
       });
    }
    // --------------------------------load all modules of class
    loadModulesByClass() : void{
       this.classService.getAllModules(this.idUrl).subscribe((data: Module[]) => {
        this.modules = data;
        console.log(this.modules,"modules");
      //  });
        })
       
    }
}
