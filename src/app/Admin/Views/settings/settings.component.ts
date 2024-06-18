import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetService } from './set.service';
import { Niveau } from '../../Models/Niveau';
import { Filiere } from '../../Models/Filieres';
import { NivFiliere } from '../../Models/NivFiliere';
import { ClassRoom } from '../../Models/Classe';
import { Ue } from '../../Models/UE';
import { Module } from '../../Models/Module';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  addFiliere!: FormGroup;
  niveaux: Niveau[] = [];
  addClass!: FormGroup;

  idNiveau!: Niveau
  objectNivFil: NivFiliere[]=[];
  classe: ClassRoom[]=[];
  addUe!: FormGroup;
  addModule!: FormGroup;
  ueList: Ue[]=[];
  ue!: Ue;
  constructor(private fb: FormBuilder, private service: SetService){}
  ngOnInit() {
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
        // console.log(this.objectNivFil);
      })
// ------------------------------------------get list ue-----------------------
  //  this.service.getAll_ue().subscribe((reponse: Ue[]) =>{
  //   this.ueList = reponse;

  //  })
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
      console.log(response);
      this.addClass.reset();
    })

    
  }
  // -------------------------------------------create ue ----------------------------------------
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
}
