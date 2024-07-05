import { Component, OnInit } from '@angular/core';
import { Teacher } from '../../Models/Teachers';
import { EnseiService } from '../enseignant/ensei.service';
import { IconsService } from '../../../Services/icons.service';
import { data } from 'jquery';
import { Presence } from '../../Models/Teacher-presence';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Seances } from '../../Models/Seances';
import { Paie } from '../../Models/paie';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrl: './archives.component.css'
})
export class ArchivesComponent  implements OnInit{
  form_paie!: FormGroup;
  Enseignants: Presence [] =[]
  dtOptions: any = {};
  diff_heure: number = 0;

  constructor (private teacherService: EnseiService, public icons: IconsService, private fb: FormBuilder, 
    private datePipe: DatePipe){}

  ngOnInit(): void {
    this.form_paie = this.fb.group({
      coutHeure:[''],
      nbreHeures: [''],
      montant: [''],
      idPresenceTeachers: ['']
    })

    this.getAll();
    
      
  }
// --------------------------------load teacher presence
  getAll(){
    this.teacherService.getAllPresence().subscribe((data =>{
      data.forEach((item: any) => {
        item.idSeance.idTeacher.urlPhoto = `http://localhost/StudentImg/${item.idSeance.idTeacher.urlPhoto}`;
      });
      this.Enseignants = data;
      console.log(this.Enseignants, "---enseignant------")
      this.load_diff(this.Enseignants);
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
  // -----------------------------------get difference of time
  load_diff(enseignant: Presence[]){
    enseignant.forEach(item =>{
     
      // Convertir les heures de début et de fin en objets Date
      let heure_Debut = new Date('1970-01-01T' + item.idSeance.heureDebut);
      let heure_Fin = new Date('1970-01-01T' + item.idSeance.heureFin );

      // Calculer la différence en millisecondes
      let differenceMs = heure_Fin.getTime() - heure_Debut.getTime();

      // Convertir la différence de millisecondes en heures et minutes
      let differenceMinutes = Math.floor(differenceMs / (1000 * 60));
      let differenceHours = Math.floor(differenceMinutes / 60);
      let remainderMinutes = differenceMinutes % 60;

      item.heure = differenceHours;
      item.munite = remainderMinutes;
      this.diff_heure  = item.heure;

    })
  }
  // --------------------------------load input value automataclly
  loadInputValue(event: any, presnce: Presence){

    let valeurCoutHeure = this.form_paie.get('coutHeure')!.value;
    let heure = presnce.heure;
    const montant = +valeurCoutHeure * +heure!;
    this.form_paie.get('montant')?.setValue(montant +" FCFA");
    // var valeur = inputElement.value
  }
  // ------------------------------- 
 
  // -------------------------------------------------add paie

    add_paie(presence: Presence){
        const formData = this.form_paie.value;
        const paie: Paie = {
        coutHeure: +formData.coutHeure,
        nbreHeures: presence.heure!,
        
        idPresenceTeachers: presence
    }
    this.teacherService.addPaie(paie).subscribe((data) => {
      alert("Paiement effectuee avec succes!!");
      window.location.reload();
      
    })
  }
  // 
}
