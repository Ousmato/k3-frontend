import { Component, OnInit } from '@angular/core';
import { AddUeDto, Ue } from '../../../Admin/Models/UE';
import { IconsService } from '../../../Services/icons.service';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { ActivatedRoute } from '@angular/router';
import { SemestreService } from '../../../Services/semestre.service';
import { Semestres } from '../../../Admin/Models/Semestre';
import { ClassRoom } from '../../../Admin/Models/Classe';

@Component({
  selector: 'app-view-ue',
  templateUrl: './view-ue.component.html',
  styleUrl: './view-ue.component.css'
})
export class ViewUeComponent implements OnInit {

  ues: AddUeDto[]=[]
  semestres: Semestres[]=[]
  idClasseNivFil!: number
  classesArchive: ClassRoom[]=[]

  constructor(public icons: IconsService, private semestreService: SemestreService,
    private classService: ClassStudentService,
    private root: ActivatedRoute){}

  ngOnInit(): void {
    this.load_ues();
  }

  load_ues(){
    this.root.queryParams.subscribe(param =>{
      this.idClasseNivFil = param['id'];
      this.semestreService.getCurrentSemestresByIdNivFiliere(this.idClasseNivFil).subscribe(result =>{
        result.forEach(res =>{
          if(!this.semestres.some(sem =>sem.id == res.id)){
            this.semestres.push(res)
          }
        })
        console.log(this.semestres, "semestre")
      })

    
    })
    
  }
  // ---------------load all semestre oc classe
 
  onSelect(event: any){
    const idSemestre = event.target.value;
     this.classService.getAll_ue(this.idClasseNivFil, idSemestre).subscribe(result =>{
     this.ues = result;
        console.log(this.ues, "ues")
      })
  }
  goBack(){
    window.history.back();
  }
}
