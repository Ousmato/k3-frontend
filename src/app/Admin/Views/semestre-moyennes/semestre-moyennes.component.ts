import { Component, OnDestroy, OnInit } from '@angular/core';
import { IconsService } from '../../../Services/icons.service';
import { NoteService } from '../../../Services/note.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InscriptionNoteDto } from '../../Models/Students';
import { SideBarService } from '../../../sidebar/side-bar.service';
import { Class_shared } from '../../../DGA/class-students/Utils/Class-shared-methods';
import { EtudeService } from '../Etudiants/etude.service';
import { Admin } from '../../../administrations/shared/models/Admin';
import { EventServiceService } from '../../../Services/event-service.service';
import { utils } from '../../../administrations/shared/utils/utils';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { ClassRoom } from '../../Models/Classe';
import { getUser } from '../../../administrations/shared/models/auth';

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
  classe!: ClassRoom
  classeNames!: string
  semestreMoyennes: InscriptionNoteDto[] = [];
  semestreMoyennesFiltered: InscriptionNoteDto[] = [];
  constructor(public icons: IconsService, public util: utils, private classeService: ClassStudentService,
    public sharedMethode: Class_shared, private eventService: EventServiceService, private studentService: EtudeService,
    private sideBarService: SideBarService, private noteService: NoteService, private root: ActivatedRoute) { }
  ngOnInit(): void {
    this.admin = getUser();
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
      this.classeService.getClassById(this.idClasse).subscribe(classe => {
        this.classe = classe
        this.classeNames = `${classe.idFiliere?.idNiveau.nom} ${this.util.abrevigate(classe.idFiliere?.idFiliere.nomFiliere!)}`

       
      })
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
    const semestres = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];

        // Récupérer les données pour chaque semestre
        const semestresData = semestres.map(sem => 
            inscrit.ueValidate.find((item: any) => item.nomSemestre.includes(sem))
            
        );

    // const s1 = inscrit.ueValidate.find((item: any) => item.nomSemestre.includes('S1'));
    // const s2 = inscrit.ueValidate.find((item: any) => item.nomSemestre.includes('S2'));
  
    // Vérifier si les deux semestres ont une moyenne supérieure à 10
    if (semestresData[0]?.moyenSemestre > 10 && semestresData[1]?.moyenSemestre > 10) {
      // if(!this.listIds.some(i => i == inscrit.id)){
      // // console.log(inscrit.id, "id inscrit")
      //   this.listIds.push(inscrit.id);
      // }
      return 'Admis';      

    }
  
    // Vérifier si un des semestres a une moyenne inférieure à 10
    if (semestresData[0]?.moyenSemestre < 10 || semestresData[1]?.moyenSemestre < 10) {
      const semestreEnEchec = semestresData[0]?.moyenSemestre < 10 ? semestresData[1] : semestresData[1];
  
      // Vérifier si le pourcentage d'UE validées est supérieur à 75%
      if (semestreEnEchec?.percentUeSemestre > 75) {
        return 'Admin avec crédit';
      } else {
        return 'Ajourné';
      }
    }
  
    // Par défaut, retourner une chaîne vide
    return '';
  }

  isChecked(idInscrit: number): boolean {
    return this.listIds.some(i => i == idInscrit);
  }

  onChecked(idInscrit: number){
    if(!this.listIds.some(i => i == idInscrit)){
      this.listIds.push(idInscrit);
    }
    else{
      this.listIds = this.listIds.filter(i => i != idInscrit);
    }
    console.log(this.listIds, "list ids")
  }

  // reinscription
  reInscritption(){
    this.isConfirm = true;
    console.log(this.listIds, "reinscription")
    this.studentService.reInscriptionStudent(this.listIds, this.idClasse, this.admin.id!).subscribe(res => {
      console.log(res, "reinscription")
      this.listIds = [];
      // this.getAllSemestreMoyens();
    })
  }

  closeModale(){
    this.isConfirm = false
  }
}
