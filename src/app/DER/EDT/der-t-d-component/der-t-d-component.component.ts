import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EnseiService } from '../../../Admin/Views/Enseignant/ensei.service';
import { Teacher, teacherConfigureDto } from '../../../Admin/Models/Teachers';
import { Inscription, Participant, Student_group, StudentGroupDto } from '../../../Admin/Models/Students';
import { EtudeService } from '../../../Admin/Views/Etudiants/etude.service';
import { Emplois } from '../Models/Emplois';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalleService } from '../../../Services/salle.service';
import { Salles } from '../../../Admin/Models/Salles';
import { Seances, type_seance } from '../Models/Seances';
import { Journee } from '../Models/Configure_seance';
import { ActivatedRoute } from '@angular/router';
import { SeancService } from '../Services/seanc.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { Admin } from '../../../Admin/Models/Admin';
import { SideBarService } from '../../../sidebar/side-bar.service';
import { IconsService } from '../../../Services/icons.service';
import { AdminUSER } from '../../../Admin/Models/Auth';
import { GroupeService } from '../../../Services/groupe.service';
import { Class_shared } from '../../../DGA/class-students/Utils/Class-shared-methods';

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
  studentOldGroup: Participant[] = [];
  list_enseignant_checked: Teacher[] = []
  listParticip_checked: Participant[] = []
  participants: Participant[] = []
  form_config!: FormGroup
  salles: Salles[] = []
  teacherConf: teacherConfigureDto[] = []
  showPerTeacher: { [teacherId: string]: boolean } = {};

  seanceTypeOptions: { key: string, value: string }[] = []
  selectedGroup: { [teacherId: string]: number | null } = {};
  selectedGroupAndRoom: { [teacherId: string]: { groupId: number, roomId: number,  seance: type_seance,  date: any[] } } = {};


  constructor(private teacherService: EnseiService, private salleService: SalleService, private sideBareService: SideBarService,
    private studentService: EtudeService, private seanceService: SeancService, public icons: IconsService, public sharedMethod: Class_shared,
    private fb: FormBuilder, private root: ActivatedRoute, private pageTitle: PageTitleService, private studentGroupService: GroupeService) { }
  ngOnInit(): void {
    // this.getAllTeacherByIdUe();
    this.load_DtoList();
    this.load_salles();
    // this.load_form();
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
    this.list_enseignant_checked.forEach(eck => {
      this.form_config = this.fb.group({
        idParticipant: [''],
        idSalle: [''],
        seanceType: [''],
        heureDebut: ['', Validators.required],
        heureFin: ['', Validators.required],
      })
    })
  }
  // ----------------------get all teachers
  getAllTeacherByIdUe() {
    console.log(this.currentEmploi, "---------------")
    const idProfile = this.currentEmploi.idClasse.idFiliere?.idFiliere.id
    this.teacherService.getAll().subscribe(result => {
      this.enseignants = result;
      console.log(this.enseignants, "enseignants");
      this.filteredItems = this.enseignants;
    })
  }

  //load all participation by idEmploi
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
   const pass = this.generateRandomPassword(8);
   console.log(pass, "pass");
    const teacher_fund = this.enseignants.find(t => t.idEnseignant == idTeacher);
    const emploi = this.currentEmploi;

    this.load_participation_by_emploi(emploi.id!);
    this.getAllStudentGroups(emploi.idClasse.id!)
    if (teacher_fund) {
       // Créer une nouvelle copie de l'enseignant pour éviter la liaison d'instances
        const newTeacher = Object.assign({}, teacher_fund);
        newTeacher.password = pass;
        if(this.list_enseignant_checked.length >= 3){
          this.list_enseignant_checked = [newTeacher]
        }else
          this.list_enseignant_checked.push(newTeacher);
      
      console.log(this.list_enseignant_checked, "checked", "unchecked");
      this.load_form();
    }
  }
  //check plag horaire
  group_check(pass: string, idStudentGroup: number, event: any) {
    if (event.target.checked) {
      this.selectedGroupAndRoom[pass] = {
        ...this.selectedGroupAndRoom[pass],
        groupId: idStudentGroup
      };
    }
    console.log(this.selectedGroupAndRoom, "group selected");
  }

// ---------------seance type cv\hange
onTypeChange(pass: string, event: any, i: number) {
  
  const seance = event.target.value;
  this.selectedGroupAndRoom[pass] = {
    ...this.selectedGroupAndRoom[pass],
    seance: seance
  };
  console.log(this.selectedGroupAndRoom, "seance selected");
}
onRoomChange(pass: string, event: any) {
    const roomId = event.target.value;
    this.selectedGroupAndRoom[pass] = {
      ...this.selectedGroupAndRoom[pass],
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
  isGroupSelected(pass: string, participantId: number): boolean {
    return this.selectedGroup[pass] === participantId;
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
        console.log(selection, "selected")
        const teacher_fund = this.list_enseignant_checked.find(tf => tf.password == teacherId);
        const group_fund = this.participants.find(pt => pt.id == selection.groupId) || this.studentOldGroup.find(old => old.id == selection.groupId);
        console.log(group_fund, "group old")

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

  chose_teacher(teacher: Teacher,) {
    this.teacher_check(teacher.idEnseignant!,);
    this.is_Teacher_checked(teacher)
    this.show_views = false
  }

  show_teachers() {
      this.show_views =! this.show_views

      this.getAllTeacherByIdUe();

  }


  day_check(pass: string, date: string, event: any) {
   const ensei = this.list_enseignant_checked.find(e=>e.password==pass);
    console.log(ensei, "ensei")

    const teacherConfig = this.selectedGroupAndRoom[pass] || { groupId: 0, roomId: 0, date: [] };

    if (event.target.checked) {
      if (!teacherConfig.date.includes(date)) {
        teacherConfig.date.push(date);
      }
    } else {
      teacherConfig.date = teacherConfig.date.filter(d => d !== date);
    }


    this.showPerTeacher[pass!] = teacherConfig.date.length > 0;
    this.selectedGroupAndRoom[pass!] = teacherConfig;
    console.log(this.selectedGroupAndRoom, "abject")
  }

  is_checked(pass: string, date?: string): boolean {
    
  //  const ensei = this.list_enseignant_checked.find(e=>e.password==pass);
    const teacherConfig = this.selectedGroupAndRoom[pass!];
    
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
    const autorize = AdminUSER()?.der;
    this.admin = autorize;
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

  // cancel all search
  cancel(){
    this.show_views = false;
    this.enseignants = []
  }

  getAllStudentGroups(idClasse: number){
    this.studentGroupService.getAllParticipantsOfClasse(idClasse).subscribe(data => {
    console.log("les grp trouver:", data)
      data.forEach(part => {
        if (!this.studentOldGroup.some(d => d.idStudentGroup.id === part.idStudentGroup.id)) {
          this.studentOldGroup.push(part)
        }
      })
      
    })
  }

  // select group
  onSelectOldGrp(event: any, pass: string){
    const idGroup = event.target.value;
    this.selectedGroupAndRoom[pass].groupId = idGroup;
    console.log(this.selectedGroupAndRoom,"selected")

  }

  generateRandomPassword(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
}

 
}
