import { Component, OnInit } from '@angular/core';
import { Inscription, Student, Student_group } from '../../Admin/Models/Students';
import { EtudeService } from '../../Admin/Views/Etudiants/etude.service';
import { ActivatedRoute } from '@angular/router';
import { IconsService } from '../../Services/icons.service';
import { InscriptionService } from '../../Services/inscription.service';
import { SideBarService } from '../../sidebar/side-bar.service';

@Component({
  selector: 'app-student-group-list',
  templateUrl: './student-group-list.component.html',
  styleUrl: './student-group-list.component.css'
})
export class StudentGroupListComponent  implements OnInit{

  searchTerm: string = ''
  inscriptions: Inscription[] = []
  filteredItem: Inscription[] = []
  group!: Student_group;
  groupes: Student_group[] = [];
  constructor(private studentService: EtudeService, private sidebareSevice: SideBarService,
    private inscriptionService: InscriptionService,
    private root: ActivatedRoute, public icons: IconsService) { }
  ngOnInit(): void {
      this.loadStudentGroup();
      this.sidebareSevice.currentSearchTerm.subscribe(term =>{
        this.searchTerm = term;
        this.filteredInscription();
      })
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
    this.inscriptionService.getListInscriptionByIdGroup(idGroup).subscribe(data => {
      this.inscriptions = data;
    })
  }
  // --------------back button
  goBack(){
    window.history.back();
  }
  // methode filter
  filteredInscription(){
    if(!this.searchTerm){
      return this.filteredItem = this.inscriptions
    }
    return this.filteredItem = this.inscriptions.filter(ins =>ins.idEtudiant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  
   ins.idEtudiant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()))
  }
}
