import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { Student_Enum_Options } from '../Utils/Student-enum-options';
import { IconsService } from '../../../../Services/icons.service';
import { AnneeScolaire } from '../../../Models/School-info';
import { StudentSharedMethods } from '../Utils/Student-shared-methode';
import { InscriptionService } from '../../../../Services/inscription.service';
import { AdminUSER } from '../../../Models/Auth';
import { Admin } from '../../../Models/Admin';
import { Router } from '@angular/router';
Chart.register(...registerables)

@Component({
  selector: 'app-student-statistique',
  templateUrl: './student-statistique.component.html',
  styleUrl: './student-statistique.component.css'
})
export class StudentStatistiqueComponent implements OnInit,  OnChanges{

  statusOptions: {key: string, value: string} [] =  []
  showStatus: boolean[] = [];
  showFilieres: boolean[] = [];
  currentYear!: number
  @Input() statistics!: any
  @Output() statEvent = new EventEmitter<any>()
  
  scolarite!: Admin
  filiereInscrit: any[] = [];
  statusInscrits: any[] = [];


  annees: AnneeScolaire[] = []
  index!: number | null
  @Input() idAnnee!: number | null

  constructor(public enum_options: Student_Enum_Options, private router: Router,
    public icons: IconsService, public student_shared_method: StudentSharedMethods){}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['statistics'] || changes['idAnnee']) {
      console.log('Statistiques mises à jour :', this.statistics, this.idAnnee);
      
      this.filiereInscrit = this.statistics.filiereInscrit
      this.statusInscrits = this.statistics.statusInscrits

      this.student_shared_method.createChart(this.statistics);
      this.readShowTemplateModel()
      // this.get_statistiqueByIdYear(this.idAnnee);
      // this.statEvent.emit(this.statistics)
      // Mettre à jour la logique du composant ici
    }
  }
  ngOnInit(): void {
    this.scolarite = AdminUSER()?.scolarite
   
      // Initially, only the first two statuses are visible
   
  }
 
  // chose index
  choseIndex(index: number){
    const visibleCount = this.showStatus.filter(status => status).length;

    // If more than 2 statuses are visible, hide the first visible status
    if (visibleCount >= 2) {
      // Find the first visible status and hide it
      const firstVisibleIndex = this.showStatus.indexOf(true);
      this.showStatus[firstVisibleIndex] = false;
      this.showStatus.push(true);
    }

    // Toggle the clicked status visibility
    this.showStatus[index] = !this.showStatus[index];
  }

  choseIndexFiliere(index: number){
    const visibleCount = this.showFilieres.filter(status => status).length;
    // If more than 2 filiere are visible, hide the first visible filiere
    if (visibleCount >= 2) {
      // Find the first visible filiere and hide it
      const firstVisibleIndex = this.showFilieres.indexOf(true);
      this.showFilieres[firstVisibleIndex] = false;
      this.showFilieres.push(true);
    }
    // Toggle the clicked filiere visibility
    this.showFilieres[index] =!this.showFilieres[index];
  }

 
  // read show template model
  readShowTemplateModel() {
    this.showStatus = new Array(this.statusInscrits.length).fill(false);
    this.showStatus[0] = true;  // First status is visible
    this.showStatus[1] = true; 

    this.showFilieres = new Array(this.filiereInscrit.length).fill(false)
    this.showFilieres[0] = true;  // First filiere is visible
    this.showFilieres[1] = true
  }
  // toggle to student by filiere
  toggle_to_filiere_student(idFiliere: number, isPaye : boolean) {
    this.router.navigate(['/r-scolarite/filiere-student'], { queryParams: {idFiliere: idFiliere, isPaye: isPaye, idAnnee: this.idAnnee }});
  }
  // toggle to student by status
  toggle_to_status_student(status: string, isPaye: number){
    this.router.navigate(['/r-scolarite/status-student'], { queryParams: {status: status, isPaye: isPaye, idAnnee: this.idAnnee}});
  }
}
