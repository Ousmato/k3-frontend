import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EtudeService } from '../../../Admin/Views/etudiants/etude.service';
import { IconsService } from '../../../Services/icons.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTitleService } from '../../../Services/page-title.service';
import { Participant, Student, Student_group } from '../../../Admin/Models/Students';
import { StudentPages } from '../../../Admin/Models/Pagination-module';
import { Emplois } from '../../../Admin/Models/Emplois';
import { ServiceService } from '../../emplois-du-temps/service.service';
import { data } from 'jquery';

@Component({
  selector: 'app-add-group-student',
  templateUrl: './add-group-student.component.html',
  styleUrl: './add-group-student.component.css'
})
export class AddGroupStudentComponent implements OnInit {

  list_checked: Student[] = [];
  students: Student[] = [];
  idClasse!: number
  idEmploi!: Emplois
  emploi!: Emplois;
  group_fund!: Student_group;
  is_Show_addGroup: boolean = false
  groupes: Student_group[] = [];

  form_add!: FormGroup;
  form_participants!:FormGroup
  
  constructor(private service: EtudeService,private fb: FormBuilder,private root: ActivatedRoute,
    private emploisService: ServiceService, public icons: IconsService, private pageTitle : PageTitleService) { }


    ngOnInit(): void {
        this.loadStudents();
        this.load_form();
        this.getAll_group();
        this.load_participant_form();
    }

    loadStudents(): void {
      this.root.queryParams.subscribe(param=>{
        this.idClasse = +param['id'];
        this.emploisService.getEmploisByClasse2(this.idClasse).subscribe(data=>{
          this.emploi = data;
          // console.log(this.emploi, "emploi trouver");
        })
        this.service.getStudentByIdClasse(this.idClasse).subscribe(data => {
          this.students = data
         
          // console.log(this.students, "pagenation teachers")
        });
      })
      
    }
    to_createGroup(){
      this.is_Show_addGroup =! this.is_Show_addGroup
    }
    close(){
      this.is_Show_addGroup = false
    }
    // ------------create group
    add_groupe(){
      const formData = this.form_add.value
      const group_student : Student_group ={
        nom: formData.nom,
        idEmploi: this.emploi
      }
      // return
      if(this.form_add.valid){
        // console.log(group_student, "group_student")
        this.service.addGroup(group_student).subscribe({
          next: (res) =>{
            this.pageTitle.showSuccessToast(res.message);
            this.form_add.reset();
            this.load_form();
            this.getAll_group();
            this.is_Show_addGroup = false
          },
          error: (erreur) =>{
            this.pageTitle.showErrorToast(erreur.error.message);
          }
        })
      }else{
        this.form_add.markAllAsTouched();
      }
    }
    // --------------load group
    getAll_group(){
      this.service.getAllGroup().subscribe(data => {
        this.groupes = data
        // console.log(this.groupes, "groupes")
      })
    }
    // --------------load form
    load_form(){
      this.form_add = this.fb.group({
        nom: ['',Validators.required],
        
        
      })
    }
    // -----------------------student select
    student_check(idStudent : number, event: any){
      const student_fund = this.students.find(student => student.idEtudiant === idStudent);
  
      if (student_fund) {
        if (event.target.checked) {
          if (!this.list_checked.some(st => st.idEtudiant === idStudent)) {
            this.list_checked.push(student_fund);
          }
        } else {
          this.list_checked = this.list_checked.filter(st => st.idEtudiant !== student_fund.idEtudiant);
        }
        // console.log(this.list_checked, event.target.checked ? "checked" : "unchecked");
      }
    }
  // -----------------select all ues
  selectAll(event : any){
    if (event.target.checked) {
      this.list_checked = [...this.students];
    } else {
      this.list_checked = [];
    }
    // console.log(this.list_checked, event.target.checked ? "tous checked" : "tous unchecked");
  
  }
    is_checked(idStudent: number): boolean {
      return this.list_checked.some(st => st.idEtudiant === idStudent);
    }
  
    areAllChecked(): boolean {
      return this.list_checked.length === this.students.length;
    }
    // --------------------back button
    goBack(){
      window.history.back();
    }
    // -------------participants----------------------------------
    load_participant_form(){
      this.form_participants = this.fb.group({
        idStudentGroup: ['',Validators.required],
      })
    }
    // -----------add participant
    create_participant(list_checked: Student[]){
      let list_student: Participant[] = [];
      
      const formData = this.form_participants.value;
      const group_fund = this.groupes.find(g =>g.id == formData.idStudentGroup);
      if (list_checked && list_checked.length > 0) {
        list_checked.forEach(student => {
          const group: Participant = {
            idStudentGroup: group_fund!,
            idStudent: student
          };
          list_student.push(group);
        });
        console.log(list_student);
      }
      // console.log(list_student, "list to add")
      if(this.form_participants.valid){
        this.service.addParticipant(list_student).subscribe({
          next: (res) =>{
            this.pageTitle.showSuccessToast(res.message);
            this.form_participants.reset();
            this.load_participant_form();
            this.loadStudents();
            this.getAll_group();
          },
          error: (erreur) =>{
            this.pageTitle.showErrorToast(erreur.error.message);
          }
        })
      }else{
        this.form_participants.markAllAsTouched();
      }
    }
    
    // ------------------------------groupe select
    onSelect(event : any){
      const g_selectId = event.target.value;
      this.group_fund = this.groupes.find(g =>g.id == + g_selectId)!;

    }
}
