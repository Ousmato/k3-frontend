import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Emplois } from '../../Models/Emplois';
import { ServiceService } from '../../../DER/emplois-du-temps/service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { Module } from '../../Models/Module';

import { IconsService } from '../../../Services/icons.service';
import { Teacher } from '../../Models/Teachers';
import { Seances } from '../../Models/Seances';
import { EnseiService } from '../enseignant/ensei.service';
import { SeancService } from './seanc.service';
import { DatePipe, Location } from '@angular/common';
import { ClassRoom } from '../../Models/Classe';
import { ToastrService } from 'ngx-toastr';
import { EtudeService } from '../etudiants/etude.service';
import { Participant } from '../../Models/Students';
import { Configure_seance } from '../../Models/Configure_seance';

import jspdf, { jsPDF } from 'jspdf';  
import html2canvas from 'html2canvas';

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
    configSeance: Configure_seance[] = []
    palageHoraire: string[] =[]
    participations : Participant[] =[]
    // palageHoraire: string[] =['08h:00 - 10h:00','10:00 - 10:15', '10h:00 - 12h:00', '12:00 - 14:00', '14h:00 - 16h:00', '16h:00 - 18h:00']


    datesWithDays: { day: string, date: string }[] = [];
    datesWithDaysTest: { day: string, dates: string[] }[] = [];
    deleted_modal: boolean = false;
    pause_matin: string [] = [];
    pause_midi: string [] = [];
    is_show_button : boolean = false
    is_show_configure: boolean = false;
    correspondance: string = '';
    formattedDate!: string;
    day_of_head : string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  


    constructor(private emploisService: ServiceService, public icons: IconsService, private toastr: ToastrService,
       private enseignantService: EnseiService,private cdr: ChangeDetectorRef, private router: Router, private studentService: EtudeService,
      private fb: FormBuilder, private location: Location,private route: ActivatedRoute, private classService: ClassStudentService,private seanceService: SeancService ) { }
    ngOnInit(): void {
      // ------------------------------get id in url path
      this.loadEmploisByClass();
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
            // this.datesWithDaysTest = this.emploisService.getDaysBetweenDatesTest(dateDebut, dateFin)
            // this.datesWithDaysTest.pop();
            this.datesWithDays = this.emploisService.getDaysBetweenDates(dateDebut, dateFin)
            this.datesWithDays.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            
            this.getAllSeance(this.emplois.id!);
            this.load_configure(this.emplois.id!);
            this.loadModulesByClass(this.idUrl);
          })
        })
       
    }

    load_configure(idEmploi: number){
      this.seanceService.get_all_configSeance(idEmploi).subscribe(data =>{
        data.forEach(dat => {
          const seance = dat.idSeance
           if(!this.configSeance.some(cf =>cf.plageHoraire == dat.plageHoraire && seance.id == cf.idSeance.id) ){
            this.configSeance.push(dat)
           }
        })
      
        
        console.log(this.configSeance, "yo config")
      })
    }
    getDayFromDate(date: string): string {
      const dateObject = new Date(date);
      
      const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
      return new Intl.DateTimeFormat('fr-FR', options).format(dateObject);
    }
    getDayFromDateConfig(date: string): string {
      const dateObject = new Date(date);
      
      const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
      return new Intl.DateTimeFormat('fr-FR', options).format(dateObject);
    }
    
    // --------------------------------load all modules of class
    loadModulesByClass(idClasse: number) : void{
       this.classService.getAllModules(idClasse).subscribe((data: Module[]) => {
        this.modules = data;
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
    // ----------------------get all seance
    getAllSeance(idEmplois : number){
      this.seanceService.getAllByEmploisId(idEmplois).subscribe((data: Seances[]) => {
        this.seances = data;
        // console.log(this.seances, "seance")
        this.seances.forEach(seance => {
          const pause_matin = '10:00 - 10:15';
          const pause_midi = '12:00 - 14:00';

          // Check if pause_matin and pause_midi are not already in palageHoraire
          if (pause_matin && !this.palageHoraire.includes(pause_matin)) {
            this.palageHoraire.push(pause_matin);
            
          }

          if (pause_midi && !this.palageHoraire.includes(pause_midi)) {
            this.palageHoraire.push(pause_midi);
          }

          // Add seance.plageHoraire to palageHoraire
          if (seance.plageHoraire) {
            seance.plageHoraire.forEach(plage => {
              if (!this.palageHoraire.includes(plage)) {
                this.palageHoraire.push(plage);
              }
            });
          }

         
          const date = new Date()
          const pauseMatin = seance.pause_matin?.toString().slice(0,5);
          const pauseMidi = seance.pause_midi?.toString().slice(0,5);

          if (pauseMatin) {
            const [hours, minutes] = pauseMatin.split(':').map(Number);
              const hpause = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
              hpause.setMinutes(hpause.getMinutes() + 15);
              const pause_matin_fin = hpause.toTimeString().split(' ')[0]; // Format HH:mm:ss
              const timePair = `${pauseMatin} - ${pause_matin_fin}`;
              if (!this.pause_matin.includes(timePair)) {
                this.pause_matin.push(timePair);
              }
          }

          if (pauseMidi) {
            const [hours, minutes] = pauseMidi.split(':').map(Number);
              const hpause = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
              hpause.setHours(hpause.getHours() + 2);
              const pause_midi_fin = hpause.toTimeString().split(' ')[0]; // Format HH:mm:ss
              const timePair = `${pauseMidi} - ${pause_midi_fin}`;
              if (!this.pause_midi.includes(timePair)) {
                this.pause_midi.push(timePair);
              }
          }

         seance.heureDebut = seance.heureDebut.slice(0, 5); // Garder les 5 premiers caractères (HH:mm)
          seance.heureFin = seance.heureFin.slice(0, 5); 
        });
        this.palageHoraire = this.sortTimeSlots(this.palageHoraire);
        // console.log(this.palageHoraire, "pppppp")
      })
    }
    // -----------------------------------load all enseignants
    load_enseignants(){
      this.enseignantService.getAll().subscribe((data: Teacher[]) => {
        this.enseignants = data;
        // console.log(this.enseignants, "enseignants");
      })
    }
  show_form() : void{
    this.cdr.detectChanges();
    // this.updateWidth();
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
  // -------------------------editer les seance
  to_show_button(){
    this.is_show_button =!this.is_show_button;
   
  }
  to_configure() : void{
   this.is_show_configure =! this.is_show_configure
   this.loadEmploisByClass();
   
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
  to_groupe(idClasse: number){
    const navigationExtras : NavigationExtras ={
      queryParams: {id : idClasse}
    }
    this.router.navigate(['/der/group-student'], navigationExtras)
  }
 
  
  // ----------------------------------------------exit delete modal
  close_delete_modal(){
    this.deleted_modal = false;
  }
  

  // ------------------------
   sortTimeSlots(slots: string[]): string[] {
    return slots.sort((a, b) => {
      return this.compareTimeSlots(a, b);
    });
  }

   compareTimeSlots(a: string, b: string): number {
    const [startA] = a.split(' - ').map(time => this.timeToDate(time));
    const [startB] = b.split(' - ').map(time => this.timeToDate(time));
    
    return startA.getTime() - startB.getTime();
  }

   timeToDate(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  // --------------------------------------button to imprime
  imprimer() { 
  
    var data = document.getElementById('idTable') as HTMLElement;
    if(data){
      data.style.padding = '10px';   
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
        pdf.save('emplois-du-temps.pdf');
        data.style.padding = '0px'
    });
  } 
}
