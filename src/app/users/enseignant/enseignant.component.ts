import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../auth-service.service';
import { User } from '../../Admin/Models/Auth';
import { IconsService } from '../../Services/icons.service';
import { Semestres } from '../../Admin/Models/Semestre';
import { SemestreService } from '../../Services/semestre.service';
import { data } from 'jquery';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-enseignant',
  templateUrl: './enseignant.component.html',
  styleUrl: './enseignant.component.css'
})
export class EnseignantComponent implements OnInit{
ngOnInit(): void {
    
}
 

}
