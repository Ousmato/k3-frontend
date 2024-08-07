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
import { Semestres } from '../../Models/Semestre';
import { SchoolInfo } from '../../Models/School-info';
import { SchoolService } from '../../../Services/school.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  
  fileName?: File;

  school?: SchoolInfo
  selectedUeId! : number

  semestres : Semestres[] = []

  addUe!: FormGroup;

  update_ue_form!: FormGroup
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
  isShow_add_semestre : boolean = false
  isshow_add_classe : boolean = false
  isshow_add_module : boolean = false
  isshow_update_module : boolean = false
  show_inputs_module_value: boolean = false

  isHow_delete: boolean = false;
  ueListForDelete: Ue[] = [];
  modulForDelete: Module[] = [];
  isHow_delete_module: boolean = false;

  constructor(private fb: FormBuilder, private schoolService: SchoolService, private pageTitle: PageTitleService,
    private service: SetService, public icons: IconsService, private router: Router){}
  
    ngOnInit() {;
    this.getSchoolInfo();
    // ------------------------------form ue
    this.addUe = this.fb.group({
      nomUE : ['', [Validators.required, Validators.maxLength(40)]]
    })

    this.load_ues();
    this.load_ue_form();
    this.get_semestres();
  
  }

  load_ues(){
    this.service.getAll_ue_all().subscribe(response =>{
      this.ueList = response;
    
    })
  
  }
 
  // -----------------------------------------------------------------
  show_input_filierre(){
    this.ishow_filiere =! this.ishow_filiere;
  }
  // -------------------------------------------create ue ----------------------------------------
  update_ue(id: number){
    const formData = this.update_ue_form.value;
    // console.log(formData, "fffff", id)
    const ue : Ue ={
      id: id,
      nomUE: formData.nomUE
    }
    if(this.update_ue_form.valid){
        this.service.updateUe(ue).subscribe({
          next: (response) =>{
            this.pageTitle.showSuccessToast(response.message + "Succè");
            this.load_ues();
            this.update_ue_form.reset();
            
            this.ishow_ue = false
          },
          error: (erreur) =>{
            this.pageTitle.showErrorToast(erreur.error.message)
          }
      })
    }else{
      this.update_ue_form.markAllAsTouched();
      console.log(this.update_ue_form.value, "invalid");
    }
   
  }

  onUeChange(event: any) {
    this.selectedUeId = event.target.value;
    const ueFind = this.ueList.find(u =>u.id == this.selectedUeId)
    console.log(ueFind, "ue trouver")
    this.update_ue_form.get('nomUE')?.setValue(ueFind?.nomUE);
    this.update_ue_form.get('id')?.setValue(ueFind?.id);
    
  }
  show_deleted(ueDelete: number){
    this.isshow_deleted =! this.isshow_deleted;
  }
  // ------------------------------------------------------------
  load_ue_form(){
    this.update_ue_form = this.fb.group({
      id: [''],
      nomUE: ['', [Validators.required, Validators.maxLength(40)]]
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
    if(this.addUe.valid){
      this.service.createUe(ue).subscribe({
        next: (response) =>{
          this.pageTitle.showSuccessToast(response.message);
          this.addUe.reset();
          this.load_ues();
          
        },
        error : (erreur) =>{
          this.pageTitle.showErrorToast(erreur.error.message + "Erreur")
        }
      })
    }else{
      this.addUe.markAllAsTouched();
    }
    
  }
  // --------------------------------------------------------------------
  show_input_classe(){
    this.ishow_classe =! this.ishow_classe;
  }
  // -----------------------------------------------------------------------
  show_add_class_form(){
    this.isshow_add_classe =! this.isshow_add_classe;
  }
 
  // -------------------------------get all semestre
  get_semestres(){
    this.service.getSemestres().subscribe(semestres => {
      this.semestres = semestres;
      console.log(semestres, "semestre----------------")
    })
  }
 
  // -------------------------------------------------------------------
  show_detail_semestre(){
    this.ishow_semestre_detail =! this.ishow_semestre_detail;

  }

  show_add_semestre(){
   this.isShow_add_semestre =! this.isShow_add_semestre;
  }
  // ---------------------------------------------------------------
  show_update_semestre(){
    this.ishow_semestre_update =! this.ishow_semestre_update
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
  this.isShow_add_semestre = false
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
  this.load_ues();
  this.get_semestres();

  }
  exit(){
     this.ueListForDelete = []
     this. ishow_module = false
     this.isHow_delete = false
     this.isHow_delete_module = false
     this.load_ues();
     this.isshow_update_module = false
     
  }
  // ----------------------------------------------------------
  show_update_module(){
    this.isshow_update_module =! this.isshow_update_module;
  
  }
  shwo_module_idUe(){
    this.show_inputs_module_value == true
  }
  // ----------------------------------------------get school information
  getSchoolInfo(){
    this.schoolService.getSchools().subscribe(info => {
      this.school = info;
        this.school.urlPhoto = `http://localhost/StudentImg/${this.school.urlPhoto}`;
        // this.load_school_input_value(this.school)
      })
    
  }

  // -------------------------------------------------
  onFileSelected(event: any)  {
    this.fileName = event.target.files[0];
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
  toggle_to_update_school(){
    this.router.navigate(['/sidebar/update-school']);
  }
  // --------------------------------------------------
  show_add_form_filiere(){
    this.isshow_add_filiere =! this.isshow_add_filiere;
  }

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
        
        // alert("Suppression effectuee succee!!")
        window.location.reload()
          console.log(value, "is ok")
      },
      error : (erreur) => {
        alert("Erreur lors de la suppression : "+erreur.error.message );
        console.log(erreur.error.message, "erreur")
      }
    })
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
      next : (value)=> {
       this.pageTitle.showSuccessToast(value.message)
      //  this.load_all_classe()
       this.load_ues()
        console.log(value, "is ok")
      },
      error : (erreur) => {
        this.pageTitle.showErrorToast(erreur.error.message+ "Erreur" );
        console.log(erreur.error.message, "erreur")
      }
    })
  }
 
}
