import { Component, inject, OnInit } from '@angular/core';
import { contructor_dependencies } from '../../../dependencies/dependencies';
import { AnneeScolaire } from '../../../../Admin/Models/School-info';
import { TeacherDto } from '../../../DER/models/Teachers';
import { Semestres } from '../../../../Admin/Models/Semestre';

@Component({
  selector: 'app-edt-individuels',
  templateUrl: './edt-individuels.component.html',
  styleUrl: './edt-individuels.component.css'
})
export class EDTIndividuelsComponent  implements OnInit{

  promotions : AnneeScolaire[]=[]
  semestres : Semestres[]=[]
  vides : number []=[1, 2, 3, 4, 5, 6, 7]
  activeIndex: any | null = null;
  idAnnee: number | null = null;
  idSemestre: number | null = null;
  filteredItems : any[]=[]
  semaines : any[]=[]
  show_hours : boolean = false
  teacherEmplois! : TeacherDto
  items : any[]=[]
  totalHours : number = 0
  public dependencies = inject(contructor_dependencies);


  ngOnInit(): void {
    this.getAllPromotions();
    this.getAllSemestre()
  }

  getAllPromotions(){
    this.dependencies.promotionService.getAll_annee().subscribe(result =>{
      this.promotions = result
      console.log("promotion", this.promotions)
    })
  }

  getAllSemestre(){
    this.dependencies.semestreService.getAllSemestre().subscribe(result =>{
      this.semestres = result
    })
  }

  checkYear(event : any){
    this.idAnnee = null
    this.idAnnee = event.target.value
    if(this.idSemestre != null && this.idAnnee != null){
      this.getAllTeachers(this.idAnnee!, this.idSemestre)
    }
   
  }

  checkSemestre(event : any){
    this.idSemestre = null
    this.idSemestre = event.target.value
    if(this.idSemestre != null && this.idAnnee != null){
      this.getAllTeachers(this.idAnnee!, this.idSemestre)
    }
    
  }


  onSearch(searchTerm: string) {
    
    this.filteredItems = this.items.filter(item =>
      item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.prenom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  export_excel_file(){}

  open_teacher(teacher: any) {
    this.activeIndex = teacher;
    this.filteredItems = [teacher];
    this.getAllEmploiOfTeacherByIdYear(this.idAnnee!, teacher.id);
    this.show_hours = true;
  }
  
  close_teacher() {
    this.activeIndex = null;
    this.filteredItems = [...this.items];
    this.show_hours = false;
  }



  getAllEmploiOfTeacherByIdYear(idAnnee: number, idTeacher: number){
    this.dependencies.teacherService.getAllEmploiOfTeacherByIdYear(idAnnee, idTeacher).subscribe(result => {
      this.teacherEmplois = result;
      this.show_hours = true
      this.semaines = this.teacherEmplois.semaines
      console.log("les heures efectues : ", this.teacherEmplois)
      // this.teacherEmplois.teacherEmploiList.forEach(item => {
      //   this.totalHours += item.volHoraires
      // })
      // this.teacherEmploi = this.emploisDto.teacherEmploiList
    })
  }
  getAllTeachers(idAnnee: number, idSemestre : number){
    this.dependencies.teacherService.getAllTeachersHaveEmploisByIdAnneeAndIdSemestre(idAnnee,idSemestre!).subscribe(result =>{
      this.items = result
      this.filteredItems = result
      console.log("log : ", this.filteredItems)
    })
  }


}
