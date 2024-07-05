import { Component, Input, OnInit, Output, input } from '@angular/core';
import { Teacher_presence } from '../../Models/objectPresence';
import { Teacher } from '../../Models/Teachers';
import { ServiceService } from '../emplois-du-temps/service.service';
import { IconsService } from '../../../Services/icons.service';
import { DatePipe } from '@angular/common';
import { Emplois } from '../../Models/Emplois';
import { Seances } from '../../Models/Seances';
import { ActivatedRoute} from '@angular/router';
import { EnseiService } from '../enseignant/ensei.service';
import { ClassRoom } from '../../Models/Classe';
import { Emplois_Classe } from '../../Models/Emplois-classe';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Presence } from '../../Models/Teacher-presence';
import { data } from 'jquery';

@Component({
  selector: 'app-enseignant-pr-details',
  templateUrl: './enseignant-pr-details.component.html',
  styleUrl: './enseignant-pr-details.component.css',
  
})
export class EnseignantPrDetailsComponent implements OnInit {
   detail_teacher!: Teacher_presence;
   emplois: Emplois[]= [];
   teacher!: Teacher
   classes: ClassRoom [] = [];
  seances: Seances[] =[]
  hoursList: any[] =[]
  dates_emplois: { day: string, date: string }[] = [];
  
 detaille!: any;
 isPresent: boolean = false;
 empois_class: Emplois_Classe[] =[];
 status!: Presence;
 presen_form!: FormGroup


  constructor(private teacherService : EnseiService, private  emploisService: ServiceService, private fb: FormBuilder,
    public icons: IconsService, private router: ActivatedRoute, private datePipe: DatePipe){
   
  }
  
  ngOnInit(): void {
    this.loadDetail();
    // this.currentDay();
    this.presen_form = this.fb.group({
      idSeance: [[]]
    })
    
  }
// -------------------------------load detail
    loadDetail(){
      let days : string;
      this.router.queryParams.subscribe(params => {
        const idUrl = params['id'];
        
        this.teacherService.getTeacherPresence(idUrl).subscribe(data  => {
        this.detail_teacher = data;
        this.teacher = this.detail_teacher.teacher;
          this.classes = this.detail_teacher.classRoom;
          this.seances = this.detail_teacher.seances;
          console.log(this.seances[0].observation+"----------------------------------")
          
        // }))
       
        this.detail_teacher.emplois.forEach((em)=>{
          if(!this.emplois.includes(em)){
            const dateDebut = em.dateDebut;
            const dateFin = em.dateFin;
            // console.log(this.emplois, "emplois trouver");
            this.dates_emplois = this.emploisService.getDaysBetweenDates(dateDebut, dateFin)
            
            this.dates_emplois.forEach(da_em =>{
              
              days = da_em.day.toUpperCase();              
            })
           
             this.emplois.push(em);
          }
          
        })
        
        this.detail_teacher.seances.forEach((snce) =>{
          let seanceIdEmplois: number;
          snce.heureDebut = snce.heureDebut.slice(0, 5);
          snce.heureFin = snce.heureFin.slice(0, 5); 
          snce.date = new Date(snce.date); 
          seanceIdEmplois = snce.idEmplois.id!;

          const formattedDate = this.datePipe.transform(snce.date, 'dd, MMMM yyyy', 'fr-FR');
          // console.log(formattedDate, 'formatted date');
          snce.date_string = formattedDate!;
          const day = this.datePipe.transform(snce.date, 'EEEE', 'fr-FR')?.toUpperCase();
          
          snce.jour = day; 
          const timePair = `${snce.heureDebut} - ${snce.heureFin}`;
          if (!this.hoursList.includes(timePair)) {
            this.hoursList.push(timePair);
          }
          const emploi_found = data.emplois.find(emp => emp.id === seanceIdEmplois)
          const classe_found = data.classRoom.find( cl_found => cl_found.id === emploi_found?.idClasse.id);
          
          if (!this.empois_class.some(item => item.emploi.id === emploi_found!.id && item.classe.id === classe_found!.id)){
          this.empois_class.push({emploi: emploi_found!, classe: classe_found!});
        }
        });
        this.checkIfEmploiExists(data.seances)
      });
      // this.currentDay(days)
    });
    }
    // -----------------------------------------emplois an classe  is found
   async checkIfEmploiExists(seances: Seances[]) {
      // Parcourir chaque seance
      for (let seance of seances) {
        try {
          const data = await this.teacherService.getStatus(seance.idTeacher.idEnseignant!).toPromise();
          this.status = data?.find(dp => dp.idSeance.id == seance.id)!;
          if (this.status?.observation == true) {
           seance.observation = true;
          
          }else {
           seance.observation = false;
         
          }
        } catch (error) {
          console.error("Error fetching status:", error);
          // Handle error if needed
        }
      }
    }
    // -------------------------------get current day
    currentDay( days: string) : boolean{
      days = days.toUpperCase();
      const currentDate = new Date();
      const day = this.datePipe.transform(currentDate, 'EEEE', 'fr-FR')?.toUpperCase();
      const day_correspond = days === day
      
      return day_correspond;
    }
    // -----------------------------------method add or update observation
    present(seanceId: number) {
      const seance = this.seances.find(s => s.id === seanceId);
      const present_seance : Presence ={
        idSeance: seance!

      }
      this.teacherService.addPresence(present_seance).subscribe(data =>{
       
        alert("La presence ajouter avec success!!");
        window.location.reload();
        console.log(data, "data added");
        
      })
    }
  
  
  // ----------------------------------method abscenter un teacher
    abscent(seanceId: number) {
      const seance = this.seances.find(s => s.id === seanceId);
      // console.log(seance, "seabbb")
      const present_seance : Presence ={
        idSeance: seance!

      }
      this.teacherService.abscenter(present_seance!).subscribe(data =>{
        // console.log(data, "data")
        if(data === true){
         
          alert("L'absence ajouter avec success!!");
          window.location.reload();
           present_seance.idSeance.observation = false;
        }
      })
    }
    
}
