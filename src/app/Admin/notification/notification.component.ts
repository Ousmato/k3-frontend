import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent  implements OnInit {

  notifications: any[] = [1, 2, 3, 4, 5];
    
  constructor() { }
  ngOnInit(): void {}

}
