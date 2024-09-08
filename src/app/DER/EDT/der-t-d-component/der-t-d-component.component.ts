import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EnseiService } from '../../../Admin/Views/enseignant/ensei.service';
import { Teacher } from '../../../Admin/Models/Teachers';
import { Participant } from '../../../Admin/Models/Students';
import { EtudeService } from '../../../Admin/Views/etudiants/etude.service';
import { Emplois } from '../../../Admin/Models/Emplois';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalleService } from '../../../Services/salle.service';
import { Salles } from '../../../Admin/Models/Salles';
import { Seances, type_seance } from '../../../Admin/Models/Seances';
import { Configure_seance, Journee } from '../../../Admin/Models/Configure_seance';
import { ActivatedRoute } from '@angular/router';
import { SeancService } from '../../../Admin/Views/emplois-seance/seanc.service';
import { PageTitleService } from '../../../Services/page-title.service';

@Component({
  selector: 'app-der-t-d-component',
  templateUrl: './der-t-d-component.component.html',
  styleUrl: './der-t-d-component.component.css'
})
export class DerTDComponentComponent  implements OnInit{

  @Input() currentEmploi!: Emplois;
  // @Input() DtoList : DtoJour [] =[]
  url_typeSeance!: type_seance 
  
@Input() datesWithDays: { day: string, date: string }[] = [];
  // currenteJour!: DtoJour
  plag_check: any [] = []
  list_checked: any[] = [];
  enseignants: Teacher [] = [];
  list_enseignant_checked: Teacher[] =[]
  listParticip_checked: Participant[]=[]
  participants : Participant[] = []
  form_config!: FormGroup
  salles: Salles[] = [] 
  
  seanceTypeOptions: { key: string, value: string }[] = []
  selectedGroup: { [teacherId: number]: number | null } = {};
  selectedGroupAndRoom: { [teacherId: number]: { groupId: number, roomId: number, date: any[] } } = {};


  constructor(private teacherService: EnseiService, private salleService: SalleService,
    private studentService: EtudeService, private seanceService: SeancService,
    private fb: FormBuilder, private root: ActivatedRoute, private pageTitle: PageTitleService){}
  ngOnInit(): void {
    this.getAllTeacherByIdUe();
    this.load_DtoList();
    this.load_salles();
    this.load_form();
    this.getStatusOptions()
  }

 load_DtoList(){
  this.root.queryParams.subscribe(param =>{
    this.url_typeSeance = param['choix']
  })
  //  this.DtoList.forEach(dto =>{
  //    this.currenteJour = dto;
     
  //       const ignoredPlage = "12:00 - 14:00";
  //       this.currenteJour.plageHoraire = this.currenteJour.plageHoraire?.filter(plage =>plage !== ignoredPlage);
  //  })
   
 }

//  ------------------load form
load_form(){
  this.form_config = this.fb.group({
    idParticipant: ['', Validators.required],
    idSalle: ['', Validators.required],
    seanceType: ['', Validators.required],
    heureDebut: ['', Validators.required],
    heureFin: ['', Validators.required],
  })
}
   // ----------------------get all teachers
   getAllTeacherByIdUe(){
    console.log(this.currentEmploi, "---------------")
    const idUe = this.currentEmploi.idModule.idUe.id
    this.teacherService.getAll_Teacher_By_IdUe(idUe!).subscribe(result => {
      this.enseignants = result;
      // console.log(this.enseignants, "enseignants");
    })
  }

   // -------------------------------load all participation by idEmploi
   load_participation_by_classe(idClass: number){
    this.studentService.getParticipantsByEmploiId(idClass).subscribe((data) => {
      data.forEach(part =>{
        if(!this.participants.some(d=>d.idStudentGroup.id == part.idStudentGroup.id)){
        this.participants.push(part)
      }
      })
      
      // console.log(this.participants, "participations");
    })
  }

  teacher_check(idTeacher : number, event: any){
    const teacher_fund = this.enseignants.find(t => t.idEnseignant === idTeacher);
    const emploi = this.currentEmploi;
    
    this.load_participation_by_classe(emploi.idClasse.id!);

    if (teacher_fund) {
      if (event.target.checked) {
        if (!this.list_enseignant_checked.some(teacher => teacher.idEnseignant === idTeacher)) {
          this.list_enseignant_checked.push(teacher_fund);
        }
      } else {
        
        this.list_enseignant_checked = this.list_enseignant_checked.filter(tck => tck !== teacher_fund);
        // this.selectedGroupAndRoom = [];
        this.form_config.reset();
        this.load_form();
      }
      console.log(this.list_enseignant_checked, event.target.checked ? "checked" : "unchecked");
    }
  }
  // -------------------------check plag horaire
  group_check(idEnseignant: number, idStudentGroup: number, event: any) {
    if (event.target.checked) {
        this.selectedGroupAndRoom[idEnseignant] = {
          ...this.selectedGroupAndRoom[idEnseignant],
            groupId: idStudentGroup
        };
    }
    console.log(this.selectedGroupAndRoom, "group selected");
}


onRoomChange(idEnseignant: number, event: any) {
  const roomId = event.target.value;
  this.selectedGroupAndRoom[idEnseignant] = {
      ...this.selectedGroupAndRoom[idEnseignant],
      roomId: roomId
  };
  console.log(this.selectedGroupAndRoom, "room selected");
}

  
  is_Particip_checked(particpant: Participant): boolean {
    return this.listParticip_checked.some(st => st === particpant);
  }
  is_Teacher_checked(teacher: Teacher): boolean {
    return this.list_enseignant_checked.some(st => st === teacher);
  }

  //  // Vérifie si un groupe est sélectionné pour un enseignant
   isGroupSelected(teacherId: number, participantId: number): boolean {
    return this.selectedGroup[teacherId] === participantId;
  }

  isGroupAlreadySelected(groupId: number): boolean {
    return Object.values(this.selectedGroupAndRoom).some(selection => selection.groupId === groupId);
}
  // load salle
  
  load_salles(){
    this.salleService.getAll().subscribe(data =>{
      this.salles = data;
      // console.log(this.salles, "sales")
    })
  }
  // ---------------submit
  onSubmit(){
    const formData = this.form_config.value
    let jourConfig: Journee[] = [];
    
    // Parcourir chaque configuration d'enseignant
    for (const teacherId in this.selectedGroupAndRoom) {
        if (this.selectedGroupAndRoom.hasOwnProperty(teacherId)) {
            const selection = this.selectedGroupAndRoom[teacherId];
            const teacher_fund = this.enseignants.find(tf => tf.idEnseignant == +teacherId);
            const group_fund = this.participants.find(pt => pt.id == selection.groupId);
            const salle_fund = this.salles.find(sal => sal.id == selection.roomId);
            

            // Créer une séance pour chaque date sélectionnée
            selection.date.forEach(date => {
              const jounee: Journee ={
                date: date,
                heureDebut: formData.heureDebut,
                heureFin: formData.heureFin,
                idEmplois: this.currentEmploi,
                idTeacher: teacher_fund!,
                idSalle: salle_fund!, 
                idParticipant: group_fund!,
                seanceType: formData.seanceType
              }
              jourConfig.push(jounee);
            });
        }
    }

    console.log(jourConfig, "dto");
    // return
      this.seanceService.add_journee(jourConfig).subscribe({
        next: (result) =>{
          this.pageTitle.showSuccessToast(result.message);
          this.form_config.reset();
          this.selectedGroupAndRoom = {}
          this.list_enseignant_checked = []
          this.list_checked = []
          this.listParticip_checked = []
        },
        error: (error) => {
          this.pageTitle.showErrorToast(error.error.message);
        }
       
      })
  
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
 

 
  day_check(teacherId: number, date : string, event: any){
    console.log(date, "date check")
 
    const teacherConfig = this.selectedGroupAndRoom[teacherId] || { groupId: 0, roomId: 0, date: [] };

    if (event.target.checked) {
        if (!teacherConfig.date.includes(date)) {
            teacherConfig.date.push(date);
        }
    } else {
        teacherConfig.date = teacherConfig.date.filter(d => d !== date);
    }

    this.selectedGroupAndRoom[teacherId] = teacherConfig;
    console.log(this.selectedGroupAndRoom, "abject----")
  }

  is_checked(teacherId: number, date?: string): boolean {
    const teacherConfig = this.selectedGroupAndRoom[teacherId];
    return teacherConfig?.date.includes(date) || false;
  }

  areAllChecked(): boolean {
    return this.list_checked.length === this.datesWithDays.length;
  }

  isDayAlreadySelected(date: string): boolean {
    // Vérifier si le jour est déjà sélectionné par un autre enseignant
    return Object.values(this.selectedGroupAndRoom).some(config => config.date.includes(date));
    
}
  selectAll(event : any){
    if (event.target.checked) {
      this.list_checked = [...this.datesWithDays];
      // this.getSeance_date('', this.list_checked);
    } else {
      this.list_checked = [];
    }
    console.log(this.list_checked, event.target.checked ? "tous checked" : "tous unchecked");
  
  }
}
