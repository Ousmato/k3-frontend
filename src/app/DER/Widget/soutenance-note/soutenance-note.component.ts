import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Docum } from '../../../Admin/Models/doc';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EtudeService } from '../../../Admin/Views/Etudiants/etude.service';
import { PageTitleService } from '../../../Services/page-title.service';

@Component({
  selector: 'app-soutenance-note',
  templateUrl: './soutenance-note.component.html',
  styleUrl: './soutenance-note.component.css'
})
export class SoutenanceNoteComponent  implements OnInit{

  addNote!: FormGroup
  @Input() doc!: Docum;
  @Output() closeModal = new EventEmitter<any>();
  constructor( private fb: FormBuilder, private studentService: EtudeService, private pageTitle: PageTitleService) { }
  ngOnInit(): void {
    this.load_form();
  }

  // ---------------------form
  load_form(){
    this.addNote = this.fb.group({
      idDoc: [this.doc.id],
      note:['',[Validators.required, Validators.min(0), Validators.max(20)]],
      
    })
  }

  // ---------------------add note
  submit(){
    const formData = this.addNote.value;
    console.log(formData, "formdata");
    this.studentService.addSoutenanceNote(this.doc.id!, formData.note).subscribe({
      next: (result) => {
        this.pageTitle.showSuccessToast(result.message)
        this.addNote.reset();
        this.closeModal.emit();
      },
      error: (error) => {
        this.pageTitle.showErrorToast(error.error.message)
        console.log("error", error);
      }
    })
  }

  // ---------------------close modal
  close(){
    this.closeModal.emit(null);
  }

}
