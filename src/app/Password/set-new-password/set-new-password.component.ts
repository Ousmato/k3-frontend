import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../Services/icons.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrl: './set-new-password.component.css'
})
export class SetNewPasswordComponent implements OnInit {

  form!: FormGroup

  passwordsMatching = false;

  newPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),
  ]);
  confirmPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),
  ]);

  constructor(public icons: IconsService, private router: Router,  private fb: FormBuilder) { }


  ngOnInit(): void {
      this.load_form();
  }

  // ------------load form
  load_form(){
    this.form = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/),
          Validators.maxLength(8),
        ],
      ],
    },
   
  );
  }

  // ------------------confirmed validator

  passwordHasUppercase(): boolean {
    const value = this.form.controls['newPassword'].value || '';
    return /[A-Z]/.test(value);
  }

  passwordHasLowercase(): boolean {
    const value = this.form.controls['newPassword'].value || '';
    return /[a-z]/.test(value);
  }

  passwordHasSpecialChar(): boolean {
    const value = this.form.controls['newPassword'].value || '';
    return /[@$!%*#?&^_-]/.test(value);
  }

  passwordHasMinLength(): boolean {
    const value = this.form.controls['newPassword'].value || '';
    return value.length > 8;
  }
  passwordHasDigit(): boolean {
    const value = this.form.controls['newPassword'].value || '';
    return /[0-9]/.test(value);
  }

  matchPassword() : boolean{
    const password = this.form.get('newPassword')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;
    console.log("pas : ", password, "conf : ", confirmPassword);
    
    // Retourne true si les mots de passe correspondent
    if(password === confirmPassword){
      return true;
    }
    return false;
  }
  
  // ------------------submit
  submit(){
    if(this.form.valid){
      if(this.matchPassword()){
        // Si les mots de passe correspondent, faire quelque chose
        console.log("success");
        return
          // Retour à la page précédente
      }
      this.passwordsMatching = true
      console.log("not  success")
    //   if (!this.matchPassword()) {  
    //   console.log(this.matchPassword(), "match--pass")

    //     this.passwordsMatching = true; 
    //   console.log(this.matchPassword(), "match--pass apres")

    //     return;
    // } else {
    //   console.log(this.matchPassword(), "match--pass dans else")

    //     this.passwordsMatching = false;  // Réinitialiser l'état si les mots de passe correspondent
    //     console.log("success");
    // }
    }else{
      this.form.markAllAsTouched();
      console.log(this.form.value, "invalid");
      
    }
  }


  goBack(){
    this.router.navigateByUrl('', {replaceUrl: true})
  }
}
