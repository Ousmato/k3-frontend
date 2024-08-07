import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Admin, Admin_role } from '../../Admin/Models/Admin';
import { IconsService } from '../../Services/icons.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-setting-widget',
  templateUrl: './admin-setting-widget.component.html',
  styleUrl: './admin-setting-widget.component.css'
})
export class AdminSettingWidgetComponent implements OnInit{

  @Input() admin! : Admin;
  desable_add_button: boolean = true;
  dataAdmin !: Admin
  
  @Output() closeModal = new EventEmitter<any>();

  constructor(public icons: IconsService, private router: Router){}

  ngOnInit(): void {
      this.load_admin();
  }

  load_admin(){
    if(this.admin.role != Admin_role.super_admin.toLocaleLowerCase()){
      // console.log(this.admin.role, "666776")
      this.desable_add_button = false
    }else{
      this.desable_add_button = true
    }
  //  
  
  }

  toggle_toAdd_admin(){
    this.closeModal.emit()
    // this.show_modal = false
   this.router.navigate(['/sidebar/add-admin']);
   
  }

}
