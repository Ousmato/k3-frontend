import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Niveau } from './Admin/Models/Niveau';
import { User } from './Admin/Models/Auth';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {


  private apiUrl = 'http://localhost:8080/niveau/readAll';
  private authUrl = 'http://localhost:8080/Auth/login';

  constructor(
    private http : HttpClient
  ) { }

  getAllNiveau(): Observable<Niveau[]> {
    return this.http.get<Niveau[]>(this.apiUrl);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.authUrl, { email, password }).pipe(
        catchError(error => {
            console.error('Error during login:', error);
            throw error; // Rethrow the error to propagate it to the caller
        })
    );
}


  logout(): Observable<any> {
    // Révoquer le jeton d'authentification ou effectuer d'autres opérations de déconnexion
    return this.http.post<any>(this.authUrl + '/logout', {})
      .pipe(
        map(() => {
          // Suppression du jeton d'authentification du localStorage lors de la déconnexion
          localStorage.removeItem('token');
          return true; // Vous pouvez retourner toute autre donnée pertinente de la réponse si nécessaire
        })
      );
  }

  // Méthode pour vérifier si l'utilisateur est actuellement authentifié
  isAuthenticated(): boolean {
    // Logique pour vérifier si l'utilisateur a un jeton d'authentification valide
    // Retourne true si l'utilisateur est authentifié, sinon false
    return localStorage.getItem('token') !== null; // Exemple : vérifie si un jeton est présent dans le stockage local
  }
}
