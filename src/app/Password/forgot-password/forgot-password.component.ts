import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../Services/icons.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../Services/admin.service';
import { EventServiceService } from '../../Services/event-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {

  form!: FormGroup;
  constructor(public icons: IconsService, private adminService: AdminService, private eventService: EventServiceService,
    private fb: FormBuilder,  private router: Router) { }


  ngOnInit(): void {
    
      this.load_form();
  }

  // ----------------load form
  load_form(){
    this.form = this.fb.group({
      email: ['', [ Validators.email, Validators.required]]
    

    });
  }
  // ----------------send password reset email
  submit(){
    if(this.form.valid){
      const formData = this.form.value;
      this.adminService.forgotPassword(formData.email).subscribe(respons =>{
        this.form.reset();
        this.eventService.emitEvent(respons);
        console.log("success")
          this.router.navigate(['/reset-password']);
        
      })
    }else{
      this.form.markAllAsTouched();
    }
    // this.router.navigate(['/set-new-password']);
  }
  goBack(){
    this.router.navigateByUrl('', { replaceUrl: true });
  }
  
}
