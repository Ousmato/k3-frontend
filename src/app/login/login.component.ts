import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { User } from '../Admin/Models/Auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Admin } from '../Admin/Models/Admin';
import { Teacher } from '../Admin/Models/Teachers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  userForm!: FormGroup; 
  admin!: Admin;
  teacher!: Teacher;
  constructor(private authService: AuthServiceService, private formBuilder: FormBuilder, private route: Router) { } 

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
   
  }

  login() {
   var email = this.userForm.value.email;
   var password = this.userForm.value.password
    // return;
    if (this.userForm.valid) { 
      this.authService.login(email, password).subscribe(data => {
        console.log('data:', data);

        if (data.idAdministra) {

          const adminDataString = JSON.stringify(data);
          localStorage.setItem("admin", adminDataString);
          
          this.route.navigate(["sidebar"])
          console.log('Je suis admin');
          

        } else if (data.idEnseignant) {
          console.log('Je suis teacher');

        } else if (data.idEtudiant) {
          console.log('Je suis étudiant');

        } else {
          console.log('Utilisateur inconnu');
        }
      }, error => {
        console.error('Error during login:', error);
      });
    }
  }
}



