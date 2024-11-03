import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EnseiService } from '../../../Admin/Views/enseignant/ensei.service';
import { Teacher, teacherConfigureDto } from '../../../Admin/Models/Teachers';
import { Participant } from '../../../Admin/Models/Students';
import { EtudeService } from '../../../Admin/Views/etudiants/etude.service';
import { Emplois } from '../../../Admin/Models/Emplois';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalleService } from '../../../Services/salle.service';
import { Salles } from '../../../Admin/Models/Salles';
import { Seances, type_seance } from '../../../Admin/Models/Seances';
import { Journee } from '../../../Admin/Models/Configure_seance';
import { ActivatedRoute } from '@angular/router';
import { SeancService } from '../../../Admin/Views/emplois-seance/seanc.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { Admin } from '../../../Admin/Models/Admin';
import { SideBarService } from '../../../sidebar/side-bar.service';
import { IconsService } from '../../../Services/icons.service';

@Component({
  selector: 'app-der-t-d-component',
  templateUrl: './der-t-d-component.component.html',
  styleUrl: './der-t-d-component.component.css'
})
export class DerTDComponentComponent implements OnInit {

  @Input() currentEmploi!: Emplois;
  admin!: Admin
  searchTerm: string = "";
  dateSelect!: string
  url_typeSeance!: type_seance

  @Input() datesWithDays: { day: string, date: string }[] = [];
  permission: boolean = false
  show_views: boolean = false
  plag_check: any[] = []
  list_checked: any[] = [];
  enseignants: Teacher[] = [];
  filteredItems: Teacher[] = [];
  list_enseignant_checked: Teacher[] = []
  listParticip_checked: Participant[] = []
  participants: Participant[] = []
  form_config!: FormGroup
  salles: Salles[] = []
  teacherConf: teacherConfigureDto[] = []
  showPerTeacher: { [teacherId: number]: boolean } = {};

  seanceTypeOptions: { key: string, value: string }[] = []
  selectedGroup: { [teacherId: number]: number | null } = {};
  selectedGroupAndRoom: { [teacherId: number]: { groupId: number, roomId: number,  seance: type_seance,  date: any[] } } = {};


  constructor(private teacherService: EnseiService, private salleService: SalleService, private sideBareService: SideBarService,
    private studentService: EtudeService, private seanceService: SeancService, public icons: IconsService,
    private fb: FormBuilder, private root: ActivatedRoute, private pageTitle: PageTitleService) { }
  ngOnInit(): void {
    // this.getAllTeacherByIdUe();
    this.load_DtoList();
    this.load_salles();
    this.load_form();
    this.getPermission();
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
      idParticipant: [''],
      idSalle1: [''],
      idSalle2: [''],
      seanceType1: [''],
      seanceType2: [''],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
    })
  }
  // ----------------------get all teachers
  getAllTeacherByIdUe() {
    console.log(this.currentEmploi, "---------------")
    const idProfile = this.currentEmploi.idClasse.idFiliere?.idFiliere.id
    this.teacherService.getAll_Teacher_By_IdUe(idProfile!).subscribe(result => {
      this.enseignants = result;
      console.log(this.enseignants, "enseignants");
      this.filteredItems = this.enseignants;
    })
  }

  // -------------------------------load all participation by idEmploi
  load_participation_by_emploi(idEmploi: number) {
    this.studentService.getParticipantsByEmploiId(idEmploi).subscribe((data) => {
      data.forEach(part => {
        if (!this.participants.some(d => d.idStudentGroup.id == part.idStudentGroup.id)) {
          this.participants.push(part)
        }
      })

      console.log(this.participants, "participations");
    })
  }

  teacher_check(idTeacher: number) {
    
    const teacher_fund = this.enseignants.find(t => t.idEnseignant == idTeacher);
    const emploi = this.currentEmploi;

    this.load_participation_by_emploi(emploi.id!);
    if (teacher_fund) {
      if (!this.list_enseignant_checked.some(teacher => teacher.idEnseignant == idTeacher) ) {
        if(this.list_enseignant_checked.length >= 2){
          this.list_enseignant_checked = [teacher_fund]
        }else
          this.list_enseignant_checked.push(teacher_fund);
      }
      
      console.log(this.list_enseignant_checked, "checked", "unchecked");
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

// ---------------seance type cv\hange
onTypeChange(idEnseignant: number, event: any, i: number) {
  
  const seance = event.target.value;
  this.selectedGroupAndRoom[idEnseignant] = {
    ...this.selectedGroupAndRoom[idEnseignant],
    seance: seance
  };
  console.log(this.selectedGroupAndRoom, "seance selected");
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

  load_salles() {
    this.salleService.getAll().subscribe(data => {
      this.salles = data;
      // console.log(this.salles, "sales")
    })
  }
  // ---------------submit
  onSubmit() {
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
          const jounee: Journee = {
            date: date,
            heureDebut: formData.heureDebut,
            heureFin: formData.heureFin,
            idEmplois: this.currentEmploi,
            idTeacher: teacher_fund!,
            idSalle: salle_fund!,
            idParticipant: group_fund!,
            seanceType: selection.seance
          }
          jourConfig.push(jounee);
        });
      }
    }

    console.log(jourConfig, "dto");
    // return
    if(this.form_config.valid){
      this.seanceService.add_journee(jourConfig).subscribe({
        next: (result) => {
          this.pageTitle.showSuccessToast(result.message);
          this.form_config.reset();
          this.load_form()
          this.selectedGroupAndRoom = {}
          this.list_enseignant_checked = []
          this.list_checked = []
          this.listParticip_checked = []
        },
        error: (error) => {
          this.pageTitle.showErrorToast(error.error.message);
        }
  
      })
    }else{
      this.form_config.markAllAsTouched();
      console.log(this.form_config.value, "inavlod")
    }
    

  }
  getStatusOptions() {
    const objet = Object.keys(type_seance).map(key => ({

      key: key,
      value: type_seance[key as keyof typeof type_seance]
    }));
    objet.forEach(o => {
      if (o.value != type_seance.SESSION && o.value != type_seance.Examen) {
        this.seanceTypeOptions.push(o)
      }
    })
  }

  chose_teacher(teacher: Teacher) {
    this.teacher_check(teacher.idEnseignant!);
    this.is_Teacher_checked(teacher)
    this.show_views = false
  }

  show_teachers() {
      this.show_views =! this.show_views

      this.getAllTeacherByIdUe();

  }


  day_check(teacherId: number, date: string, event: any) {
   
    console.log(date, "date check")

    const teacherConfig = this.selectedGroupAndRoom[teacherId] || { groupId: 0, roomId: 0, date: [] };

    if (event.target.checked) {
      if (!teacherConfig.date.includes(date)) {
        teacherConfig.date.push(date);
      }
    } else {
      teacherConfig.date = teacherConfig.date.filter(d => d !== date);
    }


    this.showPerTeacher[teacherId] = teacherConfig.date.length > 0;
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
 

  getPermission(): boolean {
    const autorize = sessionStorage.getItem('der');
    this.admin = JSON.parse(autorize!);
    if (autorize) {
      this.permission = true
      // console.log(autorize,"autorize")
      return true;
    }
    return false
  }
// ------------filtered teacher
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
