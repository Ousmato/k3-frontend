import { Component, inject, Input, OnInit } from '@angular/core';
import { Teacher, teacherConfigureDto } from '../../models/Teachers';
import { Participant} from '../../../../Admin/Models/Students';
import { FormGroup, Validators } from '@angular/forms';
import { Salles } from '../../../../Admin/Models/Salles';
import { Admin } from '../../../shared/models/Admin';
import { Emplois } from '../../models/Emplois';
import { type_seance } from '../../models/Seances';
import { contructor_dependencies } from '../../../dependencies/dependencies';
import { Journee } from '../../models/Configure_seance';
import { getUser } from '../../../shared/models/auth';

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

  public dependencies = inject(contructor_dependencies)
  
  ngOnInit(): void {
    // this.getAllTeacherByIdUe();
    this.load_DtoList();
    this.load_salles();
    // this.load_form();
    this.getPermission();
    this.getStatusOptions()

    this.dependencies.sideBareService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterTeachers();

    });
  }

  load_DtoList() {
    this.dependencies.root.queryParams.subscribe(param => {
      this.url_typeSeance = param['choix']
    })
  }

  //  ------------------load form
  load_form() {
    this.list_enseignant_checked.forEach(eck => {
      this.form_config = this.dependencies.fb.group({
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
    this.dependencies.teacherService.getAll().subscribe(result => {
      this.enseignants = result;
      console.log(this.enseignants, "enseignants");
      this.filteredItems = this.enseignants;
    })
  }

  //load all participation by idEmploi
  load_participation_by_emploi(idEmploi: number) {
    this.dependencies.studentService.getParticipantsByEmploiId(idEmploi).subscribe((data) => {
      data.forEach(part => {
        if (!this.participants.some(d => d.idStudentGroup.id == part.idStudentGroup.id)) {
          this.participants.push(part)
        }
      })

      // console.log(this.participants, "participations");
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
      
      // console.log(this.list_enseignant_checked, "checked", "unchecked");
      this.load_form();
    }
  }
  removeTeacher(teacher: Teacher) {
    const index = this.list_enseignant_checked.indexOf(teacher);
    if (index !== -1) {
      this.list_enseignant_checked.splice(index, 1);
      delete this.selectedGroupAndRoom[teacher.password!];
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
    this.dependencies.salleService.getAll().subscribe(data => {
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
      this.dependencies.seanceService.add_journee(jourConfig).subscribe({
        next: (result) => {
          this.dependencies.queryreturnMessage.showSuccessToast(result.message);
          this.form_config.reset();
          this.load_form()
          this.selectedGroupAndRoom = {}
          this.list_enseignant_checked = []
          this.list_checked = []
          this.listParticip_checked = []
        },
        error: (error) => {
          this.dependencies.queryreturnMessage.showErrorToast(error.error.message);
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
    const autorize = getUser();
    this.admin = autorize;
    if (this.dependencies.util.abrevigate(this.admin.idPoste.nom) == 'DER') {
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
    this.dependencies.sideBareService.changeSearchTerm(this.searchTerm);
  }

  // cancel all search
  cancel(){
    this.show_views = false;
    this.enseignants = []
  }

  getAllStudentGroups(idClasse: number){
    this.dependencies.studentGroupeService.getAllParticipantsOfClasse(idClasse).subscribe(data => {
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
