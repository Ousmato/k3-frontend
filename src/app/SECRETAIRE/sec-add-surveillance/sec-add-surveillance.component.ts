import { Component, OnInit } from '@angular/core';
import { Seances, Surveillance, type_seance } from '../../Admin/Models/Seances';
import { Module } from '../../Admin/Models/Module';
import { Teacher } from '../../Admin/Models/Teachers';
import { Salles } from '../../Admin/Models/Salles';
import { Configure_seance } from '../../Admin/Models/Configure_seance';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../DER/emplois-du-temps/service.service';
import { PageTitleService } from '../../Services/page-title.service';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { SalleService } from '../../Services/salle.service';
import { EnseiService } from '../../Admin/Views/enseignant/ensei.service';
import { SeancService } from '../../Admin/Views/emplois-seance/seanc.service';
import { Emplois } from '../../Admin/Models/Emplois';
import { ClassRoom } from '../../Admin/Models/Classe';
import { ActivatedRoute } from '@angular/router';
import { IconsService } from '../../Services/icons.service';

@Component({
  selector: 'app-sec-add-surveillance',
  templateUrl: './sec-add-surveillance.component.html',
  styleUrl: './sec-add-surveillance.component.css'
})
export class SecAddSurveillanceComponent implements OnInit {

  
  list_checked: any[] = [];
  enseignants: Teacher[] = [];
  modules: Module [] =[];
  classes: ClassRoom [] = [];
  salles: Salles [] = [];
  emplois!: Emplois;
  idUrl!: number;
  dates_check: any[] = [];
  isShow_add_jour: boolean = false;
  // permission: boolean = false;
  
seanceTypeOptions: { key: string, value: string }[] = [];
  
  datesWithDays: { day: string, date: string }[] = [];
  datesWithDaysTest: { day: string, dates: string[] }[] = [];

  form_seance!: FormGroup
  constructor(private emploisService: ServiceService, private root:ActivatedRoute,
    private enseignantService: EnseiService, private pageTitle: PageTitleService,
   private fb: FormBuilder, private classService: ClassStudentService, public icons: IconsService
  , private seanceService: SeancService, private salleService: SalleService){}

  ngOnInit(): void {
      this.load_form();
      this.getStatusOptions();
      this.load_enseignants();
      this.load_classe();
      this.load_salles();
      this.loadModulesByClass();
      this.getEmploi()
      
  }
  // ------------------------load form

  load_form(){
    // this.seanceTypeOptions = this.getStatusOptions();
    this.form_seance = this.fb.group({
      heureDebut: ['',Validators.required],
      heureFin: ['',Validators.required],
      idEmplois: [''],
      idSalle: ['', Validators.required],
      idTeacher: ['', Validators.required],
      date: [""],
      idModule: ['', Validators.required],
      jour: [""],
      idClasse: [''],
      seanceType: ['', Validators.required]
    });
  }

   // -----------------------------------load all enseignants
   load_enseignants(){
    this.enseignantService.getAll().subscribe((data: Teacher[]) => {
      this.enseignants = data;
      // console.log(this.enseignants, "enseignants");
    })
  }

  // ----------------------load class-room
  load_classe(){
    this.classService.getAllCurrentClassOfYear().subscribe(data =>{
      this.classes = data;
      // console.log(this.classes, "classes")
    })
  }
  // --------------------------load salle
  load_salles(){
    this.salleService.getAll().subscribe(data =>{
      this.salles = data;
      // console.log(this.salles, "sales")
    })
  }

  // --------------------------------------form to create seance
 
  create_seance() {

    let list_seances: Seances[] = []; 
    let lis_config: Configure_seance [] =[]

    const formData = this.form_seance.value;
    const idModule: Module = this.modules.find(mod => mod.id === +formData.idModule)!;
    const idTeacher: Teacher = this.enseignants.find(t => t.idEnseignant === +formData.idTeacher)!;
    const idSalle: Salles = this.salles.find(s => s.id == +formData.idSalle)!;

   

    // Vérifiez si dates_check contient des dates
    if (this.dates_check && this.dates_check.length > 0) {
        this.dates_check.forEach(date => {
          // const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
            // Création de l'objet Séance à partir des données du formulaire pour chaque date
            const seance: Seances = {
                heureDebut: formData.heureDebut,
                heureFin: formData.heureFin,
                date: date.date,
                idEmplois: this.emplois,
                idModule: idModule,
            };
            list_seances.push(seance);

             // config seance to surveillance
            const config : Configure_seance ={
              idParticipant: null!,
              heureDebut: formData.heureDebut,
              heureFin: formData.heureFin,
              seanceType: formData.seanceType,
              idTeacher: idTeacher,
              idSalle: idSalle
              
            }
            lis_config.push(config);
        });
      }

    if (this.form_seance.valid) {
       const surveillance : Surveillance ={
          seancesList: list_seances,
          configList: lis_config
        }

        this.seanceService.addSurveillance(surveillance).subscribe({
          next: (response) => {
            this.pageTitle.showSuccessToast(response.message)
            this.form_seance.reset();
            this.load_classe();
            this.load_classe();
            this.load_salles();
            this.load_enseignants();
            this.load_form();
          },
          error: (erreur) => {
            this.pageTitle.showErrorToast(erreur.error.message)
          }

        })
      }else{
      // Marquer tous les champs comme touchés pour afficher les messages d'erreur
      this.form_seance.markAllAsTouched();
      console.log("Le formulaire n'est pas valide", this.form_seance.value);
    }
  }

  // ------------------------------load emplois with seance
  getEmploi(){
    this.emploisService.getEmploisByClasse2(this.idUrl).subscribe(data  =>{
      this.emplois = data;
      const dateDebut = this.emplois.dateDebut;
      const dateFin = this.emplois.dateFin;
      console.log(this.emplois, "emplois trouver");
      this.form_seance.get('idEmplois')?.setValue(this.emplois.id);
      // this.datesWithDaysTest = this.emploisService.getDaysBetweenDatesTest(dateDebut, dateFin)
      this.datesWithDays = this.emploisService.getDaysBetweenDates(dateDebut, dateFin)
      this.datesWithDays.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      this.sortSeancesByDay()
    
    })
    
  }

  // ------------ modules of classe
  loadModulesByClass() {
    this.root.queryParams.subscribe(param=>{
      this.idUrl = +param['id']
    })
     this.classService.getAllModules(this.idUrl).subscribe((data: Module[]) => {
      this.modules = data;
      // console.log(this.modules,"modules");
    
      })
     
  }

  // ----------------------------get automatic date 
  getSeance_date(date : string, moreSelect: any){

    if(moreSelect.length == 0 ){
      this.form_seance.get('date')?.setValue(date)

    }else{
      this.form_seance.get('date')?.setValue('')
    }
  }
  // -----------------all date is checked
  hasChecked(checked : any[]){
   if(checked.length > 0){
    this.dates_check = checked;
    this.isShow_add_jour = false
   }
  }
  // ----------------close modal
  closeModal(){
    this.isShow_add_jour = false
  }
  // -------------------------
  onMention_Select(){
    this.isShow_add_jour =! this.isShow_add_jour
  }

  day_check(date : string, event: any){
    const day_find = this.datesWithDays.find(d => d.date === date);

    this.getSeance_date(day_find?.date!, this.list_checked);

    if (day_find) {
      if (event.target.checked) {
        if (!this.list_checked.some(lc => lc.date === date)) {
          this.list_checked.push(day_find);
        }
      } else {
        this.list_checked = this.list_checked.filter(lc => lc.date !== day_find.date);
      }
      console.log(this.list_checked, event.target.checked ? "checked" : "unchecked");
    }
  }
// -----------------select all ues
selectAll(event : any){
  if (event.target.checked) {
    this.list_checked = [...this.datesWithDays];
    this.getSeance_date('', this.list_checked);
  } else {
    this.list_checked = [];
  }
  console.log(this.list_checked, event.target.checked ? "tous checked" : "tous unchecked");

}
  is_checked(date: string): boolean {
    return this.list_checked.some(lc => lc.date === date);
  }

  areAllChecked(): boolean {
    return this.list_checked.length === this.datesWithDays.length;
  }

  getStatusOptions() {
    const objet = Object.keys(type_seance).map(key => ({
      
      key: key,
      value: type_seance[key as keyof typeof type_seance] 
    }));
    objet.forEach(o => {
      if(o.value == type_seance.SESSION || o.value == type_seance.Examen ){
        this.seanceTypeOptions.push(o)
      }
    })
  }
  sortSeancesByDay() {
    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
 
   // Trier les séances par jour en utilisant l'ordre défini dans daysOfWeek
   this.datesWithDays.sort((a, b) => {
     const dayIndexA = daysOfWeek.indexOf(a.day!);
     const dayIndexB = daysOfWeek.indexOf(b.day!);
     
     return dayIndexA - dayIndexB;
   });
 }
  goBack(){
    window.history.back();
  }
}
