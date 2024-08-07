import { Component, OnInit } from '@angular/core';
import { Semestres } from '../../Admin/Models/Semestre';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../Services/icons.service';
import { SemestreService } from '../../Services/semestre.service';
import { ClassRoom } from '../../Admin/Models/Classe';
import { ClassStudentService } from '../../DGA/class-students/class-student.service';
import { Emplois } from '../../Admin/Models/Emplois';
import { ClassModules } from '../../Admin/Models/ClassModule';
import { ServiceService } from './service.service';
import { DatePipe, Location } from '@angular/common';
import { PageTitleService } from '../../Services/page-title.service';

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
 classRoom: ClassRoom [] = [];
 classModule!: ClassModules;
 formattedDateFin: any;
//  -----------------------------------constructor
  constructor(
    public icon : IconsService, 
    private semestreService: SemestreService, private classService: ClassStudentService, private datePipe: DatePipe,
    private fb: FormBuilder, private emploiService: ServiceService,private pageTitle: PageTitleService, private location: Location){}
  // -------------------------------------------ngOinit
    ngOnInit(): void {

   this.load_form();
    
    this.classService.getAll().subscribe(data =>{
      this.classRoom = data;
      console.log("classe :", this.classRoom);
    })
    // ------------------------------------get all semestre
   this.semestreService.getAllSemestre().subscribe((response: Semestres[]) =>{
    this.semestre = response;
    console.log(this.semestre);
   })
   
// -----------------------------------------------calcule date fin automaticaly
    this.EmploisAdd.get('dateDebut')?.valueChanges.subscribe(value => {
      if (value) {
          const dateDebut = new Date(value);
          const dateFin = new Date(dateDebut);
          dateFin.setDate(dateDebut.getDate() + 5);
          this.formattedDateFin = this.datePipe.transform(dateFin, 'yyyy-MM-dd');

          this.EmploisAdd.get('dateFin')?.setValue(this.formattedDateFin);
      } else {
          this.EmploisAdd.get('dateFin')?.setValue('');
      }
  });
  // ----------------------------get list dates between dateDebut emplois and dateFin emplois
  
}

// load form
load_form(){
  this.EmploisAdd = this.fb.group({
    idSemestre: ['',Validators.required],
    idClasse: ['',[Validators.required]],
    // nomSemestre: ['', Validators.required],
    dateDebut: ['', Validators.required],
    dateFin: [{ value: '', disabled: true }]
  })
}
goBack(){
  this.location.back();
}

  // --------------------------------add emplois
  addEmplois(){
    if (this.EmploisAdd.valid) {
      const formData = this.EmploisAdd.value;

      const classe = this.classRoom.find(cl => cl.id == formData.idClasse);
      const semestre: Semestres = this.semestre.find(sm => sm.id === formData.idSemestre)!;
      const emplois : Emplois = {
        idSemestre: semestre,
        dateDebut: formData.dateDebut,
        dateFin: this.formattedDateFin,
        idClasse: classe!,

      }
         console.log(emplois, "emplis-----")
        //  return
       this.emploiService.addEmplois(emplois).subscribe({
        next: (response) => {
          // this.current_emplois = dt;
          this.pageTitle.showSuccessToast(response.message);
        this.EmploisAdd.reset();
        this.load_form();
        
        },
        error: (err) => {
          this.pageTitle.showErrorToast(err.error.message);
        }
       })

     
    }else{
      this.EmploisAdd.markAllAsTouched();
    }
  }
 
 
}
