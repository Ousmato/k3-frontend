import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private timer: number = 0;

  constructor(private spinner: NgxSpinnerService) { }

  loading(){
    this.timer++;
    this.spinner;
    this.spinner.show( undefined,{
      type: 'ball-scale-ripple',
      size: 'default',
      bdColor: 'rgba(0,0,0,0.8)',
      color: '#fff',
    }
      
    );
  }

  stopLoading(){
    this.timer--;
    if(this.timer <= 0){
      this.timer = 0
      this.spinner.hide();
    }
  }

 
}
