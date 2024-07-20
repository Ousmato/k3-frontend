import { Component, OnInit } from '@angular/core';
import { Semestres } from '../../Models/Semestre';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../../Services/icons.service';
import { SemestreService } from '../../../Services/semestre.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ClassRoom } from '../../Models/Classe';
import { ClassStudentService } from '../class-students/class-student.service';
import { forkJoin, map } from 'rxjs';
import { Emplois } from '../../Models/Emplois';
import { ClassModules } from '../../Models/ClassModule';
import { ServiceService } from './service.service';
import { DatePipe, Location } from '@angular/common';
import { PageTitleService } from '../../../Services/page-title.service';
import { ToastrService } from 'ngx-toastr';

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
    public icon : IconsService, private toastr: ToastrService,
    private semestreService: SemestreService, private classService: ClassStudentService, private datePipe: DatePipe,
    private fb: FormBuilder,private route: ActivatedRoute, private emploiService: ServiceService,private routeLink: Router, private location: Location){}
  // -------------------------------------------ngOinit
    ngOnInit(): void {

    this.EmploisAdd = this.fb.group({
      idSemestre: ['',Validators.required],
      // idClasse: [],
      // nomSemestre: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [{ value: '', disabled: true }]
    })
    this.route.queryParams.subscribe(params => {
      this.classRomId = params['id'];
      console.log(this.classRomId, "room id");
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
goBack(){
  this.location.back();
}

  // --------------------------------add emplois
  addEmplois(){
    if (this.EmploisAdd.valid) {
      const formData = this.EmploisAdd.value;

      const classe: ClassRoom = this.classRoom;
      const semestre: Semestres = this.semestre.find(sm => sm.id === formData.idSemestre)!;
      const emplois : Emplois = {
        idSemestre: semestre,
        dateDebut: formData.dateDebut,
        dateFin: this.formattedDateFin,
        idClasse: classe,

      }
        //  console.log(emplois, "emplis-----")
       this.emploiService.addEmplois(emplois).subscribe({
        next: dt => {
          this.current_emplois = dt;
          const navigationExtras: NavigationExtras = {
            queryParams: {
                id: this.current_emplois.idClasse.id
            }
        };
        if(this.current_emplois.id){
          this.toastr.success('Ajout effectuee avec succé', 'Success')
        }
        this.routeLink.navigate(['/sidebar/seance'], navigationExtras);

        this.EmploisAdd.reset();
        },
        error: (err) => {
          this.toastr.error(err.error.message)
        }
       })

     
    }
  }
 
 
}
