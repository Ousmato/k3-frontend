import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Emplois } from '../Models/Emplois';
import { ServiceService } from '../Services/service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Module } from '../../../Admin/Models/Module';

import { IconsService } from '../../../Services/icons.service';
import { Teacher, teacherConfigureDto } from '../../../Admin/Models/Teachers';
import { type_seance } from '../Models/Seances';
import { EnseiService } from '../../../Admin/Views/Enseignant/ensei.service';
import { SeancService } from '../Services/seanc.service';
import { ToastrService } from 'ngx-toastr';
import { EtudeService } from '../../../Admin/Views/Etudiants/etude.service';
import { Student_group } from '../../../Admin/Models/Students';
import { Journee, JourneeDTO } from '../Models/Configure_seance';

import jspdf, { jsPDF } from 'jspdf';  
import html2canvas from 'html2canvas';
import { Salles } from '../../../Admin/Models/Salles';
import { PageTitleService } from '../../../Services/page-title.service';
import { Admin } from '../../../Admin/Models/Admin';
import { AdminUSER } from '../../../Admin/Models/Auth';
import { Class_shared } from '../../../DGA/class-students/Utils/Class-shared-methods';
import { EnumOptions } from '../Utils/emum-options';
import { Emploi_shared } from '../Utils/shareds-methods';
import { StudentSharedMethods } from '../../../Admin/Views/Etudiants/Utils/Student-shared-methode';
import { EmploisJsonExcel } from '../Utils/emplois-json-excel';

@Component({
  selector: 'app-emplois-seance',
  templateUrl: './emplois-seance.component.html',
  styleUrl: './emplois-seance.component.css'
})
export class EmploisSeanceComponent  implements OnInit{
    idUrl!: number;
    classId!: number
    emplois?: Emplois;
    hasDeleted! : Journee
    journeeSelect! : Journee | null
    admin!: Admin
    scolarite!: Admin
    secretaire!: Admin; 
    idEmplois!: number;
    selected_seance_heure_fin! : any
    form_seance! : FormGroup;
    typeSeance!: string[]
    update_seance_form!: FormGroup

    
    // modules: Module[] = [];
    group!: string;
    journee : Journee[] = [];
    empModule : Module[] = [];
    // enseignants: Teacher[] =[];
    
    // seanceTypeOptions: { key: string, value: string }[] = []
    palageHoraires: string[] =['08H00 - 10H00', '10H00 - 12H00', '12H00 - 14H00', '14H00 - 16H00', '16H00 - 18H00']


    datesWithDays: { day: string, date: string ,dateDay?: string}[] = [];
    // teachersProgram: { teacher: Teacher, group: string, typeSeance: type_seance[]}[] = [];
    listSalle: { salle: Salles, typeSeance: type_seance[],group: Student_group[] }[] = [];
    // sallesListe: { typeSeance: type_seance ,salle: Salles[], group: Student_group[] }[] = [];
    test : { id: string, seanceType: string, module: string, groupe : string,date: string, heureDebut: string, heureFin: string,plageHoraire : string, nomTeacher: string, prenomTeacher: string }[] = [];
    // journeeDTO : JourneeDTO [] = []
    teacherConf : teacherConfigureDto [] = []
    deleted_modal: boolean = false;
    pause_midi: string [] = [];
    permission: boolean = false
    is_show_button : boolean = false
    is_show_configure: boolean = false;
    choisir_group: boolean = false;
    
    ec: string = '&';
  


    constructor(private emploisService: ServiceService, public icons: IconsService, public share_methode: Class_shared,
       private emploiExcel: EmploisJsonExcel,public enum_options: EnumOptions, private router: Router, public student_shared: StudentSharedMethods,
      private fb: FormBuilder, private pageTitle: PageTitleService,private route: ActivatedRoute, public emplois_shared: Emploi_shared,private seanceService: SeancService ) { }
    ngOnInit(): void {
      // ------------------------------get id in url path
      this.loadEmploisByClass();
      this.emplois_shared.getMonth();
      // this.load_enseignants();
      this.getPermission();
      
      this.secretaire = AdminUSER()?.secretaire

    }
   
    // ---------------------------------get permission
    getPermission(): boolean {
      this.scolarite = AdminUSER()?.scolarite;

      this.admin = AdminUSER()?.der;
      if(this.admin){
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
            this.emplois_shared.sortDay(this.datesWithDays);
            // console.log(this.datesWithDays, "yuuuuuuuuuuuuuuuuu")
            // this.getAllSeance(this.emplois.id!);
            this.getTeacherConf(this.emplois.id!)
            this.load_configure(this.emplois.id!);
            this.idEmplois = this.emplois.id!            // this.loadModulesByClass(this.idUrl);
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
           dat.plageHoraire = this.emplois_shared.formatTimeString(dat.plageHoraire!)
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


    // -----------------------------------load all enseignants
    // load_enseignants(){
    //   this.enseignantService.getAll().subscribe((data: Teacher[]) => {
    //     this.enseignants = data;
    //     // console.log(this.enseignants, "enseignants");
    //   })
    // }

  //editer les seance
  to_show_button(){
    this.is_show_button =!this.is_show_button;
   
  }

  // to list of student group
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
  //update seance
  show_update_seance(date: string){
    this.journeeSelect = this.journee.find(j => j.date.toString() == date)!;
    console.log(this.journeeSelect, "journee select")
  }
  exit(){
    this.journeeSelect = null;
    this.datesWithDays = []
    this.test = []
    this.journee = []
    this.loadEmploisByClass()
  }
  // -------------------------------------------deleted seance
  show_comfirme_delete(date: string){
    this.hasDeleted =  this.journee.find(j =>j.date.toString() == date)!;
 
    this.deleted_modal =! this.deleted_modal
  }
  deleted(seance: Journee){ 
  this.seanceService.delete(seance.id!).subscribe(
  {
    next : (resp) =>{
      console.log(resp, "data");
      this.pageTitle.showSuccessToast(resp.message)
      this.deleted_modal = false
      this.loadEmploisByClass()
    },
    error : (erreur) =>{
      this.pageTitle.showErrorToast(erreur.error.message);
      // console.log(erreur.error.message, "erreur");
    }
  })
  
  }
  // ------------------------------------------
  to_groupe(idClasse: number, idEmploi: number, idAnnee: number){
    // 
    console.log(idAnnee, "idAnnee")
    // return
    const navigationExtras : NavigationExtras ={
      queryParams: {
        id : idClasse, 
        idEmploi:  idEmploi,
        idAnnee: idAnnee,
      }
    }
    this.router.navigate(['/der/group-student'], navigationExtras)
  }
  // ----------------------------------------------exit delete modal
  close_delete_modal(){
    this.deleted_modal = false;
    this.choisir_group = false
  }
  


  // button to imprime
  // imprimer() { 
  //   const buttonBack = document.getElementById('back') as HTMLElement;
  //   buttonBack.style.display = "none";
  //   const buttonContent = document.getElementById('idContent') as HTMLElement;
  //   buttonContent.style.display = "none";
  //   const logo = document.getElementById('logo') as HTMLElement;
  //   var data = document.getElementById('idTable') as HTMLElement;
  //   if(data){
  //       // Save current styles to restore them later
  //       const originalPadding = data.style.padding;
  //       const originalHeight = data.style.height;
  //       const originalOverflow = data.style.overflow;
    
  //       // Temporarily set styles to capture the entire scrollable area
  //       data.style.padding = '50px'; 
  //       data.style.height = 'auto';
  //       data.style.fontSize = '12px';
  //       data.style.overflow = 'visible'; 
  //       logo.style.display = 'block';
    
    
    
  //   // Id of the table
  //   html2canvas(data!, { scale: 2 }).then(canvas => {
  //       // Few necessary setting options
  //       let imgWidth = 297; // A4 landscape width in mm
  //       let imgHeight = (canvas.height * imgWidth) / canvas.width;
        
  //       const contentDataURL = canvas.toDataURL('image/png');
  //       let pdf = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
  //       let position = 0;
  //       pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //       pdf.save('emplois-du-temps.pdf');
  //       buttonBack.style.display = "block";
  //       buttonContent.style.display = "block";
  //       logo.style.display = "none";
  //       data.style.padding = originalPadding;
  //       data.style.height = originalHeight;
  //       data.style.overflow = originalOverflow;
  //   });
  // }
  // } 
  exportToExcel(){
    this.emploiExcel.exportAsExcelFile(this.test,  this.palageHoraires, this.datesWithDays, this.teacherConf, this.emplois!);
  }
  // ------------------------------get double of each configure seance
  filteredJournee(jList: Journee[]) : Journee[]{
    return jList.filter(j => j.seanceType)
  }

   // -------------get teacher configuration he is class and groupe
   getTeacherConf(idEmploi: number){
    this.seanceService.get_teacher_configuration(idEmploi).subscribe(data=>{
      data.forEach(d =>{

         if(!this.teacherConf.some(tc => tc.id == d.id ) ){
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

  // go to groupe
  goToGroupe(idGroup: number){
    console.log(this.idEmplois)
    const navigationExtras : NavigationExtras ={
      queryParams: {
        id : idGroup,
        idEmploi: this.idEmplois
      }
    }
    this.router.navigate(['/der/liste-groupe'], navigationExtras)
  }
  goToListStudent(idClasse: number, idEmploi: number) {
    console.log(this.idEmplois)
    const navigationExtras : NavigationExtras ={
      queryParams: {
        idClasse : idClasse,
        idEmploi: idEmploi
        
      }
    }
    this.router.navigate(['/der/liste-groupe'], navigationExtras)
  }

}
