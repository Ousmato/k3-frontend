import { Component, OnInit } from '@angular/core';
import { AddUeDto, Ue } from '../../../Admin/Models/UE';
import { IconsService } from '../../../Services/icons.service';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { ActivatedRoute } from '@angular/router';
import { SemestreService } from '../../../Services/semestre.service';
import { Semestres } from '../../../Admin/Models/Semestre';
import { ClassRoom } from '../../../Admin/Models/Classe';

@Component({
  selector: 'app-view-ue',
  templateUrl: './view-ue.component.html',
  styleUrl: './view-ue.component.css'
})
export class ViewUeComponent implements OnInit {

  isShow_add_module: boolean = false;
  overlay: boolean = false;
  showUpdate: boolean = false;
  showDelete: boolean = false;
  ues: AddUeDto[]=[]
  idUeSelect!: AddUeDto
  filteredItems: AddUeDto[] = [];
  searchTerm: string = ''
  semestres: Semestres[]=[]
  idClasseNivFil!: number
  idSemestre!: number
  classe!: ClassRoom
  classesArchive: ClassRoom[]=[]

  constructor(public icons: IconsService, private semestreService: SemestreService,
    private classService: ClassStudentService,
    private root: ActivatedRoute){}

  ngOnInit(): void {
    this.load_ues();
  }

  load_ues(){
    this.root.queryParams.subscribe(param =>{
      this.idClasseNivFil = param['id'];
      this.classService.getClassByIdNivFiliere(this.idClasseNivFil).subscribe(classe =>{
       this.classe = classe
      })
      this.semestreService.getCurrentSemestresByIdNivFiliere(this.idClasseNivFil).subscribe(result =>{
        result.forEach(res =>{
          if(!this.semestres.some(sem =>sem.id == res.id)){
            this.semestres.push(res)
          }
        })
        console.log(this.semestres, "semestre")
      })

    
    })
    
  }
  // filter items on search
  filterUes(){
    if(!this.searchTerm){
     return this.filteredItems = this.ues;
    }
    return this.filteredItems = this.ues.filter(ue => 
      ue.idUe.nomUE.toLowerCase().includes(this.searchTerm.toLowerCase()) ||  // Recherche par nom de l'UE
      ue.modules.some(module => module.nomModule.toLowerCase().includes(this.searchTerm.toLowerCase())) // Recherche par nom des modules
    );
  }

  // add ue 
  addUe(){
    this.isShow_add_module = true;
    this.overlay = true
  }
  //load all semestre oc classe
 
  onSelect(event: any){
    this.idSemestre = event.target.value;
     this.classService.getAll_ue(this.idClasseNivFil,this.idSemestre).subscribe(result =>{
     this.ues = result;
        console.log(this.ues, "ues")
      })
  }
  goBack(){
    window.history.back();
  }

  // close modal to add ue
  closeModalToAddUe(){
    this.showUpdate = false;
    this.classService.getAll_ue(this.idClasseNivFil,this.idSemestre).subscribe(result =>{
      this.ues = result;
         console.log(this.ues, "ues")
       })
    this.isShow_add_module = false;
    this.showDelete = false;
    this.overlay = false;

  }
  // update ue
  updated(ue: AddUeDto){

    this.showDelete = false;
    this.idUeSelect = ue!
    this.showUpdate = true
    this.overlay = true
    // call service to update UE
  }

  // delete ue
  deleteted(ue: AddUeDto){
    this.showUpdate = false
    this.idUeSelect = ue!
    this.showDelete = true
    this.overlay = true

  }
}
