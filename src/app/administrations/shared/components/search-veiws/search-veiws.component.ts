import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { contructor_dependencies } from '../../../dependencies/dependencies';

@Component({
  selector: 'app-search-veiws',
  templateUrl: './search-veiws.component.html',
  styleUrl: './search-veiws.component.css'
})
export class SearchVeiwsComponent implements OnInit{

  public dependencies = inject(contructor_dependencies)

  filteredItems : any[] = []
  items : any[] = []
  item!: any
  @Input() value!: any
  @Output() close_view = new EventEmitter<any>()

  ngOnInit(): void {
    console.log(this.value, "value")
    this.getAll(this.value)
  }

  onSearch(searchTerm: string) {
    this.filteredItems = this.items.filter(item =>
      item.nom.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.prenom.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  chose_teacher(item: any){
    this.close_view.emit(item)
  }

  //get all teachers
  getAll(value : string) {
    console.log(this.value, "---------------")
    if(value == "Teacher"){
      this.dependencies.teacherService.getAll().subscribe(result => {
        this.items = result;
        this.filteredItems = this.items;
        console.log(this.items, "enseignants");
      })

    }else{
      this.dependencies.surveillance.getAllSurveillants().subscribe(data =>{
        this.items = data
        this.filteredItems = this.items;
        console.log("surveillant", this.items)
      })
    }
    
  }

  hide_view(){
    this.close_view.emit()
    this.value = ""
  }
}
