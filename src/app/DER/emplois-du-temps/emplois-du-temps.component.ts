import { Component, OnInit } from '@angular/core';
import { Semestres } from '../../Admin/Models/Semestre';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../Services/icons.service';
import { SemestreService } from '../../Services/semestre.service';
import { ClassRoom } from '../../Admin/Models/Classe';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { Emplois } from '../../Admin/Models/Emplois';
import { ClassModules } from '../../Admin/Models/ClassModule';
import { ServiceService } from './service.service';
import { DatePipe, Location } from '@angular/common';
import { PageTitleService } from '../../Services/page-title.service';
import { Module } from '../../Admin/Models/Module';

@Component({
  selector: 'app-emplois-du-temps',
  templateUrl: './emplois-du-temps.component.html',
  styleUrl: './emplois-du-temps.component.css',
  providers: [DatePipe]
})
export class EmploisDuTempsComponent implements OnInit {
  semestre: Semestres[] = [];
  days: string[] = [];
  modules: Module[] = [];
  // currentEmploi?: DtoEmploi
  is_showJour: boolean = false;
  
 current!: Semestres ;
 EmploisAdd! : FormGroup;
 current_emplois!: Emplois;
 classRomId!: number;
 plageHoraire: string[] =[]
 module_fund?: Module
 classRoom: ClassRoom [] = [];
 classModule!: ClassModules;
 
datesWithDays: { day: string, date: string }[] = [];
 formattedDateFin: any;
//  -----------------------------------constructor
  constructor(
    public icon : IconsService, public icons: IconsService, 
    private semestreService: SemestreService, private classService: ClassStudentService, private datePipe: DatePipe,
    private fb: FormBuilder, private emploisService: ServiceService,private pageTitle: PageTitleService, private location: Location){}
  // -------------------------------------------ngOinit
    ngOnInit(): void {
      // this.getStatusOptions()
      this.load_form();
    
      this.classService.getAll().subscribe(data =>{
        this.classRoom = data;
        console.log("classe :", this.classRoom);
      })
    // ------------------------------------get all semestre
    this.semestreService.getAllSemestre().subscribe((response: Semestres[]) =>{
      this.semestre = response;
      console.log(this.semestre);
    })
  //  ---------------------------get list dates between dateDebut emplois and dateFin emplois
  
}

nouveau(){
  this.is_showJour =! this.is_showJour
}
// load form
load_form(){
  this.EmploisAdd = this.fb.group({
    idSemestre: ['',Validators.required],
    idClasse: ['',[Validators.required]],
    idModule: ['', Validators.required],
    // seanceType: ['', Validators.required],
    dateDebut: ['', Validators.required],
    dateFin: [{ value: '', disabled: true }]
  })
}
goBack(){
  this.location.back();
}
loadModulesByClass(idClasse: number) : void{
  this.classService.getAllModules(idClasse).subscribe((data: Module[]) => {
   this.modules = data;
   console.log(this.modules,"modules");
 
   })
  
}
  // --------------------------------add emplois
  addEmplois(){
    if (this.EmploisAdd.valid) {
      
      console.log("form valid")
      const formData = this.EmploisAdd.value;

      const classe = this.classRoom.find(cl => cl.id == formData.idClasse);
      const module = this.modules.find(mod => mod.id == formData.idModule);
      
      const semestre: Semestres = this.semestre.find(sm => sm.id === formData.idSemestre)!;
      const emplois : Emplois = {
        idSemestre: semestre,
        idModule: module!,
        dateDebut: formData.dateDebut,
        dateFin: this.formattedDateFin,
        idClasse: classe!,

      }
     this.emploisService.addEmplois(emplois).subscribe({
      next: (result) =>{
        this.pageTitle.showSuccessToast(result.message);
        this.EmploisAdd.reset();
        this.ngOnInit();
        this.is_showJour = false;

      },
      error: (err) =>{
        this.pageTitle.showErrorToast(err.error.message);
      }
     })
    }else{
      this.EmploisAdd.markAllAsTouched();
      console.log(this.EmploisAdd.value);
    }
  }
 
  // // ------------------------------module select
  moduleSelect(event: any){
    const idModule = event.target.value; // Récupérez la valeur brute
    console.log("Valeur brute sélectionnée :", idModule);
    
    const idModuleNumber = +idModule; // Convertissez en nombre
    console.log("Valeur convertie en nombre :", idModuleNumber);
  
    console.log(idModule, "idclasse")
    this.loadModulesByClass(idModule);
   
  }
  check_date(event: any){
    const dateDebu = event.target.value;

    const dateDebut = new Date(dateDebu!);
    console.log(dateDebut, "dateDebut")
    const dateFin = new Date(dateDebut);
    dateFin.setDate(dateDebut.getDate() + 5);
    this.formattedDateFin = this.datePipe.transform(dateFin, 'yyyy-MM-dd');
    
    this.EmploisAdd.get('dateFin')?.setValue(this.formattedDateFin);
    // console.log(this.EmploisAdd.value, this.formattedDateFin, "000000000000000")
    this.datesWithDays = this.emploisService.getDaysBetweenDates(dateDebu, this.formattedDateFin);
    // console.log(this.datesWithDays, "dates days component")
    this.datesWithDays.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    this.sortByDay()
    // this.is_showJour = true
  }
 
  sortByDay() {
    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  // Trier les séances par jour en utilisant l'ordre défini dans daysOfWeek
  this.datesWithDays.sort((a, b) => {
    const dayIndexA = daysOfWeek.indexOf(a.day!);
    const dayIndexB = daysOfWeek.indexOf(b.day!);
    
    return dayIndexA - dayIndexB;
  });
  }

}
