import { Component, OnInit } from '@angular/core';
import { EtudeService } from '../../Admin/Views/Etudiants/etude.service';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { NavigationExtras, Router } from '@angular/router';
import { Emplois } from '../../Admin/Models/Emplois';
import { ServiceService } from '../EDT/emplois-du-temps/service.service';
import { SalleService } from '../../Services/salle.service';
import { EnseiService } from '../../Admin/Views/Enseignant/ensei.service';
import { IconsService } from '../../Services/icons.service';
import { ClassRoom } from '../../Admin/Models/Classe';

@Component({
  selector: 'app-der-home',
  templateUrl: './der-home.component.html',
  styleUrl: './der-home.component.css'
})
export class DerHomeComponent  implements OnInit{

  teacherCount: number = 0;
  studentNumber_noInscrit: number = 0;
  salle: number = 0
  memoire: number = 0
  rapport: number = 0
  salleOccuper: number = 0
  emplois : Emplois[]=[]
  classes: ClassRoom[] = []
  emploisCount!: number
  constructor(public icons: IconsService, private emploisService: ServiceService, private studentService: EtudeService,
    private router: Router, private enseignantService: EnseiService, private salleService: SalleService){}

  ngOnInit(): void {
      this.load_cunt();
      this.salleNumber();
      this.docNumber();
      this.countEmplois();
  }
  
  load_cunt(){
    this.enseignantService.countTeacherNumber().subscribe(data => {
     this.teacherCount = data
    })
  }
  // --------------------------go to student liste page
  toggle_doc(){
    this.router.navigate(['/der/doc'])
  }
  toggle_enseignant(){
    this.router.navigate(['/der/enseignants'])
  }

  toggle_toEmploi(){
    this.router.navigate(['/der/emplois-du-temps'])
  }

  toggle_class(){
    this.router.navigate(['/der/salles'])
  }

  // --------------------------------count class number
  salleNumber(){
    this.salleService.getNombreSalleOccupe().subscribe(data => {
      this.salleOccuper = data
    })
    this.salleService.getNombreSalleNonOccupe().subscribe(data => {
      this.salle = data
    })
  }
  // -----------------------count docs
  docNumber(){
    this.studentService.getMemoireNumber().subscribe(data => {
      this.memoire = data
    })
    this.studentService.getRapportNumber().subscribe(data => {
      this.rapport = data
    })
  }

  countEmplois() {
    return this.emploisService.getAllEmploisActifs().subscribe(res => {
      this.emploisCount = res.length;
      this.emplois = res
      const toDay = new Date();
      
      console.log(toDay.toLocaleDateString(), "toDay")
      res.forEach(item => {
        this.classes.push(item.idClasse)
       item.progess = this.calculateDiff(toDay, item.dateFin);
       item.toDay = this.isDateInRange(item.dateDebut, item.dateFin)
        // console.log(item.progess, "------------k-k-k-k-k-kk--");
      })
      // console.log(res);
    });
  }

  gotoEmploi(idEmploi: number){
    const navigationExtras : NavigationExtras ={
      queryParams : {
        id: idEmploi
      }

    }
    this.router.navigate(['/der/emplois-seances'], navigationExtras)
  }

  // abrevigate
  abrevigateNameFiliere(name: string): string {
    const wordAbreviate = name.split(' ');
    const abreviate = wordAbreviate.filter(word => word.length > 3).map(word => word[0]).join('');
    return abreviate;

  }
  //calculate diff date
  calculateDiff(dateDebut: Date, dateFin: Date) : number {
    const dateDebutParsed = new Date(dateDebut);
    const dateFinParsed = new Date(dateFin);

    console.log(dateDebut, "dateDebut");
    console.log(dateFin, "dateFin");

    const diffTime = Math.abs(dateFinParsed.getTime() - dateDebutParsed.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log(`La différence entre les deux dates est de ${diffDays} jour(s).`);

    const maxDays = 5;
    const percentagePerDay = 20;

    // Calculer le pourcentage basé sur la différence
    const effectiveDays = Math.min(diffDays, maxDays); // Limite l'écart à maxDays
    const percentage = Math.max(0, 100 - (effectiveDays * percentagePerDay));

    console.log(`L'écart en pourcentage est de ${percentage.toFixed(2)}%.`);
    console.log(percentage, "per return")
    return percentage;
  }

  //compare date
  isDateInRange(dateDebut: Date, dateFin: Date): boolean {
    const today = new Date(); 
    const dateDebutParsed = new Date(dateDebut);
    const dateFinParsed = new Date(dateFin);
    // Réinitialiser l'heure pour comparer uniquement les dates
    today.setHours(0, 0, 0, 0);
    dateDebutParsed.setHours(0, 0, 0, 0);
    dateFinParsed.setHours(0, 0, 0, 0);

    // Vérifie si aujourd'hui est dans l'intervalle
    return today >= dateDebutParsed && today <= dateFinParsed;
}
}
