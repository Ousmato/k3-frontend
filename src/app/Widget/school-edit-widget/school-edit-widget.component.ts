import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../Services/icons.service';
import { SetService } from '../../Admin/Views/settings/set.service';
import { AnneeScolaire, SchoolInfo } from '../../Admin/Models/School-info';
import { SchoolService } from '../../Services/school.service';
import { PageTitleService } from '../../Services/page-title.service';

@Component({
  selector: 'app-school-edit-widget',
  templateUrl: './school-edit-widget.component.html',
  styleUrl: './school-edit-widget.component.css'
})
export class SchoolEditWidgetComponent implements OnInit{
  school?: SchoolInfo
  fileName!: File;
  isshow_overlay: boolean = true
  anneeScolaire: AnneeScolaire [] =[]

  update_school_form!: FormGroup
  constructor(public icons: IconsService, private fb: FormBuilder,
    private setService: SetService, private pageTitle: PageTitleService,
    private schoolService: SchoolService){}

  ngOnInit(): void {
    this.load_school_form();
    this.getSchoolInfo();
    this.get_all_annee()
      
  }

    // ---------------------------------------
    load_school_form(){
      this.update_school_form = this.fb.group({
        id: [''],
        nomSchool: ['', [Validators.required, Validators.maxLength(40)]],
        localite: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telephone: ['', [Validators.required, Validators.maxLength(12)]],
        anneeScolaire: ['', Validators.required],
        // finAnnee: ['', Validators.required],
        // urlPhoto: ['']
        
      });
    } 
    get_all_annee(){
      this.schoolService.getAll_annee().subscribe(data => {
        this.anneeScolaire = data;
        console.log(this.anneeScolaire, "anneeScolaire")
      })
    }
   // --------------------------------------------------------
   update_school(){
    const fomData = this.update_school_form.value;
    console.log(fomData, "fomdata")
    const annee = this.anneeScolaire.find(ans=> ans.id == +fomData.anneeScolaire)
  
    const school : SchoolInfo ={
      id: fomData.id,
      nomSchool: fomData.nomSchool,
      localite: fomData.localite,
      email: fomData.email,
      telephone: fomData.telephone,
      anneeScolaire: annee!
      // urlPhoto: this.fileName.name
    }
    if(this.update_school_form.valid){
        this.schoolService.updateSchools(school, this.fileName!).subscribe({
        next: (response) =>{
          this.pageTitle.showSuccessToast(response.message);
          this.getSchoolInfo();
         
        },
        error: (erreur) =>{
          this.pageTitle.showErrorToast(erreur.error.message);
        }
      })
    }else{
      this.update_school_form.markAllAsTouched();
      
    }
    
  }

  // ------------------------get school info
  getSchoolInfo(){
    this.schoolService.getSchools().subscribe(info => {
      this.school = info;
        this.school.urlPhoto = `http://localhost/StudentImg/${this.school.urlPhoto}`;
        this.load_school_input_value(this.school)
      })
     
  }

  // ---------------------------------------------------------------
  load_school_input_value(school?: SchoolInfo){
    this.update_school_form.get('nomSchool')?.setValue(school?.nomSchool);
    this.update_school_form.get('email')?.setValue(school?.email);
    this.update_school_form.get('telephone')?.setValue(school?.telephone);
    this.update_school_form.get('localite')?.setValue(school?.localite);
    this.update_school_form.get('id')?.setValue(school?.id);
    // this.update_school_form.get('urlPhoto')?.setValue(school?.urlPhoto.);
  }
  // -------------------file select
  onFileSelected(event : any){
    this.fileName = event.target.files[0];
  }
  // -------------------------close modal
  goBack(){
    window.history.back();
  }
}
