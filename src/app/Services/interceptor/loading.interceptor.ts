import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, delay, finalize, switchMap, tap, throwError } from 'rxjs';
import { AuthServiceService } from '../../auth-service.service';
import { LoaderService } from '../loader.service';
import { EventServiceService } from '../event-service.service';


export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthServiceService); 
  const eventService = inject(EventServiceService);
  const authToken = sessionStorage.getItem('authToken');
  const adminObject = sessionStorage.getItem('user');
  // const refreshToken = sessionStorage.getItem('refreshToken');



  const admin = JSON.parse(adminObject!)


  let authReq = req;
  if (authToken) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
  }
  // debugger;
  console.log(authReq, "requettes auth")

  return next(authReq).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        // Vérifiez si l'en-tête `X-Token-Expiring-Soon` est présent dans la réponse
        const tokenExpiringSoon = event.headers.get('X-Token-Expiring-Soon');
        console.log("Token expiration soon ::::::::::::::::::", tokenExpiringSoon);
        if (tokenExpiringSoon) {
          // Par exemple, afficher un message d'avertissement
          eventService.show(tokenExpiringSoon);
        }
      }
    }),
    catchError(error => {
      if(error.status === 403 || error.status === 401){
       eventService.show(error.status);
      }
      return throwError(() => error);
    })
  
  )
  // .pipe(
  //   catchError(error => {
  //     // En cas d'erreur 403 ou 401, tente de rafraîchir le token
  //     if ((error.status === 403 || error.status === 401) && !req.url.includes('refresh-token')) {
  //       console.log('Erreur 403 ou 401 détectée, tentative de rafraîchissement du token...');
  //       console.log(req.url , "url---------------------------------");
  //      // Créer une requête avec le `refreshToken` pour l'autorisation
  //      const refreshTokenReq = req.clone({
  //       url: '/Auth/refresh-token', // ou l'URL exacte si différente
  //       headers: req.headers.set('Authorization', `Bearer ${refreshToken}`)
  //     });

  //       console.log(refreshToken, `Refreshing token avant d'entrer les headers`);
  //       return authService.refreshToken(admin.email, refreshToken!).pipe(
  //         switchMap(newToken => {
  //           console.log(newToken, "Nouveau token reçu après rafraîchissement");

  //           // Met à jour le token d'authentification dans le sessionStorage
  //           sessionStorage.setItem('authToken', newToken.token);

  //           // Recréer la requête d'origine avec le nouveau token
  //           const newAuthReq = authReq.clone({
  //             headers: req.headers.set('Authorization', `Bearer ${newToken.token}`)
  //           });

  //           // Réessaye la requête initiale avec le nouveau token
  //           return next(newAuthReq);
  //         }),
  //         catchError(refreshError => {
  //           // Si le rafraîchissement échoue, déconnecter l'utilisateur
  //           console.error('Échec du rafraîchissement du token:', refreshError);
  //           // authService.logout();
  //           return throwError(() => refreshError);
  //         })
  //       );
  //     }

  //     // Retourne l'erreur originale si elle n'est pas due à l'expiration
  //     return throwError(() => error);
  //   })
  // );
};


function isTokenExpired(token: string): boolean {
  if (!token) return true;

  // Décoder le payload du token
  const payloadBase64 = token.split('.')[1];
  const payload = JSON.parse(atob(payloadBase64));

  // Récupérer l'expiration (`exp`) en secondes et la convertir en millisecondes
  const expirationDate = payload.exp * 1000;
  const currentTime = Date.now();

  console.log()
  // Comparer la date actuelle avec la date d'expiration
  return currentTime > expirationDate;
}
