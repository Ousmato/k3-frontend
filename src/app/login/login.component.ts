import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Admin, RoleTypes } from '../administrations/shared/models/Admin';
import { environment } from '../../environments/environment';
import { contructor_dependencies } from '../administrations/dependencies/dependencies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  userForm!: FormGroup; 
  admin!: Admin;
  passwordVisible: boolean = false
  invalid : boolean = false
  errorMessage: any;
  posteName: any;
  roleType: any;
  urlLogo = ""
  urlAssetsImage = environment.urlAssetsImage;

  public dependencies = inject(contructor_dependencies)

  ngOnInit() {
    this.urlLogo = environment.assetUrlLogo,
    this.userForm = this.dependencies.fb.group({
      // faculte: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
   
  }

  login() {
    const formData = this.userForm.value;
  
    if (this.userForm.invalid) return;
  
    this.dependencies.authService.login(formData.email, formData.password).subscribe({
      next: (data) => {
        const user = this.dependencies.authService.getUser();
  
        if (!user || !user.idPoste || !user.idPoste.nom) {
          this.dependencies.queryreturnMessage.showErrorToast('Informations utilisateur invalides');
          return;
        }
  
        const role = this.dependencies.util.abrevigate(user.idPoste.nom); 
  
        const redirectTo = this.dependencies.authService.roleRouteMap[role];
  
        if (redirectTo) {
          this.dependencies.router.navigate([redirectTo]);
          this.dependencies.queryreturnMessage.showSuccessToast('Connexion réussie !');
        } else {
          this.dependencies.queryreturnMessage.showErrorToast("Rôle non reconnu !");
        }
      },
      error: (error) => {
        if (error.status === 0) {
          this.dependencies.queryreturnMessage.showErrorToast("Erreur de connexion au serveur !");
        } else if (error.status === 401) {
          this.dependencies.queryreturnMessage.showErrorToast("Email ou mot de passe incorrect !");
        } else {
          this.dependencies.queryreturnMessage.showErrorToast("Une erreur est survenue.");
        }
      }
    });
  }
 
  // login() {
  //   const formData = this.userForm.value
    
  //   // return;
  //   if (this.userForm.valid) { 
  //     // console.log('ici')
  //     this.dependencies.authService.login(formData.email, formData.password).subscribe({
  //       next: (data) =>{
  //         if (data.user.idPoste.nom === RoleTypes.SUPER_ADMIN) {
  //           this.dependencies.router.navigate(["/sidebar"])
  //           console.log('Je suis admin');
  //           this.dependencies.queryreturnMessage.showSuccessToast('Connexion avec succès!!',)

  
  //         // } else if (this.util.abrevigate(data.user.idRole.nom) === Admin_role.DGA.toString().toUpperCase()) {
         
  //         //   console.log('Je suis dga');
  //         //   this.route.navigate(['/dga'])
  //         //   this.toastr.success('Connexion avec succès!!', 'Succès',{timeOut: 3000})


  //         // }else if(this.util.abrevigate(data.user.idRole.nom )=== Admin_role.SCOLARITE.toString().toUpperCase()){
       
  //         //   this.route.navigate(['/r-scolarite']);
  //         //   this.toastr.success('Connexion avec succès!!', 'Succès',{timeOut: 3000})

  
  //         // } else if (this.util.abrevigate(data.user.idRole.nom) === Admin_role.DER.toString().toUpperCase()) {
  //         //   // const adminDataString = JSON.stringify(data);
  //         //   // sessionStorage.setItem("der", adminDataString);
  //         //   this.route.navigate(['/der']);
  //         //   this.toastr.success('Connexion avec succès!!', 'Succès',{timeOut: 3000})

  
  //         // } else if (this.util.abrevigate(data.user.idRole.nom) === Admin_role.COMPTABLE.toString().toUpperCase()) {
  //         //   // const adminDataString = JSON.stringify(data);
  //         //   // sessionStorage.setItem("comptable", adminDataString);
  //         //   this.route.navigate(['/comptable']);
  //         //   this.toastr.success('Connexion avec succès!!', 'Succès',{timeOut: 3000})

            
  //         //   }else if (this.util.abrevigate(data.user.idRole.nom) === Admin_role.SECRET_P.toString().toUpperCase()) {
  //         //     // const adminDataString = JSON.stringify(data);
  //         //     // sessionStorage.setItem("secretaire", adminDataString);
  //         //     this.route.navigate(['/secretaire']);
  //         //   this.toastr.success('Connexion avec succès!!', 'Succès',{timeOut: 3000})


  //         // }else{
  //         //   this.toastr.error('User introuvable', 'Erreur',)
  //         }
  //       },
  //       error: (erreur) =>{
  //         if(erreur.status == 0){
  //           this.dependencies.queryreturnMessage.showErrorToast("Verifier la connexion a votre base de données");
  //         }
  //       this.errorMessage = erreur.error.message;
  //       this.invalid =! this.invalid;
  //         // this.pageTitle.showErrorToast(erreur.error.message)
  //       },

        
  //     })
  //   }else{
  //     this.userForm.markAllAsTouched();
  //     console.log("invalid", this.userForm.value)
  //   }
  // }


  // --------------------------------method password visible
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
}

to_forgotPassword(){
  this.dependencies.router.navigate(['/forgot-password']);
}




}



