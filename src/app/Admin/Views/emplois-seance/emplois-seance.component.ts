import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Emplois } from '../../Models/Emplois';
import { ServiceService } from '../../../DER/emplois-du-temps/service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { Module } from '../../Models/Module';

import { IconsService } from '../../../Services/icons.service';
import { Teacher, teacherConfigureDto } from '../../Models/Teachers';
import { type_seance } from '../../Models/Seances';
import { EnseiService } from '../enseignant/ensei.service';
import { SeancService } from './seanc.service';
import { ClassRoom } from '../../Models/Classe';
import { ToastrService } from 'ngx-toastr';
import { EtudeService } from '../etudiants/etude.service';
import { Student_group } from '../../Models/Students';
import { Journee, JourneeDTO } from '../../Models/Configure_seance';

import jspdf, { jsPDF } from 'jspdf';  
import html2canvas from 'html2canvas';
import { Salles } from '../../Models/Salles';
import { PageTitleService } from '../../../Services/page-title.service';
import { Admin } from '../../Models/Admin';

@Component({
  selector: 'app-emplois-seance',
  templateUrl: './emplois-seance.component.html',
  styleUrl: './emplois-seance.component.css'
})
export class EmploisSeanceComponent  implements OnInit{
    idUrl!: number;
    classId!: ClassRoom
    emplois?: Emplois;
    hasDeleted! : Journee
    admin!: Admin
    scolarite!: Admin
    idEmplois!: number;
    selected_seance_heure_fin! : any
    form_seance! : FormGroup;
    typeSeance!: string[]
    update_seance_form!: FormGroup

    
    modules: Module[] = [];
    group!: string;
    journee : Journee[] = [];
    empModule : Module[] = [];
    enseignants: Teacher[] =[];
    
    seanceTypeOptions: { key: string, value: string }[] = []
    palageHoraires: string[] =['08H00 - 10H00', '10H00 - 12H00', '12H00 - 14H00', '14H00 - 16H00', '16H00 - 18H00']


    datesWithDays: { day: string, date: string ,dateDay?: string}[] = [];
    // teachersProgram: { teacher: Teacher, group: string, typeSeance: type_seance[]}[] = [];
    listSalle: { salle: Salles, typeSeance: type_seance[],group: Student_group[] }[] = [];
    // sallesListe: { typeSeance: type_seance ,salle: Salles[], group: Student_group[] }[] = [];
    test : { id: string, seanceType: string, module: string, groupe : string,date: string, heureDebut: string, heureFin: string,plageHoraire : string, nomTeacher: string, prenomTeacher: string }[] = [];
    journeeDTO : JourneeDTO [] = []
    teacherConf : teacherConfigureDto [] = []
    deleted_modal: boolean = false;
    pause_midi: string [] = [];
    permission: boolean = false
    is_show_button : boolean = false
    is_show_configure: boolean = false;
    choisir_group: boolean = false;
    formattedDate!: string;
  


    constructor(private emploisService: ServiceService, public icons: IconsService, private toastr: ToastrService,
       private enseignantService: EnseiService,private cdr: ChangeDetectorRef, private router: Router, private studentService: EtudeService,
      private fb: FormBuilder, private pageTitle: PageTitleService,private route: ActivatedRoute, private classService: ClassStudentService,private seanceService: SeancService ) { }
    ngOnInit(): void {
      // ------------------------------get id in url path
      this.loadEmploisByClass();
      this.getMonth();
      this.load_enseignants();
      this.load_update_form();
      this.getPermission();
      this.getStatusOptions();
      

    }
   
    // ---------------------------------get permission
    getPermission(): boolean {
      const autorize = sessionStorage.getItem('der');
      const scolarite = sessionStorage.getItem('secretaire');
      this.scolarite = JSON.parse(scolarite!);
      this.admin = JSON.parse(autorize!);
      if(autorize){
        this.permission = true
        // console.log(autorize,"autorize")
        return true;
      }
      return false
    }
    // ---------------------------go back button 
    goBack(){
      window.history.back()
    }
   
// ----------------------get id in url path
    loadEmploisByClass() : void{
      this.route.queryParams.subscribe(param =>{
        // console.log(param["id"],"param")
        this.idUrl = +param['id'];
        // console.log(this.idUrl,"id emplois");

          this.emploisService.getEmploisByClasse2(this.idUrl).subscribe(data  =>{
            this.emplois = data;
            // console.log(this.emplois,"emplois");
            const dateDebut = this.emplois.dateDebut;
            const dateFin = this.emplois.dateFin;
            // this.datesWithDaysTest = this.emploisService.getDaysBetweenDatesTest(dateDebut, dateFin)
            // this.datesWithDaysTest.pop();
            this.datesWithDays = this.emploisService.getDaysBetweenDatesAndDaysDate(dateDebut, dateFin)
            this.datesWithDays.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            this.sortDay();
            // console.log(this.datesWithDays, "yuuuuuuuuuuuuuuuuu")
            // this.getAllSeance(this.emplois.id!);
            this.getTeacherConf(this.emplois.id!)
            this.load_configure(this.emplois.id!);
            this.loadModulesByClass(this.idUrl);
          })
        })
       
    }

    load_configure(idEmploi: number){
      this.seanceService.getAllByEmploisId(idEmploi).subscribe(data =>{
        console.log(data, "journee ------------")
        data.forEach(dat => {
          // const seance = dat.idSeance
        if(!this.journee.some(cf =>cf.plageHoraire == dat.plageHoraire && dat!.id == cf!.id) ){
            // console.log(dat, "dat")
           dat.plageHoraire = this.formatTimeString(dat.plageHoraire!)
          //  console.log(dat.plageHoraire, "journee")
          if (dat.seanceType.toString() === 'td') {
            if (!dat.groupe) {
                dat.groupe = [];
            }
            dat.groupe.push(dat.idParticipant!);
            console.log(dat.groupe, "--------------grp")
          }
            this.journee.push(dat)

        }
           
           const existingSalle = this.listSalle.find(sl => sl.salle.id ==dat.idSalle.id);
          //  console.log(existingSalle, "salle exist")
          if (existingSalle) {
              // Si la salle existe déjà, ajouter le type de séance s'il n'est pas déjà présent
            if (!existingSalle.typeSeance.includes(dat.seanceType) && existingSalle.group.includes(dat.idParticipant?.idStudentGroup!)) {
                existingSalle.group.push(dat.idParticipant?.idStudentGroup!);
                existingSalle.typeSeance.push(dat.seanceType);
            }
          } else {
              // Si la salle n'existe pas encore dans listSalle, l'ajouter avec le type de séance
            this.listSalle.push({
                salle: dat?.idSalle!,
                typeSeance: [dat.seanceType],
                group: [dat.idParticipant?.idStudentGroup!]
            });
          }
          
        })
        this.journee.forEach(jrn =>{
          let index = this.test.findIndex(e => ( e.module == jrn.idEmplois.idModule.nomModule) && 
          e.date == jrn.date.toString() && e.heureDebut == jrn.heureDebut && e.heureFin == jrn.heureFin
          && e.seanceType == jrn.seanceType.toString());
          if(index > -1)
            this.test[index].groupe = `${this.test[index].groupe} - ${jrn.idParticipant?.idStudentGroup.nom}`;
            // this.test[index].nomTeacher = `${jrn.idTeacher.nom}`;
          else
            this.test.push({
          id: jrn.id?.toString()!,
          seanceType: jrn.seanceType.toString(),
          module: jrn.idEmplois.idModule.nomModule, 
          groupe: jrn.idParticipant ? jrn.idParticipant!.idStudentGroup.nom : '',
          date: jrn.date.toString(), 
          heureDebut: jrn.heureDebut, 
          prenomTeacher: jrn.idTeacher.prenom,
          
          heureFin: jrn.heureFin, plageHoraire: jrn.plageHoraire!,
        nomTeacher: jrn.idTeacher.nom})
        })

       
      })
    }

    formatTimeString(timeString: string | string[]): string {
      if (Array.isArray(timeString)) {
        // Si `timeString` est un tableau, traiter chaque élément individuellement
        return timeString.map(time => this.formatTimeString(time)).join(' - ');
      }
    
      // console.log(timeString.replace(/(\d{2})(:)/g, '$1H'), "plage hhhhhhhhhhhh")
      // Remplace les ":" par "H" pour le formatage en français
      return timeString.replace(/(\d{2})(:)/g, '$1H');
    }
    
  // ---------------------get current date
    getCurrentDate() : string{
      const date = new Date();
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long',  year: 'numeric'};
      
      // console.log(Intl.DateTimeFormat('fr-FR', options).format(date))
      return new Intl.DateTimeFormat('fr-FR', options).format(date);
    }
    // -------------------- get day for date
    getDayFromDate(date: string): string {
      const dateObject = new Date(date);
      
      const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
      // console.log(Intl.DateTimeFormat('fr-FR', options).format(dateObject))
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
 

  // -------------------------editer les seance
  to_show_button(){
    this.is_show_button =!this.is_show_button;
   
  }

  // ----------------------to list of student group
  go_toList(idEmploi: number){
    const navigationExtras : NavigationExtras ={
      queryParams: {
        id : idEmploi
      },
     
    }
    this.router.navigate(['/der/liste-groupe'], navigationExtras)
  }
  to_configure() : void{
    const navigationExtras : NavigationExtras ={
      queryParams: {
        id : this.idUrl
      },
     
    }
    if(this.permission){
      
    this.router.navigate(['/der/affect-t-d'], navigationExtras)
    }else{
      this.router.navigate(['/secretaire/affect-t-d'], navigationExtras)
    }
     
 
  }
  show_configure(){
    this.is_show_configure = false;
    this.loadEmploisByClass();
  }

  getStatusOptions() {
      const objet = Object.keys(type_seance).map(key => ({
        
        key: key,
        value: type_seance[key as keyof typeof type_seance] 
      }));
      objet.forEach(o => {
        if(o.value != type_seance.SESSION && o.value != type_seance.Examen ){
          this.seanceTypeOptions.push(o)
        }
      })
    }

// -----------------------------------------update seance
  show_update_seance(idSeance: string){
    const navigationExtras: NavigationExtras = {
      queryParams: {id : +idSeance}
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
    this.hasDeleted =  this.journee.find(s =>s.heureFin == heureFin && s.heureDebut == heureDebut)!;
 
    this.deleted_modal =! this.deleted_modal
  }
  deleted(seance: Journee){ 
  this.seanceService.delete(seance.id!).subscribe(
  {
    next : (resp) =>{
      console.log(resp, "data");
      this.pageTitle.showSuccessToast(resp.message)
      this.deleted_modal = false
    },
    error : (erreur) =>{
      this.pageTitle.showErrorToast(erreur.error.message);
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
  to_groupe(idClasse: number, idEmploi: number){
    // 
    // return
    const navigationExtras : NavigationExtras ={
      queryParams: {
        id : idClasse, 
        idEmploi:  idEmploi
      }
    }
    this.router.navigate(['/der/group-student'], navigationExtras)
  }
 
    // ------------------trie les seances par jours
    sortDay() {
      const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  
    // Trier les séances par jour en utilisant l'ordre défini dans daysOfWeek
    this.datesWithDays.sort((a, b) => {
      const dayIndexA = daysOfWeek.indexOf(a.day!);
      const dayIndexB = daysOfWeek.indexOf(b.day!);
      
      return dayIndexA - dayIndexB;
    });
    }
  // ----------------------------------------------exit delete modal
  close_delete_modal(){
    this.deleted_modal = false;
    this.choisir_group = false
  }
  


  // --------------------------------------button to imprime
  imprimer() { 
    const buttonBack = document.getElementById('back') as HTMLElement;
    buttonBack.style.display = "none";
    const buttonContent = document.getElementById('idContent') as HTMLElement;
    buttonContent.style.display = "none";
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
        buttonBack.style.display = "block";
        buttonContent.style.display = "block";
        data.style.padding = '0px'
    });
  } 
  // ------------------------------get double of each configure seance
  filteredJournee(jList: Journee[]) : Journee[]{
    return jList.filter(j => j.seanceType)
  }

   // -------------get teacher configuration he is class and groupe
   getTeacherConf(idEmploi: number){
    this.seanceService.get_teacher_configuration(idEmploi).subscribe(data=>{
      data.forEach(d =>{
         if(!this.teacherConf.some(tc => tc.id == d.id)){
           this.teacherConf.push(d)
          
           if(d.groupe !== null)
            this.group = d.groupe

         }else{
          this.group = ""
         }

      })  
     
      console.log(this.teacherConf, "teacher conf")
    })
  }

}
