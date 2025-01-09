import { Component, OnInit } from '@angular/core';
import { EnseiService } from '../../Views/Enseignant/ensei.service';
import { Presence } from '../../Models/Teacher-presence';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Paie } from '../../Models/paie';
import { min } from 'rxjs';
import { PageTitleService } from '../../../Services/page-title.service';

@Component({
  selector: 'app-fiche-de-paie',
  templateUrl: './fiche-de-paie.component.html',
  styleUrl: './fiche-de-paie.component.css'
})
export class FicheDePaieComponent implements OnInit {

  form_paie!: FormGroup;
  idSeance!: number;
  presence?: Presence;
  show_modal : boolean = true
  
  diff_heure: number = 0;

  constructor(private teacherService: EnseiService, private pageTitle: PageTitleService,
    private fb: FormBuilder, private root: ActivatedRoute ){}

  ngOnInit(): void {
    this.load_form();
    this.getTeacherPresence();
      
  }
  load_form(){
    this.form_paie = this.fb.group({
      coutHeure:['',[Validators.required, Validators.min(1000)]],
      nbreHeures: [''],
      montant: ['',[Validators.required, Validators.max(500000)]],
      idPresenceTeachers: ['']
    })
  }
  // --------------------------load 
  getTeacherPresence(){
    this.root.queryParams.subscribe(param =>{
      this.idSeance = param['id'];
    })

    this.teacherService.getPresence_by_seance(this.idSeance).subscribe(data =>{
      this.presence = data;
      console.log(this.presence, "presence");
      this.load_diff(this.presence)
    })
    
  }
// ------------------------calcule des difference d'heure
  load_diff(presence: Presence){
      let heure_Debut = new Date('1970-01-01T' + presence.idSeance.heureDebut);
      let heure_Fin = new Date('1970-01-01T' + presence.idSeance.heureFin );
      // Calculer la différence en millisecondes
      let differenceMs = heure_Fin.getTime() - heure_Debut.getTime();

      // Convertir la différence de millisecondes en heures et minutes
      let differenceMinutes = Math.floor(differenceMs / (1000 * 60));
      let differenceHours = Math.floor(differenceMinutes / 60);
      let remainderMinutes = differenceMinutes % 60;

      presence.heure = differenceHours;
      presence.munite = remainderMinutes;
      this.diff_heure  = presence.heure;

    console.log(this.diff_heure, "heure diff")
  }

  // --------------------------load input 
  
  loadInputValue(event: any, presnce: Presence){

    let valeurCoutHeure = this.form_paie.get('coutHeure')!.value;
    let heure = presnce.heure;
    const montant = +valeurCoutHeure * +heure!;
    this.form_paie.get('montant')?.setValue(montant +" FCFA");
    this.form_paie.get('idPresenceTeachers')?.setValue(presnce.idSeance.id);
    this.form_paie.get('nbreHeures')?.setValue(presnce.heure);
    // var valeur = inputElement.value
  }
  // ---------------------------method add paie
  // add_paie(presence: Presence){
  //   this.form_paie
  //   const formData = this.form_paie.value;
  //   const paie: Paie = {
  //   coutHeure: +formData.coutHeure,
  //   nbreHeures: presence.heure!,
    
  // }
  // console.log(paie, "paie")
  // if(this.form_paie.valid){
  //   this.teacherService.addPaie(paie).subscribe( {
  //     next: (response) =>{
  //       this.pageTitle.showSuccessToast(response.message);
  //     window.history.back();
  //     },
  //     error: (erreur) =>{
  //       this.pageTitle.showErrorToast(erreur.error.message);
  //     }
      
  //   })
  // }else{
  //   this.form_paie.markAllAsTouched();
  //   console.log('invalid', this.form_paie.value)
  // }
    
  // }
  // -----------------------------exit button
  close_modal(){
    this.show_modal = false;
    window.history.back();
  }
}
