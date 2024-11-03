import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, delay, finalize, switchMap, throwError } from 'rxjs';
import { AuthServiceService } from '../../auth-service.service';
import { LoaderService } from '../loader.service';

// export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
//   // debugger;
//   const authToken = sessionStorage.getItem('authToken');
//   console.log(authToken, "Token récupéré");

//   if (authToken) {
//     const authReq = req.clone({
//       headers: req.headers.set('Authorization', `Bearer ${authToken}`)
//     });
//     console.log(authReq, 'Requête avec authentification');
//     return next(authReq);
//   }

//   // Si aucun token, passer la requête sans modification
//   return next(req);
// };
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthServiceService); // Injection du service d'authentification
  const authToken = sessionStorage.getItem('authToken');
  const adminObject = sessionStorage.getItem('user');
  const loadingService = inject(LoaderService); // Injection du service de chargement


  const admin = JSON.parse(adminObject!)
  console.log(authToken, "Token récupéré");

  let authReq = req;
  if (authToken) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    console.log(authReq, 'Requête avec authentification');
  }

  // loadingService.loading()
  // Passer la requête modifiée avec l'authentification ou sans si pas de token
  return next(authReq).pipe(
   
    // finalize( () => {
    //   loadingService.stopLoading();
    // }),
    catchError(error => {
      // Si erreur 403 ou 401 et que la requête n'est pas un rafraîchissement du token
      if ((error.status === 403 || error.status === 401) && !req.url.includes('refresh-token')) {
        console.log('Erreur 403 ou 401 détectée, tentative de rafraîchissement du token...');
  
        // Appel au service d'authentification pour rafraîchir le token
        return authService.refreshToken(admin.email).pipe(
          switchMap(newToken => {
            console.log(newToken, "new response from");
            // Met à jour le token dans le sessionStorage
            sessionStorage.setItem('authToken', newToken.token);
  
            // Recréer la requête avec le nouveau token
            const newAuthReq = authReq.clone({
              headers: req.headers.set('Authorization', `Bearer ${newToken.token}`)
            });
            console.log(newAuthReq, 'Requête avec nouveau token après rafraîchissement');
  
            // Réessaye la requête initiale avec le nouveau token
            return next(newAuthReq);
          }),
          catchError(refreshError => {
            // Gérer les erreurs du rafraîchissement du token
            console.error('Échec du rafraîchissement du token:', refreshError);
            return throwError(() => refreshError);
          })
        );
      }
      // Retourne l'erreur s'il s'agit d'une autre erreur
      return throwError(() => error);
    })
  );
};