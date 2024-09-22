import { Component, OnInit } from '@angular/core';
import { Teacher } from '../../../Admin/Models/Teachers';
import { Module } from '../../../Admin/Models/Module';
import { ClassRoom } from '../../../Admin/Models/Classe';
import { Salles } from '../../../Admin/Models/Salles';
import { Emplois } from '../../../Admin/Models/Emplois';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../emplois-du-temps/service.service';
import { EnseiService } from '../../../Admin/Views/enseignant/ensei.service';
import { SeancService } from '../../../Admin/Views/emplois-seance/seanc.service';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { IconsService } from '../../../Services/icons.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { SalleService } from '../../../Services/salle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Seances } from '../../../Admin/Models/Seances';
import { Filiere } from '../../../Admin/Models/Filieres';
import { NivFiliere } from '../../../Admin/Models/NivFiliere';

@Component({
  selector: 'app-der-edit-seance',
  templateUrl: './der-edit-seance.component.html',
  styleUrl: './der-edit-seance.component.css'
})
export class DerEditSeanceComponent implements OnInit{

 
  enseignants: Teacher[] = [];
  modules: Module [] =[];
  classes: ClassRoom [] = [];
  salles: Salles [] = [];
  emplois!: Emplois;
  seance!: Seances;
  idUrl!: number
  
  datesWithDays: { day: string, date: string }[] = [];
  datesWithDaysTest: { day: string, dates: string[] }[] = [];

  nomMension?: NivFiliere;
  enseig?: Teacher;
  salle?: Salles;
  nomModule?: Module;

  form_seance?: FormGroup
  constructor(private emploisService: ServiceService, public icons: IconsService,
    private enseignantService: EnseiService, private pageTitle: PageTitleService,
   private fb: FormBuilder, private classService: ClassStudentService, private route: ActivatedRoute, private router: Router, private seanceService: SeancService, private salleService: SalleService){}


  ngOnInit(): void {
    this.load_form(); 
    this.get_by_id();
      this.load_classe();
      this.load_enseignants();
      this.getSeance_date();
      this.load_salles();
     
  }

   // ------------------------load form

   load_form(){
    this.form_seance = this.fb.group({
      id: [''],
      heureDebut: [''],
      heureFin: [''],
      idEmplois: [''],
      idSalle: [''],
      idTeacher: [''],
      date: [""],
      idModule: [''],
      jour: [""],
      idClasse: ['']
    });
  }

  // -------------------load seance by id
  get_by_id(){
    this.route.queryParams.subscribe(param =>{
      this.idUrl = +param['id'];
    })
    this.seanceService.getSeance_byId(this.idUrl).subscribe((data: Seances) =>{
      this.seance = data;

      this.form_seance?.get('id')?.setValue(this.seance.id);
      this.form_seance?.get('idEmplois')?.setValue(this.seance.idEmplois);
      this.form_seance?.get('heureDebut')?.setValue(this.seance.heureDebut);
      this.form_seance?.get('heureFin')?.setValue(this.seance.heureFin);
      this.form_seance?.get('date')?.setValue(this.seance.date);

      // this.enseig = this.seance.idTeacher;
      this.nomMension = this.seance.idEmplois.idClasse.idFiliere!;
      this.nomModule = this.seance.idModule
    
    });
  }

   // -----------------------------------load all enseignants
   load_enseignants(){
    this.enseignantService.getAll().subscribe(data => {
      this.enseignants = data;
    })
  }

  // ----------------------load class-room
  load_classe(){
    this.classService.getAllCurrentClassOfYear().subscribe(data =>{
      this.classes = data;
    })
  }
  // --------------------------load salle
  load_salles(){
    this.salleService.getAll_non_occuper().subscribe(data =>{
      this.salles = data;
    })
  }


  updat_seance(){
    const formData = this.form_seance?.value;
      const idModule: Module = this.modules.find(mod => mod.id == +formData.idModule)!;
      const idEmploi: Emplois = this.seance.idEmplois;
      const idTeacher: Teacher = this.enseignants.find(t => t.idEnseignant == +formData.idTeacher)!;
      const idSalle: Salles = this.salles.find(s => s.id == +formData.idSalle)!;

      const seance: Seances = {
        id: formData.id,
        heureDebut: formData.heureDebut,
        heureFin: formData.heureFin,
        date: formData.date,
        idEmplois: idEmploi,
        idModule: idModule,
        // idTeacher: idTeacher,
        // idClasse: idEmploi.idClasse
        
      }
      // console.log(seance, "seance")
      // return
        console.log("valid :", seance)
          this.seanceService.update(seance).subscribe({
          next : (resp) =>{
           this.pageTitle.showSuccessToast(resp.message)
           window.history.back();
            
          },
          error : (erreur) => {
            this.pageTitle.showErrorToast(erreur.error.message);
          }
        })

  }

  // ------------select mention
  onSelect(event : any){
    this.idUrl = event.target.value;
    
    this.emploisService.getEmploisByClasse2(this.idUrl).subscribe(data  =>{
      this.emplois = data;
      const dateDebut = this.emplois.dateDebut;
      const dateFin = this.emplois.dateFin;

      // this.datesWithDaysTest = this.emploisService.getDaysBetweenDatesTest(dateDebut, dateFin)
      this.datesWithDays = this.emploisService.getDaysBetweenDates(dateDebut, dateFin)
      this.datesWithDays.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      
      this.loadModulesByClass(this.idUrl)
    })
  }

  // ------------ modules of classe
  loadModulesByClass(idClasse: number) : void{
     this.classService.getAllModules(idClasse).subscribe((data: Module[]) => {
      this.modules = data;
      // console.log(this.modules,"modules");
    //  });
      })
     
  }

  // ----------------------------get automatic date 
  getSeance_date(){
    this.form_seance?.get("jour")?.valueChanges.subscribe((value: any) => {
      if(value){
        this.form_seance?.get("date")?.setValue(value);
        // console.log("change") 
      }else{
        this.form_seance?.get("date")?.setValue('');
      }
    })

  }

  goBack(){
    window.history.back();
  }
}
