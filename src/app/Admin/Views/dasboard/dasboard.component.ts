import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../../Services/icons.service';
import { EtudeService } from '../etudiants/etude.service';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { EnseiService } from '../enseignant/ensei.service';
import { ServiceService } from '../../../DER/emplois-du-temps/service.service';
import { ClassRoom } from '../../Models/Classe';
import { Emplois } from '../../Models/Emplois';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../../Services/notification.service';
import { Admin } from '../../Models/Admin';
import { Notifications_gestion } from '../../Models/Notifications-gestion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrl: './dasboard.component.css'
})
export class DasboardComponent  implements OnInit{

  admin!: Admin
  studentsCount!: number;
  classesCount!: number;
  teachersCount!: number;
  emploisCount!: number;
  classes : ClassRoom [] = []
  emplois: Emplois [] = []
  notifs: Notifications_gestion [] = []
  books : any[] = []
  noti_form!: FormGroup

  constructor(private teacherService: EnseiService, private ruter: Router,
    private notifiService: NotificationService, private emploisService: ServiceService, private fb: FormBuilder,
    public icons: IconsService, private etudiantService: EtudeService, private classeService: ClassStudentService) { }
  ngOnInit(): void {

    this.noti_form = this.fb.group({
      description: [''],
      // date: [''],
      idAdmin: [''],
      titre: ['']
      // idTeacher: ['']

    })
    this.countStudents()
    this.countClasses()
    this.countTeachers()
    this.countEmplois()
    this.get_all_notifi()
    // this.searchBooks("henry")
  }
  countStudents(){
    this.etudiantService.getAll().subscribe(res =>{
      this.studentsCount = res.length;
      // console.log(this.studentsCount);
    });
  
  }
  // -----------------------------count number of classe
  countClasses(){
    this.classeService.getAllCurrentClassOfYear().subscribe(res =>{
      this.classesCount = res.length;
      // console.log(this.classesCount);
    });
  }
  // ----------------------------count tachers
  countTeachers(){
    return this.teacherService.getAll().subscribe(res =>{
      this.teachersCount = res.length
    });
  }
  // -------------------------------count number of emplois
  countEmplois(){
    return this.emploisService.getAllEmploisActifs().subscribe(res =>{
      this.emploisCount = res.length;
      this.emplois = res
      res.forEach(item =>{
        this.classes.push(item.idClasse)  // to get the classes of the emplois
      })
      // console.log(res);
    });
  }
  // -----------------------------------add notification
  add_notification(){
    const formData = this.noti_form.value
    const adminData = localStorage.getItem("admin");
    
    if (adminData) {
      // Convertir les données JSON en objet JavaScript
     this.admin = JSON.parse(adminData);
    
    } else {
      console.log("Aucune donnée d'administrateur trouvée dans le localStorage.");
    }
    const notifi : Notifications_gestion ={
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
  get_all_notifi(){
    this.notifiService.getAll().subscribe(res => {
      this.notifs = res;
      console.log(res, "not");
    })
  }
  // ------------------------------get book 
  toggle_toClasse(){
    this.ruter.navigate(['/sidebar/classe'])
  }

  toggle_toEnseignant(){
    this.ruter.navigate(['/sidebar/enseignants'])
  }

  toggle_toEtudiant(){
    this.ruter.navigate(['/sidebar/etudiant'])
  }
}
