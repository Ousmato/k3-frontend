import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { IconsService } from '../../Services/icons.service';
import { EventServiceService } from '../../Services/event-service.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AdminService } from '../../Services/admin.service';
import { Toast, ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  
  form!: FormGroup;
  email: string =  ""
  subscription!:Subscription;
  constructor(public icons: IconsService, private fb: FormBuilder,  private zone: NgZone,
    private router: Router, private adminService: AdminService, private toastr: ToastrService,
     private eventService: EventServiceService) { }

   ngOnInit(): void {
   this.subscription = this.eventService.event$.subscribe((value: any) =>{
      if (value && value.email) {
        this.zone.run(() => {
          this.email = value.email;
        })
      };
      })
      this.load_form();
  }

  // ----------------load form
  load_form(){
    this.form = this.fb.group({
      box1: ['', [Validators.required, this.singleDigitValidator]],
      box2: ['', [Validators.required, this.singleDigitValidator]],
      box3: ['', [Validators.required, this.singleDigitValidator]],
      box4: ['', [Validators.required,this.singleDigitValidator]],
    });
  }

  singleDigitValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && (value.toString().length > 1)) {
      return { singleDigit: true };  // erreur si plus d'un chiffre
    }
    return null;  // valide si un seul chiffre
  }
  // ----------------send password reset email
  submit(){
    const formData = this.form.value;
    const codeString = `${formData.box1}${formData.box2}${formData.box3}${formData.box4}`;
    const codeNunmber = Number(codeString);
  this.adminService.validateToken(codeString).subscribe({
    next: (result) =>{
      if(result){
      this.router.navigate(['/set-new-password'])

      }else{
        this.toastr.warning("Code incorrect ou expirer, veuillez réessayer.", "Warning")
      }
    },
    error: (result) =>{
      this.toastr.error()
    }

  })
  }
  goBack(){
    this.router.navigateByUrl('', { replaceUrl: true });
    this.subscription.unsubscribe();
  }

  // -----------retry
  retry(email: string){
    this.adminService.forgotPassword(email).subscribe();
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }
}
