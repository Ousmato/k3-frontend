import { Component, OnDestroy, OnInit } from '@angular/core';
import { IconsService } from '../../../Services/icons.service';
import { NoteService } from '../../../Services/note.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InscriptionNoteDto } from '../../Models/Students';
import { SideBarService } from '../../../sidebar/side-bar.service';
import { Class_shared } from '../../../DGA/class-students/Utils/Class-shared-methods';
import { EtudeService } from '../Etudiants/etude.service';
import { Admin } from '../../Models/Admin';
import { AdminUSER } from '../../Models/Auth';
import { EventServiceService } from '../../../Services/event-service.service';

@Component({
  selector: 'app-semestre-moyennes',
  templateUrl: './semestre-moyennes.component.html',
  styleUrl: './semestre-moyennes.component.css'
})
export class SemestreMoyennesComponent implements OnInit, OnDestroy {

  idClasse!: number
  idAnnee!: number
  isConfirm: boolean = false
  searchTerm: string =""
  listIds: number[] = [];
  admin!: Admin;
  semestreMoyennes: InscriptionNoteDto[] = [];
  semestreMoyennesFiltered: InscriptionNoteDto[] = [];
  constructor(public icons: IconsService,
    public sharedMethode: Class_shared, private eventService: EventServiceService,
    private sideBarService: SideBarService, private noteService: NoteService, private root: ActivatedRoute) { }
  ngOnInit(): void {
    this.admin = AdminUSER()?.scolarite;
    this.getAllSemestreMoyens();
    this.sideBarService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filteredSemestreMoyennes();
  })
}
ngOnDestroy(): void {
  this.eventService.emitEvent(this.idAnnee);
}

  goback(){
    window.history.back();
  }

   // get all student moyens of semestre
   getAllSemestreMoyens(){
    this.root.queryParams.subscribe(params => {
      this.idClasse = +params['id'];
      this.idAnnee = +params['idAnnee'];
      this.noteService.getAllSemestreMoyen(this.idClasse).subscribe(res =>{
        this.semestreMoyennes =  res
        // console.log(this.semestreMoyennes, "moyennes")
      })
    });
    
  }

  // filter 
  filteredSemestreMoyennes(){
    if(!this.searchTerm){
      return this.semestreMoyennesFiltered = this.semestreMoyennes
    }else{
     return this.semestreMoyennesFiltered = this.semestreMoyennes.filter(sm => sm.nom.toLowerCase().includes(this.searchTerm.toLowerCase())||
     sm.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())
    )
    }
  }

  getObservation(inscrit: any): string {
    // Récupérer les données pour S1 et S2
    const s1 = inscrit.ueValidate.find((item: any) => item.nomSemestre.includes('S1'));
    const s2 = inscrit.ueValidate.find((item: any) => item.nomSemestre.includes('S2'));
  
    // Vérifier si les deux semestres ont une moyenne supérieure à 10
    if (s1?.moyenSemestre > 10 && s2?.moyenSemestre > 10) {
      if(!this.listIds.some(i => i == inscrit.id)){
      // console.log(inscrit.id, "id inscrit")
        this.listIds.push(inscrit.id);
      }
      return 'Admis';      

    }
  
    // Vérifier si un des semestres a une moyenne inférieure à 10
    if (s1?.moyenSemestre < 10 || s2?.moyenSemestre < 10) {
      const semestreEnEchec = s1?.moyenSemestre < 10 ? s1 : s2;
  
      // Vérifier si le pourcentage d'UE validées est supérieur à 75%
      if (semestreEnEchec?.percentUeSemestre > 75) {
        return 'Ajourné avec crédit';
      } else {
        return 'Ajourné';
      }
    }
  
    // Par défaut, retourner une chaîne vide
    return '';
  }

  // reinscription
  reInscritption(){
    this.isConfirm = true;
    console.log(this.listIds, "reinscription")
    // this.studentService.reInscriptionStudent(this.listIds, this.idClasse, this.admin.idAdministra!).subscribe(res => {
    //   console.log(res, "reinscription")
    //   this.listIds = [];
    //   // this.getAllSemestreMoyens();
    // })
  }

  closeModale(){
    this.isConfirm = false
  }
}
