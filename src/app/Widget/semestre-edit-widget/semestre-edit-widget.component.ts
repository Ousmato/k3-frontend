import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IconsService } from '../../Services/icons.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTitleService } from '../../Services/page-title.service';
import { Semestres } from '../../Admin/Models/Semestre';
import { SetService } from '../../Admin/Views/settings/set.service';

@Component({
  selector: 'app-semestre-edit-widget',
  templateUrl: './semestre-edit-widget.component.html',
  styleUrl: './semestre-edit-widget.component.css'
})
export class SemestreEditWidgetComponent implements OnInit{

  selectedSemestreId!: number;
  semestres! : Semestres []
  update_semestre_form!: FormGroup;
  @Output() closeModal = new EventEmitter<any>();

  constructor(public icons: IconsService, private fb: FormBuilder, private pageTitle: PageTitleService, private setService: SetService){}

  ngOnInit(): void {
      this.load_semestre_form();
      this.get_semestres();
  }

   // -------------------------------get all semestre
   get_semestres(){
    this.setService.getSemestres().subscribe(semestres => {
      this.semestres = semestres;
    })
  }

  // -----------------------method update
 

   // ---------------------------------------update semestre
   load_semestre_form(){
    this.update_semestre_form = this.fb.group({
      id: [''],
      nomSemetre: ['', Validators.required],
      dateDebut: ['', Validators.required],
      datFin: ['', Validators.required]
    });
  }
  send_semestre(){
    const formData = this.update_semestre_form.value;
    const semestre : Semestres ={
      id: +formData.id,
      nomSemetre: formData.nomSemetre,
      dateDebut: formData.dateDebut,
      datFin: formData.datFin
    }
    this.setService.updateSemestre(semestre).subscribe({
      next: (response) =>{
        this.pageTitle.showSuccessToast(response.message)
        this.update_semestre_form.reset();
        // window.location.reload();
        this.get_semestres();
      },
      error: (erreur) => {
        this.pageTitle.showErrorToast(erreur.error.message)
      }
    } )

  }

  // ----------------------------------------------------------------
  onSemestreChange(event: any){
    this.selectedSemestreId = event.target.value;
    const selectSemestre = this.semestres.find(sem => sem.id == +this.selectedSemestreId);
    console.log(selectSemestre, "semestre trover")
    this.update_semestre_form.get('id')?.setValue(selectSemestre?.id);
    this.update_semestre_form.get('nomSemetre')?.setValue(selectSemestre?.nomSemetre);
    this.update_semestre_form.get('dateDebut')?.setValue(selectSemestre?.dateDebut);
    this.update_semestre_form.get('datFin')?.setValue(selectSemestre?.datFin);

    
  }
  close_modal(){
    this.closeModal.emit();
  }
}
