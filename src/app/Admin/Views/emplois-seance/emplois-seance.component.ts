import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Emplois } from '../../Models/Emplois';
import { ServiceService } from '../emplois-du-temps/service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClassStudentService } from '../class-students/class-student.service';
import { Module } from '../../Models/Module';
import { Pipe, PipeTransform } from '@angular/core';

import { IconsService } from '../../../Services/icons.service';
import { Teacher } from '../../Models/Teachers';
import { Seances } from '../../Models/Seances';
import { EnseiService } from '../enseignant/ensei.service';
import { SeancService } from './seanc.service';
import { DatePipe } from '@angular/common';
import { ClassRoom } from '../../Models/Classe';

@Component({
  selector: 'app-emplois-seance',
  templateUrl: './emplois-seance.component.html',
  styleUrl: './emplois-seance.component.css'
})
export class EmploisSeanceComponent  implements OnInit{
    idUrl!: number;
    classId!: ClassRoom
    emplois!: Emplois;
    form_seance! : FormGroup;
    idEmplois!: number;
    modules: Module[] = [];
    seances : Seances[] = [];
    empModule : Module[] = [];
    datesWithDays: { day: string, date: string }[] = [];
    isCreating: boolean = false;
    selectedDay: string = '';
    selectedDate: string = '';
    formattedDate!: string;
    enseignants: Teacher[] =[];
    hoursList: any[] =[];
    cellules: number[] = [];


    constructor(private emploisService: ServiceService, public icons: IconsService, private enseignantService: EnseiService,private cdr: ChangeDetectorRef,
      private fb: FormBuilder, private datePipe: DatePipe,private route: ActivatedRoute, private classService: ClassStudentService,private seanceService: SeancService ) { }
    ngOnInit(): void {
      // ------------------------------get id in url path
      this.loadEmploisByClass();
      // this.loadModulesByClass();
      this.load_form();
      this.getSeance_date();
      this.updateWidth();
      this.getMonth();
      this.load_enseignants();

    }
    load_form(){
      this.form_seance = this.fb.group({
        heureDebut: [''],
        heureFin: [''],
        idEmplois: [''],
        idTeacher: [''],
        date: [""],
        idModule: [''],
        jour: [""]
      });
    }
// ----------------------get id in url path
    loadEmploisByClass() : void{
      this.route.queryParams.subscribe(param =>{
        // console.log(param["id"],"param")
        this.idUrl = +param['id'];
        console.log(this.idUrl,"id emplois");
        // this.emploisService.getEmploisById(this.idUrl).subscribe((data: Emplois) =>{
        //   this.classId = data.idClasse;
        //   console.log(data.idClasse, "cla---------------------")

          this.emploisService.getEmploisByClasse2(this.idUrl).subscribe(data  =>{
            this.emplois = data;
            const dateDebut = this.emplois.dateDebut;
            const dateFin = this.emplois.dateFin;
            console.log(this.emplois, "emplois trouver");
            this.datesWithDays = this.emploisService.getDaysBetweenDates(dateDebut, dateFin)
            console.log(this.datesWithDays, "list date");
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
    // ---------------------------------------manager width in element
    updateWidth() {
      const table = document.getElementById("idTable");
      const form = document.getElementById("idForm");
      if (this.isCreating === false) {
        table!.style.width = "100%";
        if (form) {
          form.style.width = "0%"; 
        }
      } else {
        table!.style.width = "70%";
        if (form) {
          form.style.width = "30%";
        }
      }
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
        // console.log(this.enseignants, "enseignants");
      })
    }
    // ----------------------------------------------add seance

  // ----------------------------------------
  show_form() : void{
    this.isCreating = true;
    this.cdr.detectChanges();
    this.updateWidth();
  }
  // -------------------------------------------metho pour filtrer par date
  getSeancesForDate(date: string): any[] {
    return this.seances.filter(seance => seance.date.toString() === date);
  }
  // -------------------------------------------meth
  validate_emplois(){
    this.emploisService.validateEmplois(this.emplois.id!).subscribe(data =>{
      if(data === true)
        {
          alert("Emplois validé avec succes!!!");
          console.log(data)
        }else{
        alert("emplois desactiver avec success");
        }
    })
  }
  annuller() : void{
    this.isCreating = false;
    this.updateWidth();
  }
// -----------------------------------load times
loadTime() : string[]{
  const toDayHourStart : Date = new Date();
  const toDayHourEnd : Date = new Date();

  toDayHourStart.setHours(8, 0, 0, 0);
  toDayHourEnd.setHours(18, 0, 0, 0);
  // let times
  for (let i = toDayHourStart; i < toDayHourEnd; i.setHours(i.getHours() + 1)) {
    const hourStart = this.datePipe.transform(i, 'HH:mm');
    const nextHour = new Date(i);
    nextHour.setHours(i.getHours() + 1);
    const hourEnd = this.datePipe.transform(nextHour, 'HH:mm');
    
    this.hoursList.push(`${hourStart} - ${hourEnd}`);
  }
  
  console.log(this.hoursList, "hours");
  return this.hoursList;


}
// --------------------------------------form to create seance
  create_seance(){
    const formData = this.form_seance.value;
    const idModule: Module = this.modules.find(mod => mod.id === +formData.idModule)!;
    const idEmploi: Emplois = this.emplois;
    const idTeacher: Teacher = this.enseignants.find(t => t.idEnseignant === +formData.idTeacher)!;
    const seance: Seances = {
      heureDebut: formData.heureDebut,
      heureFin: formData.heureFin,
      date: formData.date,
      idEmplois: idEmploi,
      idModule: idModule,
      idTeacher: idTeacher,
    }
    console.log("data:", seance)
    this.seanceService.create(seance).subscribe(data =>{
      console.log(data, "data");
      alert("Ajout effectuer avec succes!!!");
      this.form_seance.reset();
      this.isCreating = false;
      window.location.reload();
    })
  }

}
