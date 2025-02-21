import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Teacher } from '../../../Admin/Models/Teachers';
import { Module } from '../../../Admin/Models/Module';
import { ClassRoom } from '../../../Admin/Models/Classe';
import { Salles } from '../../../Admin/Models/Salles';
import { Emplois } from '../../EDT/Models/Emplois';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../EDT/Services/service.service';
import { EnseiService } from '../../../Admin/Views/Enseignant/ensei.service';
import { SeancService } from '../../EDT/Services/seanc.service';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { IconsService } from '../../../Services/icons.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { SalleService } from '../../../Services/salle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Seances } from '../../EDT/Models/Seances';
import { NivFiliere } from '../../../Admin/Models/NivFiliere';
import { Admin } from '../../../Admin/Models/Admin';
import { AdminUSER } from '../../../Admin/Models/Auth';
import { Journee } from '../../EDT/Models/Configure_seance';
import { EnumOptions } from '../../EDT/Utils/emum-options';

@Component({
  selector: 'app-der-edit-seance',
  templateUrl: './der-edit-seance.component.html',
  styleUrl: './der-edit-seance.component.css'
})
export class DerEditSeanceComponent implements OnInit{

 
  enseignants: Teacher[] = [];
  modules: Module [] =[];
  classes: ClassRoom [] = [];
  salles: Salles [] = [];
  emplois!: Emplois;
  idUrl!: number
  @Input() journee! : Journee

  @Output() closeUpdate = new EventEmitter<any>();
  enseig?: Teacher;
  salle?: Salles;
  nomModule?: Module;
  admin!: Admin

  form_seance?: FormGroup
  constructor(public enum_options: EnumOptions, public icons: IconsService,
    private enseignantService: EnseiService, private pageTitle: PageTitleService,
   private fb: FormBuilder, private classService: ClassStudentService, private route: ActivatedRoute, private router: Router, private seanceService: SeancService, private salleService: SalleService){}


  ngOnInit(): void {
    this.load_form(); 
    this.admin = AdminUSER()?.der
    
      this.load_enseignants();
      this.getSeance_date();
      this.load_salles();
     
  }

   // ------------------------load form

   load_form(){
    this.form_seance = this.fb.group({
      
      heureDebut: [this.journee.heureDebut, Validators.required],
      heureFin: [this.journee.heureFin, Validators.required],
      seanceType: ['', Validators.required],
      idSalle: [''],
      idTeacher: [''],
      // date: [this.journee.date],
      
    });
  }


   // -----------------------------------load all enseignants
   load_enseignants(){
    this.enseignantService.getAll().subscribe(data => {
      this.enseignants = data;
    })
  }

  // --------------------------load salle
  load_salles(){
    this.salleService.getAll_non_occuper().subscribe(data =>{
      this.salles = data;
    })
  }


  updat_seance(){
    const formData = this.form_seance?.value;
    const { noteModule, ...idModuleWithoutNoteModule } = this.journee.idEmplois.idModule;
    const tchr : Teacher = this.journee.idTeacher
    this.journee.idEmplois.idModule = { ...idModuleWithoutNoteModule };
      const idEmploi = this.journee.idEmplois;
      const idTeacher : Teacher = formData.idTeacher != '' ? this.enseignants.find(t => t.idEnseignant == +formData.idTeacher)! : this.journee.idTeacher;
      const idSalle  = formData.idSalle != '' ?  this.salles.find(s => s.id == +formData.idSalle)! : this.journee.idSalle;
      const seanceType = formData.seanceType != '' ? formData.seanceType : this.journee.seanceType;
      const {desable,...newTeacher} = idTeacher
      console.log(newTeacher, "newTeacher")

      const enseignant = { 
        idEnseignant: idTeacher.idEnseignant, 
        nom: idTeacher.nom, 
        prenom: idTeacher.prenom, 
        email: idTeacher.email, 
        dateNaissance: idTeacher.dateNaissance, 
        sexe: idTeacher.sexe,  
        diplome: idTeacher.diplome, 
        telephone: idTeacher.telephone, 
        urlPhoto: idTeacher.urlPhoto, 
        status: idTeacher.status,
        admin: idTeacher.admin
      }
      // const sall ={
      //   id: this.journee.idSalle.id,
      //   nom: idSalle.nom,
      //   nombrePlace: idSalle.nombrePlace,
      // }
      const seance: Journee = {
        id: this.journee.id,
        heureDebut: formData.heureDebut,
        heureFin: formData.heureFin,
        date: this.journee.date,
        idEmplois: idEmploi,
        idTeacher: enseignant,
        idSalle: idSalle,
        seanceType: seanceType,
        // idClasse: idEmploi.idClasse
        
      }
      // console.log(seance, "seance")
      // return
        console.log("valid :", seance)
          this.seanceService.update(seance).subscribe({
          next : (resp) =>{
           this.pageTitle.showSuccessToast(resp.message)
            this.closeUpdate.emit()
            
          },
          error : (erreur) => {
            this.pageTitle.showErrorToast(erreur.error.message);
          }
        })

  }

  // ------------select mention
  onSelect(event : any){
  
  }


  // ----------------------------get automatic date 
  getSeance_date(){
    this.form_seance?.get("jour")?.valueChanges.subscribe((value: any) => {
      if(value){
        this.form_seance?.get("date")?.setValue(value);
        // console.log("change") 
      }else{
        this.form_seance?.get("date")?.setValue('');
      }
    })

  }

  closeModal(){
    this.closeUpdate.emit()
  }
}
