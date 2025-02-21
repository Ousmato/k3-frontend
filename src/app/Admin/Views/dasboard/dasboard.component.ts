import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../../Services/icons.service';
import { EtudeService } from '../Etudiants/etude.service';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { EnseiService } from '../Enseignant/ensei.service';
import { ServiceService } from '../../../DER/EDT/Services/service.service';
import { ClassRoom } from '../../Models/Classe';
import { Emplois } from '../../../DER/EDT/Models/Emplois';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../../Services/notification.service';
import { Admin } from '../../Models/Admin';
import { Notifications_gestion } from '../../Models/Notifications-gestion';
import { NavigationExtras, Router } from '@angular/router';
import { AdminUSER } from '../../Models/Auth';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrl: './dasboard.component.css'
})
export class DasboardComponent implements OnInit {

  admin!: Admin
  studentsCount!: number;
  classesCount!: number;
  teachersCount!: number;
  emploisCount!: number;
  classes: ClassRoom[] = []
  emplois: Emplois[] = []
  notifs: Notifications_gestion[] = []
  books: any[] = []
  noti_form!: FormGroup

  constructor(private teacherService: EnseiService, private ruter: Router,
    private notifiService: NotificationService, private emploisService: ServiceService, private fb: FormBuilder,
    public icons: IconsService, private etudiantService: EtudeService, private classeService: ClassStudentService) { }
  ngOnInit(): void {
    this.admin =  AdminUSER()?.admin
    this.noti_form = this.fb.group({
      description: [''],
      // date: [''],
      idAdmin: [''],
      titre: ['']

    })
    this.countStudents()
    this.countClasses()
    this.countTeachers()
    this.countEmplois()
    this.get_all_notifi()
    // this.searchBooks("henry")
  }
  countStudents() {
    this.etudiantService.getAll().subscribe(res => {
      this.studentsCount = res.length;
      // console.log(this.studentsCount);
    });
  }
  // -----------------------------count number of classe
  countClasses() {
    this.classeService.getAllCurrentClassOfYear(this.admin.idAdministra!).subscribe(res => {
      this.classesCount = res.length;
      // console.log(this.classesCount);
    });
  }
  // ----------------------------count tachers
  countTeachers() {
    return this.teacherService.getAll().subscribe(res => {
      this.teachersCount = res.length
    });
  }
  // -------------------------------count number of emplois
  countEmplois() {
    return this.emploisService.getAllEmploisActifs(this.admin.idAdministra!).subscribe(res => {
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
  // -----------------------------------add notification
  add_notification() {
    const formData = this.noti_form.value
   
    const notifi: Notifications_gestion = {
      description: formData.description,
      // date: formData.date,
      idAdmin: this.admin,
      titre: formData.titre,
      // idTeacher: formData.idTeacher
    }
    this.notifiService.addNotifi(notifi).subscribe(res => {
      console.log(res);
      alert("Notification ajoutée avec succès!")
      this.noti_form.reset()
    })
  }
  // -----------------------------get all notification
  get_all_notifi() {
    this.notifiService.getAll().subscribe(res => {
      this.notifs = res;
      console.log(res, "not");
    })
  }
  // ------------------------------get book 
  toggle_toClasse() {
    this.ruter.navigate(['/sidebar/classe'])
  }

  toggle_toEnseignant() {
    this.ruter.navigate(['/sidebar/enseignants'])
  }

  toggle_toEtudiant() {
    this.ruter.navigate(['/sidebar/etudiant'])
  }

  gotoEmploi(idEmploi: number){
    const navigationExtras : NavigationExtras ={
      queryParams : {
        id: idEmploi
      }

    }
    this.ruter.navigate(['/sidebar/emplois-seance'], navigationExtras)
  }

  // ----------------abrevigate
  abrevigateNameFiliere(name: string): string {
    const wordAbreviate = name.split(' ');
    const abreviate = wordAbreviate.filter(word => word.length > 3).map(word => word[0]).join('');
    return abreviate;

  }
  // --------calculate diff date
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

  // -----------compare date
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
