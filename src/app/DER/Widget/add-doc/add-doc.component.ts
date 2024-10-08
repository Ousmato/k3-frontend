import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from '../../../Admin/Models/Students';
import { EtudeService } from '../../../Admin/Views/etudiants/etude.service';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { ClassRoom } from '../../../Admin/Models/Classe';
import { Docum, StudentDoc, TypeDoc } from '../../../Admin/Models/doc';
import { PageTitleService } from '../../../Services/page-title.service';
import { IconsService } from '../../../Services/icons.service';
import { debounceTime } from 'rxjs';
import { EnseiService } from '../../../Admin/Views/enseignant/ensei.service';
import { Teacher } from '../../../Admin/Models/Teachers';

@Component({
  selector: 'app-add-doc',
  templateUrl: './add-doc.component.html',
  styleUrl: './add-doc.component.css'
})
export class AddDocComponent implements OnInit {

  students : Student  []= []
  doc_form!: FormGroup
  classRoom : ClassRoom [] = []
  
  disabledStudentIds : number [] = []
  numberStuden : number [] = [1,2]
  student_checked: any[] = []
  teacherFiltered?: Teacher
  classeDocs : StudentDoc [] = []
  isShow_add_student : boolean = false
  show_classe : boolean = false
  teach : boolean = false
  docTypes: {key: string, value : string}[] =[]
  constructor(private fb: FormBuilder, private studentService: EtudeService, public icons: IconsService, 
    private pageTitle: PageTitleService, private teacherService: EnseiService,
    private classService: ClassStudentService) { }

  ngOnInit(): void {
      this.load_form();
      // this.load_classes();
      this.getTypesOptions();
      this.doc_form.get("teacher")?.valueChanges.pipe(debounceTime(1000)).subscribe(value =>{
        console.log(value, "value forr");
        this.teacherService.getFilteredTeachers(+value).subscribe(result =>{
          this.teacherFiltered = result
          this.teach = true
          // if(this.teacherFiltered != null)
          console.log(this.teacherFiltered, "teacher filtered")
        })
      })
      // this.doc_form.get("idEncadrant")?.setValue("messi")
  }

  load_form(){
    this.doc_form = this.fb.group({
      idClasse: ['', Validators.required],
      docType : ['', Validators.required],
      idEncadrant: [''],
      teacher: ['', Validators.required]
    })

  }

  // -------------laod student by classe id
  load_students(idClass : number){
    console.log(idClass, "idClasse")
    this.studentService.getStudentByIdClasse(idClass).subscribe(
      (data: Student[]) => {
        this.students = data;
        console.log(this.students, "students")
        this.getAllDocsByClass(idClass, this.students);
      }
    )
   
  }

  // ---------------------------get teacher filter
  teacherSelect(teacher: Teacher){
    this.doc_form.get("idEncadrant")?.setValue(teacher.idEnseignant);
    this.teach = false
  }
  changeDocType(event: any){
    const typeDoc = event.target.value
    if(typeDoc == TypeDoc.RAPPORT.toString()){
      const typeSelect : number = 1
      this.classService.getListClassByTypeDoc(typeSelect).subscribe(classe =>{
        this.classRoom = classe;
        this.classRoom.forEach(clr =>{
          const date = new Date(clr.idAnneeScolaire?.finAnnee!);
          clr.idAnneeScolaire!.ans = date.getFullYear();
          console.log(clr.idAnneeScolaire?.ans, "pro")
        })
        this.show_classe = true
    console.log(this.classRoom, "----------types de doc")

      })
    }else{
      const typeSelect : number = 2
      this.classService.getListClassByTypeDoc(typeSelect).subscribe(classe =>{
        this.classRoom = classe;
        this.classRoom.forEach(clr =>{
          const date = new Date(clr.idAnneeScolaire?.finAnnee!);
          clr.idAnneeScolaire!.ans = date.getFullYear();
          console.log(clr.idAnneeScolaire?.ans, "pro")
        })
        this.show_classe = true
    console.log(this.classRoom, "----------l3")

      })
    }
  }

  changeClasse(event : any){
    this.isShow_add_student = true
    const idSelect = event.target.value
    this.load_students(+idSelect);

  }


  // -----------------------submit form
  submit(){
    let students: Student[] = []
    const formData = this.doc_form.value;
      students = this.students.filter(st => this.student_checked.includes(st.idEtudiant))
    
    const doc : Docum = {
      docType: formData.docType,
      idEncadrant: this.teacherFiltered!
     
    }
    
    // console.log(doc, "doc")
    // return
    const stDoc: StudentDoc ={
      idDocument: doc,
      idEtudiant: students,

    }
    console.log(doc, "doc")
// return
    if(this.doc_form.valid){
      this.studentService.addDoc(stDoc).subscribe({
        next : (result) =>{
          this.pageTitle.showSuccessToast(result.message);
          this.load_form();
          // this.load_classes();
          this.student_checked = []
          this.isShow_add_student = false
         
        },
        error : (erreur) =>{
          this.pageTitle.showErrorToast(erreur.error.message);
         
        }
      })
      
    }else{
      this.student_checked = []
      this.doc_form.markAllAsTouched();
     
    }
  }

  // ---------------------all docs by classe id
  getAllDocsByClass(idClass : number, student: Student[]){
    this.studentService.getAllDocByClasse(idClass).subscribe(result => {
      this.classeDocs = result;
      console.log(result, "all docs by class")
      this.disableCheckbox(this.classeDocs, student)
    })
  }
  // -----------------------desable checkbox
  disableCheckbox(doc: StudentDoc[], students: Student[]){

    doc.forEach(d => {
      // Trouve l'étudiant correspondant
      console.log(d.idEtudiant, "les etudiant")
      d.idEtudiant.forEach(ds => {
        const student = students.find(s => s.idEtudiant == ds.idEtudiant);
      if (student) {
        // Ajoute l'ID de l'étudiant au tableau des IDs désactivés
       this.disabledStudentIds.push(student.idEtudiant!);
       console.log(this.disabledStudentIds, "id cores")
      }
      })
      
    });
  
    return this.disabledStudentIds;
    
  }
  // -----------------------check student
    student_check(studentId: number, event: any) {
      // this.student_checked = []
       const MAX_SELECTIONS = 2
      if (event.target.checked) {
        if (this.student_checked.length < MAX_SELECTIONS) {
          // Ajouter l'ID de l'étudiant s'il n'est pas déjà présent
          if (!this.student_checked.some(st => st === studentId)) {
              this.student_checked.push(studentId);
          }
        }else{
          this.student_checked = []
        }
      } else {
          // Si la case est décochée, réinitialiser la sélection
          this.student_checked = [];
      }
    }

    isChecked(studentId: number): boolean {
        return this.student_checked.includes(studentId);
    }
   getTypesOptions() {
    const objet = Object.keys(TypeDoc).map(key => ({
      
      key: key,
      value: TypeDoc[key as keyof typeof TypeDoc] 
    }));
    objet.forEach(o => {
        this.docTypes.push(o)
      
    })
  }
  // ------------------go back
  goBack(){
    window.history.back()
  }

  valid(){
    this.submit()
  }

   // ----------------------abreviation name filiere
   abbreviateFiliereName(nomFiliere: string): string {
    // Découper le nom de la filière en mots
    const words = nomFiliere.split(' ');
  
    // Garder uniquement les mots de plus de 3 lettres pour l'abréviation
    const abbreviation = words
      .filter(word => word.length > 3) // Ne prendre que les mots significatifs
      .map(word => word[0].toUpperCase()) // Prendre la première lettre en majuscule
      .join(''); // Joindre les lettres pour former l'abréviation
  
    return abbreviation;
  }
}
