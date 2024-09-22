import { Component, Input, OnInit, Output, input } from '@angular/core';
import { Teacher_presence } from '../../Models/objectPresence';
import { Teacher } from '../../Models/Teachers';
import { ServiceService } from '../../../DER/emplois-du-temps/service.service';
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
import { PageTitleService } from '../../../Services/page-title.service';

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
  datesWithDaysTest: { day: string, dates: string[] }[] = [];
  
 detaille!: any;
 isPresent: boolean = false;
 empois_class: Emplois_Classe[] =[];
 status!: Presence;
 presen_form!: FormGroup
 day_of_head : string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  


  constructor(private teacherService : EnseiService, private pageTitle: PageTitleService,
    private  emploisService: ServiceService, private fb: FormBuilder,
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
      this.router.queryParams.subscribe(params => {
        const idUrl = params['id'];
        
        this.teacherService.getTeacherPresence(idUrl).subscribe(data  => {
        this.detail_teacher = data;
        this.teacher = this.detail_teacher.teacher;
          this.classes = this.detail_teacher.classRoom;
          this.seances = this.detail_teacher.seances;

         
          console.log(this.seances, "seances")
          
        this.detail_teacher.emplois.forEach((em)=>{
          if(!this.emplois.includes(em)){
            const dateDebut = em.dateDebut;
            const dateFin = em.dateFin;
            // console.log(this.emplois, "emplois trouver");
            
            // this.datesWithDaysTest = this.emploisService.getDaysBetweenDatesTest(dateDebut, dateFin);
            console.log(this.datesWithDaysTest, "date- tes")
           
          }
          
        })
        
        this.detail_teacher.seances.forEach((snce) =>{
          console.log(snce.observation , "observation")
          let seanceIdEmplois: number;
          snce.heureDebut = snce.heureDebut.slice(0, 5);
          snce.heureFin = snce.heureFin.slice(0, 5); 
          snce.date = new Date(snce.date!); 
          seanceIdEmplois = snce.idEmplois.id!;

          const formattedDate = this.datePipe.transform(snce.date, 'dd, MMMM yyyy', 'fr-FR');
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
        // this.checkIfEmploiExists(data.seances)
      });
      // this.currentDay(days)
    });
    }
    // -----------------------------------------emplois an classe  is found
  //  async checkIfEmploiExists(seances: Seances[]) {
  //     // Parcourir chaque seance
  //     for (let seance of seances) {
  //       try {
  //         const data = await this.teacherService.getStatus(seance.idTeacher.idEnseignant!).toPromise();
  //         this.status = data?.find(dp => dp.idSeance.id == seance.id)!;
  //         if (this.status?.observation == true) {
  //          seance.observation = true;
  //          console.log(seance.observation, "true")
          
  //         }else {
  //          seance.observation = false;
  //          console.log(seance.observation, "false")
         
  //         }
  //       } catch (error) {
  //         console.error("Error fetching status:", error);
  //         // Handle error if needed
  //       }
  //     }
  //   }
    // -------------------------------get current day
    currentDay( days: string) : boolean{
      days = days.toUpperCase();
      const currentDate = new Date();
      const day = this.datePipe.transform(currentDate, 'EEEE', 'fr-FR')?.toUpperCase();
      const day_correspond = days === day
      
      return day_correspond;
    }
  
  // ----------------------------------method abscenter un teacher
    change_observation(seanceId: number) {
      const seance = this.seances.find(s => s.id === seanceId);
      const present_seance : Presence ={
        idSeance: seance!

      }
      this.teacherService.chage_observation(present_seance!).subscribe({
        next: (response) =>{
          this.pageTitle.showSuccessToast(response.message);
          this.loadDetail();
        },
        error: (erreur) =>{
          this.pageTitle.showErrorToast(erreur.error.message);
        }
      })
    }
    // ---------------------------------go back button
    goBack(){
      window.history.back();
    }
}
