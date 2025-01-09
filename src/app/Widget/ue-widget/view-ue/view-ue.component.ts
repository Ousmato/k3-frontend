import { Component, OnInit } from '@angular/core';
import { AddUeDto, Ue } from '../../../Admin/Models/UE';
import { IconsService } from '../../../Services/icons.service';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SemestreService } from '../../../Services/semestre.service';
import { Semestres } from '../../../Admin/Models/Semestre';
import { ClassRoom } from '../../../Admin/Models/Classe';
import { Ecue } from '../../../Admin/Models/Module';
import { Class_shared } from '../../../DGA/class-students/Utils/Class-shared-methods';
import { EventServiceService } from '../../../Services/event-service.service';

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
  semestre!: Semestres
  idClasseNivFil!: number
  idSemestre!: number
  classe!: ClassRoom
  idAnnee!: number
  classesArchive: ClassRoom[]=[]

  constructor(public icons: IconsService, private semestreService: SemestreService,
    private classService: ClassStudentService, private router: Router, private eventService: EventServiceService,
    private root: ActivatedRoute, public classShared : Class_shared){}

  ngOnInit(): void {
    this.load_ues();
    this.eventService.event$.subscribe(event =>{
     this.callBackUes(event)
    })
    
  }

  load_ues(){
    this.root.queryParams.subscribe(param =>{
      this.idClasseNivFil = param['id'];
      this.idAnnee = param['query'];
      this.classService.getClassById(this.idClasseNivFil).subscribe(classe =>{
       this.classe = classe
       console.log(classe, " la classe")
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
    if(event && event.target && event.target.value){
      this.idSemestre = event.target.value;

    }
    else{
      this.idSemestre = event;
      this.semestreService.getCurrentSemestresByIdNivFiliere(this.idClasseNivFil).subscribe(result =>{
        result.forEach(res =>{
          if(!this.semestres.some(sem =>sem.id == res.id)){
            this.semestres.push(res)
          }
        })
      this.semestre = this.semestres.find(s => s.id == this.idSemestre)!

      })
      
    }

    this.semestre = this.semestres.find(s => s.id == this.idSemestre)!
     this.classService.getAll_ue(this.idClasseNivFil,this.idSemestre).subscribe(result =>{
     this.ues = result;
        // console.log(this.ues, "les ues dans le select")
      })
  }
  goBack(){
    window.history.back();
  }

  callBackUes(event: any){
    if(event != undefined && event != null && event != ""){
      console.log("callBackUes")
      this.onSelect(event);
    this.filterUes();
    }
    
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

  addNote(module: Ecue){
    console.log(this.idAnnee,"idAnnee", module.id)
    this.router.navigate(['/r-scolarite/student-notes'], {queryParams : {idModule: module.id, id: this.idClasseNivFil, idSemestre: this.idSemestre, idAnnee: this.idAnnee}});
  }
}
