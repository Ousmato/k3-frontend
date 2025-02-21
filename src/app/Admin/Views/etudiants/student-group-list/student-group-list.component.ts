import { Component, OnInit } from '@angular/core';
import { AnneeScolaire } from '../../../Models/School-info';
import { Inscription, InscriptionNoteDto, Student_group, StudentGroupDto } from '../../../Models/Students';
import { EtudeService } from '../etude.service';
import { SideBarService } from '../../../../sidebar/side-bar.service';
import { InscriptionService } from '../../../../Services/inscription.service';
import { IconsService } from '../../../../Services/icons.service';
import { Class_shared } from '../../../../DGA/class-students/Utils/Class-shared-methods';
import { StudentSharedMethods } from '../Utils/Student-shared-methode';
import { ActivatedRoute } from '@angular/router';
import { GroupeService } from '../../../../Services/groupe.service';
import { StudentEmergement } from '../Utils/emergement-liste';
import { SeancService } from '../../../../DER/EDT/Services/seanc.service';
import { ServiceService } from '../../../../DER/EDT/Services/service.service';
import { Emplois } from '../../../../DER/EDT/Models/Emplois';

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
  emploi!: Emplois
  idClasse!: number
  groupes!: StudentGroupDto;
  constructor(private studentEmergement: StudentEmergement, private sidebareSevice: SideBarService, private emploiService: ServiceService,
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
      this.idClasse = param['idClasse'];
      const idEmploi = param['idEmploi']
      if(this.idClasse != null){
        this.emploiService.getEmploisById(idEmploi).subscribe(emploi => {
         this.groupes = this.formatEmploi(emploi)
        })
        this.inscriptionService.getInscriptionsIdClasse(this.idClasse).subscribe(result =>{
          console.log(result, "result")
           this.inscriptions = this.formatInscriptions(result);
        })
        return;
      }else{
         this.grpService.getParticipantsOfGroup(this.idGroup, idEmploi).subscribe(data => {
          this.groupes = data;
          this.inscriptions = this.groupes.inscriptions
          
          console.log(this.groupes, "groupes")
        });
      }
     
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
      return this.filteredItem = this.inscriptions.filter(ins => ins.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      ins.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()))
  
    }
    
   
  }

  // export excel file
  exportExcelFile(){
    this.studentEmergement.exportExcel(this.inscriptions, this.groupes)
  }

  // formate inscriptions
   formatInscriptions(inscriptions: Inscription[]): InscriptionNoteDto[] {
    return inscriptions.map((ins: Inscription) => {
      // Retourner un objet InscriptionNoteDto avec les valeurs souhaitées
      
      const inscriptionNoteDto: InscriptionNoteDto = {
          id: ins.id,
          nom: ins.idEtudiant.nom,
          prenom: ins.idEtudiant.prenom,
          lieuNaissance: ins.idEtudiant.lieuNaissance,
          dateNaissance: ins.idEtudiant.dateNaissance,
          idClasse: ins.idClasse,
          sexe: ins.idEtudiant.sexe,
          ueValidate: []
          
      };
      return inscriptionNoteDto;  // Assurez-vous que l'objet retourné est du bon type
    });
  }

  // formate emploi
  formatEmploi(emploi: Emplois): StudentGroupDto {
    const group: StudentGroupDto = {
      id: emploi.id,
      nom: '', 
      nomModule: emploi.idModule.nomModule,     
      classe: `${this.sharedMethode.abrevigateNiveauName(emploi.idClasse.idFiliere!.idNiveau.nom!)}-${this.sharedMethode.abreviateFiliereName(emploi.idClasse.idFiliere!.idFiliere.nomFiliere!)}`,
      annee: emploi.idClasse.idAnneeScolaire!,
      semestre: emploi.idSemestre.nomSemetre,
      inscriptions: []
    };
    // Retourner un objet Emplois avec les valeurs souhaitées
    return group;
  }

}
