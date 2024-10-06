import { Component, OnInit } from '@angular/core';
import { Student, Student_group } from '../../Admin/Models/Students';
import { EtudeService } from '../../Admin/Views/etudiants/etude.service';
import { ActivatedRoute } from '@angular/router';
import { IconsService } from '../../Services/icons.service';

@Component({
  selector: 'app-student-group-list',
  templateUrl: './student-group-list.component.html',
  styleUrl: './student-group-list.component.css'
})
export class StudentGroupListComponent  implements OnInit{

  students: Student[] = []
  group!: Student_group;
  groupes: Student_group[] = [];
  constructor(private studentService: EtudeService, private root: ActivatedRoute, public icons: IconsService) { }
  ngOnInit(): void {
      this.loadStudentGroup();
  }
  loadStudentGroup() {
    this.root.queryParams.subscribe(param =>{
      const idEmploi = param['id'];
      this.studentService.getListGroupByIdEmploi(idEmploi).subscribe(data => {
      this.groupes = data;
      
      console.log(this.groupes, "groupes")
    });
    })
    
  }

  // ----------------------load all students by id group
  changeGroup(event: any){
    const idGroup = +event.target.value;
    this.load_students_by_group(+event.target.value);
    this.group = this.groupes.find(g => g.id === idGroup)!;
  }
  load_students_by_group(idGroup: number){
    this.studentService.getListStudentsByIdGroup(idGroup).subscribe(data => {
      this.students = data;
    })
  }
  // --------------back button
  goBack(){
    window.history.back();
  }
}
