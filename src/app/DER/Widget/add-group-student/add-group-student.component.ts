import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EtudeService } from '../../../Admin/Views/Etudiants/etude.service';
import { IconsService } from '../../../Services/icons.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTitleService } from '../../../Services/page-title.service';
import { Inscription, Participant, Student, Student_group } from '../../../Admin/Models/Students';
import { StudentPages } from '../../../Admin/Models/Pagination-module';
import { Emplois } from '../../../Admin/Models/Emplois';
import { ServiceService } from '../../EDT/emplois-du-temps/service.service';
import { InscriptionService } from '../../../Services/inscription.service';
import { Admin } from '../../../Admin/Models/Admin';
import { SideBarService } from '../../../sidebar/side-bar.service';
import { AdminUSER } from '../../../Admin/Models/Auth';

@Component({
  selector: 'app-add-group-student',
  templateUrl: './add-group-student.component.html',
  styleUrl: './add-group-student.component.css'
})
export class AddGroupStudentComponent implements OnInit {

  searchTerm: string = ''
  list_checked: Inscription[] = [];
  idClasse!: number
  idEmploi!: number
  emploi!: Emplois;
  admin!: Admin
  particip?: Participant

  inscriptions: Inscription[] = []
  filteredItem: Inscription[] = []
  is_Show_addGroup: boolean = false
  is_Show_addParticipant: boolean = false
  groupes: Student_group[] = [];
  participants: Participant[] = [];
  form_add!: FormGroup;
  form_participants!: FormGroup

  constructor(private service: EtudeService, private inscriptionService: InscriptionService, private studentsServices: EtudeService,
    private fb: FormBuilder, private root: ActivatedRoute, private sidebarService: SideBarService,
    private emploisService: ServiceService, public icons: IconsService, private pageTitle: PageTitleService) { }


  ngOnInit(): void {

    this.admin = AdminUSER()?.der
    this.load_form();
    this.getAll_group();
    this.load_participant_form();
    this.loadStudents();
    this.sidebarService.currentSearchTerm.subscribe(trem =>{
      this.searchTerm = trem 
    this.filteredInscription();

    })
  }

  loadStudents(): void {
    this.root.queryParams.subscribe(param => {
      this.idClasse = +param['id'];
      const idAnnee = param['idAnnee'];
      this.service.getStudentListByIdAnneeAndIdClasse(idAnnee, this.idClasse).subscribe(result =>{
        this.inscriptions = result
        console.log(this.inscriptions, "les inscrit de la classe");
      })
     
     
    })

  }
  // -----------------------load group of this emplois

  to_createGroup() {
    this.is_Show_addGroup = !this.is_Show_addGroup
  }
  close() {
    this.is_Show_addGroup = false
  }
  // ------------create group
  add_groupe() {
    const formData = this.form_add.value
    const name = formData.nom;
    // return
    if (this.form_add.valid) {
      // console.log(group_student, "group_student")
      this.service.addGroup(name, this.idEmploi).subscribe({
        next: (res) => {
          this.pageTitle.showSuccessToast(res.message);
          this.form_add.reset();
          this.load_form();
          this.getAll_group();
          this.is_Show_addGroup = false
        },
        error: (erreur) => {
          this.pageTitle.showErrorToast(erreur.error.message);
        }
      })
    } else {
      this.form_add.markAllAsTouched();
    }
  }
  // --------------load group
  getAll_group() {
    this.root.queryParams.subscribe(param => {
      this.idEmploi = +param['idEmploi'];
    })
    // console.log(this.idEmploi, "idEmplois")
    this.service.getListGroupByIdEmploi(this.idEmploi).subscribe(data => {
      this.groupes = data
      console.log(this.groupes, "groupes")
    })
    this.load_participation_by_emploi(this.idEmploi);
  }
  // load all participation by idEmploi
  load_participation_by_emploi(idEmploi: number) {
    this.service.getParticipantsByEmploiId(idEmploi).subscribe((data) => {
      console.log("parti----------", data)
      this.participants = data
      // data.forEach(part => {
      //   if (!this.participants.some(d => d.idStudentGroup.id == part.idStudentGroup.id)) {
      //     this.participants.push(part)
      //   }
      // })

      console.log(this.participants, "participations");
    })
  }
  // --------------load form
  load_form() {
    this.form_add = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(8)]],
    })
  }
  // student select
  student_check(idInscription: number, event: any) {
    const student_fund = this.inscriptions.find(inscrit => inscrit.id === idInscription);

    if (student_fund) {
      if (event.target.checked) {
        if (!this.list_checked.some(st => st.id === idInscription)) {
          this.list_checked.push(student_fund);
        }
      } else {
        this.list_checked = this.list_checked.filter(st => st.id !== student_fund.id);
      }
    }
  }
  // select all students
  selectAll(event: any) {
    if (event.target.checked) {
      this.list_checked = [...this.inscriptions];
    } else {
      this.list_checked = [];
    }
  }
  is_checked(idStudent: number): boolean {
    return this.list_checked.some(st => st.id === idStudent);
  }

  areAllChecked(): boolean {
    return this.list_checked.length === this.inscriptions.length;
  }
  // --------------------back button
  goBack() {
    window.history.back();
  }
  // -------------participants----------------------------------
  load_participant_form() {
    this.form_participants = this.fb.group({
      idStudentGroup: ['', Validators.required],
    })
  }
  // -----------add participant
  create_participant(list_checked: Inscription[]) {
  
    let list_student: Participant[] = [];

    const formData = this.form_participants.value;
    const group_fund = this.groupes.find(g => g.id == formData.idStudentGroup);
    if (list_checked && list_checked.length > 0) {
      list_checked.forEach(inscrit => {
        
    const {scolarite, ...newList_cheked } = inscrit

        const group: Participant = {
          idStudentGroup: group_fund!,
          idInscription: newList_cheked,
          idAdmin: this.admin
        };
        list_student.push(group);
        console.log(group.idInscription);
      });
      
    }
    console.log(list_student, "list to add")
    if (this.form_participants.valid) {
      this.service.addParticipant(list_student).subscribe({
        next: (res) => {
          this.pageTitle.showSuccessToast(res.message);
          this.form_participants.reset();
          this.load_participant_form();
          this.getAll_group();
          this.list_checked = []

        },
        error: (erreur) => {
          this.pageTitle.showErrorToast(erreur.error.message);
        }
      })
    } else {
      this.form_participants.markAllAsTouched();
    }
  }


  check(id: number) {
    console.log(id, "check-id");
    return this.participants.some(sg => sg.idInscription.id === id);

  }
  // --------compare and extrate group name
  isPresent(idStudent: number): boolean {
    this.particip = this.participants.find(pc => pc.idInscription.id == idStudent);
    console.log(this.particip, "isPresent")
    return this.participants.some(pc => pc.idInscription.id == idStudent);
  }
// -------select groupe
onSelect(event: any){
  const idStudentGroup = event.target.value;
  this.is_Show_addParticipant = true;
}
exit(){
  this.is_Show_addParticipant = false;
  this.form_participants.reset();
  this.load_participant_form();
}
// filtered inscription
  filteredInscription(){
    if(!this.searchTerm){
      return this.filteredItem = this.inscriptions
    }
    return this.filteredItem = this.inscriptions.filter(item => item.idEtudiant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
    item.idEtudiant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()))

  }
}
