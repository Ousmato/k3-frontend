import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Admin, Admin_role } from '../Admin/Models/Admin';
import { Teacher } from '../Admin/Models/Teachers';
import { Router } from '@angular/router';
import { IconsService } from '../Services/icons.service';
import { ToastrService } from 'ngx-toastr';
import { SideBarService } from '../sidebar/side-bar.service';

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
  errorMessage: any;


  constructor(private authService: AuthServiceService, public icons:IconsService, private toastr: ToastrService,
    private formBuilder: FormBuilder, private route: Router, private sidbarService: SideBarService) { } 

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
      // console.log('ici')
      this.authService.login(email, password).subscribe({
        next: (data) =>{
          console.log(data.user.role)
          if (data.user.role == Admin_role.DG.toLocaleLowerCase()) {
            this.route.navigate(["/sidebar"])
            console.log('Je suis admin', data.user.role);
            this.toastr.success('Connexion avec succès!!', 'Succès',{timeOut: 3000})

  
          } else if (data.user.role === Admin_role.DGA.toLocaleLowerCase()) {
         
            console.log('Je suis dga');
            this.route.navigate(['/dga'])
            this.toastr.success('Connexion avec succès!!', 'Succès',{timeOut: 3000})


          }else if(data.user.role === Admin_role.SCOLARITE.toLocaleLowerCase()){
       
            this.route.navigate(['/r-scolarite']);
            this.toastr.success('Connexion avec succès!!', 'Succès',{timeOut: 3000})

  
          } else if (data.user.role === Admin_role.DER.toLocaleLowerCase()) {
            // const adminDataString = JSON.stringify(data);
            // sessionStorage.setItem("der", adminDataString);
            this.route.navigate(['/der']);
            this.toastr.success('Connexion avec succès!!', 'Succès',{timeOut: 3000})

  
          } else if (data.user.role === Admin_role.COMPTABLE.toLocaleLowerCase()) {
            // const adminDataString = JSON.stringify(data);
            // sessionStorage.setItem("comptable", adminDataString);
            this.route.navigate(['/comptable']);
            this.toastr.success('Connexion avec succès!!', 'Succès',{timeOut: 3000})

            
            // } else if (data.role === Admin_role.DG.toLocaleLowerCase()) {
            //   const adminDataString = JSON.stringify(data);
            //   sessionStorage.setItem("dg", adminDataString);
            //   this.route.navigate(['/dg']);
            
            }else if (data.user.role === Admin_role.SECRETAIRE.toLocaleLowerCase()) {
              // const adminDataString = JSON.stringify(data);
              // sessionStorage.setItem("secretaire", adminDataString);
              this.route.navigate(['/secretaire']);
            this.toastr.success('Connexion avec succès!!', 'Succès',{timeOut: 3000})


          }else{
            this.toastr.error('Identifiant ou mot de passe incorrect', 'Erreur',)
          }
        },
        error: (erreur) =>{
          if(erreur.status == 0){
            this.toastr.error("Verifier la connexion a votre base de données", "Erreur");
          }
        this.errorMessage = erreur.error.message;
        this.invalid =! this.invalid;
          // this.pageTitle.showErrorToast(erreur.error.message)
        },
        
      })
    }else{
      this.userForm.markAllAsTouched();
      console.log("invalid", this.userForm.value)
    }
  }
  // --------------------------------method password visible
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
}

to_forgotPassword(){
  this.route.navigate(['/forgot-password']);
}
}



