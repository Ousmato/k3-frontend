import { Component, OnInit } from '@angular/core';
import { InscriptionService } from '../../../../Services/inscription.service';
import { IconsService } from '../../../../Services/icons.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Admin } from '../../../Models/Admin';
import { AdminUSER } from '../../../Models/Auth';
import { StudentSharedMethods } from '../Utils/Student-shared-methode';
import { SideBarService } from '../../../../sidebar/side-bar.service';
import { EtudeService } from '../etude.service';
import { Dto_scolarite } from '../../../Models/Students';
import { PageTitleService } from '../../../../Services/page-title.service';

@Component({
  selector: 'app-statistique-sudents-values',
  templateUrl: './statistique-sudents-values.component.html',
  styleUrl: './statistique-sudents-values.component.css'
})
export class StatistiqueSudentsValuesComponent implements OnInit{

  idFiliere!: number
  idInscritSelect!: number | null
  searchTerm: string = ''
  status!: string
  idAnnee!: number
  isPayed!: any
  form!: FormGroup
  admin!: Admin
  students: any[] = [];
  studentsItemFiltered: any[] = [];

  constructor(private inscriptionService: InscriptionService, private studentService: EtudeService,
    private fb: FormBuilder, private sideBarService: SideBarService, private pageTitle: PageTitleService,
    public icons: IconsService, private root: ActivatedRoute, public studentShared : StudentSharedMethods) { }

  ngOnInit(): void {
    this.admin = AdminUSER()?.scolarite
    this.load_form()
      this.load_students()
      this.sideBarService.currentSearchTerm.subscribe(term => {
        this.searchTerm = term;
        this.filterStudents();
      
      });
  }

  // load form
  load_form(){
    this.form = this.fb.group({
      scolarite: ['', Validators.required],
    })
  }
  load_students(){
    this.root.queryParams.subscribe(params => {
      this.idFiliere = params['idFiliere'];
      this.status = params['status'];
      this.isPayed = params['isPaye'];
      this.idAnnee = params['idAnnee'];
      if(this.idFiliere){
        this.inscriptionService.getInscriptionByFiliere(this.idFiliere, this.admin.idAdministra!, this.idAnnee, this.isPayed).subscribe((res: any) => {
          this.students = res;
          console.log(this.students, "students-----filiere------");
          this.studentMapper(this.students)
        });
      }else if(this.status){
        console.log(this.status, "status", this.isPayed, "payer")
        // return
        this.inscriptionService.getInscriptionByStatus(this.status, this.admin.idAdministra!, this.idAnnee, this.isPayed).subscribe(res => {
          this.students = res;
          console.log(this.students, "students-----status------");
          this.studentMapper(this.students)
        })
      }
      
    });
    
  }
  // student mapper
  studentMapper(students: any[]) {
    students.forEach(st =>{
      st.seuil = (st.seuil!).toLocaleString('fr-CM', { style: 'currency', currency: 'XOF' });
      st.reliquat = (st.reliquat!).toLocaleString('fr-CM', { style: 'currency', currency: 'XOF' });
      st.payer = (st.payer!).toLocaleString('fr-CM', { style: 'currency', currency: 'XOF' });
    })
  }
  // go back
  goBack(){
    window.history.back();
  }
  filterStudents(){
    if(!this.searchTerm){
      return this.studentsItemFiltered = this.students;
    }
    return this.studentsItemFiltered = this.students.filter(student =>
      student.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.classe.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // update payer
  update(idInscrit : any){
    if(this.idInscritSelect == null){
       this.idInscritSelect = idInscrit
    }else{
      this.idInscritSelect = null;
    }
   
  }

  update_paie_student(statistic : any){
      const formData = this.form.value
      const dto: Dto_scolarite ={
        id: statistic.idInscrit,
        payer: formData.scolarite,
        type: statistic.status,
      }
      
      
      if(this.form.valid){
        console.log(dto)
        // return
        this.studentService.update_student_scolarite( dto, this.admin.idAdministra!).subscribe({
        next: (response) =>{
          this.pageTitle.showSuccessToast(response.message);
          
          this.load_students();
          this.idInscritSelect = null
          this.form.reset();
          this.searchTerm = ''
        },
        error: (erreur) =>{
          this.pageTitle.showErrorToast(erreur.error.message);
        }
        
      })
      }else{
        this.form.markAllAsTouched();
        console.log("Veuillez remplir tous les champs correctement!");
  
    
      }
      
    }

}
