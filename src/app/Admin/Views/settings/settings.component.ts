import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetService } from './set.service';
import { Niveau } from '../../Models/Niveau';
import { Filiere } from '../../Models/Filieres';
import { NivFiliere } from '../../Models/NivFiliere';
import { ClassRoom } from '../../Models/Classe';
import { Ue } from '../../Models/UE';
import { Module } from '../../Models/Module';
import { IconsService } from '../../../Services/icons.service';
import { ClassStudentService } from '../class-students/class-student.service';
import { Semestres } from '../../Models/Semestre';
import { SchoolInfo } from '../../Models/School-info';
import { SchoolService } from '../../../Services/school.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  addFiliere!: FormGroup;
  niveaux: Niveau[] = [];
  addClass!: FormGroup;
  errorMessage!: string;
  fileName?: File;

  idNiveau!: Niveau
  school!: SchoolInfo
  selectedUeId! : number
  selectedClasseId! : number
  moduleFind! : Module
  selectedFiliereId! : number
  selectedSemestreId! : number
  selectedUeId_module!: number

  objectNivFil: NivFiliere[]=[];
  classes: ClassRoom[]=[];
  modules: Module [] = []
  semestres : Semestres[] = []
  schoolInfo : SchoolInfo [] = []

  addUe!: FormGroup;
  addModule!: FormGroup;

  update_filiere_form!: FormGroup
  update_classe_form!: FormGroup
  update_ue_form!: FormGroup
  update_module_form!: FormGroup
  update_semestre_form!: FormGroup
  update_school_form!: FormGroup
  ueList: Ue[]=[];
  ue!: Ue;

  ishow_ue: boolean = false
  ishow_classe : boolean = false
  isshow_deleted: boolean = false
  ishow_module: boolean = false
  ishow_filiere: boolean = false
  ishow_semestre_detail: boolean = false
  ishow_semestre_update: boolean = false
  isshow_school_detail: boolean = false
  isshow_school_update: boolean = false
  isshow_add_filiere : boolean = false
  isshow_add_ue : boolean = false
  ishow_module_select_ue : boolean = true
  isshow_add_classe : boolean = false
  isshow_add_module : boolean = false
  show_inputs_module_value: boolean = false

  isHow_delete: boolean = false;
  ueListForDelete: Ue[] = [];
  modulForDelete: Module[] = [];
  isHow_delete_module: boolean = false;

  constructor(private fb: FormBuilder, private schoolService: SchoolService,
    private service: SetService, public icons: IconsService, private classService: ClassStudentService){}
  ngOnInit() {
    this.load_school_form();
    this.getSchoolInfo();
    // -------------------------------------form filiere
    this.addFiliere = this.fb.group({
      idNiveau: ['',Validators.required],
      nomFiliere: ['',Validators.required]
    });
    // --------------------------------------------form classe
    this.addClass = this.fb.group({
      effectifs: ['',Validators.required],
      idNiveau: ['',Validators.required],
      scolarite: ['',Validators.required]
    });
    // ------------------------------form ue
    this.addUe = this.fb.group({
      nomUE : ['', Validators.required]
    })
    // ---------------------------------form module
    this.addModule = this.fb.group({
      nomModule : ['', Validators.required],
      coefficient : ['', Validators.required],
      idUe : ['', Validators.required]

    })
    // ----------------------get liste niveau-------------------------------------
    this.service.getAll().subscribe((niveaux: Niveau[]) => {
      this.niveaux = niveaux;
      
    });
// ------------------------get liste niveau filiere-----------------------------------
    this.service.getAll_Niveau_filiere().subscribe((
      nivFil: NivFiliere[]) =>{
        this.objectNivFil = nivFil;
        console.log(this.objectNivFil, "--------------------------fili");
        this.load_filiere_input_value(nivFil)
      })

  //  =============================================================================
  
  this.load_ue_form();
  this.load_form_class();
  this.load_all_classe();
  this.load_filiere_form();
  this.get_semestres();
  this.load_semestre_form();
  
  this.load_module_form();
  
  }
 

  // -----------------------------------lod classe
  load_all_classe(){
    this.classService.getAll().subscribe((res: ClassRoom[]) =>{
      this.classes = res;
      this.load_classe_input_value(res);
    })
  }
  
  // --------------------------send filiere to backend---------------------------------
  send(){
    const formData = this.addFiliere.value;
    const niveau: Niveau = this.niveaux.find(niv => niv.id === +formData.idNiveau)!;

    const filiere: Filiere = {
      nomFiliere: formData.nomFiliere
    };

    this.service.createFiliere(filiere).subscribe((createdFiliere: Filiere) => {
      const nivFiliere = {
        idNiveau: niveau,
        idFiliere: createdFiliere
      };

      this.service.addFiliere(nivFiliere).subscribe(response => {
        console.log('Filiere ajoutée avec succès', response);
        this.addFiliere.reset();
      }, error => {
        console.error('Erreur lors de l\'ajout de la filiere', error);
      });
    }, error => {
      console.error('Erreur lors de la création de la filiere', error);
    });
  }
  // --------------------------------------------------------------
  update_filiere(id: number){
    const formData = this.update_filiere_form.value;
    const object = this.objectNivFil.find(fl => fl.id == id);

    const f: Filiere ={
      id: object?.idFiliere.id,
      nomFiliere: formData.idFiliere

    }

    const n: Niveau ={
      id: object?.idNiveau.id!,
      nom: formData.idNiveau
    }
    const filiere: NivFiliere = {
      id: id,
      idFiliere: f,
      idNiveau: n
    };
    console.log(filiere, "--=-=-=--=-=-=-=")
    this.service.updateNiveauFiliere(filiere).subscribe(response =>{
      console.log(response,"resp")
      alert("Mise a jours effectuee ave succees!!")
      this.update_filiere_form.reset();
      window.location.reload();
    })
    console.log(filiere, "niv------------------")
  }
  // -----------------------------------------------------------
  onFiliereChange(event: any) {
    this.selectedFiliereId = event.target.value;

    this.load_filiere_input_value(this.objectNivFil, +event.target.value);
    
  }
  // -------------------------------------------------------
  load_filiere_form(){
    this.update_filiere_form = this.fb.group({
      id: [''],
      idFiliere: ['', Validators.required],
      idNiveau: ['', Validators.required]
    });
  }
  // -----------------------------------------------------------------
  
  load_filiere_input_value(nivFil?: NivFiliere[], id?: number){
    const selectFiliere = nivFil?.find( fil => fil.idFiliere.id === id)!;
   
    console.log( selectFiliere, "filiere trover")
    this.update_filiere_form.get('idFiliere')?.setValue(selectFiliere?.idFiliere.nomFiliere);
    this.update_filiere_form.get('idNiveau')?.setValue(selectFiliere?.idNiveau.nom);

  }
  // -----------------------------------------------------------------
  show_input_filierre(){
    this.ishow_filiere =! this.ishow_filiere;
  }
  
  // --------------------------------------------create classroom---------------------
  createClassroom(){
    const formData = this.addClass.value;
    const filiere: NivFiliere = this.objectNivFil.find(niv => niv.id === +formData.idNiveau)!;
    const classe: ClassRoom = {
      effectifs: formData.effectifs,
      scolarite: formData.scolarite,
      idFiliere: filiere
    }
    this.service.addClass(classe).subscribe(response => {
      console.log("ici", response)
      console.log(response);
      this.addClass.reset();
    })

  }
  // -------------------------------------------create ue ----------------------------------------
  update_ue(id: number){
    const formData = this.update_ue_form.value;
    // console.log(formData, "fffff", id)
    const ue : Ue ={
      id: id,
      nomUE: formData.nomUE
    }
    this.service.updateUe(ue).subscribe(response =>{
      // console.log(response);
      alert("Mise à jour effectuée avec succès!")
      this.update_ue_form.reset();
      window.location.reload();
    })
  }

  onUeChange(event: any) {
    this.selectedUeId = event.target.value;
    const ueFind = this.ueList.find(u =>u.id == this.selectedUeId)
    console.log(ueFind, "ue trouver")
    this.update_ue_form.get('nomUE')?.setValue(ueFind?.nomUE);
    // this.load_ue_input_value(this.ueList, +event.target.value);
    
  }
  show_deleted(ueDelete: number){
    this.isshow_deleted =! this.isshow_deleted;
  }
  // ------------------------------------------------------------
  load_ue_form(){
    this.update_ue_form = this.fb.group({
      id: [''],
      nomUE: ['', Validators.required]
    });
  }
  // --------------------------------------------------------
  show_input_ue(){
    console.log(this.selectedUeId, "eve-id-ue")
    this.service.getAll_ue_all().subscribe(response =>{
      this.ueList = response;
    
    })
    this.ishow_ue =! this.ishow_ue;
    
  }
  // ------------------------------------------------
  show_add_ue_form(){
    this.isshow_add_ue =! this.isshow_add_ue;
  }
  // -----------------------------------------------------------
  creatUe(){
    const formData = this.addUe.value;
    const ue: Ue = {
      nomUE: formData.nomUE
    }
    this.service.createUe(ue).subscribe(response => {
      console.log(response);
      alert("Ajout Effectuee avec succees!")
      this.addUe.reset();
    })
  }
  // ---------------------------------------update classe ------------------------
  onClasseChange(event: any) {
    this.selectedClasseId = event.target.value;
    this.load_classe_input_value(this.classes, +event.target.value);
    
  }
  // -----------------------------------------------------------------------
  load_form_class(){
    this.update_classe_form = this.fb.group({
      id: [''],
      idFiliere: [''],
      // effectifs: ['', Validators.required],
      scolarite: ['', Validators.required]
    });
  }
  // --------------------------------------------------------------------
  show_input_classe(){
    this.ishow_classe =! this.ishow_classe;
  }
  // -----------------------------------------------------------------------
  show_add_class_form(){
    this.isshow_add_classe =! this.isshow_add_classe;
  }
  // -----------------------------------------------------------------------------
  update_classe(id: number){
    const formData = this.update_classe_form.value;
  const fliere =  formData.idFiliere;
    const classe : ClassRoom ={
      id: id,
      // effectifs: formData.effectifs,
      scolarite: formData.scolarite,
      idFiliere: fliere
    }
    this.classService.update_classe(classe).subscribe(response =>{
      // console.log(response);
      alert("Mise à jour effectuée avec succès!")
      this.update_classe_form.reset();
      window.location.reload();
    })
  }
  // ---------------------------------------------------------------------
  load_classe_input_value(classes?: ClassRoom[], id?: number){
    const selectClasse = classes!.find(cl => cl.id === id);
    console.log(selectClasse, "class trover")
    this.update_classe_form.get('idFiliere')?.setValue(selectClasse?.idFiliere);
    this.update_classe_form.get('scolarite')?.setValue(selectClasse?.scolarite);
  }
  // ------------------------------------------add module------------------------------------
  creatModule(){
    const formData = this.addModule.value;
    const ue: Ue = this.ueList.find(ue => ue.id === +formData.idUe)!;
    const module: Module = {
      nomModule: formData.nomModule,
      coefficient: formData.coefficient,
      idUe: ue
    }
    this.service.createModule(module).subscribe(response => {
      console.log(response);
      alert("Ajout Effectuee avec succees!")
      this.addModule.reset();
    })
  }
  // -------------------------------get all semestre
  get_semestres(){
    this.service.getSemestres().subscribe(semestres => {
      this.semestres = semestres;
      console.log(semestres, "semestre----------------")
    })
  }
  // ---------------------------------------update semestre
  load_semestre_form(){
    this.update_semestre_form = this.fb.group({
      id: [''],
      nomSemetre: ['', Validators.required],
      dateDebut: ['', Validators.required],
      datFin: ['', Validators.required]
    });
  }
  update_semestre(id: number){
    const formData = this.update_semestre_form.value;
    const semestre : Semestres ={
      id: id,
      nomSemetre: formData.nomSemetre,
      dateDebut: formData.dateDebut,
      datFin: formData.datFin
    }
    this.service.updateSemestre(semestre).subscribe(response =>{
      // console.log(response);
      alert("Mise à jour effectuée avec succès!")
      this.update_semestre_form.reset();
      window.location.reload();
    },
    error => {
      this.errorMessage = error;
      alert("Error : "+ this.errorMessage);
    }
  )

  }
  // -------------------------------------------------------------------
  show_detail_semestre(){
    this.ishow_semestre_detail =! this.ishow_semestre_detail;

  }
  // ---------------------------------------------------------------
  show_update_semestre(){
    this.ishow_semestre_update =! this.ishow_semestre_update
  }
  // ----------------------------------------------------------------
  onSemestreChange(event: any){
    this.selectedSemestreId = event.target.value;
    this.load_semestre_input_value(this.semestres, +event.target.value);
    
  }
  // -----------------------------------------------------------------
  load_semestre_input_value(semestre: Semestres[], id: number){
    const selectSemestre = semestre.find(sem => sem.id === id);
    console.log(selectSemestre, "semestre trover")
    this.update_semestre_form.get('nomSemetre')?.setValue(selectSemestre?.nomSemetre);
    this.update_semestre_form.get('dateDebut')?.setValue(selectSemestre?.dateDebut);
    this.update_semestre_form.get('datFin')?.setValue(selectSemestre?.datFin);

  }
  // ------------------------------------------update modules
  onModuleUeChange(event: any){
    const idUe_event = event.target.value
    console.log("ues-event", idUe_event)
  
  }
   // -----------------------get all modules
   
  show_module_form(){
    this.service.getAll_ue_all().subscribe(response =>{
      this.ueList = response;
    
    })
    this.isshow_add_module =! this.isshow_add_module;
  }
  annuler(){
  this.ishow_ue = false
  this.modules = []
  this.ishow_classe  = false
  
  this. ishow_filiere = false
  this. ishow_semestre_detail = false
  this. ishow_semestre_update = false
  this. isshow_school_detail = false
  this. isshow_school_update = false
  this. isshow_add_filiere  = false
  this. isshow_add_ue  = false
  this. isshow_add_classe  = false
  this. isshow_add_module  = false
  this. show_inputs_module_value = false

  }
  exit(){
     this.modules = []
     this.ueListForDelete = []
     this. ishow_module = false
     this.isHow_delete = false
     this.isHow_delete_module = false
     
  }
  // ----------------------------------------------------------
  show_update_module(){
    this.classService.allModuleWithoutNotes().subscribe((mods: Module[]) => {
      this.modules = mods; 
      console.log("les modules")
    
    })
  }
  shwo_module_idUe(){
    this.show_inputs_module_value == true
  }
  // ----------------------------------------------------
  onModuleChange(event: any){
    const moduleId_event = event.target.value;
    this.moduleFind = this.modules.find(m =>m.id == moduleId_event)!;
    this.update_module_form.get('nomModule')?.setValue(this.moduleFind.nomModule);
    this.update_module_form.get('coefficient')?.setValue(this.moduleFind!.coefficient);
    this.update_module_form.get('idUe')?.setValue(this.moduleFind?.idUe.nomUE);
    this. ishow_module = true

    // this.load_module_input_value(this.modules, this.selectedModuleId);
  }
  
  // ------------------------------------------------
  load_module_form(){
    this.update_module_form = this.fb.group({
      id: [''],
      nomModule: [''],
      coefficient: [''],
      idUe: ['']
    });
  }
// ------------------------------------------------
  update_module(moduleFind: Module){
   const formData = this.update_module_form.value
   const module : Module = {
    id: formData.id,
    nomModule: formData.nomModule,
    coefficient: formData.coefficient,
    idUe: moduleFind?.idUe!
   }
   console.log(module, "mmmmmm")
  //  return
    this.service.updateModule(module!).subscribe(response => {
      console.log(response);
      alert("Modification Effectuee avec succees!")
      this.update_module_form.reset();
      window.location.reload()
    })
  }
  // ----------------------------------------------get school information
  getSchoolInfo(){
    this.schoolService.getSchools().subscribe(info => {
      this.school = info;
        this.school.urlPhoto = `http://localhost/StudentImg/${this.school.urlPhoto}`;
      })
      this.load_school_input_value(this.school)
      console.log(this.school, "school info----------------")
    
  }
  // ---------------------------------------
  load_school_form(){
    this.update_school_form = this.fb.group({
      id: [''],
      nomSchool: ['', Validators.required],
      localite: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      debutAnnee: ['', Validators.required],
      finAnnee: ['', Validators.required],
      // urlPhoto: ['']
      
    });
  } 
  // -------------------------------------------------
  onFileSelected(event: any)  {
    this.fileName = event.target.files[0];
  }
 
  // --------------------------------------------------------
  update_school(){
    const fomData = this.update_school_form.value;
    console.log(fomData, "fomdata")
  
    const school : SchoolInfo ={
      id: fomData.id,
      nomSchool: fomData.nomSchool,
      localite: fomData.localite,
      email: fomData.email,
      telephone: fomData.telephone,
      debutAnnee: fomData.debutAnnee,
      finAnnee: fomData.finAnnee,
      // urlPhoto: this.fileName.name
    }
    console.log(school, "scccool")
    this.schoolService.updateSchools(school, this.fileName!).subscribe(response =>{
      // console.log(response);
      alert("Mise à jour effectuée avec succès!")
      this.update_school_form.reset();
      window.location.reload();
    })
    // console.log(school, "------------------scool")
  }
 
  // -------------------------------------------------------------------
  show_school_detail(){
    this.isshow_school_detail =! this.isshow_school_detail;
    
  }
  preventClick(event: MouseEvent): void {
    event.stopPropagation(); // Empêche la propagation de l'événement de clic
  }
  preventClick_delete(event: MouseEvent): void {
    event.stopPropagation(); // Empêche la propagation de l'événement de clic
  }
  // ----------------------------------------------------------
  show_school_update(){
    this.isshow_school_update =! this.isshow_school_update;
  }
  // --------------------------------------------------
  show_add_form_filiere(){
    this.isshow_add_filiere =! this.isshow_add_filiere;
  }
  // ---------------------------------------------------------------
  load_school_input_value(school?: SchoolInfo){
    this.update_school_form.get('nomSchool')?.setValue(school?.nomSchool);
    this.update_school_form.get('email')?.setValue(school?.email);
    this.update_school_form.get('telephone')?.setValue(school?.telephone);
    this.update_school_form.get('debutAnnee')?.setValue(school?.debutAnnee);
    this.update_school_form.get('finAnnee')?.setValue(school?.finAnnee);
    this.update_school_form.get('localite')?.setValue(school?.localite);
    this.update_school_form.get('id')?.setValue(school?.id);
    // this.update_school_form.get('urlPhoto')?.setValue(school?.urlPhoto.);
  }



  // ===========================================================
 

  showDeleted() {
      this.service.getAll_ue_all_without_module_and_classe().subscribe(response =>{
      this.ueListForDelete = response;
      this.isHow_delete = ! this.isHow_delete
    })
  }
  // --------------------------------------method delete ----------------ue 
  deleted_ue(idUe: number){
    this.service.deleteUe(idUe).subscribe({
      next(value) {
        alert("Suppression effectuee succee!!")
        window.location.reload()
          console.log(value, "is ok")
      },
      error : (erreur) => {
        alert("Erreur lors de la suppression : "+erreur.error.message );
        console.log(erreur.error.message, "erreur")
      }
    })
    console.log(idUe, "value")
    // this.ueListForDelete  = []
  }
  // ----------------------------------------delete module
  delete_module(){
    this.service.getAll_module_without_note().subscribe(respnse =>{
      this.modulForDelete = respnse;
      this.isHow_delete_module =! this.isHow_delete_module
    })
  }
  // ---------------------------------------------------------
  deleted_module(idModule: number){
    this.service.deleteModule(idModule).subscribe({
      next(value) {
        alert("Suppression effectuee avec succees!")
        window.location.reload()
        console.log(value, "is ok")
      },
      error : (erreur) => {
        alert("Erreur lors de la suppression : "+erreur.error.message );
        console.log(erreur.error.message, "erreur")
      }
    })
    console.log(idModule, "value")
    // this.modulForDelete = []
  }
 
}
