import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Filiere, Specialites } from '../../../../Admin/Models/Filieres';
import { SpecialiteService } from '../../../../Services/specialite.service';
import { FiliereService } from '../../../../Services/filiere.service';
import { PageTitleService } from '../../../../Services/page-title.service';

@Component({
  selector: 'app-add-teacher-specialites',
  templateUrl: './add-teacher-specialites.component.html',
  styleUrl: './add-teacher-specialites.component.css'
})
export class AddTeacherSpecialitesComponent {

  @Input() idTeacher !: number
  @Output() closeModal = new EventEmitter<any>();
  specilaite: Specialites[] = [];
  specialiteSelected: Specialites[] = [];

  overlay: boolean = true;
  constructor(private pageTitle: PageTitleService, private specialiteService: SpecialiteService){}

  ngOnInit(){
    this.load_specialites();
  }

  // get all filieres
  load_specialites(){
    this.specialiteService.getAllSpecialitesNotAssociatedInTeacherById(this.idTeacher).subscribe( splist =>{
      this.specilaite = splist
    })
  }

  submit(){
    console.log("Submit", this.idTeacher, this.specialiteSelected)
    this.specialiteService.addTeacherSpecialite(this.idTeacher, this.specialiteSelected).subscribe({
      next : (res) =>{
        this.pageTitle.showSuccessToast(res.message);
        this.closeModal.emit();
      },
      error :( err) =>{
        this.pageTitle.showErrorToast(err.error.message);
      }
    })
  }
   // exit
   exite(){
    this.closeModal.emit();
    this.overlay = false;
  }

  // select filieres
  filiere_check(idFilier: number, event: any){
    console.log(idFilier, "filiereid", this.specialiteSelected)
    const filiere = this.specilaite.find(fl => fl.id === idFilier);
    if(event.target.checked){
    if(!this.specialiteSelected.some(fl => fl.id === filiere?.id)){
      this.specialiteSelected.push(filiere!);
    }
  }else{
    this.specialiteSelected = this.specialiteSelected.filter(fl => fl.id !== filiere?.id)
  }
    console.log(this.specialiteSelected, "filiere selected")
  }

   // abrevigate filieres
   abreviateFiliereName(name: string){
    const nameSplit = name.split(' ');
    return nameSplit.filter(word => word.length > 3).map(w => w[0].toUpperCase()).join('');
  }

}
