import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../../Services/icons.service';
import { ClassStudentService } from '../../class-students/class-student.service';
import { SetService } from '../../../Admin/Views/settings/set.service';
import { NivFiliere } from '../../../Admin/Models/NivFiliere';
import { ClassRoom } from '../../../Admin/Models/Classe';
import { PageTitleService } from '../../../Services/page-title.service';

@Component({
  selector: 'app-class-room-widget',
  templateUrl: './class-room-widget.component.html',
  styleUrl: './class-room-widget.component.css'
})
export class ClassRoomWidgetComponent implements OnInit{
  iSshow: boolean = true

  objectNivFil : NivFiliere[] = [];
  @Output() closeModal = new EventEmitter<any>();
  addClass!: FormGroup;

  constructor(public icons: IconsService, private fb: FormBuilder, private pageTitle : PageTitleService,
    private service: SetService){}

  ngOnInit(): void {
    this.load_class_form();
    this.load_fillere();
      
  }

  load_fillere(){
    // ------------------------get liste niveau filiere-----------------------------------
    this.service.getAll_Niveau_filiere().subscribe((
      nivFil: NivFiliere[]) =>{
        this.objectNivFil = nivFil;
      })

  }
// ---------------------------------form to create class-room
load_class_form(){
  this.addClass = this.fb.group({
    // effectifs: ['',Validators.required],
    idNiveau: ['',Validators.required],
    scolarite: ['',[Validators.required, Validators.min(100000), Validators.max(3000000)]]
  });
  
}
// -----------------------------methode add class-room
  createClassroom(){
    const formData = this.addClass.value;
    const filiere: NivFiliere = this.objectNivFil.find(niv => niv.id === +formData.idNiveau)!;
    const classe: ClassRoom = {
      effectifs: formData.effectifs,
      scolarite: formData.scolarite,
      idFiliere: filiere
    }
    if(this.addClass.valid){
        this.service.addClass(classe).subscribe({
          next: (response) =>{
            this.pageTitle.showSuccessToast(response.message);
            this.addClass.reset();
            this.load_fillere();
          }, 
          error: (erreur)=>{
            this.pageTitle.showErrorToast(erreur.error.message);
          }
      
      })
    }else{
    this.addClass.markAllAsTouched();
    console.log(this.addClass.value);
    }
    

  }
  // ----------------close- modal
  close_modal(){
    this.closeModal.emit()
    this.iSshow = false


  }
}
