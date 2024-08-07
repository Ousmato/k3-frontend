import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Emplois } from '../../Models/Emplois';
import { ServiceService } from '../../../DER/emplois-du-temps/service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { Module } from '../../Models/Module';
import { Pipe, PipeTransform } from '@angular/core';

import { IconsService } from '../../../Services/icons.service';
import { Teacher } from '../../Models/Teachers';
import { Seances } from '../../Models/Seances';
import { EnseiService } from '../enseignant/ensei.service';
import { SeancService } from './seanc.service';
import { DatePipe, Location } from '@angular/common';
import { ClassRoom } from '../../Models/Classe';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { ToastrNotificationService } from '../../Classes/delete-modal';
import { Salles } from '../../Models/Salles';

@Component({
  selector: 'app-emplois-seance',
  templateUrl: './emplois-seance.component.html',
  styleUrl: './emplois-seance.component.css'
})
export class EmploisSeanceComponent  implements OnInit{
    idUrl!: number;
    classId!: ClassRoom
    emplois!: Emplois;
    hasDeleted! : Seances
    idEmplois!: number;
    selected_seance_heure_fin! : any
    form_seance! : FormGroup;
    update_seance_form!: FormGroup

    
    modules: Module[] = [];
    seances : Seances[] = [];
    empModule : Module[] = [];
    enseignants: Teacher[] =[];
    hoursList: any[] =[];
    cellules: number[] = [];

    datesWithDays: { day: string, date: string }[] = [];
    datesWithDaysTest: { day: string, dates: string[] }[] = [];
    deleted_modal: boolean = false;
    isCreating: boolean = false;
    ishow_update_form : boolean = false
    selectedDay: string = '';
    selectedDate: string = '';
    formattedDate!: string;
    day_of_head : string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  


    constructor(private emploisService: ServiceService, public icons: IconsService, private toastr: ToastrService,
       private enseignantService: EnseiService,private cdr: ChangeDetectorRef, private router: Router,
      private fb: FormBuilder, private location: Location,private route: ActivatedRoute, private classService: ClassStudentService,private seanceService: SeancService ) { }
    ngOnInit(): void {
      // ------------------------------get id in url path
      this.loadEmploisByClass();
      // this.load_form();
      this.getSeance_date();
      this.getMonth();
      this.load_enseignants();
      this.load_update_form();

    }
    showSuccessToast(message: any) {
      this.toastr.success(message, 'Succès');
      
    }
    showErrorToast(erreur: any) {
      this.toastr.error("Erreur : "+ erreur)
    }

    // ---------------------------------------button to refresh page
    refreshPage(){
      this.loadEmploisByClass();
    }
    // ---------------------------go back button 
    goBack(){
      this.location.back();
    }
   
// ----------------------get id in url path
    loadEmploisByClass() : void{
      this.route.queryParams.subscribe(param =>{
        // console.log(param["id"],"param")
        this.idUrl = +param['id'];
        console.log(this.idUrl,"id emplois");

          this.emploisService.getEmploisByClasse2(this.idUrl).subscribe(data  =>{
            this.emplois = data;
            const dateDebut = this.emplois.dateDebut;
            const dateFin = this.emplois.dateFin;
            console.log(this.emplois, "emplois trouver");
            this.datesWithDaysTest = this.emploisService.getDaysBetweenDatesTest(dateDebut, dateFin)
            this.datesWithDays = this.emploisService.getDaysBetweenDates(dateDebut, dateFin)
            this.datesWithDays.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            // for(let dtd of )
            console.log(this.datesWithDaysTest, "list date");
            this.getAllSeance(this.emplois.id!);

            this.loadModulesByClass(this.idUrl)
          })
        })
       
      //  });
    }
    // --------------------------------load all modules of class
    loadModulesByClass(idClasse: number) : void{
      console.log(this.classId, "classId")
       this.classService.getAllModules(idClasse).subscribe((data: Module[]) => {
        this.modules = data;
        console.log(this.modules,"modules");
      //  });
        })
       
    }
    // ---------------------get current month
    getMonth(): string {
      const date = new Date();
      const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      this.formattedDate = `${month}, ${year}`;
      
      return this.formattedDate;
    }
    // -------------------------------------get automatic value seances date of day 
    getSeance_date(){
      this.form_seance.get("jour")?.valueChanges.subscribe((value: any) => {
        if(value){
          this.form_seance.get("date")?.setValue(value); 
        }else{
          this.form_seance.get("date")?.setValue('');
        }
      })

    }
    // ----------------------get all seance
    getAllSeance(idEmplois : number){
      this.seanceService.getAllByEmploisId(idEmplois).subscribe((data: Seances[]) => {
        this.seances = data;
        this.seances.forEach(seance => {
         seance.heureDebut = seance.heureDebut.slice(0, 5); // Garder les 5 premiers caractères (HH:mm)
          seance.heureFin = seance.heureFin.slice(0, 5); 

          const timePair = `${seance.heureDebut} - ${seance.heureFin}`;
          if (!this.hoursList.includes(timePair)) {
            this.hoursList.push(timePair);
          }
          // this.hoursList.push("heureFin", seance.heureFin);
        });
        console.log(this.seances, "seances");
      })
    }
    // -----------------------------------load all enseignants
    load_enseignants(){
      this.enseignantService.getAll().subscribe((data: Teacher[]) => {
        this.enseignants = data;
        console.log(this.enseignants, "enseignants");
      })
    }
    // ----------------------------------------------add seance

  // ----------------------------------------
  show_form() : void{
    this.isCreating = true;
    this.cdr.detectChanges();
    // this.updateWidth();
  }
  // -------------------------------------------metho pour filtrer par date
  getSeancesForDate(date: string): any[] {
    return this.seances.filter(seance => seance.date?.toString() === date);
  }
  // -------------------------------------------meth
  validate_emplois(){
    this.emploisService.validateEmplois(this.emplois.id!).subscribe(data =>{
      if(data === true)
        {
          this.toastr.success("Emplois validé avec succes!!!", "Succès");
          console.log(data)
        }else{
        this.toastr.success("Emplois desactiver avec success");
        }
    })
  }
  annuller() : void{
    this.isCreating = false;
    // this.updateWidth();
  }
// -----------------------------------------update seance
  show_update_seance(idSeance: number){
    const navigationExtras: NavigationExtras = {
      queryParams: {id : idSeance}
    } 
    this.router.navigate(['/der/edit-seance'], navigationExtras)
  }
  preventClick(event: MouseEvent): void {
    event.stopPropagation(); // Empêche la propagation de l'événement de clic
  }
  exit(){
    this.selected_seance_heure_fin = null;
  }
  // -------------------------------------------deleted seance
  show_comfirme_delete(heureDebut: string, heureFin: string){
    this.hasDeleted =  this.seances.find(s =>s.heureFin == heureFin && s.heureDebut == heureDebut)!;
 
    this.deleted_modal =! this.deleted_modal
  }
  deleted(seance: Seances){ 
  this.seanceService.delete(seance.id!).subscribe(
  {
    next : (resp) =>{
      console.log(resp, "data");
      this.showSuccessToast(resp.message)
      this.deleted_modal = false
    },
    error : (erreur) =>{
      this.showErrorToast(erreur.error.message);
      // console.log(erreur.error.message, "erreur");
    }
  })
  
  }
  // ----------------------------------------load update form
  load_update_form(){
    this.update_seance_form = this.fb.group({
      id: ['',],
      heureDebut: ['',Validators.required],
      heureFin: ['',Validators.required],
      date: ['',Validators.required],
      idEmplois: [''],
      idModule: ['',Validators.required],
      idTeacher: ['',Validators.required],
    })
  }
  // ------------------------------------------
  update_seance(){}
  //  
  // }
  // ----------------------------------------------exit delete modal
  close_delete_modal(){
    this.deleted_modal = false;
  }
  
}
