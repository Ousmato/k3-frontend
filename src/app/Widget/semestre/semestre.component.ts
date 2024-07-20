import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SemestreService } from '../../Services/semestre.service';
import { Semestres } from '../../Admin/Models/Semestre';

@Component({
  selector: 'app-semestre',
  templateUrl: './semestre.component.html',
  styleUrl: './semestre.component.css'
})
export class SemestreComponent implements OnInit {

  constructor(){}
  ngOnInit(): void {
      
  }

 
}
