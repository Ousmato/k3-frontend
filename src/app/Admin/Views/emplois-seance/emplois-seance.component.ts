import { Component, OnInit } from '@angular/core';
import { Emplois } from '../../Models/Emplois';
import { ServiceService } from '../emplois-du-temps/service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { data, param } from 'jquery';
import { ClassStudentService } from '../class-students/class-student.service';
import { Module } from '../../Models/Module';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IconsService } from '../../../Services/icons.service';
import { Teacher } from '../../Models/Teachers';
import { Seances } from '../../Models/Seances';
import { EnseiService } from '../enseignant/ensei.service';
import { SeancService } from './seanc.service';

@Component({
  selector: 'app-emplois-seance',
  templateUrl: './emplois-seance.component.html',
  styleUrl: './emplois-seance.component.css'
})
export class EmploisSeanceComponent  implements OnInit{
    idUrl!: number;
    emplois!: Emplois;
    form_seance! : FormGroup;
    idEmplois!: number;
    modules: Module[] = [];
    empModule : Module[] = [];
    datesWithDays: { day: string, date: string }[] = [];
    isCreating: boolean = false;
    selectedDay: string = '';
    selectedDate: string = '';
    formattedDate!: string;
    enseignants: Teacher[] =[];


    constructor(private emploisService: ServiceService, public icons: IconsService, private enseignantService: EnseiService,
      private fb: FormBuilder,private route: ActivatedRoute, private classService: ClassStudentService,private seanceService: SeancService ) { }
    ngOnInit(): void {
      // ------------------------------get id in url path
      this.loadEmploisByClass();
      this.loadModulesByClass();
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
          this.form_seance.get("date")?.setValue(value); // Mise à jour du contrôle du formulaire
        }else{
          this.form_seance.get("date")?.setValue(''); // Mise à jour du contrôle du formulaire
        }
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
    this.updateWidth();
  }
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
loadTime() : void{
  // let starTime = DateTim
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
