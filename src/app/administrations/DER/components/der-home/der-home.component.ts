import { Component, inject, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Emplois } from '../../models/Emplois';
import { Admin } from '../../../shared/models/Admin';
import { environment } from '../../../../../environments/environment';
import { contructor_dependencies } from '../../../dependencies/dependencies';
import { ClassRoom } from '../../../../Admin/Models/Classe';
import { getUser } from '../../../shared/models/auth';

@Component({
  selector: 'app-der-home',
  templateUrl: './der-home.component.html',
  styleUrl: './der-home.component.css'
})
export class DerHomeComponent  implements OnInit{

  urlAsset = environment.urlAssetsImage
  teacherCount: number = 0;
  studentNumber_noInscrit: number = 0;
  salle: number = 0
  searchTerm: string = ""
  memoire: number = 0
  rapport: number = 0
  salleOccuper: number = 0
  emplois : Emplois[]=[]
  emploiFiltered : Emplois[]=[]
  der! : Admin
  classes: ClassRoom[] = []
  emploisCount!: number

  public dependencies = inject(contructor_dependencies)

  ngOnInit(): void {
    this.der = getUser()
      this.load_cunt();
      this.salleNumber();
      this.docNumber();
      this.countEmplois();

      this.dependencies.sideBareService.currentSearchTerm.subscribe(term =>{
        this.searchTerm = term
       this.filteredEmplois()
      })
  }
  
  load_cunt(){
    this.dependencies.teacherService.countTeacherNumber().subscribe(data => {
     this.teacherCount = data
    })
  }
  // --------------------------go to student liste page
  toggle_doc(){
    this.dependencies.router.navigate(['/der/doc'])
  }
  toggle_enseignant(){
    this.dependencies.router.navigate(['/der/enseignants'])
  }

  toggle_toEmploi(){
    this.dependencies.router.navigate(['/der/emplois-du-temps'])
  }

  toggle_class(){
    this.dependencies.router.navigate(['/der/salles'])
  }

  // --------------------------------count class number
  salleNumber(){
    this.dependencies.salleService.getNombreSalleOccupe().subscribe(data => {
      this.salleOccuper = data
    })
    this.dependencies.salleService.getNombreSalleNonOccupe().subscribe(data => {
      this.salle = data
    })
  }
  // -----------------------count docs
  docNumber(){
    this.dependencies.studentService.getMemoireNumber().subscribe(data => {
      this.memoire = data
    })
    this.dependencies.studentService.getRapportNumber().subscribe(data => {
      this.rapport = data
    })
  }

  countEmplois() {
    return this.dependencies.emploiService.getAllEmploisActifs(this.der.id!).subscribe(res => {
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
      console.log(res, "---------emploi");
    });
  }

  gotoEmploi(idEmploi: number){
    const navigationExtras : NavigationExtras ={
      queryParams : {
        id: idEmploi
      }

    }
    this.dependencies.router.navigate(['/der/emplois-seances'], navigationExtras)
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
filteredEmplois(){
  if(!this.searchTerm){
    return this.emploiFiltered = this.emplois
  }else{
    return this.emploiFiltered = this.emplois.filter(emploi => emploi.idModule.nomModule.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
    this.dependencies.util.abrevigate(emploi.idClasse.idFiliere?.idFiliere.nomFiliere!).toLowerCase().includes(this.searchTerm.toLowerCase()))
  }
}
}
