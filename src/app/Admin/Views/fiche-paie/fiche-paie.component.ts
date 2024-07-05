import { Component, OnInit } from '@angular/core';
import { Paie } from '../../Models/paie';
import { EnseiService } from '../enseignant/ensei.service';
import { IconsService } from '../../../Services/icons.service';
import { Seances } from '../../Models/Seances';
import { Teacher } from '../../Models/Teachers';

@Component({
  selector: 'app-fiche-paie',
  templateUrl: './fiche-paie.component.html',
  styleUrl: './fiche-paie.component.css'
})
export class FichePaieComponent  implements OnInit{
  Enseignants: Teacher[] =[]
  dtOptions: any = {}
  seances : Seances [] =[];
  paies : Paie[] =[];

  constructor(private teacherService: EnseiService, public icons: IconsService){}
  ngOnInit(): void {
      this.getAllPaie();
  }

  getAllPaie(){
    this.teacherService.getAllPaie().subscribe((data =>{
      data.forEach((item: Paie) => {

        item.idPresenceTeachers.idSeance.idTeacher.urlPhoto = `http://localhost/StudentImg/${item.idPresenceTeachers.idSeance.idTeacher.urlPhoto}`;
        
        const teacher = item.idPresenceTeachers.idSeance.idTeacher;
        
        if (teacher && !this.Enseignants.some(t => t.idEnseignant === teacher.idEnseignant)) {
          this.Enseignants.push(teacher);
      }
       
        const paie = item;
        const montant = paie.coutHeure * paie.nbreHeures;
        paie.montant = montant;
        this.paies.push(paie!);
          
           console.log(paie, "paie")
      //   if (paie && !this.paies.some(t => t.idPresenceTeachers.idSeance.idTeacher.idEnseignant === teacher.idEnseignant)) {
      //     this.paies.push(paie!);
      //     const montant = paie.coutHeure * paie.nbreHeures;
      //     paie.montant = montant;
      //      console.log(paie, "paie")
      // }
       
          
          
          this.seances.push(item.idPresenceTeachers.idSeance);
      });
      this.teacherService.getAllPresence().subscribe(data =>{

      })
      // this.Enseignants = data;
       
      console.log(this.Enseignants, "---enseignant------")
      // this.load_diff(this.Enseignants);
    }))
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      // processing: true,
      // serverSide: true,
      columnDefs: [
        { orderable: false, targets: '_all' }
      ],
      language: {
        info: 'Affichage de _START_ à _END_ sur _TOTAL_ entrées',
        infoEmpty: 'Affichage de 0 à 0 sur 0 entrée',
        infoFiltered: '(filtré à partir de _MAX_ entrées au total)',
        lengthMenu: '_MENU_ Entrées par page',
        search: 'Recherche :'
      }
      // Ajoutez d'autres options au besoin
    };

  }
}
