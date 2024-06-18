import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../auth-service.service';
import { User } from '../../Admin/Models/Auth';
import { IconsService } from '../../Services/icons.service';

@Component({
  selector: 'app-enseignant',
  templateUrl: './enseignant.component.html',
  styleUrl: './enseignant.component.css'
})
export class EnseignantComponent implements OnInit{

  constructor(public icon : IconsService){}
  ngOnInit(): void {
   
  }
 

}
