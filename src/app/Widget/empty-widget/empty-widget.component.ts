import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../Services/icons.service';

@Component({
  selector: 'app-empty-widget',
  templateUrl: './empty-widget.component.html',
  styleUrl: './empty-widget.component.css'
})
export class EmptyWidgetComponent implements OnInit{

  
  empty: number[] = [1, 2, 3]
  constructor(public icons: IconsService) { }

  ngOnInit(): void {
  }
}
