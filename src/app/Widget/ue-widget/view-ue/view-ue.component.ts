import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddNoteDto } from '../../../Admin/Models/Notes';
import { UeService } from '../../../Services/ue.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { Admin } from '../../../Admin/Models/Admin';
import { AdminUSER } from '../../../Admin/Models/Auth';

@Component({
  selector: 'app-view-ue',
  templateUrl: './view-ue.component.html',
  styleUrl: './view-ue.component.css'
})
export class ViewUeComponent implements OnInit, OnDestroy  {

  isShow_add_module: boolean = false;
  overlay: boolean = false;
  showUpdate: boolean = false;
  showDelete: boolean = false;
  showAddModule: boolean = false;
  ues: AddUeDto[]=[]
  modules: Ecue[] = [];
  idUeSelect!: AddUeDto
  moduleSelect!: Ecue
  filteredItems: AddUeDto[] = [];
  searchTerm: string = ''
  ueChecked!: Ue
  semestres: Semestres[]=[]
  semestre!: Semestres
  idClasseNivFil!: number
  idActive!: number
  idSemestre!: number
  classe!: ClassRoom
  der!: Admin
  ueForm!: FormGroup
  ueForms: { [key: number]: FormGroup } = {};
  idAnnee!: number
  classesArchive: ClassRoom[]=[]

  constructor(public icons: IconsService, private semestreService: SemestreService, 
    private fb: FormBuilder, private pageTite: PageTitleService,
    private classService: ClassStudentService, private router: Router, private eventService: EventServiceService,
    private root: ActivatedRoute, public classShared : Class_shared, private ueService: UeService){}

  ngOnInit(): void {
    this.load_ues();
    this.der = AdminUSER()?.der
    this.eventService.event$.subscribe(event =>{
     this.callBackUes(event)
    })
    
  }

  ngOnDestroy(): void {
    this.eventService.emitEvent(this.idAnnee);
  }

   // load form add
   load_form() {

    this.ueForms = {};  
    this.ues.forEach(ue => {
      ue.modules.forEach(module => {
        this.ueForms[module.id!] = this.fb.group({
          id: [module.id],
          volHCM: [module.volHCM, [Validators.min(0), Validators.max(120)]],
          volHTD: [module.volHTD, [Validators.min(0), Validators.max(80)]],
          volTPE: [module.volTPE, [Validators.min(0), Validators.max(80)]],
          volTP: [module.volTP, [Validators.min(0), Validators.max(80)]],
        });
        // console.log(this.ueForms, "form");
      });

    });
  }
  load_ues(){
    this.root.queryParams.subscribe(param =>{
      this.idClasseNivFil = param['id'];
      this.idAnnee = param['idAnnee'];
      this.classService.getClassById(this.idClasseNivFil).subscribe(classe =>{
       this.classe = classe
       console.log(classe, " la classe")
      })
      this.semestreService.getCurrentSemestresByIdNivFiliere(this.idClasseNivFil).subscribe(result =>{
        result.forEach((res )=>{
          if(!this.semestres.some(sem =>sem.id == res.id)){
            this.semestres.push(res)
            // if(res.){
             
            // }
          }
        })
        this.idSemestre = this.semestres[0].id!;
        this.classService.getAll_ue(this.idClasseNivFil,this.idSemestre).subscribe(result =>{
          this.ues = result;
          this.load_form()
        })
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
 
  onSelect(idSemestre: number){
    
      this.idSemestre = idSemestre;
      this.semestreService.getCurrentSemestresByIdNivFiliere(this.idClasseNivFil).subscribe(result =>{
        result.forEach(res =>{
          if(!this.semestres.some(sem =>sem.id == res.id)){
            this.semestres.push(res)

          }
        })
      this.semestre = this.semestres.find(s => s.id == this.idSemestre)!

      })
      
    

    this.semestre = this.semestres.find(s => s.id == this.idSemestre)!
     this.classService.getAll_ue(this.idClasseNivFil,this.idSemestre).subscribe(result =>{
     this.ues = result;
    this.load_form()
   
      })
      
  }

  onSubmit(moduleId: number, field: string, value: any) {
    if (this.ueForms[moduleId].invalid) {
      this.pageTite.showErrorToast('Veuillez entrer des valeurs correctes.');
      return;
    }
  
    const moduleUpdate = {
      id: moduleId,
      [field]: value
    };
    console.log(moduleUpdate, "update")
  // return
    this.ueService.updateModuleVolHoraire(moduleUpdate).subscribe({
      next: () => this.classService.getAll_ue(this.idClasseNivFil, this.idSemestre).subscribe(data => {
        this.ues = data;
      }),
      error: (res) => {
        this.pageTite.showErrorToast(res.error.message);
      }
    });
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
       })
    this.isShow_add_module = false;
    this.showDelete = false;
    this.overlay = false;
    this.showAddModule = false

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
  deleteted(module: Ecue){
    this.showUpdate = false
    this.moduleSelect = module!
    this.showDelete = true
    this.overlay = true
    // console.log(this.showDelete, "showDelete", this.moduleSelect, "moduleSelect")

  }

  // add notes
  addNote(module: Ecue, codeUe: string){

    console.log(this.idAnnee,"idAnnee", module.id, "codeUe", codeUe, this.idSemestre, "id Semestre")
    this.router.navigate(['/r-scolarite/student-notes'], {queryParams : {idModule: module.id, id: this.idClasseNivFil, idSemestre: this.idSemestre, idAnnee: this.idAnnee, code: codeUe}});
  }

  // addModules
  addModule(ue : Ue){
    this.ueChecked = ue
    this.showAddModule = true
    this.overlay = true
  }
}
