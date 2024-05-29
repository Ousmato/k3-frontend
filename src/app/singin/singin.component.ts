import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SinginServiceService } from './singin-service.service';

@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html',
  styleUrl: './singin.component.css'
})
export class SinginComponent implements OnInit {
// adminConnect: 
  studentForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private service: SinginServiceService){}
  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      id: [null], 
      nomStudent: ['', Validators.required],
      prenom: ['', Validators.required],
      sexe: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      password: ['', Validators.required],
      urlPhoto: [''],
      matricule: ['', Validators.required],
      scolarite: ['', Validators.required],
      date: [''],
      lieuNaissance: [''],
      dateNaissance: [''],
      age: [null],
      isDeleted: [false],
      admin: [] 
    });
  }

  singin () {
    if(this.studentForm.valid)
    this.service.singIn(this.studentForm.value).subscribe(
      data => {
        console.log(data);
      })
    
    this.studentForm.reset();
  }
}
