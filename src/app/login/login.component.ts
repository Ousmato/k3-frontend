import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { User } from '../Admin/Models/Auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Admin } from '../Admin/Models/Admin';
import { Teacher } from '../Admin/Models/Teachers';
import { Router } from '@angular/router';
import { IconsService } from '../Services/icons.service';
import { PageTitleService } from '../Services/page-title.service';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  userForm!: FormGroup; 
  admin!: Admin;
  teacher!: Teacher;
  passwordVisible: boolean = false
  invalid : boolean = false
  message: any;


  constructor(private authService: AuthServiceService, public icons:IconsService, private toastr: ToastrService,
    private formBuilder: FormBuilder, private route: Router) { } 

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
      this.authService.login(email, password).subscribe({
        next: (data) =>{
          if (data.idAdministra) {

            const adminDataString = JSON.stringify(data);
            localStorage.setItem("admin", adminDataString);
            this.toastr.success('Connexion avec succé!!', 'Success',{timeOut: 3000})
            
            this.route.navigate(["sidebar"])
            // console.log('Je suis admin');
            
            
  
          } else if (data.idEnseignant) {
            console.log('Je suis teacher');
  
          } else if (data.idEtudiant) {
            console.log('Je suis étudiant');
  
          } else {
            console.log('Utilisateur inconnu');
          }
        },
        error: (erreur) =>{
        this.message = erreur.error.message;
        this.invalid =! this.invalid;
          // this.pageTitle.showErrorToast(erreur.error.message)
        }
      })
    }
  }
  // --------------------------------method password visible
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
}
}



