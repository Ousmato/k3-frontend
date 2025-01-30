import { Component, OnInit } from '@angular/core';
import { InscriptionNoteDto, Student_group, StudentGroupDto } from '../../Admin/Models/Students';
import { EtudeService } from '../../Admin/Views/Etudiants/etude.service';
import { ActivatedRoute } from '@angular/router';
import { IconsService } from '../../Services/icons.service';
import { InscriptionService } from '../../Services/inscription.service';
import { SideBarService } from '../../sidebar/side-bar.service';
import { Class_shared } from '../../DGA/class-students/Utils/Class-shared-methods';
import { AddNoteDto } from '../../Admin/Models/Notes';
import { AnneeScolaire } from '../../Admin/Models/School-info';
import { StudentSharedMethods } from '../../Admin/Views/Etudiants/Utils/Student-shared-methode';
import { GroupeService } from '../../Services/groupe.service';

@Component({
  selector: 'app-student-group-list',
  templateUrl: './student-group-list.component.html',
  styleUrl: './student-group-list.component.css'
})
export class StudentGroupListComponent  implements OnInit{

  searchTerm: string = ''
  inscriptions: InscriptionNoteDto[] = []
  filteredItem: InscriptionNoteDto[] = []
  group!: Student_group;
  idGroup!: number
  semestre!: string
  classe!: string
  modules!: string
  annees!: AnneeScolaire
  groupes!: StudentGroupDto;
  constructor(private studentService: EtudeService, private sidebareSevice: SideBarService,
    private inscriptionService: InscriptionService, public sharedMethode: Class_shared, private grpService: GroupeService,
    private root: ActivatedRoute, public icons: IconsService, public studentUtil: StudentSharedMethods) { }
  ngOnInit(): void {
      this.loadStudentGroup();
      this.sidebareSevice.currentSearchTerm.subscribe(term =>{
        this.searchTerm = term;
        this.filteredInscription();
      })
  }
  loadStudentGroup() {
    this.root.queryParams.subscribe(param =>{
      this.idGroup = param['id'];
      const idEmploi = param['idEmploi']
      this.grpService.getParticipantsOfGroup(this.idGroup, idEmploi).subscribe(data => {
      this.groupes = data;
      this.inscriptions = this.groupes.inscriptions
      
      console.log(this.groupes, "groupes")
    });
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
    }else{
      console.log(this.inscriptions, "invalid search term")
      return this.filteredItem = this.inscriptions.filter(ins => ins.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      ins.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()))
  
    }
    
   
  }
}
