import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Inscription, Student } from '../../../Admin/Models/Students';
import { EtudeService } from '../../../Admin/Views/etudiants/etude.service';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { ClassRoom } from '../../../Admin/Models/Classe';
import { Docum, StudentDoc, TypeDoc } from '../../../Admin/Models/doc';
import { PageTitleService } from '../../../Services/page-title.service';
import { IconsService } from '../../../Services/icons.service';
import { debounceTime } from 'rxjs';
import { EnseiService } from '../../../Admin/Views/enseignant/ensei.service';
import { Teacher } from '../../../Admin/Models/Teachers';
import { InscriptionService } from '../../../Services/inscription.service';
import { Admin } from '../../../Admin/Models/Admin';
import { ToastrService } from 'ngx-toastr';
import { SideBarService } from '../../../sidebar/side-bar.service';

@Component({
  selector: 'app-add-doc',
  templateUrl: './add-doc.component.html',
  styleUrl: './add-doc.component.css'
})
export class AddDocComponent implements OnInit {

  searchTerm: string = ""
  inscriptions: Inscription[] = []
  filteredItem: Inscription[] = []
  doc_form!: FormGroup
  admin!: Admin 
  classe !: ClassRoom
  indexSelect!: number
  classRoom: ClassRoom[] = []

  disabledStudentIds: number[] = []
  numberStuden: number[] = [1, 2]
  student_checked: Inscription[] = []
  teacherFiltered?: Teacher
  classeDocs: StudentDoc[] = []
  isShow_add_student: boolean = false
  isConfirm: boolean = false
  show_classe: boolean = false
  teach: boolean = false
  docTypes: { key: string, value: string }[] = []

  constructor(private fb: FormBuilder, private studentService: EtudeService, private inscriptionService: InscriptionService,
    public icons: IconsService, private toastr: ToastrService, private sidebarService: SideBarService,
    private pageTitle: PageTitleService, private teacherService: EnseiService,
    private classService: ClassStudentService) { }

  ngOnInit(): void {
    this.load_form();
    // this.load_classes();
    this.getTypesOptions();
    this.doc_form.get("teacher")?.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      console.log(value, "value forr");
      this.teacherService.getFilteredTeachers(+value).subscribe(result => {
        this.teacherFiltered = result
        this.teach = true
        // if(this.teacherFiltered != null)
        console.log(this.teacherFiltered, "teacher filtered")
      })
    })
    const dataAdmin = sessionStorage.getItem('der');
    this.admin = JSON.parse(dataAdmin!);
    
    this.sidebarService.currentSearchTerm.subscribe(term =>{
      this.searchTerm = term
      this.filteredInscriptions()
    })
    
  }

  load_form() {
    this.doc_form = this.fb.group({
      idClasse: ['', Validators.required],
      docType: ['', Validators.required],
      idEncadrant: ['', Validators.required],
      teacher: ['', Validators.required]
    })

  }

  // -laod student by classe id
  load_students(idAnnee: number, idClass: number) {
    console.log(idClass, "idClasse")
    this.inscriptionService.getInscriptionsIdClasse(idAnnee, idClass).subscribe(
      data => {
        this.inscriptions = data;
        console.log(this.inscriptions, "students")
        this.getAllDocsByClass(idClass, this.inscriptions);
      }
    )

  }

  // -get teacher filter
  teacherSelect(teacher: Teacher) {
    this.doc_form.get("idEncadrant")?.setValue(teacher.idEnseignant);
    this.teach = false
  }
  changeDocType(event: any) {
    const typeDoc = event.target.value
    if (typeDoc == TypeDoc.RAPPORT.toString()) {
      const typeSelect: number = 1
      this.classService.getListClassByTypeDoc(typeSelect).subscribe(classe => {
        this.classRoom = classe;
        this.classRoom.forEach(clr => {
          const date = new Date(clr.idAnneeScolaire?.finAnnee!);
          clr.idAnneeScolaire!.ans = date.getFullYear();
          console.log(clr.idAnneeScolaire?.ans, "pro")
        })
        this.show_classe = true
        // console.log(this.classRoom, "----------types de doc")/

      })
    } else {
      const typeSelect: number = 2
      this.classService.getListClassByTypeDoc(typeSelect).subscribe(classe => {
        this.classRoom = classe;
        this.classRoom.forEach(clr => {
          const date = new Date(clr.idAnneeScolaire?.finAnnee!);
          clr.idAnneeScolaire!.ans = date.getFullYear();
          console.log(clr.idAnneeScolaire?.ans, "pro")
        })
        this.show_classe = true
        console.log(this.classRoom, "-------classroom")

      })
    }
  }

  changeClasse(event: any) {
    this.isShow_add_student = true
    const idSelect = event.target.value
    this.classe = this.classRoom.find(cl =>cl.id == idSelect)!;
    this.load_students(this.classe?.idAnneeScolaire?.id!, this.classe?.id!);

  }


  // -submit form
  submit() {
    if(this.student_checked.length === 0){
      console.log(this.student_checked, "cheked")
      this.toastr.warning("Veillez choisir au moins un étudiant", "Avertissement");
      return;
    }
    let inscriptions: Inscription[] = []
    const formData = this.doc_form.value;
    inscriptions = this.inscriptions.filter(st => this.student_checked.includes(st))

    const doc: Docum = {
      docType: formData.docType,
      idEncadrant: this.teacherFiltered!

    }
    const stDoc: StudentDoc = {
      idDocument: doc,
      idAdmin: this.admin,
      idInscription: inscriptions,

    }
  
    console.log(stDoc, "doc")
    // return
    if (this.doc_form.valid) {
      this.studentService.addDoc(stDoc).subscribe({
        next: (result) => {
          this.pageTitle.showSuccessToast(result.message);
          this.student_checked = []
          // this.load_students(this.classe.idAnneeScolaire?.id!, this.classe.id!);
          this.getAllDocsByClass(this.classe.id!, inscriptions);
          // this.isShow_add_student = false

        },
        error: (erreur) => {
          this.pageTitle.showErrorToast(erreur.error.message);

        }
      })

    } else {
      this.student_checked = []
      this.doc_form.markAllAsTouched();

    }
  }

  // show confirm
  annuler(index: number){
    this.indexSelect = index
    this.isConfirm = true
   
  }
  exitconfirm(){
    this.isConfirm = false
  }
  // annuler le depot
  confirm(idInscription: number){
    this.inscriptionService.annulerDepot(idInscription).subscribe({
      next : (result) =>{
        this.pageTitle.showSuccessToast(result.message);
        // this.load_students(this.classe.idAnneeScolaire?.id!, this.classe.id!);
        this.getAllDocsByClass(this.classe.id!, this.inscriptions);
      }, 
      error :(err) =>{
        this.pageTitle.showErrorToast(err.error.message);
      }
     
    })
  }
  // all docs by classe id
  getAllDocsByClass(idClass: number, student: Inscription[]) {
    this.studentService.getAllDocByClasse(idClass).subscribe(result => {
      this.classeDocs = result;
      console.log(result, "all docs by class")
      this.disableCheckbox(this.classeDocs, student)
    })
  }
  // -desable checkbox
  disableCheckbox(doc: StudentDoc[], inscriptions: Inscription[]) {

    doc.forEach(d => {
      // Trouve l'étudiant correspondant
      console.log(d.idInscription, "les etudiant")
      d.idInscription.forEach(ds => {
        const inscrit = inscriptions.find(ins => ins.id == ds.id);
        if (inscrit && d.idDocument.deleted === false) {
          // Ajoute l'ID de l'étudiant au tableau des IDs désactivés
          this.disabledStudentIds.push(inscrit.id!);
          console.log(this.disabledStudentIds, "id cores")
        }
      })

    });

    return this.disabledStudentIds;
  }
  // -check student
  student_check(studentId: number, event: any) {
    const inscrit = this.inscriptions.find(i =>i.id == studentId);
    const MAX_SELECTIONS = 2
    if (event.target.checked) {
      if (this.student_checked.length < MAX_SELECTIONS) {
        // Ajouter l'ID de l'étudiant s'il n'est pas déjà présent
        if (!this.student_checked.some(st => st.id == studentId)) {
          this.student_checked.push(inscrit!);
          console.log(this.student_checked, "id checked")
        }
      } else {
        this.student_checked = []
        this.student_checked.push(inscrit!);

      }
    } else {
      // Si la case est décochée, réinitialiser la sélection
      this.student_checked = [];
    }
  }

  isChecked(studentId: number): boolean {
    return this.student_checked.some(i => i.id == studentId);
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
  goBack() {
    window.history.back()
  }


  // abreviation name filiere
  abbreviateFiliereName(nomFiliere: string): string {
    const words = nomFiliere.split(' ');
    // Garder uniquement les mots de plus de 3 lettres pour l'abréviation
    const abbreviation = words.filter(word => word.length > 3)
      .map(word => word[0].toUpperCase()) 
      .join(''); 

    return abbreviation;
  }
  // filter the inscriptions
  filteredInscriptions(){
    if(!this.searchTerm){
      return this.filteredItem = this.inscriptions;
    }
    return this.filteredItem = this.inscriptions.filter(i =>i.idEtudiant.nom.toLowerCase().includes(this.searchTerm) ||
    i.idEtudiant.telephone.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) ||
   i.idEtudiant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }
}
