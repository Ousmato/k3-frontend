import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../../../Services/icons.service';
import { ActivatedRoute } from '@angular/router';
import { InscriptionService } from '../../../../Services/inscription.service';
import { Dto_scolarite, paiement } from '../../../Models/Students';
import { StudentSharedMethods } from '../Utils/Student-shared-methode';
import { Class_shared } from '../../../../DGA/class-students/Utils/Class-shared-methods';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageTitleService } from '../../../../Services/page-title.service';
import { Admin } from '../../../Models/Admin';
import { AdminUSER } from '../../../Models/Auth';

@Component({
  selector: 'app-student-paiement-rapport',
  templateUrl: './student-paiement-rapport.component.html',
  styleUrl: './student-paiement-rapport.component.css'
})
export class StudentPaiementRapportComponent implements OnInit{

  imageUrl: string = '';
  idPaiementSelect !: number | null
  form! : FormGroup
  isUpdate : boolean = false;
  montantTota!: string
  paiement: paiement[] = [];
  Admin! : Admin
  constructor(public icons: IconsService, private root: ActivatedRoute, private fb: FormBuilder,
    public class_shared: Class_shared, private pageTitle: PageTitleService,
    private inscriptionService: InscriptionService) { }
  ngOnInit(): void {
    this.getAllPaiement();
    this.load_form();
    this.Admin = AdminUSER()?.scolarite

  }

  // load form
  load_form(){
    this.form = this.fb.group({
      montant: [''],
    })
  }
  // back
  goBack(): void {
    window.history.back();
  }

  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/business-professional-icon.svg';
  }
   // get paiement for student
   getAllPaiement(){
    this.root.queryParams.subscribe(params =>{
      const idInscrit = +params['id'];
      this.inscriptionService.getAllPaiement(idInscrit).subscribe(result =>{
        console.log(result, "paiement")
        this.paiement = result;
        let total = 0;
        this.paiement.forEach(p =>{
          total += p.montant!;
          p.montantXof = (p.montant!).toLocaleString('fr-CM', { style: 'currency', currency: 'XOF' });
        })
        this.montantTota = (total!).toLocaleString('fr-CM', { style: 'currency', currency: 'XOF' });
        this.imageUrl = this.paiement[0].idInscription.idEtudiant?.urlPhoto || 'assets/business-professional-icon.svg';

        // this.inscrit!.scolarite = result.scolarite;
      });
    })
    
  }

  onChange(event:any, idPaiement: number){
    console.log(event.target.value, idPaiement)
    const scolarite: Dto_scolarite ={
      payer: event.target.value,
      type: this.paiement[0].idInscription.idEtudiant.status

    }
    if(this.form.valid){
      console.log(scolarite, "valid")
      // return
    this.inscriptionService.updatePaiement(idPaiement, scolarite, this.Admin.idAdministra!).subscribe({
      next: (res) => {
        this.pageTitle.showSuccessToast(res.message);
        this.getAllPaiement();
        this.load_form();
        this.idPaiementSelect = null;
      },
      error: (erreur) => {
        this.pageTitle.showErrorToast(erreur.error.message);
      }
    })
  }
}
  update(idPaiement: number){
    if(this.idPaiementSelect){
      this.idPaiementSelect = null
    }else{
      this.idPaiementSelect = idPaiement
    }
    const pSelected = this.paiement.find(p => p.id === idPaiement)
    this.form.get('montant')?.setValue(pSelected?.montant)
  }


}
