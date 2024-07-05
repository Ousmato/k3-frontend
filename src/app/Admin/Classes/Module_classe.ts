import { Module } from "../Models/Module";
import { Students_Module } from "../Models/studends_modules";

export class StudenModules_classe {
    modules_of_student: Students_Module[] = [];

    removeModule(module_to_remove: Module) {
        console.log(this.modules_of_student,"att")
        for (let studentModule of this.modules_of_student) {
            const index = studentModule.modules.findIndex(module => module.id === module_to_remove.id);
            if (index !== -1) {
                studentModule.modules.splice(index, 1);
                console.log(`Module ${module_to_remove.nomModule} supprimé de la liste.`);
                return;
            }
        }
        
        console.log(`Le module ${module_to_remove.nomModule} n'a pas été trouvé dans la liste.`);
    }
    // ----------------------update liste 
    updateModules(new_modules: Module[]) {
        this.modules_of_student.forEach(m =>{
            m.modules = new_modules;
        })
        console.log(`Liste des modules mise à jour.`);
        return this.modules_of_student;
    }
}