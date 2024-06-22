import { Component, OnInit } from '@angular/core';
import { Semestres } from '../../Models/Semestre';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IconsService } from '../../../Services/icons.service';
import { SemestreService } from '../../../Services/semestre.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ClassRoom } from '../../Models/Classe';
import { ClassStudentService } from '../class-students/class-student.service';
import { forkJoin, map } from 'rxjs';
import { Emplois } from '../../Models/Emplois';
import { ClassModules } from '../../Models/ClassModule';
import { ServiceService } from './service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-emplois-du-temps',
  templateUrl: './emplois-du-temps.component.html',
  styleUrl: './emplois-du-temps.component.css',
  providers: [DatePipe]
})
export class EmploisDuTempsComponent implements OnInit {
  semestre: Semestres[] = [];
  days: string[] = [];
  
 current!: Semestres ;
 EmploisAdd! : FormGroup;
 current_emplois!: Emplois;
 classRomId!: number;
 classRoom!: ClassRoom;
 classModule!: ClassModules;
 formattedDateFin: any;
//  -----------------------------------constructor
  constructor(
    public icon : IconsService, 
    private semestreService: SemestreService, private classService: ClassStudentService, private datePipe: DatePipe,
    private fb: FormBuilder,private route: ActivatedRoute, private emploiService: ServiceService,private routeLink: Router){}
  // -------------------------------------------ngOinit
    ngOnInit(): void {

    this.EmploisAdd = this.fb.group({
      idSemestre: [''],
      idClasse: [],
      nomSemestre: [''],
      dateDebut: [''],
      dateFin: [{ value: '', disabled: true }]
    })
    this.route.queryParams.subscribe(params => {
      this.classRomId = params['id'];
      // Utilisez `classRomId` pour vos besoins
      console.log(this.classRomId);
    });
    this.classService.getClassById(this.classRomId).subscribe(data =>{
      this.classRoom = data;
      console.log("classe :", this.classRoom);
    })
    // ------------------------------------get all semestre
   this.semestreService.getAllSemestre().subscribe((response: Semestres[]) =>{
    this.semestre = response;
    console.log(this.semestre);
   })
// --------------------------------get current semestre
   this.semestreService.getCurentSemestre().subscribe(data =>{
     this.current = data;
    console.log(this.current);
   })

   
// -----------------------------------------------calcule date fin automaticaly
    this.EmploisAdd.get('dateDebut')?.valueChanges.subscribe(value => {
      if (value) {
          const dateDebut = new Date(value);
          const dateFin = new Date(dateDebut);
          dateFin.setDate(dateDebut.getDate() + 7);
          this.formattedDateFin = this.datePipe.transform(dateFin, 'yyyy-MM-dd');

          this.EmploisAdd.get('dateFin')?.setValue(this.formattedDateFin);
      } else {
          this.EmploisAdd.get('dateFin')?.setValue('');
      }
  });
  // ----------------------------get list dates between dateDebut emplois and dateFin emplois
  
}

// ======================================================================================================


  // --------------------------------add emplois
  addEmplois(){
    if (this.EmploisAdd.valid) {
      const formData = this.EmploisAdd.value;
      console.log(formData, "-----------------")
      
      const classe: ClassRoom = this.classRoom;
      // console.log(classe);
       const semestre: Semestres = this.semestre.find(sm => sm.id === formData.idSemestre)!;
       console.log("semetre : ", semestre);
          const emplois : Emplois = {
            idSemestre: semestre,
            dateDebut: formData.dateDebut,
            dateFin: this.formattedDateFin,
            idClasse: classe,

          }
       this.emploiService.addEmplois(emplois).subscribe(dt =>{
        this.current_emplois = dt;
         console.log(dt);
         alert("Ajout Effectuee avec succees!"+dt.id); 
         // Naviguer vers la route avec les paramètres
         const navigationExtras: NavigationExtras = {
             queryParams: {
                 id: this.current_emplois.id
             }
         };
         this.routeLink.navigate(['/sidebar/seance'], navigationExtras);

         this.EmploisAdd.reset();
       })

     
    }
  }
 
 
}
