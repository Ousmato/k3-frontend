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
  
      if (objet.role === Admin_role.SCOLARITE) {

        return {scolarite : objet};  

      }else if(objet.role === Admin_role.COMPTABLE){

        return {comptable: objet};

      }else if(objet.role === Admin_role.DER){

        return {der: objet};

      }else if(objet.role === Admin_role.DGA){

        return {dga: objet};

      }else if(objet.role === Admin_role.SECRETAIRE){

        return {secretaire: objet};

      }else if(objet.role === Admin_role.DG){
        
        return {dg: objet};
      }
    }
  
    return null; // Si l'utilisateur ou la scolarité n'existent pas, retourner null
  }