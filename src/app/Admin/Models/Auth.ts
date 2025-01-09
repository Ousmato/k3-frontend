import { Admin, Admin_role } from "./Admin";

export interface User {
    email: string;
    password: string;
}

export const AdminUSER = () => {
    // Récupération des données de l'utilisateur et de la scolarité depuis le sessionStorage
    const user = sessionStorage.getItem('user');
    
    if (user) {
      const objet = JSON.parse(user);  // Vous devez analyser l'objet stocké
  
      if (abrevigate(objet.idRole.nom )=== Admin_role.SCOLARITE.toUpperCase()) {

        return {scolarite : objet};  

      }else if(abrevigate(objet.idRole.nom ) === Admin_role.COMPTABLE.toUpperCase()){

        return {comptable: objet};

      }else if(abrevigate(objet.idRole.nom ) === Admin_role.DER.toUpperCase()){

        return {der: objet};

      }else if(abrevigate(objet.idRole.nom ) === Admin_role.DGA.toUpperCase()){

        return {dga: objet};

      }else if(abrevigate(objet.idRole.nom) === Admin_role.SECRET_P.toUpperCase()){

        return {secretaire: objet};

      }else if(abrevigate(objet.idRole.nom) === Admin_role.DG.toUpperCase()){
        
        return {dg: objet};
      
      }else if(objet.idRole.nom === "Admin"){
        
        return {admin: objet};
      }
    }
  
    return null; // Si l'utilisateur ou la scolarité n'existent pas, retourner null

     function abrevigate(name: string){
      const nameSplit = name.split(' ');
      return nameSplit.filter(word => word.length > 3).map(w => w[0].toUpperCase()).join('');
     }
  }