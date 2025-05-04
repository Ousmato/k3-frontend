import { Admin, Admin_role } from "./Admin";

export const AdminUSER = () => {
    // Récupération des données de l'utilisateur et de la scolarité depuis le sessionStorage
    const user = sessionStorage.getItem('user');

    if (user) {
        const objet: Admin = JSON.parse(user); // Analyse de l'objet stocké
        const poste = objet.idPoste?.nom ? abrevigate(objet.idPoste.nom) : "UNKNOWN";

        switch (poste) {
            case 'RS':
                return { scolarite: objet };
            case 'COMPTABLE':
                return { comptable: objet };
            case 'DER':
                return { der: objet };
            case 'DGA':
                return { dga: objet };
            case 'SP':
                return { secretaire: objet };
            case 'DG':
                return { dg: objet };
            case 'SA':
                return { admin: objet };
            default:
                console.warn("Poste inconnu :", poste);
                return null;
        }
    }

    return null;
};

function abrevigate(name: string) {
    const nameSplit = name.split(' ');
    return nameSplit.filter(word => word.length > 3).map(w => w[0].toUpperCase()).join('');
}

export const getUser = () => {
    const user = sessionStorage.getItem('user');
    if (user) {
        return JSON.parse(user);
    }
    return null;
}

