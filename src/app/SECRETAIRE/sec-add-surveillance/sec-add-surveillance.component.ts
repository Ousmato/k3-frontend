import { Component, Input, OnInit } from '@angular/core';
import { type_seance } from '../../DER/EDT/Models/Seances';
import { Teacher } from '../../Admin/Models/Teachers';
import { Salles } from '../../Admin/Models/Salles';
import { Journee, Surveillance } from '../../DER/EDT/Models/Configure_seance';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTitleService } from '../../Services/page-title.service';
import { SalleService } from '../../Services/salle.service';
import { EnseiService } from '../../Admin/Views/Enseignant/ensei.service';
import { SeancService } from '../../DER/EDT/Services/seanc.service';
import { Emplois } from '../../DER/EDT/Models/Emplois';
import { ActivatedRoute } from '@angular/router';
import { Participant } from '../../Admin/Models/Students';
import { EtudeService } from '../../Admin/Views/Etudiants/etude.service';
import { Admin } from '../../Admin/Models/Admin';
import { IconsService } from '../../Services/icons.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { SideBarService } from '../../sidebar/side-bar.service';

@Component({
  selector: 'app-sec-add-surveillance',
  templateUrl: './sec-add-surveillance.component.html',
  styleUrl: './sec-add-surveillance.component.css'
})
export class SecAddSurveillanceComponent implements OnInit {


  @Input() currentEmploi!: Emplois;
  admin!: Admin
  searchTerm: string = '';
  surveillance!: Surveillance
  filteredItems: Teacher[] = []
  url_typeSeance!: type_seance

  @Input() datesWithDays: { day: string, date: string }[] = [];
  overlay: boolean = false
  show_views: boolean = false
  isContente: boolean = false
  plag_check: any[] = []
  list_checked: any[] = [];
  enseignants: Teacher[] = [];
  list_enseignant_checked: Teacher[] = []
  
  listParticip_checked: Participant[] = []
  participants: Participant[] = []
  form_config!: FormGroup
  salles: Salles[] = []

  seanceTypeOptions: { key: string, value: string }[] = []
  selectedGroup: { [teacherId: number]: number | null } = {};
  selectedGroupAndRoom: { [teacherId: number]: { groupId: number, roomId: number, date: any } } = {};


  constructor(private teacherService: EnseiService, private salleService: SalleService, private sideBareService: SideBarService,
    private studentService: EtudeService, private seanceService: SeancService, public icons: IconsService,
    private fb: FormBuilder, private root: ActivatedRoute, private pageTitle: PageTitleService) { }
  ngOnInit(): void {
    this.load_DtoList();
    this.load_salles();
    this.load_form();
    this.getStatusOptions()

    this.sideBareService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterTeachers();

    });
  }

  load_DtoList() {
    this.root.queryParams.subscribe(param => {
      this.url_typeSeance = param['choix']
    })
  }

  //  ------------------load form
  load_form() {
    this.form_config = this.fb.group({
      idParticipant: ['', Validators.required],
      idSalle: ['', Validators.required],
      seanceType: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      date: ['', Validators.required],
    })
  }
  // ----------------------get all teachers
  getAllTeacherByIdUe() {
    // console.log(this.currentEmploi, "---------------")
    const idProfile = this.currentEmploi.idClasse.idFiliere?.idFiliere.id
    this.teacherService.getAll_Teacher_By_IdUe(idProfile!).subscribe(result => {
      this.enseignants = result;
      this.filteredItems = this.enseignants;
      // console.log(this.enseignants, "enseignants");
    })
  }

   // -------------------------------load all participation by idEmploi
   load_participation_by_classe(idClass: number) {
    this.studentService.getParticipantsByEmploiId(idClass).subscribe((data) => {
      data.forEach(part => {
        if (!this.participants.some(d => d.idStudentGroup.id == part.idStudentGroup.id)) {
          this.participants.push(part)
        }
      })

      // console.log(this.participants, "participations");
    })
  }

  teacher_check(idTeacher: number) {
    
    const teacher_fund = this.enseignants.find(t => t.idEnseignant == idTeacher);
    const emploi = this.currentEmploi;

    this.load_participation_by_classe(emploi.idClasse.id!);
    if (teacher_fund) {
      if (!this.list_enseignant_checked.some(teacher => teacher.idEnseignant == idTeacher) ) {
        if(this.list_enseignant_checked.length >= 2){
          this.list_enseignant_checked = [teacher_fund]
        }else
          this.list_enseignant_checked.push(teacher_fund);
      }
      
      this.form_config.reset();
      this.load_form();
      console.log(this.list_enseignant_checked, "checked", "unchecked");
    }
  }


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
    this.salleService.getAll().subscribe(data => {
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
        const teacher_fund = this.enseignants.find(tf => tf.idEnseignant == +teacherId);
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
    // return
    this.seanceService.addSurveillance(jourConfig).subscribe({
      next: (result) => {
        this.pageTitle.showSuccessToast(result.message);
        this.form_config.reset();
        this.selectedGroupAndRoom = {}
        this.list_enseignant_checked = []
        this.list_checked = []
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
      if (o.value == type_seance.SESSION || o.value == type_seance.Examen) {
        this.seanceTypeOptions.push(o)
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


  // ------------teacher select
  chose_teacher(teacher: Teacher) {
    this.teacher_check(teacher.idEnseignant!);
    this.is_Teacher_checked(teacher)
    this.show_views = false
  }

  show_teachers() {
      this.show_views =! this.show_views

      this.getAllTeacherByIdUe();

  }

  filterTeachers() {
    console.log(this.searchTerm, "cherche")
    if (!this.searchTerm) {
      return this.filteredItems = this.enseignants;
    } else {
      return this.filteredItems = this.enseignants.filter(enseignant =>
        enseignant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        enseignant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onSearchChange() {
    this.sideBareService.changeSearchTerm(this.searchTerm);
  }

}
