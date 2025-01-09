import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Emplois } from '../../../Admin/Models/Emplois';
import { ServiceService } from '../emplois-du-temps/service.service';
import { EtudeService } from '../../../Admin/Views/Etudiants/etude.service';
import { Participant } from '../../../Admin/Models/Students';
import { IconsService } from '../../../Services/icons.service';
import { Admin } from '../../../Admin/Models/Admin';
import { AdminUSER } from '../../../Admin/Models/Auth';

@Component({
  selector: 'app-der-e-d-t',
  templateUrl: './der-e-d-t.component.html',
  styleUrl: './der-e-d-t.component.css'
})
export class DerEDTComponent implements OnInit{

  url_typeSeance! : string
  idClass!: number
  emploi!: Emplois
  admin!: Admin
  permission: boolean = false
  participants: Participant[] = []
  
  datesWithDays: { day: string, date: string }[] = [];
  constructor(private root: ActivatedRoute, public icons: IconsService, private studentService: EtudeService,
    private emploiService: ServiceService) { }
  ngOnInit(): void {
   this.load_all();
   this.getPermission();
  }

  // -----------------------------------------
  load_all(){
    this.root.queryParams.subscribe(param =>{
      this.url_typeSeance = param['choix'];
      this.idClass = +param['id'];
      console.log(this.url_typeSeance, this.idClass, "url_typeSeance");
      this.emploiService.getEmploisByClasse2(this.idClass).subscribe(result=>{
        this.emploi = result;
        console.log(this.emploi, "emploia");
      const dateDebut = this.emploi.dateDebut;
      const dateFin = this.emploi.dateFin;
      this.datesWithDays = this.emploiService.getDaysBetweenDates(dateDebut, dateFin)
      console.log(this.datesWithDays, "date days ")

      this.load_participation_by_classe(this.idClass!)
      
      })

    })
  }

  // load participatant (group)
  load_participation_by_classe(idClass: number){
    this.studentService.getParticipantsByEmploiId(idClass).subscribe((data) => {
      data.forEach(part =>{
        if(!this.participants.some(d=>d.idStudentGroup.id == part.idStudentGroup.id)){
        this.participants.push(part)
      }
      })
      
      console.log(this.participants, "participations");
    })
  }
  goBack(){
    // this.load_all();
    window.history.back()
  }

  getPermission(): boolean {
    const autorize = AdminUSER()?.der;
    this.admin = autorize;
    if(autorize){
      this.permission = true
      // console.log(autorize,"autorize")
      return true;
    }
    return false
  }
}
