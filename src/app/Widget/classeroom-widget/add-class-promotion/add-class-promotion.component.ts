import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../../Services/icons.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { AnneeScolaire } from '../../../Admin/Models/School-info';
import { SchoolService } from '../../../Services/school.service';
import { NivFiliere } from '../../../Admin/Models/NivFiliere';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { ClassRoom } from '../../../Admin/Models/Classe';

@Component({
  selector: 'app-add-class-promotion',
  templateUrl: './add-class-promotion.component.html',
  styleUrl: './add-class-promotion.component.css'
})
export class AddClassPromotionComponent implements OnInit {

  formAdd!: FormGroup
  formUpdate!: FormGroup
  @Output() closeModale = new EventEmitter<any>()
  isShow_add: boolean = false
  isConfirm: boolean = false
  show_deleted: boolean = false
  isShow_update: boolean = false
  annees: AnneeScolaire[]=[]
  filieres: NivFiliere[]=[]
  classes: ClassRoom[]=[]
  classFordelete!: ClassRoom;
  classSect?: ClassRoom;

  constructor(private fb: FormBuilder, private classService: ClassStudentService,
    public icons: IconsService, private infoSchool: SchoolService,
    private pageTitle: PageTitleService){}

  ngOnInit(): void {
      this.load_form();
  }

  // ----------------load form
  load_form(){
    this.formAdd = this.fb.group({
      idFiliere: ['', Validators.required],
      idAnnee: ['', Validators.required],
    })
    this.formUpdate = this.fb.group({
      // id: ['', Validators.required],
      // idFiliere: ['', Validators.required],
      idAnneeScolaire: ['', Validators.required],
    })

  }

  

  addProClasse(){
    const formData = this.formAdd.value;
    if(this.formAdd.valid){
        this.classService.addProClasse(formData.idFiliere, formData.idAnnee).subscribe({
        next: (result)=>{
          this.pageTitle.showSuccessToast(result.message);
          this.formAdd.reset();
          this.load_form();
          this.get_filieres();
          this.isShow_add = false;
          this.closeModale.emit();
        },
        error: (err) => {
          this.pageTitle.showErrorToast(err.error.message)
        }
      })
    }else{
      this.formAdd.markAllAsTouched()
    }
    
  }

   // -------------------------get annees
   get_annees(){
    this.infoSchool.getAll_annee().subscribe(data =>{
      this.annees = data;
      this.annees.forEach(ans=>{
        const annee = new Date(ans.debutAnnee)
        const debutAnnee = annee.getFullYear()
        ans.ans = debutAnnee
      })
    })
  }

  // -------------------------get filiere
  get_filieres(){
    this.classService.getAllNivFil().subscribe(data =>{
      this.filieres = data;
    })

  }
  getClasses(){
    this.classService.getAllCurrentClassOfYear().subscribe(result =>{
      this.classes = result;
      // console.log(this.classes, "class");
    })
  }
  show_added(){
    this.get_annees();
    this.get_filieres();
    this.isShow_add = true
   this.closeModale.emit()
  }

  close_add(){
    this.isShow_add = false
    this.closeModale.emit()
  }

  show_updated(){
    this.get_annees();
    this.getClasses();
    this.isShow_update =true
    this.closeModale.emit();
  }

  show_delete(){
    this.getClasses();
    this.show_deleted = true
    this.closeModale.emit();
  }

  exitDelete(){
    this.isConfirm = false
  }
  close_delete(){
    this.show_deleted = false
    this.closeModale.emit();
  }
  nextToConfirm(){
    this.isConfirm = true;
    this.show_deleted = false
    // this.closeModale.emit();
  }

  onDelete(event: any){
    const selectedId = event.target.value;
    this.classFordelete = this.classes.find(cl => cl.id == selectedId)!;

  }

  onChage(event: any){
    const idSelect = event.target.value
    this.classSect = this.classes.find(cl => cl.id == idSelect)!;
    const date = new Date(this.classSect.idAnneeScolaire?.finAnnee!)
    this.classSect.idAnneeScolaire!.ans = date.getFullYear();
    // this.formUpdate.get("idAnnee")?.setValue(this.classSect?.idAnneeScolaire?.id)
  }

  delete_classe(idSelect: number){
    this.classService.deleteProClasse(idSelect).subscribe({
      next: (response) => {
        this.pageTitle.showSuccessToast(response.message);
       this.getClasses();
       this.isConfirm = false
        this.closeModale.emit();
      },
      error: (err) => {
        this.pageTitle.showErrorToast(err.error.message)
      }
    })
  }

  update(){
    const formData = this.formUpdate.value;
    const annee = this.annees.find(an => an.id == formData.idAnneeScolaire);
    console.log(annee, "annees")
    // return
    this.classService.updateProClasse(this.classSect?.id!, formData.idAnneeScolaire).subscribe({
      next: (result) => {
        this.pageTitle.showSuccessToast(result.message);
        this.formUpdate.reset();
        this.load_form();
        this.getClasses();
        this.isShow_update = false;
        this.closeModale.emit();
      },
      error: (err) => {
        this.pageTitle.showErrorToast(err.error.message)
      }
    })
  }

}
