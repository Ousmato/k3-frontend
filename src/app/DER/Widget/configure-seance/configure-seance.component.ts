import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Seances, type_seance } from '../../../Admin/Models/Seances';
import { ServiceService } from '../../emplois-du-temps/service.service';
import { SeancService } from '../../../Admin/Views/emplois-seance/seanc.service';
import { Emplois } from '../../../Admin/Models/Emplois';
import { Configure_seance, Journee } from '../../../Admin/Models/Configure_seance';
import { PageTitleService } from '../../../Services/page-title.service';
import { Participant, Student_group } from '../../../Admin/Models/Students';
import { EtudeService } from '../../../Admin/Views/etudiants/etude.service';
import { Teacher } from '../../../Admin/Models/Teachers';
import { Ue } from '../../../Admin/Models/UE';
import { EnseiService } from '../../../Admin/Views/enseignant/ensei.service';

@Component({
  selector: 'app-configure-seance',
  templateUrl: './configure-seance.component.html',
  styleUrl: './configure-seance.component.css'
})
export class ConfigureSeanceComponent  {

//   @Input() idEmplois!: number
//   @Input() configSeance: Configure_seance [] =[]
//   @Output() closeModal = new EventEmitter<any>();
//   @Output() close_Modal = new EventEmitter<any>();

//   groupes: Student_group [] = [];
//   seances: Journee [] = [];
//   seance_type: string[] = [];
//   emplois!: Emplois;
//   ues: Ue [] = []
//   plageHoraire: string[]= [];
//   plage!: string;
//   enseignants: Teacher [] =[]
//   list_checked: string[] =[]
//   list_enseignant_checked: Teacher [] =[]
//   listParticip_checked: Participant[]=[]
//   is_show_plag: boolean = false
//   is_show_group: boolean = false
//   seanceType: string = '';
//   config?: Configure_seance |undefined
//   is_contenair_teachers: boolean = false
//   is_select_teachers: boolean = false
  
//   datesWithDays: { day: string, date: string }[] = [];
//   datesWithDaysTest: { day: string, dates: string[] }[] = [];
//   pause_matin: string [] = [];
//   pause_midi: string [] = [];
//   seanceTypeOptions: { key: string, value: string }[] = []
//   form_configure!: FormGroup
//   participants: Participant [] = []

//   constructor(private fb: FormBuilder, private teacherService: EnseiService, private pageTitle: PageTitleService, private studentService: EtudeService,
//     private seanceService: SeancService, private emploisService: ServiceService ) { }

//   ngOnInit(): void {
//     this.load_form();
//     this.loadEmploisByClass();
//     this.getStatusOptions();
//   }

//   // ---------------load form
//   load_form(){
//     this.seance_type = Object.values(type_seance);
//     this.form_configure = this.fb.group({
//       idSeance: ['',[Validators.required]],
//       idParticipant: ['',[Validators.required]],
//       seanceType: ['', Validators.required], 
//       idTeacher: ['', Validators.required]
//     });
//   }

//    formatTimeCorrectly(timeString: string): string {
//     const [hours, minutes] = timeString.split(':');
//     return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
//   }

//   add_configure(){
//     const formData = this.form_configure.value
//     let plage : Configure_seance[]=[];

//     this.list_checked.forEach(checked =>{
//       let heureDebut = this.removeHFromTimeString(checked.slice(0, 6));
//       let heureFin = this.removeHFromTimeString(checked.slice(9));
//       heureDebut = this.formatTimeCorrectly(heureDebut)
//        heureFin = this.formatTimeCorrectly(heureFin)

//       const idTeacher = this.enseignants.find(en =>en.idEnseignant == formData.idTeacher);
//       const seance =  this.seances.find(s =>s.id == +formData.idSeance);
//       const idParticipant =  this.participants.find(s =>s.id == +formData.idParticipant);

//       const config_seance: Configure_seance ={
//         idSeance: seance!,
//         idParticipant: idParticipant!,
//         seanceType: formData.seanceType,
//         heureDebut: heureDebut,
//         heureFin: heureFin,
//         idTeacher: idTeacher!,
//         idSalle: this.config?.idSalle!
//       }
//       plage.push(config_seance)
//     })
      
//       console.log(plage, "confi")
//       // return
//       this.seanceService.addConfigureSeance(plage).subscribe({
//         next: (response) =>{
//           this.pageTitle.showSuccessToast(response.message);
          
//           this.form_configure.reset();
//           this.load_form();
//           this.loadEmploisByClass();
//           this.closeModal.emit();
//         },
//         error: (erreur) =>{
//           this.pageTitle.showErrorToast(erreur.error.message);
//         }
        
//       })
   
//   }
//   // -------------------------------loadEmplois
//   loadEmploisByClass() : void{
//     this.emploisService.getEmploisByClasse2(this.idEmplois).subscribe(data  =>{
//       this.emplois = data;
//       const dateDebut = this.emplois.dateDebut;
//       const dateFin = this.emplois.dateFin;
//       this.datesWithDays = this.emploisService.getDaysBetweenDates(dateDebut, dateFin)
//       this.datesWithDays.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())

//       this.getAllSeance(this.emplois.id!);
//       this.load_participation_by_classe(this.emplois.idClasse.id!)
      
//     })
//   }
//   // -----------------------load seance by id emplois
//   getAllSeance(idEmplois : number){
//     this.seanceService.getAllByEmploisId(idEmplois).subscribe((data: Journee[]) => {
      
//       this.journee = data;
//       data.forEach(result => {
//           if(!this.ues.some(u=>u.id == result.idModule.idUe.id)){
//              this.ues.push(result.idModule.idUe);
//           }
          
//         })
//         this.ues.forEach(ue =>{
//           this.getAllTeacherByIdUe(ue.id!);
//         })
      
//       this.seances.forEach(seance => {
//         this.datesWithDays.forEach(dwd =>{
//           if(seance.date?.toString() === dwd.date){
//             seance.jour = dwd.day;
           
//           } 
         
//         })
//         const date = new Date()
//         const pauseMidi = seance.pause_midi?.toString().slice(0,5);

//         if (pauseMidi) {
//           const [hours, minutes] = pauseMidi.split(':').map(Number);
//             const hpause = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
//             hpause.setHours(hpause.getHours() + 2);
//             const pause_midi_fin = hpause.toTimeString().split(' ')[0]; // Format HH:mm:ss
//             const timePair = `${pauseMidi} - ${pause_midi_fin}`;
//             if (!this.pause_midi.includes(timePair)) {
//               this.pause_midi.push(timePair);
//             }
//         }

//        seance.heureDebut = seance.heureDebut.slice(0, 5); // Garder les 5 premiers caractères (HH:mm)
//         seance.heureFin = seance.heureFin.slice(0, 5); 
       
//       });
      
//       this.sortSeancesByDay()
//     })
//   }
// // ------------------trie les seances par jours
//   sortSeancesByDay() {
//      const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  
//     // Trier les séances par jour en utilisant l'ordre défini dans daysOfWeek
//     this.seances.sort((a, b) => {
//       const dayIndexA = daysOfWeek.indexOf(a.jour!);
//       const dayIndexB = daysOfWeek.indexOf(b.jour!);
      
//       return dayIndexA - dayIndexB;
//     });
//   }
//   // ---------------------close modal
//   close(){
//     this.closeModal.emit();
//   }

//   getStatusOptions() {
//     const objet = Object.keys(type_seance).map(key => ({
      
//       key: key,
//       value: type_seance[key as keyof typeof type_seance] 
//     }));
//     objet.forEach(o => {
//       if(o.value != type_seance.SESSION && o.value != type_seance.Examen ){
//         this.seanceTypeOptions.push(o)
//       }
//     })
//   }
//   // --------------------on seance select
//   onSelect(event: any) {
//     this.is_show_plag = true;
//     this.config = undefined
//     const seance = this.seances.find(s => s.id == +event.target.value);

//     if (seance) {
//         // Assurez-vous que `seance.plageHoraire` est défini avant de le manipuler
//         if (seance.plageHoraire) {
//             seance.plageHoraire = seance.plageHoraire.map(sp => this.formatTimeString(sp));
//         } 

//         // Crée une copie de la liste des plages horaires de la séance après formatage
//         let updatedPlageHoraire = [...(seance.plageHoraire || [])];
//         console.log(updatedPlageHoraire, "updat horaire")
//         this.configSeance.forEach(cf => {
//             if (cf.idSeance && cf.idSeance.id == seance.id) {
//               console.log(cf, "cf")
//                 this.seanceService.get_all_configSeance_by_id(cf.id!).subscribe(result => {
//                     if (result.plageHoraire) {
//                         result.plageHoraire = this.formatTimeString(result.plageHoraire);
//                         this.config = result;
//                         console.log(this.config, "----config");
//                     } else {
//                         result.plageHoraire  = ''
//                     }
//                 });
//             }
//         });
//          const ignoredPlage = this.formatTimeString('12:00 - 14:00');
//       updatedPlageHoraire = updatedPlageHoraire.filter(plage => plage !== ignoredPlage);
    
//       this.plageHoraire = updatedPlageHoraire;
//     }
//     } 


     
    

//   isHighlighted(item: string): boolean {
//      // Vérifiez si `this.config` et `this.config.plageHoraire` sont définis
//      if (this.config && this.config.plageHoraire) {
//       // Retourne vrai si `item` est inclus dans `this.config.plageHoraire`
//       return this.config.plageHoraire.includes(item);
//   }
//   // Retourne faux si `this.config` ou `this.config.plageHoraire` n'est pas défini
//   return false;
// }
//     //--------------------------------select type 
//     // typeSelect(event: any){
//     //   this.seanceType = ''
//     //   const value = event.target.value;
//     //   const conl = type_seance.CM
      
//     //   if(value == type_seance.TD.toString()){
//     //     this.seanceType = value
        
//     //     this.is_contenair_teachers = true
//     //     this.is_select_teachers = false
//     //   }
//     //     // this.seanceType == type_seance.CM.toString() || this.seanceType == type_seance.TP.toString();
//     //     if(value == type_seance.CM.toString() || value == type_seance.TP.toString()){
//     //        this.is_select_teachers = true
//     //        this.is_contenair_teachers = false
//     //         console.log(this.is_select_teachers, "999999")
      
//     //     }
       
      
//     //   console.log(value, "value select")
      
//     // }

//     // -----------------------
  
// // ----------------------insert H in plage horaire to compare
//   formatTimeString(timeString: string): string {
//     return timeString.replace(/(\d{2})(:)/g, '$1H$2');
//   }

//   // -----------------------remove H in plage
//   removeHFromTimeString(timeString: string): string {
//     return timeString.replace(/H/g, ''); // Remplace le "H" par rien
//   }

//    // -------------------------------load all participation by idEmploi
//    load_participation_by_classe(idClass: number){
//     this.studentService.getParticipantsByEmploiId(idClass).subscribe((data) => {
//       data.forEach(part =>{
//         if(!this.participants.some(d=>d.idStudentGroup.id == part.idStudentGroup.id)){
//         this.participants.push(part)
//       }
//       })
      
//       console.log(this.participants, "participations");
//     })
//   }
//   // -------------------------check plag horaire
//   student_check(item : string, event: any){
//     const student_fund = this.plageHoraire.find(p => p === item);

//     if (student_fund) {
//       if (event.target.checked) {
//         if (!this.list_checked.some(pl => pl === item)) {
//           this.list_checked.push(student_fund);
//         }
//       } else {
//         this.list_checked = this.list_checked.filter(st => st!== student_fund);
//       }
//       console.log(this.list_checked, event.target.checked ? "checked" : "unchecked");
//     }
//   }
//   // -------------------------check teachers
//   // teacher_check(idTeacher : number, event: any){
//   //   const teacher_fund = this.enseignants.find(t => t.idEnseignant === idTeacher);

//   //   if (teacher_fund) {
//   //     if (event.target.checked) {
//   //       if (!this.list_enseignant_checked.some(teacher => teacher.idEnseignant === idTeacher)) {
//   //         this.list_enseignant_checked.push(teacher_fund);
//   //       }
//   //     } else {
//   //       this.list_enseignant_checked = this.list_enseignant_checked.filter(tck => tck !== teacher_fund);
//   //     }
//   //     console.log(this.list_enseignant_checked, event.target.checked ? "checked" : "unchecked");
//   //   }
//   // }
//   // -------------------------check plag horaire
//   // group_check(idParticip : number, event: any){
//   //   const part_fund = this.participants.find(p => p.id === idParticip);

//   //   if (part_fund) {
//   //     if (event.target.checked) {
//   //       if (!this.listParticip_checked.some(pl => pl.id === idParticip)) {
//   //         this.listParticip_checked.push(part_fund);
//   //       }
//   //     } else {
//   //       this.listParticip_checked = this.listParticip_checked.filter(st => st!== part_fund);
//   //     }
//   //     console.log(this.listParticip_checked, event.target.checked ? "checked" : "unchecked");
//   //   }
//   // }

//   is_checked(plag: string): boolean {
//     return this.list_checked.some(st => st === plag);
//   }
//   // is_Particip_checked(particpant: Participant): boolean {
//   //   return this.listParticip_checked.some(st => st === particpant);
//   // }
//   // is_Teacher_checked(teacher: Teacher): boolean {
//   //   return this.list_enseignant_checked.some(st => st === teacher);
//   // }

//   isGroup(){
//     this.is_show_group =! this.is_show_group
//   }
//   // ----------------------------get all teachers
//   getAllTeacherByIdUe(idUe: number){
//     this.teacherService.getAll_Teacher_By_IdUe(idUe).subscribe(result => {
//       this.enseignants = result;
//     })
//   }
}
