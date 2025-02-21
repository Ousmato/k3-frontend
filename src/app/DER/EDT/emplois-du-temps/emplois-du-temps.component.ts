import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Semestres } from '../../../Admin/Models/Semestre';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../../Services/icons.service';
import { SemestreService } from '../../../Services/semestre.service';
import { ClassRoom } from '../../../Admin/Models/Classe';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { Emplois } from '../Models/Emplois';
import { ClassModules } from '../../../Admin/Models/ClassModule';
import { ServiceService } from '../Services/service.service';
import { DatePipe, Location } from '@angular/common';
import { PageTitleService } from '../../../Services/page-title.service';
import { Module } from '../../../Admin/Models/Module';
import { Admin } from '../../../Admin/Models/Admin';
import { AdminUSER } from '../../../Admin/Models/Auth';

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
  admin!: Admin
  isShow: boolean = true;

  @Output() closeModale = new EventEmitter<any>()
  @Input() idClasse!: number
  current!: Semestres;
  EmploisAdd!: FormGroup;
  current_emplois!: Emplois;
  classeSelect!: ClassRoom;
  plageHoraire: string[] = []
  module_fund?: Module
  classRoom!: ClassRoom;
  classModule!: ClassModules;

  datesWithDays: { day: string, date: string }[] = [];
  formattedDateFin: any;
  //  -----------------------------------constructor
  constructor(
    public icon: IconsService, public icons: IconsService,
    private semestreService: SemestreService, private classService: ClassStudentService, private datePipe: DatePipe,
    private fb: FormBuilder, private emploisService: ServiceService, private pageTitle: PageTitleService, private location: Location) { }
  // -------------------------------------------ngOinit
  ngOnInit(): void {
    this.admin = AdminUSER()?.der
    this.loadSemestre()
    this.load_form();

    this.classService.getClassById(this.idClasse).subscribe(data => {
      this.classRoom = data
      console.log("classe :", this.classRoom);
    })
  }

  //get all semestre of classroom
  loadSemestre(){
    this.semestreService.getCurrentSemestresByIdNivFiliere(this.idClasse!).subscribe((response: Semestres[]) =>{
      response.forEach(sm =>{
        if(!this.semestre.some(s => s.id ==sm.id)){
          this.semestre.push(sm)
        }
      });
      console.log(this.semestre);
    })
  }
  load_form() {
    this.EmploisAdd = this.fb.group({
      idSemestre: ['', Validators.required],
      idClasse: [this.idClasse],
      idModule: ['', Validators.required],
      // seanceType: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [{ value: '', disabled: true }]
    })
  }
  goBack() {
    this.location.back();
  }
  loadModulesByClass(idClasse: number, idSemestre: number): void {
    this.classService.getAllModulesByClasseAndSemestre(idClasse, idSemestre).subscribe((data: Module[]) => {
      this.modules = data;
      console.log(this.modules, "modules");

    })

  }
  // --------------------------------add emplois
  addEmplois() {
    if (this.EmploisAdd.valid) {

      console.log("form valid")
      const formData = this.EmploisAdd.value;

      
      const module = this.modules.find(mod => mod.id == formData.idModule);
      // console.log("idSemestre", formData.idSemestrete)

      const semestre: Semestres = this.semestre.find(sm => sm.id == formData.idSemestre)!;
      const emplois: Emplois = {
        idSemestre: semestre,
        idModule: module!,
        dateDebut: formData.dateDebut,
        dateFin: this.formattedDateFin,
        idClasse: this.classRoom!,
        idAdmin: this.admin

      }
      // console.log("emplois", emplois)
      this.emploisService.addEmplois(emplois).subscribe({
        next: (result) => {
          this.pageTitle.showSuccessToast(result.message);
          this.EmploisAdd.reset();
          this.ngOnInit();
          this.isShow = false;
          this.closeModale.emit()

        },
        error: (err) => {
          this.pageTitle.showErrorToast(err.error.message);
        }
      })
    } else {
      this.EmploisAdd.markAllAsTouched();
      console.log(this.EmploisAdd.value);
    }
  }

  // // ------------------------------module select
  classSelect(event: any) {
    this.EmploisAdd.get("idSemestre")?.setValue("");
    this.EmploisAdd.get("idModule")?.setValue("");
    const idClasse = event.target.value; 

    // this.loadModulesByClass(idClasse);
   
     // ------------------------------------get all semestre
    
    this.isShow = true

  }
  check_date(event: any) {
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
    this.datesWithDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
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

  
  close(){
    this.closeModale.emit();
    this.isShow = false;
  }

  onSemestreSelect(event: any){
    console.log(event.target.value)
    const idSemestre = event.target.value.trim();
    
    console.log(idSemestre, "idSemestre")
    if (!idSemestre || isNaN(+idSemestre)) {
      console.error("idSemestre is not a valid number");
      return; // Sortir de la fonction si la valeur n'est pas valide
  }
    this.loadModulesByClass(this.idClasse!, +idSemestre);
  }
}
