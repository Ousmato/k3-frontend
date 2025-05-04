import { Component, Inject, inject, Input, OnInit } from '@angular/core';
import { type_seance } from '../../../DER/models/Seances';
import { Teacher } from '../../../DER/models/Teachers';
import { Salles } from '../../../../Admin/Models/Salles';
import { Journee, Surveillance } from '../../../DER/models/Configure_seance';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Emplois } from '../../../DER/models/Emplois';
import { Participant } from '../../../../Admin/Models/Students';
import { Admin } from '../../../shared/models/Admin';
import { contructor_dependencies } from '../../../dependencies/dependencies';
import { surveillants } from '../../models/surveillence';

@Component({
  selector: 'app-sec-add-surveillance',
  templateUrl: './sec-add-surveillance.component.html',
  styleUrl: './sec-add-surveillance.component.css'
})
export class SecAddSurveillanceComponent implements OnInit {


  @Input() currentEmploi!: Emplois;
  admin!: Admin
  surveillance!: Surveillance
  filteredItems: any[] = []
  url_typeSeance!: type_seance
  teacher : string = "Teacher"
  surveillant : string = "Surveillant"
  value: string = ''

  @Input() datesWithDays: { day: string, date: string }[] = [];
  overlay: boolean = false
  show_views: boolean = false
  isContente: boolean = false
  plag_check: any[] = []
  list_checked: any[] = [];
  surveillants: any[] = [];
  list_enseignant_checked: Teacher[] = []
  
  listParticip_checked: Participant[] = []
  participants: Participant[] = []
  form_config!: FormGroup
  salles: Salles[] = []

  selectedGroup: { [teacherId: number]: number | null } = {};
  selectedGroupAndRoom: { [teacherId: number]: { groupId: number, roomId: number, date: any } } = {};

public dependencies = inject(contructor_dependencies)
  ngOnInit(): void {
    this.load_DtoList();
    this.load_salles();
    this.load_form();
  }

  load_DtoList() {
    this.dependencies.root.queryParams.subscribe(param => {
      this.url_typeSeance = param['choix']
    })
  }

  //load form
  load_form() {
    this.form_config = this.dependencies.fb.group({
      idParticipant: ['', Validators.required],
      idSalle: ['', Validators.required],
      seanceType: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      date: ['', Validators.required],
    })
  }
  

  

   //load all participation by idEmploi
   load_participation_by_classe(idClass: number) {
    this.dependencies.studentService.getParticipantsByEmploiId(idClass).subscribe((data) => {
      data.forEach(part => {
        if (!this.participants.some(d => d.idStudentGroup.id == part.idStudentGroup.id)) {
          this.participants.push(part)
        }
      })

      // console.log(this.participants, "participations");
    })
  }

  // teacher_checkfiiii(idTeacher: number) {
    
  //   const teacher_fund = this.surveillants.find(t => t.idEnseignant == idTeacher);
  //   const emploi = this.currentEmploi;

  //   this.load_participation_by_classe(emploi.idClasse.id!);
  //   if (teacher_fund) {
  //     if (!this.list_enseignant_checked.some(teacher => teacher.idEnseignant == idTeacher) ) {
  //       if(this.list_enseignant_checked.length >= 2){
  //         this.list_enseignant_checked = [teacher_fund]
  //       }else
  //         this.list_enseignant_checked.push(teacher_fund);
  //     }
      
  //     this.form_config.reset();
  //     this.load_form();
  //     console.log(this.list_enseignant_checked, "checked", "unchecked");
  //   }
  // }


  onRoomChange(idEnseignant: number, event: any) {
    const roomId = event.target.value;
    this.selectedGroupAndRoom[idEnseignant] = {
      ...this.selectedGroupAndRoom[idEnseignant],
      roomId: roomId
    };
    // console.log(this.selectedGroupAndRoom, "room selected");
  }

  is_Teacher_checked(teacher: Teacher): boolean {
    return this.list_enseignant_checked.some(st => st == teacher);
  }


  // load salle

  load_salles() {
    this.dependencies.salleService.getAll().subscribe(data => {
      this.salles = data;
      // console.log(this.salles, "sales")
    })
  }
  // ---------------submit
  onSubmit() {
    const formData = this.form_config.value
    console.log(formData, "form data")

    let jourConfig: Journee[] = [];

    // Parcourir chaque configuration d'enseignant
    for (const teacherId in this.selectedGroupAndRoom) {
      if (this.selectedGroupAndRoom.hasOwnProperty(teacherId)) {
        const selection = this.selectedGroupAndRoom[teacherId];
        const teacher_fund = this.list_enseignant_checked.find(tf => tf.idEnseignant == +teacherId);
        const salle_fund = this.salles.find(sal => sal.id == selection.roomId);


        console.log(teacher_fund, "teacher")
        console.log(salle_fund, "sallle")
        
          const jounee: Journee = {
            date: formData.date,
            heureDebut: formData.heureDebut,
            heureFin: formData.heureFin,
            idEmplois: this.currentEmploi,
            idTeacher: teacher_fund!,
            idSalle: salle_fund!,

            seanceType: formData.seanceType
          }
          jourConfig.push(jounee);
      }
    }

    console.log(jourConfig, "dto");
    return
    this.dependencies.seanceService.addSurveillance(jourConfig).subscribe({
      next: (result) => {
        this.dependencies.queryreturnMessage.showSuccessToast(result.message);
        this.form_config.reset();
        this.selectedGroupAndRoom = {}
        this.list_enseignant_checked = []
        this.list_checked = []
      },
      error: (error) => {
        this.dependencies.queryreturnMessage.showErrorToast(error.error.message);
      }

    })

  }
 
  is_Particip_checked(particpant: Participant): boolean {
    return this.listParticip_checked.some(st => st === particpant);
  }

  isGroupAlreadySelected(groupId: number): boolean {
    return Object.values(this.selectedGroupAndRoom).some(selection => selection.groupId === groupId);
  }

  // Vérifie si un groupe est sélectionné pour un enseignant
  isGroupSelected(teacherId: number, participantId: number): boolean {
    return this.selectedGroup[teacherId] === participantId;
  }

  group_check(idEnseignant: number, idStudentGroup: number, event: any) {
    if (event.target.checked) {
      this.selectedGroupAndRoom[idEnseignant] = {
        ...this.selectedGroupAndRoom[idEnseignant],
        groupId: idStudentGroup
      };
    }
    console.log(this.selectedGroupAndRoom, "group selected");
  }

  show_Surveillant(value : string){
    this.show_views =! this.show_views
    this.value = value
      
  }
  hide_view( event: any) {
    
    // this.teacher_check(event.idEnseignant!);
    // this.is_Teacher_checked(event)
    this.list_enseignant_checked.push(event);
    // this.list_enseignant_checked = this.list_enseignant_checked.filter(teacher => teacher.idEnseignant !== event.idEnseignant);
    console.log(event, "event")
    console.log(this.list_enseignant_checked, "enseignant checked")
    this.show_views = false
  }

}
